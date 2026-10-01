import { useState } from "react";
import { Badge, Banner, Btn, PhotoSlot, Segmented, TextField } from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { nextId } from "../data/demo.ts";
import "./field-workflows.css";

type AssetStatus = "未実施" | "異常なし" | "異常";
type Asset = { id: string; name: string; area: string; status: AssetStatus; photo?: string };

export function ManufacturingInspection() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [activeId, setActiveId] = useState("a1");
  const [noise, setNoise] = useState<"未" | "良" | "否">("未");
  const [leak, setLeak] = useState<"未" | "良" | "否">("未");
  const [assets, setAssets] = useState<Asset[]>([
    { id: "a1", name: "コンプレッサー#2", area: "第1工場", status: "未実施" },
    { id: "a2", name: "ボイラー#1", area: "動力室", status: "異常なし" },
    { id: "a3", name: "クレーン南", area: "屋外", status: "未実施" },
  ]);
  const pending = assets.filter((item) => item.status === "未実施").length;
  const abnormalCount = assets.filter((item) => item.status === "異常").length;
  const active = assets.find((item) => item.id === activeId) ?? assets[0];
  const answered = Number(noise !== "未") + Number(leak !== "未");

  return (
    <div className="stack field-workflow">
      <div className="field-overview"><div><span className="eyebrow">EQUIPMENT INSPECTION</span><h2>設備の状態を、次のシフトへ。</h2><p className="hint">設備を選んで、異音・漏れの2項目を確認</p></div><span className="field-count">登録設備 {assets.length}台</span></div>
      <div className="stats field-stats">
        <div className="stat"><span>未実施</span><strong>{pending}<small> 台</small></strong><span>次のシフトまでに確認</span></div>
        <div className="stat"><span>異常なし</span><strong>{assets.length - pending - abnormalCount}<small> 台</small></strong><span>点検を記録済み</span></div>
        <div className={`stat${abnormalCount ? " field-stat-alert" : ""}`}><span>異常</span><strong>{abnormalCount}<small> 台</small></strong><span>対応・写真の確認が必要</span></div>
      </div>
      <Banner tone={pending > 0 ? "alert" : "ok"}>{pending > 0 ? `未実施 ${pending}件。次のシフトの前に閉じてください` : "未実施はありません"}</Banner>
      <div className="field-inspection-layout">
        <aside className="workspace-section stack">
          <div className="section-heading"><h2>設備一覧</h2><span className="hint">{assets.length}台</span></div>
          <div className="field-asset-list">
            {assets.map((asset) => <article key={asset.id} className={`field-asset${asset.id === active?.id ? " is-active" : ""}`}>
              <div className="field-asset-meta"><span className="hint">{asset.area}</span><Badge tone={asset.status === "未実施" ? "alert" : asset.status === "異常" ? "warn" : "ok"}>{asset.status}</Badge></div>
              <h3>{asset.name}</h3><Btn kind={asset.id === active?.id ? "primary" : "default"} onClick={() => {
                setActiveId(asset.id); setNoise("未"); setLeak("未"); toast(`${asset.name}の点検を開きました`);
              }}>点検する</Btn>
            </article>)}
          </div>
          <form className="stack tight field-add-asset" onSubmit={(event) => {
            event.preventDefault(); const id = nextId("a");
            setAssets((current) => [...current, { id, name: name.trim(), area: "追加設備", status: "未実施" }]);
            setName(""); toast("設備を追加しました。状態は未実施です");
          }}>
            <TextField label="設備名" value={name} onChange={setName} required placeholder="例: プレス2号" />
            <Btn type="submit">設備を追加</Btn>
          </form>
        </aside>
        {active ? <section className="workspace-section stack field-inspection">
          <div className="section-heading"><div><span className="eyebrow">INSPECTION · {active.area}</span><h2>{active.name}</h2></div><Badge tone={active.status === "異常" ? "warn" : active.status === "異常なし" ? "ok" : "muted"}>{active.status}</Badge></div>
          <div className="field-inspection-progress"><span>{answered} / 2 項目を入力</span><progress className="field-progress" value={answered} max={2} aria-label="点検項目の入力状況" /></div>
          <div className="field-inspection-check"><div><span className="field-check-number">01</span><h3>異音</h3><p className="hint">稼働音を確認して判定を選択</p></div><Segmented label="異音" value={noise} onChange={setNoise} options={[{ value: "未", label: "異音: 未" }, { value: "良", label: "異音: 良" }, { value: "否", label: "異音: 否" }]} /></div>
          <div className="field-inspection-check"><div><span className="field-check-number">02</span><h3>漏れ</h3><p className="hint">設備周辺を確認して判定を選択</p></div><Segmented label="漏れ" value={leak} onChange={setLeak} options={[{ value: "未", label: "漏れ: 未" }, { value: "良", label: "漏れ: 良" }, { value: "否", label: "漏れ: 否" }]} /></div>
          {active.photo ? <div className="stack tight"><h3>異常の記録写真</h3><PhotoSlot name={active.photo} /></div> : null}
          <div className="field-action-bar"><div><strong>{answered === 2 ? "点検内容を記録できます" : "すべての項目を確認してください"}</strong><p className="hint">「否」で記録すると、異常写真が付きます</p></div><div className="actions"><Btn kind="primary" disabled={noise === "未" || leak === "未"} onClick={() => {
            const abnormal = noise === "否" || leak === "否";
            const photo = abnormal ? `${active.name}_異常.jpg` : undefined;
            setAssets((current) => current.map((item) => item.id === active.id ? { ...item, status: abnormal ? "異常" : "異常なし", photo } : item));
            toast(abnormal ? `${active.name}を異常で記録し、写真を付けました` : `${active.name}を異常なしで記録しました`);
          }}>点検を記録</Btn>{active.status === "異常" ? <Btn onClick={() => {
            setAssets((current) => current.map((item) => item.id === active.id ? { ...item, status: "異常なし", photo: undefined } : item));
            toast(`${active.name}の異常を閉じました`);
          }}>異常を閉じる</Btn> : null}</div></div>
        </section> : null}
      </div>
    </div>
  );
}

