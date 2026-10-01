import { useState } from "react";
import {
  Badge,
  Banner,
  Btn,
  SelectField,
  TextField,
} from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { DEMO_TODAY, isPast, nextId, shortDate } from "../data/demo.ts";
import "./document-workflows.css";

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
    {
      id: "m1",
      client: "株式会社丸和製作所",
      matter: "決算申告",
      due: "2026-10-31",
      done: false,
    },
    {
      id: "m2",
      client: "佐藤商事",
      matter: "源泉所得税",
      due: "2026-10-10",
      done: false,
    },
    {
      id: "m3",
      client: "山田氏",
      matter: "相続登記",
      due: "2026-09-20",
      done: false,
    },
  ]);
  const sorted = rows.slice().sort((a, b) => {
    const rank = (row: CaseRow) => (row.done ? 2 : isPast(row.due) ? 0 : 1);
    return rank(a) - rank(b) || a.due.localeCompare(b.due);
  });
  const overdue = rows.filter((row) => !row.done && isPast(row.due)).length;
  const completed = rows.filter((row) => row.done).length;

  return (
    <div className="stack doc-workflow">
      <div className="doc-work-header">
        <div>
          <span className="eyebrow">CASE MANAGEMENT</span>
          <h2>今日の優先順位を、ひと目で。</h2>
          <p className="hint">
            基準日 {DEMO_TODAY} · 顧客と手続の期限をまとめて管理
          </p>
        </div>
      </div>
      <div className="doc-case-metrics">
        <div>
          <span>対応中の案件</span>
          <strong>
            {rows.length - completed}
            <small> 件</small>
          </strong>
          <p>完了まで、ここで追いかける</p>
        </div>
        <div className={overdue > 0 ? "needs-attention" : ""}>
          <span>期限超過</span>
          <strong>
            {overdue}
            <small> 件</small>
          </strong>
          <p>
            {overdue > 0
              ? "優先して確認してください"
              : "超過している案件はありません"}
          </p>
        </div>
        <div>
          <span>完了した案件</span>
          <strong>
            {completed}
            <small> 件</small>
          </strong>
          <p>手続の完了を記録済み</p>
        </div>
      </div>
      <Banner tone={overdue > 0 ? "alert" : "ok"}>
        {overdue > 0
          ? `期限超過 ${overdue}件を先頭に出しています（基準日 ${shortDate(DEMO_TODAY)}）`
          : "期限超過はありません"}
      </Banner>
      <section className="workspace-section">
        <div className="section-heading">
          <h2>案件台帳</h2>
          <span className="hint">期限の近い順 · {rows.length}件</span>
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>顧客</th>
                <th>手続</th>
                <th>期限</th>
                <th>状態</th>
                <th>
                  <span className="doc-visually-hidden">操作</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const late = !row.done && isPast(row.due);
                return (
                  <tr key={row.id} className={late ? "overdue" : undefined}>
                    <td data-label="顧客">
                      <strong>{row.client}</strong>
                    </td>
                    <td data-label="手続">{row.matter}</td>
                    <td data-label="期限">
                      <span className={late ? "doc-late-date" : "doc-date"}>
                        {shortDate(row.due)}
                      </span>
                    </td>
                    <td data-label="状態">
                      {row.done ? (
                        <Badge tone="ok">完了</Badge>
                      ) : late ? (
                        <Badge tone="alert">超過</Badge>
                      ) : (
                        <Badge tone="warn">進行中</Badge>
                      )}
                    </td>
                    <td data-label="操作">
                      {row.done ? (
                        <span className="doc-complete-note">手続完了</span>
                      ) : (
                        <Btn
                          onClick={() => {
                            setRows((current) =>
                              current.map((item) =>
                                item.id === row.id
                                  ? { ...item, done: true }
                                  : item,
                              ),
                            );
                            toast(
                              `${row.client}の${row.matter}を完了にしました`,
                            );
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
      </section>
      <section className="workspace-section doc-entry-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">NEW CASE</span>
            <h2>新しい案件を登録</h2>
          </div>
          <span className="hint">顧客・手続・期限の3項目から</span>
        </div>
        <form
          className="form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            if (
              !/^\d{4}-\d{2}-\d{2}$/.test(due) ||
              Number.isNaN(Date.parse(due))
            ) {
              toast("期限はYYYY-MM-DD形式で入力してください");
              return;
            }
            setRows((current) => [
              ...current,
              {
                id: nextId("m"),
                client: client.trim(),
                matter: matter.trim(),
                due,
                done: false,
              },
            ]);
            setClient("");
            setMatter("");
            toast("案件を追加しました");
          }}
        >
          <TextField
            label="顧客"
            value={client}
            onChange={setClient}
            required
            placeholder="例: 青木商店"
          />
          <TextField
            label="手続"
            value={matter}
            onChange={setMatter}
            required
            placeholder="例: 給与計算"
          />
          <TextField label="期限" value={due} onChange={setDue} required />
          <Btn type="submit" kind="primary">
            案件を追加
          </Btn>
        </form>
      </section>
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
    {
      id: "i1",
      title: "丸和_契約書.pdf",
      channel: "メール",
      kind: "未分類",
      hint: "契約",
      owner: "未定",
      done: false,
    },
    {
      id: "i2",
      title: "佐藤商事_通帳コピー",
      channel: "郵送",
      kind: "未分類",
      hint: "通帳",
      owner: "未定",
      done: false,
    },
    {
      id: "i3",
      title: "山田氏_戸籍",
      channel: "持参",
      kind: "本人確認",
      hint: "本人確認",
      owner: "田所",
      done: true,
    },
  ]);
  const pending = rows.filter((row) => !row.done);
  const done = rows.filter((row) => row.done);
  function classify(row: Intake, kind: DocKind) {
    setRows((current) =>
      current.map((item) =>
        item.id === row.id
          ? { ...item, kind, done: true, owner: "田所" }
          : item,
      ),
    );
    toast(`${kind}として処理済にしました`);
  }

  return (
    <div className="stack doc-workflow">
      <div className="doc-work-header">
        <div>
          <span className="eyebrow">DOCUMENT INTAKE</span>
          <h2>届いた資料に、次の行き先を。</h2>
          <p className="hint">分類候補を確認して、担当者の処理済みへ</p>
        </div>
        <div className="doc-mini-metrics">
          <div>
            <strong>{pending.length}</strong>
            <span>未処理</span>
          </div>
          <div>
            <strong>{done.length}</strong>
            <span>処理済</span>
          </div>
        </div>
      </div>
      <div className="doc-intake-board">
        <section className="doc-intake-column">
          <div className="doc-column-heading">
            <h2>
              <span className="doc-status-dot" />
              未処理
            </h2>
            <span>{pending.length}</span>
          </div>
          {pending.length === 0 ? (
            <div className="doc-empty">
              <strong>未処理の資料はありません</strong>
              <p>届いた資料の分類が完了しました</p>
            </div>
          ) : (
            pending.map((row) => (
              <article key={row.id} className="ticket doc-intake-card">
                <div className="doc-row-top">
                  <span className="doc-file-mark">資料</span>
                  <Badge tone="muted">{row.channel}</Badge>
                </div>
                <strong className="doc-intake-title">{row.title}</strong>
                <div className="doc-suggestion">
                  <span>分類候補</span>
                  <strong>{row.hint}</strong>
                  <small>裏方の当たり。人が確定します</small>
                </div>
                <div className="doc-classification">
                  <span className="hint">分類して処理済みにする</span>
                  <div className="actions">
                    {(["契約", "本人確認", "通帳"] as const).map((kind) => (
                      <Btn key={kind} onClick={() => classify(row, kind)}>
                        {kind}
                      </Btn>
                    ))}
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
        <section className="doc-intake-column is-complete">
          <div className="doc-column-heading">
            <h2>
              <span className="doc-status-dot" />
              処理済
            </h2>
            <span>{done.length}</span>
          </div>
          {done.map((row) => (
            <article key={row.id} className="ticket doc-intake-card">
              <div className="doc-row-top">
                <Badge tone="ok">{row.kind}</Badge>
                <span className="doc-complete-note">分類完了</span>
              </div>
              <strong className="doc-intake-title">{row.title}</strong>
              <div className="doc-assignment">
                <span>{row.channel}から受領</span>
                <span>
                  <span className="doc-avatar">田</span>担当 {row.owner}
                </span>
              </div>
            </article>
          ))}
        </section>
      </div>
      <section className="workspace-section doc-entry-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">NEW DOCUMENT</span>
            <h2>資料を受け取る</h2>
          </div>
          <span className="hint">受領経路を問わず、まずここへ</span>
        </div>
        <form
          className="form-grid"
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
          <TextField
            label="資料名"
            value={title}
            onChange={setTitle}
            required
            placeholder="例: 青木商店_請求書"
          />
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
          <Btn type="submit" kind="primary">
            資料を受け取る
          </Btn>
        </form>
      </section>
    </div>
  );
}
