import { useState } from "react";
import { Badge, Btn, Preview, SelectField, TextField } from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { nextId, shortDate } from "../data/demo.ts";
import "./field-workflows.css";

type WorkKind = "定植" | "追肥" | "防除" | "収穫" | "観察";
type Work = { id: string; date: string; kind: WorkKind; material: string; note: string };

export function FarmGapLog() {
  const toast = useToast();
  const [kind, setKind] = useState<WorkKind>("観察");
  const [material, setMaterial] = useState("");
  const [note, setNote] = useState("");
  const [packed, setPacked] = useState(false);
  const [works, setWorks] = useState<Work[]>([
    { id: "g1", date: "2026-09-28", kind: "追肥", material: "有機配合 8kg", note: "第2圃場 畝2-4" },
    { id: "g2", date: "2026-09-29", kind: "防除", material: "モスピラン 規定希釈", note: "収穫7日前を確認" },
  ]);
  const text = ["GAP証跡（PDFイメージ）", "圃場: 第2圃場 / 作物: トマト", ...works.map((work) => `${shortDate(work.date)} ${work.kind} ${work.material} ${work.note}`)].join("\n");
  const latest = works[works.length - 1];

  return (
    <div className="stack field-workflow">
      <div className="field-farm-overview"><div className="field-farm-marker" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="M24 39V21M24 29C12 29 8 20 9 11c10 0 15 6 15 15M24 23C24 13 30 8 40 9c0 10-6 16-16 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 39h26" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg></div><div><span className="eyebrow">FIELD RECORD / GAP</span><h2>第2圃場 <span className="field-crop">トマト</span></h2><p className="hint">第2圃場・トマト。審査用に、その日の作業だけを残します。</p></div><Badge tone={packed ? "ok" : "muted"}>{packed ? "証跡出力済" : "記録中"}</Badge></div>
      <div className="stats field-stats">
        <div className="stat"><span>作業記録</span><strong>{works.length}<small> 件</small></strong><span>圃場の作業履歴</span></div>
        <div className="stat"><span>作業の種類</span><strong>{new Set(works.map((work) => work.kind)).size}<small> 種類</small></strong><span>資材・メモと一緒に記録</span></div>
        <div className="stat"><span>最新の記録</span><strong>{latest ? shortDate(latest.date) : "—"}</strong><span>{latest?.kind ?? "まだ記録がありません"}</span></div>
      </div>
      <div className="field-columns field-columns-ledger">
        <div className="stack">
          <section className="workspace-section stack">
            <div className="section-heading"><div><span className="eyebrow">WORK HISTORY</span><h2>栽培・作業の記録</h2></div><span className="field-count">{works.length}件</span></div>
            <div className="table-wrap"><table className="data field-farm-table"><thead><tr><th>日付</th><th>作業</th><th>資材</th><th>メモ</th></tr></thead><tbody>{works.map((work) => <tr key={work.id}>
              <td data-label="日付"><span className="field-date">{shortDate(work.date)}</span></td><td data-label="作業"><span className={`field-work-kind field-work-kind-${work.kind}`}>{work.kind}</span></td><td data-label="資材">{work.material}</td><td data-label="メモ">{work.note}</td>
            </tr>)}</tbody></table></div>
          </section>
          <section className="workspace-section stack">
            <div className="field-export-heading"><div><span className="eyebrow">EVIDENCE PACK</span><h2>記録をGAP証跡にまとめる</h2><p className="hint">圃場・作物・{works.length}件の作業記録を、ひとつのPDFイメージに</p></div><Btn kind="primary" onClick={() => { setPacked(true); toast("GAP証跡PDFのイメージを出しました"); }}>証跡PDFを出す</Btn></div>
            {packed ? <div className="field-preview"><Preview title="証跡PDFイメージ" text={text} /></div> : <div className="field-export-placeholder"><span className="field-document-icon" aria-hidden="true">≡</span><span>出力すると、ここで証跡を確認できます</span></div>}
          </section>
        </div>
        <aside><form className="workspace-section stack field-compose" onSubmit={(event) => {
          event.preventDefault(); setWorks((current) => [...current, { id: nextId("g"), date: "2026-09-30", kind, material: material.trim(), note: note.trim() }]);
          setMaterial(""); setNote(""); setPacked(false); toast("作業を追加しました。証跡PDFを更新しました");
        }}>
          <div><span className="eyebrow">NEW WORK RECORD</span><h2>今日の作業を残す</h2><p className="hint">記録日 2026-09-30</p></div>
          <SelectField label="作業" value={kind} onChange={setKind} options={(["定植", "追肥", "防除", "収穫", "観察"] as const).map((item) => ({ value: item, label: item }))} />
          <TextField label="資材" value={material} onChange={setMaterial} required placeholder="例: なし" />
          <TextField label="メモ" value={note} onChange={setNote} required placeholder="例: 裂果を2株確認" />
          <Btn type="submit" kind="primary">作業を追加</Btn>
          <p className="hint">使った資材や、圃場での気づきを記録。資材を使わない作業は「なし」と入力します。</p>
        </form></aside>
      </div>
    </div>
  );
}
