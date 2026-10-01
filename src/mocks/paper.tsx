import { useState } from "react";
import { Badge, Btn, Preview, Segmented } from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { DEMO_TODAY, nextId } from "../data/demo.ts";
import "./document-workflows.css";

type FormId = "daily" | "stock" | "check";
const forms: Record<FormId, { title: string; fields: string[] }> = {
  daily: { title: "作業日報", fields: ["作業場所", "作業内容", "人員"] },
  stock: { title: "入出庫票", fields: ["品目", "数量", "入出"] },
  check: { title: "点検票", fields: ["設備", "結果", "担当"] },
};
type Saved = { id: string; form: string; summary: string };

export function PaperFormKit() {
  const toast = useToast();
  const [formId, setFormId] = useState<FormId>("daily");
  const [values, setValues] = useState<Record<string, string>>({
    作業場所: "第1工場",
    作業内容: "朝の点検",
    人員: "2",
  });
  const [csv, setCsv] = useState("");
  const [saved, setSaved] = useState<Saved[]>([]);
  const form = forms[formId];
  const filled = form.fields.filter((field) => values[field]?.trim()).length;
  function setField(field: string, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setCsv("");
  }
  const line = form.fields.map((field) => values[field] ?? "").join(",");

  return (
    <div className="stack doc-workflow">
      <div className="doc-work-header">
        <div>
          <span className="eyebrow">DIGITAL PAPER</span>
          <h2>いつもの帳票を、そのまま画面で。</h2>
          <p className="hint">見慣れた枠に入力して、一覧とCSVへ</p>
        </div>
        <Badge tone="info">3つの帳票テンプレート</Badge>
      </div>
      <section className="doc-template-picker">
        <span className="field-label">入力する帳票</span>
        <Segmented
          label="帳票"
          value={formId}
          onChange={(value) => {
            setFormId(value);
            setCsv("");
            toast(`${forms[value].title}の枠に切り替えました`);
          }}
          options={[
            { value: "daily", label: "作業日報" },
            { value: "stock", label: "入出庫票" },
            { value: "check", label: "点検票" },
          ]}
        />
      </section>
      <div className="doc-paper-layout">
        <section className="doc-paper-desk" aria-label={`${form.title}の入力`}>
          <div className="paper doc-digital-sheet">
            <div className="doc-sheet-top">
              <span>業務帳票</span>
              <span>入力用</span>
            </div>
            <h2 className="paper-head">{form.title}</h2>
            <div className="doc-paper-meta">
              <span>
                日付 <strong>{DEMO_TODAY}</strong>
              </span>
              <span>
                様式{" "}
                {formId === "daily" ? "01" : formId === "stock" ? "02" : "03"}
              </span>
            </div>
            <table className="paper-table">
              <tbody>
                {form.fields.map((field, index) => (
                  <tr key={field}>
                    <th>
                      <span className="doc-field-index">0{index + 1}</span>
                      {field}
                    </th>
                    <td>
                      <input
                        className="input"
                        aria-label={field}
                        value={values[field] ?? ""}
                        placeholder={`${field}を入力`}
                        onChange={(event) =>
                          setField(field, event.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="doc-paper-note">枠の中をタップして入力できます</p>
          </div>
        </section>
        <aside className="doc-paper-tools">
          <div>
            <span className="eyebrow">OUTPUT</span>
            <h2>入力をまとめる</h2>
            <p className="hint">
              入力した内容を一覧に残すか、CSVイメージで確認できます
            </p>
          </div>
          <div className="doc-fill-status">
            <div>
              <span>入力状況</span>
              <strong>
                {filled}
                <small> / {form.fields.length}項目</small>
              </strong>
            </div>
            <progress
              value={filled}
              max={form.fields.length}
              aria-label="入力済み項目"
            />
          </div>
          <div className="doc-export-actions">
            <Btn
              kind="primary"
              onClick={() => {
                const text = `${form.fields.join(",")}\n${line}`;
                setCsv(text);
                toast(`${form.title}のCSVイメージを出しました`);
              }}
            >
              CSVを出す
            </Btn>
            <Btn
              onClick={() => {
                setSaved((current) => [
                  {
                    id: nextId("r"),
                    form: form.title,
                    summary: filled ? line : "（空）",
                  },
                  ...current,
                ]);
                toast(`${form.title}を一覧に追加しました`);
              }}
            >
              入力を一覧へ
            </Btn>
          </div>
          <p className="hint doc-local-note">
            データはこの画面の中だけで保持されます
          </p>
        </aside>
      </div>
      {csv ? (
        <section className="workspace-section doc-csv-preview">
          <Preview title="CSVイメージ" text={csv} />
        </section>
      ) : null}
      <section className="workspace-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">RECORDS</span>
            <h2>入力した帳票</h2>
          </div>
          <span className="hint">{saved.length}件</span>
        </div>
        {saved.length > 0 ? (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>帳票</th>
                  <th>内容</th>
                </tr>
              </thead>
              <tbody>
                {saved.map((row) => (
                  <tr key={row.id}>
                    <td data-label="帳票">
                      <strong>{row.form}</strong>
                    </td>
                    <td data-label="内容">{row.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="doc-empty">
            <strong>入力した帳票が、ここに並びます</strong>
            <p>「入力を一覧へ」で記録を追加してください</p>
          </div>
        )}
      </section>
    </div>
  );
}