type CheckResult = "未" | "良" | "否";
type CheckItem = { id: string; label: string; result: CheckResult; note: string };

export function ManufacturingChecklistDigital() {
  const toast = useToast();
  const [label, setLabel] = useState("");
  const [stamped, setStamped] = useState(false);
  const [items, setItems] = useState<CheckItem[]>([
    { id: "c1", label: "非常停止の動作", result: "良", note: "" },
    { id: "c2", label: "安全カバーの固定", result: "未", note: "" },
    { id: "c3", label: "油圧の漏れ", result: "未", note: "" },
    { id: "c4", label: "周辺の油拭き", result: "良", note: "" },
  ]);
  function setResult(id: string, result: CheckResult) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, result } : item));
    setStamped(false); toast(`良否を${result}にしました`);
  }
  const remaining = items.filter((item) => item.result === "未").length;
  const failed = items.filter((item) => item.result === "否").length;

  return (
    <div className="stack field-workflow">
      <div className="field-overview"><div><span className="eyebrow">DAILY CHECKLIST</span><h2>紙の点検表を、そのまま現場へ。</h2><p className="hint">項目の並びはそのまま。良否とメモをタップで記録</p></div><Badge tone={stamped ? "ok" : "muted"}>{stamped ? "記録済" : "未記録"}</Badge></div>
      <div className="stats field-stats">
        <div className="stat"><span>確認済み</span><strong>{items.length - remaining}<small> / {items.length}</small></strong><span>良否を入力した項目</span></div>
        <div className="stat"><span>未確認</span><strong>{remaining}<small> 件</small></strong><span>記録前にすべて確認</span></div>
        <div className={`stat${failed ? " field-stat-alert" : ""}`}><span>要確認（否）</span><strong>{failed}<small> 件</small></strong><span>必要に応じてメモを追加</span></div>
      </div>
      <section className="paper field-checklist">
        <div className="field-paper-heading"><div><span className="eyebrow">INSPECTION SHEET / PRESS 01</span><h2 className="paper-head">日常点検表（プレス1号）</h2><p className="hint">日付 2026-09-30 / 担当 中村 / 紙の並びのまま</p></div><span className="field-paper-code">日常点検</span></div>
        <div className="table-wrap"><table className="paper-table field-checklist-table"><thead><tr><th>項目</th><th>良否</th><th>メモ</th></tr></thead><tbody>
          {items.map((item, index) => <tr key={item.id} className={item.result === "未" ? "field-unchecked" : undefined}>
            <td data-label="項目"><div className="field-checklist-name"><span className="field-row-number">{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong>{item.result === "未" ? <Badge tone="muted">未</Badge> : null}</div></td>
            <td data-label="良否"><div className="actions"><button type="button" className="btn" aria-label={`${item.label}: 良`} aria-pressed={item.result === "良"} onClick={() => setResult(item.id, "良")}>良</button><button type="button" className="btn" aria-label={`${item.label}: 否`} aria-pressed={item.result === "否"} onClick={() => setResult(item.id, "否")}>否</button></div></td>
            <td data-label="メモ"><input className="input" aria-label={`${item.label}のメモ`} placeholder="気づいたことを記録" value={item.note} onChange={(event) => {
              const note = event.target.value; setItems((current) => current.map((row) => row.id === item.id ? { ...row, note } : row)); setStamped(false);
            }} /></td>
          </tr>)}
        </tbody></table></div>
        <form className="form-grid field-checklist-add" onSubmit={(event) => {
          event.preventDefault(); setItems((current) => [...current, { id: nextId("c"), label: label.trim(), result: "未", note: "" }]);
          setLabel(""); setStamped(false); toast("点検項目を追加しました");
        }}><TextField label="項目を追加" value={label} onChange={setLabel} required placeholder="例: 照明" /><Btn type="submit">行を追加</Btn></form>
        <div className="field-paper-footer"><div className="field-stamp-area"><div className="stamp-slot">{stamped ? <div className="stamp">記録済</div> : <span className="hint">未記録</span>}</div><div><strong>{stamped ? "点検表を記録しました" : remaining ? `あと${remaining}項目を確認` : "すべての項目を確認済み"}</strong><p className="hint">入力を変更すると未記録に戻ります</p></div></div><Btn kind="primary" onClick={() => {
          if (items.some((item) => item.result === "未")) { toast("未の項目が残っています"); return; }
          setStamped(true); toast("点検表を記録済にしました");
        }}>記録する</Btn></div>
      </section>
    </div>
  );
}
