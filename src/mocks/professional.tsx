import { useState } from "react";
import { Badge, Banner, Btn, SelectField, TextField } from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { DEMO_TODAY, isPast, nextId, shortDate } from "../data/demo.ts";

type CaseRow = {
  id: string;
  client: string;
  matter: string;
  due: string;
  done: boolean;
};

export function ProfessionalCaseLedger() {
  const toast = useToast();
  const [client, setClient] = useState("");
  const [matter, setMatter] = useState("");
  const [due, setDue] = useState("2026-10-15");
  const [rows, setRows] = useState<CaseRow[]>([
    { id: "m1", client: "株式会社丸和製作所", matter: "決算申告", due: "2026-10-31", done: false },
    { id: "m2", client: "佐藤商事", matter: "源泉所得税", due: "2026-10-10", done: false },
    { id: "m3", client: "山田氏", matter: "相続登記", due: "2026-09-20", done: false },
  ]);

  const sorted = rows.slice().sort((a, b) => {
    const rank = (row: CaseRow) => (row.done ? 2 : isPast(row.due) ? 0 : 1);
    return rank(a) - rank(b) || a.due.localeCompare(b.due);
  });
  const overdue = rows.filter((row) => !row.done && isPast(row.due)).length;

  return (
    <div className="stack">
      <Banner tone={overdue > 0 ? "alert" : "ok"}>
        {overdue > 0 ? `期限超過 ${overdue}件を先頭に出しています（基準日 ${shortDate(DEMO_TODAY)}）` : "期限超過はありません"}
      </Banner>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>顧客</th>
              <th>手続</th>
              <th>期限</th>
              <th>状態</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const late = !row.done && isPast(row.due);
              return (
                <tr key={row.id} className={late ? "overdue" : undefined}>
                  <td>{row.client}</td>
                  <td>{row.matter}</td>
                  <td>{shortDate(row.due)}</td>
                  <td>
                    {row.done ? <Badge tone="ok">完了</Badge> : late ? <Badge tone="alert">超過</Badge> : <Badge tone="warn">進行中</Badge>}
                  </td>
                  <td>
                    {row.done ? null : (
                      <Btn
                        onClick={() => {
                          setRows((current) =>
                            current.map((item) => (item.id === row.id ? { ...item, done: true } : item)),
                          );
                          toast(`${row.client}の${row.matter}を完了にしました`);
                        }}
                      >
                        完了にする
                      </Btn>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          setRows((current) => [
            ...current,
            { id: nextId("m"), client: client.trim(), matter: matter.trim(), due, done: false },
          ]);
          setClient("");
          setMatter("");
          toast("案件を追加しました");
        }}
      >
        <TextField label="顧客" value={client} onChange={setClient} required placeholder="例: 青木商店" />
        <TextField label="手続" value={matter} onChange={setMatter} required placeholder="例: 給与計算" />
        <TextField label="期限" value={due} onChange={setDue} required />
        <Btn type="submit" kind="primary">案件を追加</Btn>
      </form>
    </div>
  );
}

type DocKind = "未分類" | "契約" | "本人確認" | "通帳";
type Intake = {
  id: string;
  title: string;
  channel: string;
  kind: DocKind;
  hint: string;
  owner: string;
  done: boolean;
};

export function ProfessionalIntakeBox() {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState("メール");
  const [rows, setRows] = useState<Intake[]>([
    { id: "i1", title: "丸和_契約書.pdf", channel: "メール", kind: "未分類", hint: "契約", owner: "未定", done: false },
    { id: "i2", title: "佐藤商事_通帳コピー", channel: "郵送", kind: "未分類", hint: "通帳", owner: "未定", done: false },
    { id: "i3", title: "山田氏_戸籍", channel: "持参", kind: "本人確認", hint: "本人確認", owner: "田所", done: true },
  ]);

  const pending = rows.filter((row) => !row.done);
  const done = rows.filter((row) => row.done);

  function classify(row: Intake, kind: DocKind) {
    setRows((current) =>
      current.map((item) =>
        item.id === row.id ? { ...item, kind, done: true, owner: "田所" } : item,
      ),
    );
    toast(`${kind}として処理済にしました`);
  }

  return (
    <div className="two-col">
      <section className="stack">
        <h2>未処理 {pending.length}</h2>
        {pending.map((row) => (
          <article key={row.id} className="ticket">
            <strong>{row.title}</strong>
            <span>{row.channel}</span>
            <span className="hint">当たり: {row.hint}（裏方。人が確定）</span>
            <div className="actions">
              {(["契約", "本人確認", "通帳"] as const).map((kind) => (
                <Btn key={kind} onClick={() => classify(row, kind)}>
                  {kind}
                </Btn>
              ))}
            </div>
          </article>
        ))}
        <form
          className="stack"
          onSubmit={(event) => {
            event.preventDefault();
            setRows((current) => [
              ...current,
              {
                id: nextId("i"),
                title: title.trim(),
                channel,
                kind: "未分類",
                hint: "契約",
                owner: "未定",
                done: false,
              },
            ]);
            setTitle("");
            toast("資料を受け取りました");
          }}
        >
          <TextField label="資料名" value={title} onChange={setTitle} required placeholder="例: 青木商店_請求書" />
          <SelectField
            label="受領経路"
            value={channel}
            onChange={setChannel}
            options={[
              { value: "メール", label: "メール" },
              { value: "郵送", label: "郵送" },
              { value: "持参", label: "持参" },
            ]}
          />
          <Btn type="submit" kind="primary">資料を受け取る</Btn>
        </form>
      </section>
      <section className="stack">
        <h2>処理済 {done.length}</h2>
        {done.map((row) => (
          <article key={row.id} className="ticket">
            <strong>{row.title}</strong>
            <span>{row.channel} / 担当 {row.owner}</span>
            <Badge tone="ok">{row.kind}</Badge>
          </article>
        ))}
      </section>
    </div>
  );
}
