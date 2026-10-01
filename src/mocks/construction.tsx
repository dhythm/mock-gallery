import { useState } from "react";
import {
  AreaField, Badge, Banner, Btn, CheckField, PhotoSlot, Preview, Segmented,
  SelectField, TextField,
} from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { DEMO_TODAY, isPast, nextId, shortDate } from "../data/demo.ts";
import "./field-workflows.css";

const photoNames = ["北面_配筋_03.jpg", "開口部_養生_01.jpg", "KY_朝礼_02.jpg", "是正後_足場_04.jpg"];

export function ConstructionDailyReport() {
  const toast = useToast();
  const [site, setSite] = useState("東陽町マンション新築");
  const [weather, setWeather] = useState("晴");
  const [crew, setCrew] = useState("18");
  const [work, setWork] = useState("3Fスラブ配筋、外部足場の手すり点検");
  const [checks, setChecks] = useState([
    { id: "scaffold", label: "足場の点検", done: true },
    { id: "opening", label: "開口部の養生", done: true },
    { id: "heat", label: "熱中症（給水・休憩）", done: false },
    { id: "meeting", label: "朝礼の実施", done: true },
  ]);
  const [photos, setPhotos] = useState(["北面_配筋_01.jpg", "朝礼_全景_02.jpg"]);
  const [saved, setSaved] = useState(false);
  const kyDone = checks.filter((item) => item.done).length;
  const pdf = [
    "現場日報（PDFイメージ）", `工事名: ${site}`, `日付: ${DEMO_TODAY}`,
    `天候: ${weather}  人員: ${crew}名`, `KY: ${kyDone}/${checks.length}`,
    `作業: ${work}`, `写真: ${photos.join(" / ")}`, `状態: ${saved ? "確定" : "下書き"}`,
  ].join("\n");

  return (
    <div className="stack field-workflow">
      <div className="field-overview">
        <div><span className="eyebrow">DAILY REPORT</span><h2>今日の現場を、ひとつに。</h2><p className="hint">{DEMO_TODAY} · 作業・安全・写真をまとめて記録</p></div>
        <Badge tone={saved ? "ok" : "muted"}>{saved ? "確定" : "下書き"}</Badge>
      </div>
      <div className="stats field-stats">
        <div className="stat"><span>作業員</span><strong>{crew || "0"}<small> 名</small></strong><span>本日の入場人員</span></div>
        <div className="stat"><span>安全点検</span><strong>{kyDone}<small> / {checks.length}</small></strong><span>{checks.length - kyDone}項目が未確認</span></div>
        <div className="stat"><span>現場写真</span><strong>{photos.length}<small> 枚</small></strong><span>日報に添付する記録</span></div>
      </div>
      <div className="field-columns">
        <div className="stack">
          <section className="workspace-section stack">
            <div className="section-heading"><div><span className="eyebrow">01 / WORK</span><h2>作業の記録</h2></div><span className="field-step">基本情報</span></div>
            <TextField label="工事名" value={site} onChange={(value) => { setSite(value); setSaved(false); }} />
            <div className="form-grid">
              <SelectField label="天候" value={weather} onChange={(value) => { setWeather(value); setSaved(false); }} options={[{ value: "晴", label: "晴" }, { value: "曇", label: "曇" }, { value: "雨", label: "雨" }]} />
              <TextField label="作業員数" value={crew} onChange={(value) => { setCrew(value); setSaved(false); }} />
            </div>
            <AreaField label="作業内容" value={work} onChange={(value) => { setWork(value); setSaved(false); }} />
          </section>
          <section className="workspace-section stack">
            <div className="section-heading"><div><span className="eyebrow">02 / PHOTOS</span><h2>写真</h2></div><span className="field-count">{photos.length}枚</span></div>
            <div className="photos">{photos.map((name) => <PhotoSlot key={name} name={name} />)}</div>
            <div className="actions"><Btn onClick={() => {
              const name = photoNames[photos.length % photoNames.length] ?? "現場写真.jpg";
              const unique = name.replace(".jpg", `_${photos.length + 1}.jpg`);
              setPhotos((current) => [...current, unique]); setSaved(false);
              toast(`写真を追加しました: ${unique}`);
            }}>写真を追加</Btn><span className="hint">現場写真を日報に添付</span></div>
          </section>
          <div className="field-action-bar"><div><strong>{saved ? "日報を確定しました" : "記録を確認して確定"}</strong><p className="hint">入力内容は右のPDFイメージに反映されます</p></div><Btn kind="primary" onClick={() => { setSaved(true); toast("日報を保存しました。PDFイメージを更新しました"); }}>日報を確定</Btn></div>
        </div>
        <aside className="stack">
          <section className="workspace-section stack">
            <div className="section-heading"><div><span className="eyebrow">SAFETY CHECK</span><h2>安全点検 KY {kyDone}/{checks.length}</h2></div></div>
            <progress className="field-progress" max={checks.length} value={kyDone} aria-label="安全点検の確認状況" />
            <div className="stack tight field-checks">{checks.map((item) => <CheckField key={item.id} label={item.label} checked={item.done} onChange={(done) => {
              setChecks((current) => current.map((row) => row.id === item.id ? { ...row, done } : row));
              setSaved(false); toast(done ? `${item.label}を確認済にしました` : `${item.label}を未確認に戻しました`);
            }} />)}</div>
            <Banner tone={kyDone === checks.length ? "ok" : "warn"}>{kyDone === checks.length ? "KYはすべて確認済です" : "未確認のKYがあります"}</Banner>
          </section>
          <section className="workspace-section field-preview"><span className="eyebrow">OUTPUT PREVIEW</span><Preview title="PDFイメージ" text={pdf} /></section>
        </aside>
      </div>
    </div>
  );
}

