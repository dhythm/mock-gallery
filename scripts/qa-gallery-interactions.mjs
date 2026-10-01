/**
 * Dependency-free component-state smoke tests. Runs real TSX event handlers in a
 * small hook/JSX adapter. NOT a browser: no layout, native validity, focus,
 * history, CSS, real React reconciliation, effects, or assistive-tech assertions.
 * The adapter intentionally ignores CSS and provides an in-memory router/toast.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cache = new Map();
let active;
let cursor = 0;
let params = new URLSearchParams();
let slug;
let messages = [];
const fragment = Symbol("Fragment");
const jsx = (type, props, key) => ({ type, props: props ?? {}, key });
const react = {
  useState(initial) {
    const owner = active;
    const index = cursor++;
    if (!(index in owner)) owner[index] = typeof initial === "function" ? initial() : initial;
    return [owner[index], value => { owner[index] = typeof value === "function" ? value(owner[index]) : value; }];
  },
  useMemo(fn) { return fn(); },
  useCallback(fn) { return fn; },
  useEffect() {},
  useId() { const [id] = react.useState(() => `qa-id-${++idSequence}`); return id; },
};
let idSequence = 0;
const router = {
  Link: ({ to, children, ...rest }) => jsx("a", { ...rest, href: to, children }),
  useSearchParams: () => [params, value => { params = new URLSearchParams(value); }],
  useParams: () => ({ slug }),
};
function load(filename) {
  filename = path.resolve(filename);
  if (cache.has(filename)) return cache.get(filename).exports;
  if (filename.endsWith(".css")) return {};
  const module = { exports: {} };
  cache.set(filename, module);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    fileName: filename,
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const require = specifier => {
    if (specifier === "react") return react;
    if (specifier === "react/jsx-runtime") return { jsx, jsxs: jsx, Fragment: fragment };
    if (specifier === "react-router-dom") return router;
    if (specifier.endsWith("toast-context.ts")) return { useToast: () => message => messages.push(message) };
    assert(specifier.startsWith("."), `Unsupported test import ${specifier}`);
    return load(path.resolve(path.dirname(filename), specifier));
  };
  const fn = vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename });
  fn(require, module, module.exports);
  return module.exports;
}
const { mockViews } = load(path.join(root, "src/mocks/registry.ts"));
const { mockCatalog, industryOrder } = load(path.join(root, "src/data/catalog.ts"));
const { PortalPage } = load(path.join(root, "src/pages/PortalPage.tsx"));
const { MockPage } = load(path.join(root, "src/pages/MockPage.tsx"));
function mount(Component) {
  const stores = new Map();
  let tree;
  function visit(node, key) {
    if (node === null || node === undefined || typeof node === "boolean") return null;
    if (Array.isArray(node)) return node.map((child, index) => visit(child, `${key}/${child?.key ?? index}`));
    if (typeof node !== "object") return String(node);
    if (node.type === fragment) return visit(node.props.children, `${key}/fragment`);
    if (typeof node.type === "function") {
      const ownerKey = `${key}:${node.type.name}`;
      if (!stores.has(ownerKey)) stores.set(ownerKey, []);
      active = stores.get(ownerKey); cursor = 0;
      return visit(node.type(node.props), `${ownerKey}/result`);
    }
    return { ...node, children: visit(node.props.children, `${key}/children`) };
  }
  const api = {
    render() { tree = visit(jsx(Component, {}), "root"); return tree; },
    all(predicate) { const output = []; function walk(node) { if (Array.isArray(node)) node.forEach(walk); else if (node && typeof node === "object") { if (predicate(node)) output.push(node); walk(node.children); } } walk(tree); return output; },
    text() { return text(tree); },
    count(type) { return api.all(node => node.type === type).length; },
    click(label, index = 0) { const nodes = api.all(node => node.type === "button" && (node.props["aria-label"] === label || text(node) === label)); const node = nodes[index]; assert(node, `Missing button ${label}. Have: ${api.all(n => n.type === "button").map(text).join(" / ")}`); assert(!node.props.disabled, `Disabled button ${label}`); node.props.onClick?.(); api.render(); },
    field(label, value, index = 0) { const labels = api.all(node => node.type === "label" && text(node) === label); const nodes = api.all(node => ["input", "select", "textarea"].includes(node.type) && (node.props["aria-label"] === label || labels.some(item => item.props.htmlFor === node.props.id))); const node = nodes[index]; assert(node, `Missing field ${label}`); node.props.onChange({ target: { value, checked: value } }); api.render(); },
    submit(index = 0) { const node = api.all(node => node.type === "form")[index]; assert(node, `Missing form ${index}`); node.props.onSubmit({ preventDefault() {} }); api.render(); },
    has(value) { assert(api.text().includes(value), `Missing content: ${value}`); },
    absent(value) { assert(!api.text().includes(value), `Unexpected content: ${value}`); },
  };
  api.render(); return api;
}
function contains(node, target) { if (node === target) return true; if (Array.isArray(node)) return node.some(child => contains(child, target)); return node && typeof node === "object" ? contains(node.children, target) : false; }
function text(node) { if (node === null || node === undefined) return ""; if (Array.isArray(node)) return node.map(text).join(""); if (typeof node !== "object") return String(node); return text(node.children); }
const checks = [];
function test(name, callback) { try { messages = []; callback(); checks.push(name); console.log(`PASS ${name}`); } catch (error) { console.error(`FAIL ${name}: ${error.message}`); process.exitCode = 1; } }
function demo(slugValue) { return mount(mockViews[slugValue]); }

test("all 22 demo components render and name their controls", () => {
  assert.equal(Object.keys(mockViews).length, 22);
  for (const [name, View] of Object.entries(mockViews)) {
    const app = mount(View); assert(app.text().length > 100, name);
    for (const node of app.all(n => ["input", "select", "textarea", "button"].includes(n.type))) {
      const label = node.props["aria-label"] || (node.type === "button" ? text(node) : "") || app.all(n => n.type === "label" && ((node.props.id && n.props.htmlFor === node.props.id) || contains(n.children, node))).map(text).join("");
      assert(label.trim(), `${name}: unnamed ${node.type}`);
    }
  }
});
test("portal category/search/empty/reset + URL state", () => {
  params = new URLSearchParams(); const app = mount(PortalPage);
  const cards = () => app.all(n => n.type === "a" && n.props.className === "card");
  assert.equal(cards().length, 22);
  for (const industry of industryOrder) { const button = app.all(n => n.type === "button" && n.props["data-industry"] === industry)[0]; button.props.onClick(); app.render(); assert.equal(cards().length, mockCatalog.filter(item => item.industry === industry).length); assert.equal(params.get("industry"), industry); }
  const all = app.all(n => n.type === "button" && text(n).startsWith("すべて"))[0]; all.props.onClick(); app.render();
  const search = value => { app.all(n => n.type === "input" && n.props.type === "search")[0].props.onChange({ target: { value } }); app.render(); };
  search("日報"); assert(cards().length > 0 && cards().length < 22); assert.equal(params.get("q"), "日報");
  search("no-such-mock-123"); assert.equal(cards().length, 0); app.has("一致するモックがありません"); app.click("条件をクリア"); assert.equal(cards().length, 22);
});
test("detail catalog navigation + useful unknown-route fallback", () => {
  for (const meta of mockCatalog) { slug = meta.slug; const app = mount(MockPage); assert.equal(app.count("h1"), 1); app.has(meta.title); assert(app.all(n => n.props.id === "workspace").length === 1); }
  slug = "unknown-demo"; const app = mount(MockPage); app.has("このモックは見つかりませんでした"); assert(app.all(n => n.type === "a" && n.props.href === "/").length > 0);
});
test("construction-daily-report: edit, confirm, invalidate", () => { const a = demo("construction-daily-report"); a.field("作業内容", "QA作業記録"); a.click("日報を確定"); a.has("状態: 確定"); a.has("QA作業記録"); a.click("写真を追加"); a.has("状態: 下書き"); });
test("construction-corrective-photos: fix + filter", () => { const a = demo("construction-corrective-photos"); const before = a.all(n => n.type === "button" && text(n) === "是正完了").length; a.click("是正完了"); assert.equal(a.all(n => n.type === "button" && text(n) === "是正完了").length, before - 1); a.click("是正済"); a.has("是正後の写真を記録済み"); });
test("construction-subcontractor-board: move through workflow", () => { const a = demo("construction-subcontractor-board"); a.click("作業開始"); assert(messages.at(-1).includes("作業中")); a.click("完了にする"); assert(messages.at(-1).includes("完了")); });
test("logistics-driver-log: wait total + confirm", () => { const a = demo("logistics-driver-log"); a.click("60分以上"); a.has("荷待ち合計: 130分"); a.click("日報を確定"); a.has("状態: 確定"); a.click("なし"); a.has("状態: 下書き"); });
test("manufacturing-inspection: record abnormal + resolve", () => { const a = demo("manufacturing-inspection"); a.click("異音: 否"); a.click("漏れ: 良"); a.click("点検を記録"); a.has("コンプレッサー#2_異常.jpg"); a.click("異常を閉じる"); a.absent("コンプレッサー#2_異常.jpg"); });
test("manufacturing-checklist-digital: block partial + record all", () => { const a = demo("manufacturing-checklist-digital"); a.click("記録する"); assert.equal(messages.at(-1), "未の項目が残っています"); a.click("安全カバーの固定: 良"); a.click("油圧の漏れ: 良"); a.click("記録する"); a.has("点検表を記録しました"); a.field("油圧の漏れのメモ", "確認"); a.has("未記録"); });
test("care-handover: add + export", () => { const a = demo("care-handover"); a.field("内容", "QA申し送り"); a.submit(); a.has("QA申し送り"); a.click("CSVイメージ"); a.has("取り込み用CSV"); });
test("care-paper-bridge: classify + export", () => { const a = demo("care-paper-bridge"); a.field("scan_0930_001.pdfの種別", "バイタル"); a.has("未分類 1件"); a.click("CSVを出す"); a.has("既存ソフト向けCSV"); });
test("care-shift-board: change named day + apply request", () => { const a = demo("care-shift-board"); a.click("佐々木 月 早、クリックで変更"); assert(a.all(n => n.props["aria-label"] === "佐々木 月 遅、クリックで変更").length); a.click("希望を反映"); assert(a.all(n => n.props["aria-label"] === "林 土 休、クリックで変更").length); });
test("shift-excel-bridge: export + invalidate", () => { const a = demo("shift-excel-bridge"); a.click("Excel形式で書き出し"); a.has("タブ区切り（Sheets / Excel）"); a.has("名前\t所属\t月"); a.field("田中 月", "休"); a.absent("タブ区切り（Sheets / Excel）"); });
test("restaurant-order-loss: quantity + confirmation", () => { const a = demo("restaurant-order-loss"); a.click("＋"); a.click("発注を確定"); a.has("今日の発注は確定済です"); a.click("−"); a.has("発注はまだ下書きです"); });
test("restaurant-shift-exit: staff + publish + edit", () => { const a = demo("restaurant-shift-exit"); a.click("水 ホール昼 空き、クリックで変更"); a.click("シフトを公開"); a.has("シフトは公開中です"); a.click("水 ホール昼 田中、クリックで変更"); a.has("下書きです"); });
test("property-owner-report: pack + month invalidation", () => { const a = demo("property-owner-report"); a.click("PDFパックを作成"); a.has("状態: PDFイメージ作成済"); a.click("2026-08"); a.has("状態: 未作成"); a.has("修繕: 42,000円"); });
test("farm-gap-log: export + new work invalidation", () => { const a = demo("farm-gap-log"); a.click("証跡PDFを出す"); a.has("証跡PDFイメージ"); a.field("資材", "なし"); a.field("メモ", "QA観察"); a.submit(); a.has("QA観察"); a.absent("証跡PDFイメージ"); });
test("professional-case-ledger: complete overdue", () => { const a = demo("professional-case-ledger"); a.click("完了にする"); a.has("期限超過はありません"); a.has("手続完了"); });
test("professional-intake-box: classify document", () => { const a = demo("professional-intake-box"); a.click("契約"); assert.equal(a.all(n => n.type === "button" && text(n) === "契約").length, 1); assert.equal(messages.at(-1), "契約として処理済にしました"); });
test("fax-structured-inbox: confirm selected + empty search", () => { const a = demo("fax-structured-inbox"); a.click("受注確定"); a.has("内容の確認が完了しました"); assert(a.all(n => n.type === "button" && text(n) === "受注確定")[0].props.disabled); a.field("検索（得意先・品目・金額）", "nothing-123"); a.has("該当する受信はありません"); });
test("wholesale-order-hub: confirm + channel filter", () => { const a = demo("wholesale-order-hub"); a.click("確認済にする"); a.has("確認完了"); a.click("FAX"); a.has("東北食品"); a.absent("みどり商店"); });
test("ebook-law-lite: register + reject invalid amount", () => { const a = demo("ebook-law-lite"); a.field("取引先", "QA取引先", 1); a.field("金額（円）", "12345"); a.submit(); a.has("order_0930_QA取引先.pdf"); const count = a.count("tr"); a.field("取引先", "不正", 1); a.field("金額（円）", "abc"); a.submit(); assert.equal(a.count("tr"), count); });
test("sme-order-web: confirm version + edit draft", () => { const a = demo("sme-order-web"); a.click("この版を確定"); a.has("最新版 v4"); a.has("全行確定"); a.field("醤油 18Lの数量", "21"); a.has("下書き行あり"); });
test("clinic-doc-export: store copy + template change", () => { const a = demo("clinic-doc-export"); const count = a.count("tr"); a.click("控えを保管"); assert.equal(a.count("tr"), count + 1); a.click("診断書"); a.has("診断書"); });
test("paper-form-kit: edit + save + template round trip", () => { const a = demo("paper-form-kit"); a.field("作業内容", "QA日報"); a.click("入力を一覧へ"); a.has("第1工場,QA日報,2"); a.click("CSVを出す"); a.has("作業場所,作業内容,人員"); a.click("入出庫票"); a.click("作業日報"); assert(a.all(n => n.props["aria-label"] === "作業内容")[0].props.value === "QA日報"); });
test("required text inputs reject whitespace by native pattern", () => {
  for (const View of Object.values(mockViews)) { const a = mount(View); for (const field of a.all(n => n.type === "input" && n.props.required)) { assert(field.props.pattern, "Required field needs whitespace guard"); const pattern = new RegExp(`^(?:${field.props.pattern})$`); assert(!pattern.test("   ")); assert(pattern.test("  内容  ")); } }
});
test("restaurant-order-loss: reject negative and invalid loss quantity", () => { const a = demo("restaurant-order-loss"); const count = a.count("tr"); for (const value of ["abc", "-1", "0", " ", "Infinity"]) { a.field("数量", value); a.submit(); assert.equal(a.count("tr"), count); assert.equal(messages.at(-1), "数量は0より大きい数値で入力してください"); } a.field("数量", "2.5"); a.submit(); assert.equal(a.count("tr"), count + 1); });
test("restaurant-shift-exit: reject duplicate or blank role", () => { const a = demo("restaurant-shift-exit"); const count = a.count("tr"); a.field("役割", "ホール昼"); a.submit(); assert.equal(a.count("tr"), count); assert.equal(messages.at(-1), "同じ役割は登録済みです"); a.field("役割", "   "); a.submit(); assert.equal(a.count("tr"), count); a.field("役割", "まかない"); a.submit(); assert.equal(a.count("tr"), count + 1); });
test("clinic-doc-export: repeated active template keeps custom text", () => { const a = demo("clinic-doc-export"); a.field("本文", "QA編集した本文"); a.click("紹介状"); assert.equal(a.all(n => n.type === "textarea")[0].props.value, "QA編集した本文"); });
test("quantity steppers have specific accessible action names and zero floor", () => { const a = demo("restaurant-order-loss"); for (let i = 0; i < 4; i++) a.click("鶏ももの発注数を減らす"); assert(a.all(n => n.props["aria-label"] === "鶏ももの発注数を減らす")[0].props.disabled); a.click("鶏ももの発注数を増やす"); assert(!a.all(n => n.props["aria-label"] === "鶏ももの発注数を減らす")[0].props.disabled); });
console.log(`\n${checks.length} component/state checks passed. Browser layout, native events, focus, history and console checks NOT RUN.`);
