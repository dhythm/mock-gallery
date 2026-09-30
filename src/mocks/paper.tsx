import { useState } from "react";
import { Btn, Preview, Segmented } from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { DEMO_TODAY, nextId } from "../data/demo.ts";

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

  function setField(field: string, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setCsv("");
  }

  const line = form.fields.map((field) => values[field] ?? "").join(",");

  return (
    <div className="stack">
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
      <div className="paper">
        <h2 className="paper-head">{form.title}</h2>
        <p className="hint">日付 {DEMO_TODAY}</p>
        <div className="table-wrap">
          <table className="paper-table">
            <tbody>
              {form.fields.map((field) => (
                <tr key={field}>
                  <th>{field}</th>
                  <td>
                    <input
                      className="input"
                      aria-label={field}
                      value={values[field] ?? ""}
                      onChange={(event) => setField(field, event.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="actions">
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
              { id: nextId("r"), form: form.title, summary: line || "（空）" },
              ...current,
            ]);
            toast(`${form.title}を一覧に追加しました`);
          }}
        >
          入力を一覧へ
        </Btn>
      </div>
      {csv ? <Preview title="CSVイメージ" text={csv} /> : null}
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
                  <td>{row.form}</td>
                  <td>{row.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
