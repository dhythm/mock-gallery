import { useState } from "react";
import { Btn, Preview, TextField } from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { nextId, shortDate } from "../data/demo.ts";

type Contact = { id: string; date: string; channel: string; body: string };

const months = {
  "2026-09": { income: 286000, fee: 18400, repair: 0 },
  "2026-08": { income: 286000, fee: 18400, repair: 42000 },
} as const;

export function PropertyOwnerReport() {
  const toast = useToast();
  const [month, setMonth] = useState<keyof typeof months>("2026-09");
  const [channel, setChannel] = useState("電話");
  const [body, setBody] = useState("");
  const [packed, setPacked] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "k1", date: "2026-09-12", channel: "電話", body: "共用灯の交換を了承" },
    { id: "k2", date: "2026-09-21", channel: "メール", body: "10月の更新について確認" },
  ]);

  const figures = months[month];
  const text = [
    `オーナー報告パック ${month}`,
    "物件: メゾン桜台",
    `賃料収入: ${figures.income.toLocaleString("ja-JP")}円`,
    `管理費: ${figures.fee.toLocaleString("ja-JP")}円`,
    `修繕: ${figures.repair.toLocaleString("ja-JP")}円`,
    "連絡履歴:",
    ...contacts.map((contact) => `- ${shortDate(contact.date)} ${contact.channel} ${contact.body}`),
    packed ? "状態: PDFイメージ作成済" : "状態: 未作成",
  ].join("\n");

  return (
    <div className="stack">
      <div className="actions">
        {(Object.keys(months) as (keyof typeof months)[]).map((key) => (
          <button
            key={key}
            type="button"
            className="btn"
            aria-pressed={month === key}
            onClick={() => {
              setMonth(key);
              setPacked(false);
              toast(`${key}の収支に切り替えました`);
            }}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="stats">
        <div className="stat">
          <b>{figures.income.toLocaleString("ja-JP")}</b>
          <span>賃料収入（円）</span>
        </div>
        <div className="stat">
          <b>{figures.fee.toLocaleString("ja-JP")}</b>
          <span>管理費（円）</span>
        </div>
        <div className="stat">
          <b>{figures.repair.toLocaleString("ja-JP")}</b>
          <span>修繕（円）</span>
        </div>
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>日付</th>
              <th>経路</th>
              <th>内容</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{shortDate(contact.date)}</td>
                <td>{contact.channel}</td>
                <td>{contact.body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          setContacts((current) => [
            ...current,
            { id: nextId("k"), date: "2026-09-30", channel, body: body.trim() },
          ]);
          setBody("");
          setPacked(false);
          toast("連絡を追加しました");
        }}
      >
        <TextField label="経路" value={channel} onChange={setChannel} required />
        <TextField label="内容" value={body} onChange={setBody} required placeholder="例: 漏水の一次対応を報告" />
        <Btn type="submit" kind="primary">連絡を追加</Btn>
      </form>
      <Btn
        kind="primary"
        onClick={() => {
          setPacked(true);
          toast(`${month}の報告パックをまとめました`);
        }}
      >
        PDFパックを作成
      </Btn>
      {packed ? <Preview title="PDFイメージ" text={text} /> : <Preview title="下書き" text={text} />}
    </div>
  );
}