type Finding = { id: string; place: string; detail: string; due: string; fixed: boolean; photo: string };

export function ConstructionCorrectivePhotos() {
  const toast = useToast();
  const [filter, setFilter] = useState<"すべて" | "未是正" | "是正済">("すべて");
  const [place, setPlace] = useState("");
  const [detail, setDetail] = useState("");
  const [due, setDue] = useState("2026-10-03");
  const [rows, setRows] = useState<Finding[]>([
    { id: "f1", place: "3Fバルコニー", detail: "手すりがぐらつく", due: "2026-10-02", fixed: false, photo: "指摘_3F手すり.jpg" },
    { id: "f2", place: "1F仮囲い", detail: "養生シートのめくれ", due: "2026-10-01", fixed: true, photo: "是正後_仮囲い.jpg" },
    { id: "f3", place: "外部足場", detail: "巾木不足", due: "2026-09-28", fixed: false, photo: "指摘_巾木.jpg" },
  ]);
  const open = rows.filter((row) => !row.fixed).length;
  const late = rows.filter((row) => !row.fixed && isPast(row.due)).length;
  const visible = rows.filter((row) => filter === "すべて" ? true : filter === "是正済" ? row.fixed : !row.fixed).slice()
    .sort((a, b) => Number(isPast(a.due) && !a.fixed) - Number(isPast(b.due) && !b.fixed)).reverse();

  return (
    <div className="stack field-workflow">
      <div className="field-overview"><div><span className="eyebrow">CORRECTIVE ACTIONS</span><h2>指摘から、是正完了まで。</h2><p className="hint">期限超過の指摘を先頭に表示しています</p></div><span className="field-count">全{rows.length}件</span></div>
      <div className="stats field-stats">
        <div className="stat"><span>未是正</span><strong>{open}<small> 件</small></strong><span>対応が必要な指摘</span></div>
        <div className="stat field-stat-alert"><span>期限超過</span><strong>{late}<small> 件</small></strong><span>優先して確認</span></div>
        <div className="stat"><span>是正済</span><strong>{rows.length - open}<small> 件</small></strong><span>是正後写真を保管</span></div>
      </div>
      <div className="field-columns field-columns-ledger">
        <section className="workspace-section stack">
          <div className="section-heading"><h2>指摘台帳</h2><span className="hint">{visible.length}件を表示</span></div>
          <Segmented label="是正状態" value={filter} onChange={setFilter} options={[{ value: "すべて", label: "すべて" }, { value: "未是正", label: "未是正" }, { value: "是正済", label: "是正済" }]} />
          <div className="field-findings">
            {visible.map((row) => {
              const overdue = !row.fixed && isPast(row.due);
              return <article key={row.id} className={`field-finding${overdue ? " field-finding-late" : ""}`}>
                <div className="field-finding-body"><div className="field-finding-top"><span className="field-location">{row.place}</span><Badge tone={row.fixed ? "ok" : overdue ? "alert" : "warn"}>{row.fixed ? "是正済" : overdue ? "期限超過" : "未是正"}</Badge></div><h3>{row.detail}</h3><span className="hint">期限 {shortDate(row.due)}</span><div className="actions">{!row.fixed ? <Btn kind="primary" onClick={() => {
                  setRows((current) => current.map((item) => item.id === row.id ? { ...item, fixed: true, photo: `是正後_${item.place}.jpg` } : item));
                  toast(`是正済にしました: ${row.place}`);
                }}>是正完了</Btn> : <span className="field-completed">是正後の写真を記録済み</span>}</div></div>
                <PhotoSlot name={row.photo} />
              </article>;
            })}
            {visible.length === 0 ? <div className="field-empty">該当する指摘はありません</div> : null}
          </div>
        </section>
        <aside><form className="workspace-section stack field-compose" onSubmit={(event) => {
          event.preventDefault();
          const next: Finding = { id: nextId("f"), place: place.trim(), detail: detail.trim(), due, fixed: false, photo: `指摘_${place.trim()}.jpg` };
          setRows((current) => [next, ...current]); setPlace(""); setDetail(""); toast("指摘を追加しました");
        }}>
          <div><span className="eyebrow">NEW FINDING</span><h2>新しい指摘</h2><p className="hint">場所と期限を添えて、対応漏れを防ぐ</p></div>
          <TextField label="場所" value={place} onChange={setPlace} required placeholder="例: 2F階段" />
          <TextField label="内容" value={detail} onChange={setDetail} required placeholder="例: 段鼻の養生なし" />
          <TextField label="期限" value={due} onChange={setDue} required />
          <Btn type="submit" kind="primary">指摘を追加</Btn>
          <p className="hint">追加した指摘には写真イメージが付きます</p>
        </form></aside>
      </div>
    </div>
  );
}

