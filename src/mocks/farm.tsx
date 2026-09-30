import { useState } from "react";
import { Btn, Preview, SelectField, TextField } from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { nextId, shortDate } from "../data/demo.ts";

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

  const text = [
    "GAP証跡（PDFイメージ）",
    "圃場: 第2圃場 / 作物: トマト",
    ...works.map((work) => `${shortDate(work.date)} ${work.kind} ${work.material} ${work.note}`),
  ].join("\n");

  return (
    <div className="stack">
      <p className="hint">第2圃場・トマト。審査用に、その日の作業だけを残します。</p>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>日付</th>
              <th>作業</th>
              <th>資材</th>
              <th>メモ</th>
            </tr>
          </thead>
          <tbody>
            {works.map((work) => (
              <tr key={work.id}>
                <td>{shortDate(work.date)}</td>
                <td>{work.kind}</td>
                <td>{work.material}</td>
                <td>{work.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          setWorks((current) => [
            ...current,
            { id: nextId("g"), date: "2026-09-30", kind, material: material.trim(), note: note.trim() },
          ]);
          setMaterial("");
          setNote("");
          setPacked(false);
          toast("作業を追加しました。証跡PDFを更新しました");
        }}
      >
        <SelectField
          label="作業"
          value={kind}
          onChange={setKind}
          options={(["定植", "追肥", "防除", "収穫", "観察"] as const).map((item) => ({
            value: item,
            label: item,
          }))}
        />
        <TextField label="資材" value={material} onChange={setMaterial} required placeholder="例: なし" />
        <TextField label="メモ" value={note} onChange={setNote} required placeholder="例: 裂果を2株確認" />
        <Btn type="submit" kind="primary">作業を追加</Btn>
      </form>
      <Btn
        kind="primary"
        onClick={() => {
          setPacked(true);
          toast("GAP証跡PDFのイメージを出しました");
        }}
      >
        証跡PDFを出す
      </Btn>
      {packed ? <Preview title="証跡PDFイメージ" text={text} /> : null}
    </div>
  );
}
