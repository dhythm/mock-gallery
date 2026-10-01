import "./people-workflows.css";
import { useState } from "react";
import { Badge, Btn, Preview, TextField } from "../components/kit.tsx";
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
    <div className="stack pflow-workspace">
      <div className="pflow-context">
        <div className="pflow-context-main"><div className="pflow-monogram" aria-hidden="true">桜</div><div><p className="pflow-kicker">Owner reporting / Maison Sakuradai</p><h2>メゾン桜台</h2><p className="hint">月次の収支と連絡履歴を、一つの報告に。</p></div></div>
        <Badge tone={packed ? "ok" : "muted"}>{packed ? "報告パック作成済み" : "報告パックの下書き"}</Badge>
      </div>
      <div className="pflow-heading"><div><p className="pflow-kicker">Monthly statement</p><h2>{month.replace("-", "年")}月の収支</h2></div>
      <div className="actions" role="group" aria-label="報告月">
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
      </div>
      <div className="pflow-ledger" aria-label="月次収支">
        <div className="pflow-ledger-total"><span>収支差額</span><strong>{(figures.income - figures.fee - figures.repair).toLocaleString("ja-JP")}<small>円</small></strong></div>
        <div><span>賃料収入</span><strong>{figures.income.toLocaleString("ja-JP")}<small>円</small></strong></div>
        <div><span>管理費</span><strong>{figures.fee.toLocaleString("ja-JP")}<small>円</small></strong></div>
        <div><span>修繕</span><strong>{figures.repair.toLocaleString("ja-JP")}<small>円</small></strong></div>
      </div>
      <div className="pflow-columns">
      <section className="pflow-column">
      <div className="pflow-heading"><div><p className="pflow-kicker">Communication history</p><h2>オーナーとの連絡</h2></div><Badge tone="muted">{contacts.length}件</Badge></div>
      <div className="pflow-panel pflow-contact-list">
        {contacts.map((contact) => <article className="pflow-contact" key={contact.id}>
          <time dateTime={contact.date}>{shortDate(contact.date)}</time>
          <div><Badge tone="muted">{contact.channel}</Badge><p>{contact.body}</p></div>
        </article>)}
      </div>
      <section className="pflow-inline-form">
      <div className="pflow-heading"><h3>連絡内容を記録</h3></div>
      <form
        className="form-grid pflow-form"
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
      </section>
      </section>
      <section className="pflow-panel pflow-panel-soft pflow-column">
      <div className="pflow-heading"><div><p className="pflow-kicker">Report package</p><h2>報告パック</h2><p className="hint">収支と連絡履歴をまとめた、オーナーへの報告内容です。</p></div></div>
      {packed ? <Preview title="PDFイメージ" text={text} /> : <Preview title="下書き" text={text} />}
      <Btn
        kind="primary"
        onClick={() => {
          setPacked(true);
          toast(`${month}の報告パックをまとめました`);
        }}
      >
        PDFパックを作成
      </Btn>
      <p className="hint">収支や連絡を変更したときは、再度パックを作成します。</p>
      </section>
      </div>
    </div>
  );
}