type Ticket = { id: string; company: string; task: string; column: "手配" | "作業中" | "完了"; photo?: string };
const columns = ["手配", "作業中", "完了"] as const;

export function ConstructionSubcontractorBoard() {
  const toast = useToast();
  const [company, setCompany] = useState("");
  const [task, setTask] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: "t1", company: "青葉鉄筋", task: "3Fスラブ配筋", column: "手配" },
    { id: "t2", company: "北沢設備", task: "スリーブ確認", column: "作業中" },
    { id: "t3", company: "川田塗装", task: "内部パテ", column: "完了", photo: "完了_内部パテ.jpg" },
  ]);
  function move(ticket: Ticket, column: Ticket["column"]) {
    setTickets((current) => current.map((item) => item.id === ticket.id ? { ...item, column } : item));
    toast(`${ticket.company}を${column}に移しました`);
  }
  const completed = tickets.filter((item) => item.column === "完了").length;

  return (
    <div className="stack field-workflow">
      <div className="field-overview"><div><span className="eyebrow">PARTNER WORK BOARD</span><h2>協力会社と、今日の進捗。</h2><p className="hint">手配 → 作業中 → 完了の順に、作業を進めます</p></div><div className="field-board-summary"><strong>{completed}<small> / {tickets.length}</small></strong><span>作業完了</span></div></div>
      <div className="board field-board">
        {columns.map((column, index) => {
          const columnTickets = tickets.filter((item) => item.column === column);
          return <section key={column} className={`board-col field-board-col field-board-col-${index}`}>
            <div className="field-column-heading"><div><span className="eyebrow">0{index + 1}</span><h2>{column}</h2></div><span className="field-count">{columnTickets.length}</span></div>
            <p className="hint field-column-hint">{["開始を待っている作業", "現場で進行中の作業", "記録を残して引き継ぎ"][index]}</p>
            {columnTickets.map((item) => <article key={item.id} className="ticket field-ticket">
              <span className="field-company">{item.company}</span><h3>{item.task}</h3>
              {item.photo ? <PhotoSlot name={item.photo} /> : <div className="field-photo-empty">現場写真はまだありません</div>}
              <div className="actions">
                {column === "手配" ? <Btn kind="primary" onClick={() => move(item, "作業中")}>作業開始</Btn> : null}
                {column === "作業中" ? <Btn kind="primary" onClick={() => move(item, "完了")}>完了にする</Btn> : null}
                {column !== "完了" ? <Btn onClick={() => {
                  const photo = `${item.company}_現場.jpg`;
                  setTickets((current) => current.map((row) => row.id === item.id ? { ...row, photo } : row));
                  toast(`写真を付けました: ${item.company}`);
                }}>写真を追加</Btn> : <Badge tone="ok">完了</Badge>}
              </div>
            </article>)}
            {columnTickets.length === 0 ? <div className="field-empty">{column}の作業はありません</div> : null}
          </section>;
        })}
      </div>
      <section className="workspace-section stack">
        <div className="section-heading"><div><span className="eyebrow">NEW ASSIGNMENT</span><h2>協力会社への手配</h2></div><span className="hint">追加した作業は「手配」に入ります</span></div>
        <form className="form-grid field-inline-form" onSubmit={(event) => {
          event.preventDefault();
          setTickets((current) => [...current, { id: nextId("t"), company: company.trim(), task: task.trim(), column: "手配" }]);
          setCompany(""); setTask(""); toast("手配を追加しました");
        }}>
          <TextField label="協力会社" value={company} onChange={setCompany} required placeholder="例: 東邦電気" />
          <TextField label="作業" value={task} onChange={setTask} required placeholder="例: 配線立会" />
          <Btn type="submit" kind="primary">手配を追加</Btn>
        </form>
      </section>
    </div>
  );
}
