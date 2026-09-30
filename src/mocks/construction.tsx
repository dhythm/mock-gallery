import { useState } from "react";
import {
  AreaField,
  Badge,
  Banner,
  Btn,
  CheckField,
  PhotoSlot,
  Preview,
  Segmented,
  SelectField,
  TextField,
} from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { DEMO_TODAY, isPast, nextId, shortDate } from "../data/demo.ts";

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
    "現場日報（PDFイメージ）",
    `工事名: ${site}`,
    `日付: ${DEMO_TODAY}`,
    `天候: ${weather}  人員: ${crew}名`,
    `KY: ${kyDone}/${checks.length}`,
    `作業: ${work}`,
    `写真: ${photos.join(" / ")}`,
    `状態: ${saved ? "確定" : "下書き"}`,
  ].join("\n");

  return (
    <div className="split">
      <div className="stack">
        <TextField label="工事名" value={site} onChange={setSite} />
        <div className="form-grid">
          <SelectField
            label="天候"
            value={weather}
            onChange={setWeather}
            options={[
              { value: "晴", label: "晴" },
              { value: "曇", label: "曇" },
              { value: "雨", label: "雨" },
            ]}
          />
          <TextField label="作業員数" value={crew} onChange={setCrew} />
        </div>
        <AreaField label="作業内容" value={work} onChange={setWork} />
        <div className="stack tight">
          {checks.map((item) => (
            <CheckField
              key={item.id}
              label={item.label}
              checked={item.done}
              onChange={(done) => {
                setChecks((current) =>
                  current.map((row) => (row.id === item.id ? { ...row, done } : row)),
                );
                setSaved(false);
                toast(done ? `${item.label}を確認済にしました` : `${item.label}を未確認に戻しました`);
              }}
            />
          ))}
        </div>
        <div className="actions">
          <Btn
            kind="primary"
            onClick={() => {
              setSaved(true);
              toast("日報を保存しました。PDFイメージを更新しました");
            }}
          >
            日報を確定
          </Btn>
          <Badge tone={saved ? "ok" : "muted"}>{saved ? "確定" : "下書き"}</Badge>
        </div>
      </div>
      <div className="stack">
        <div className="stack tight">
          <h2>安全点検 KY {kyDone}/{checks.length}</h2>
          <Banner tone={kyDone === checks.length ? "ok" : "warn"}>
            {kyDone === checks.length ? "KYはすべて確認済です" : "未確認のKYがあります"}
          </Banner>
        </div>
        <div className="stack tight">
          <h2>写真</h2>
          <div className="photos">
            {photos.map((name) => (
              <PhotoSlot key={name} name={name} />
            ))}
          </div>
          <Btn
            onClick={() => {
              const name = photoNames[photos.length % photoNames.length] ?? "現場写真.jpg";
              const unique = name.replace(".jpg", `_${photos.length + 1}.jpg`);
              setPhotos((current) => [...current, unique]);
              setSaved(false);
              toast(`写真を追加しました: ${unique}`);
            }}
          >
            写真を追加
          </Btn>
        </div>
        <Preview title="PDFイメージ" text={pdf} />
      </div>
    </div>
  );
}

type Finding = {
  id: string;
  place: string;
  detail: string;
  due: string;
  fixed: boolean;
  photo: string;
};

export function ConstructionCorrectivePhotos() {
  const toast = useToast();
  const [filter, setFilter] = useState<"すべて" | "未是正" | "是正済">("すべて");
  const [place, setPlace] = useState("");
  const [detail, setDetail] = useState("");
  const [due, setDue] = useState("2026-10-03");
  const [rows, setRows] = useState<Finding[]>([
    {
      id: "f1",
      place: "3Fバルコニー",
      detail: "手すりがぐらつく",
      due: "2026-10-02",
      fixed: false,
      photo: "指摘_3F手すり.jpg",
    },
    {
      id: "f2",
      place: "1F仮囲い",
      detail: "養生シートのめくれ",
      due: "2026-10-01",
      fixed: true,
      photo: "是正後_仮囲い.jpg",
    },
    {
      id: "f3",
      place: "外部足場",
      detail: "巾木不足",
      due: "2026-09-28",
      fixed: false,
      photo: "指摘_巾木.jpg",
    },
  ]);

  const visible = rows
    .filter((row) => (filter === "すべて" ? true : filter === "是正済" ? row.fixed : !row.fixed))
    .slice()
    .sort((a, b) => Number(isPast(a.due) && !a.fixed) - Number(isPast(b.due) && !b.fixed))
    .reverse();

  return (
    <div className="stack">
      <Segmented
        label="是正状態"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "すべて", label: "すべて" },
          { value: "未是正", label: "未是正" },
          { value: "是正済", label: "是正済" },
        ]}
      />
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>場所</th>
              <th>内容</th>
              <th>期限</th>
              <th>状態</th>
              <th>写真</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => {
              const overdue = !row.fixed && isPast(row.due);
              return (
                <tr key={row.id} className={overdue ? "overdue" : undefined}>
                  <td>{row.place}</td>
                  <td>{row.detail}</td>
                  <td>{shortDate(row.due)}</td>
                  <td>
                    {row.fixed ? (
                      <Badge tone="ok">是正済</Badge>
                    ) : overdue ? (
                      <Badge tone="alert">期限超過</Badge>
                    ) : (
                      <Badge tone="warn">未是正</Badge>
                    )}
                  </td>
                  <td>
                    <PhotoSlot name={row.photo} />
                  </td>
                  <td>
                    {row.fixed ? null : (
                      <Btn
                        kind="primary"
                        onClick={() => {
                          setRows((current) =>
                            current.map((item) =>
                              item.id === row.id
                                ? { ...item, fixed: true, photo: `是正後_${item.place}.jpg` }
                                : item,
                            ),
                          );
                          toast(`是正済にしました: ${row.place}`);
                        }}
                      >
                        是正完了
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
          const next: Finding = {
            id: nextId("f"),
            place: place.trim(),
            detail: detail.trim(),
            due,
            fixed: false,
            photo: `指摘_${place.trim()}.jpg`,
          };
          setRows((current) => [next, ...current]);
          setPlace("");
          setDetail("");
          toast("指摘を追加しました");
        }}
      >
        <TextField label="場所" value={place} onChange={setPlace} required placeholder="例: 2F階段" />
        <TextField label="内容" value={detail} onChange={setDetail} required placeholder="例: 段鼻の養生なし" />
        <TextField label="期限" value={due} onChange={setDue} required />
        <Btn type="submit" kind="primary">
          指摘を追加
        </Btn>
      </form>
    </div>
  );
}

type Ticket = {
  id: string;
  company: string;
  task: string;
  column: "手配" | "作業中" | "完了";
  photo?: string;
};

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
    setTickets((current) =>
      current.map((item) => (item.id === ticket.id ? { ...item, column } : item)),
    );
    toast(`${ticket.company}を${column}に移しました`);
  }

  return (
    <div className="stack">
      <div className="board">
        {columns.map((column) => (
          <section key={column} className="board-col">
            <h2>
              {column} {tickets.filter((item) => item.column === column).length}
            </h2>
            {tickets
              .filter((item) => item.column === column)
              .map((item) => (
                <article key={item.id} className="ticket">
                  <strong>{item.company}</strong>
                  <span>{item.task}</span>
                  {item.photo ? <PhotoSlot name={item.photo} /> : null}
                  <div className="actions">
                    {column === "手配" ? (
                      <Btn onClick={() => move(item, "作業中")}>作業開始</Btn>
                    ) : null}
                    {column === "作業中" ? (
                      <Btn kind="primary" onClick={() => move(item, "完了")}>
                        完了にする
                      </Btn>
                    ) : null}
                    {column !== "完了" ? (
                      <Btn
                        onClick={() => {
                          const photo = `${item.company}_現場.jpg`;
                          setTickets((current) =>
                            current.map((row) => (row.id === item.id ? { ...row, photo } : row)),
                          );
                          toast(`写真を付けました: ${item.company}`);
                        }}
                      >
                        写真を追加
                      </Btn>
                    ) : (
                      <Badge tone="ok">完了</Badge>
                    )}
                  </div>
                </article>
              ))}
          </section>
        ))}
      </div>
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          setTickets((current) => [
            ...current,
            { id: nextId("t"), company: company.trim(), task: task.trim(), column: "手配" },
          ]);
          setCompany("");
          setTask("");
          toast("手配を追加しました");
        }}
      >
        <TextField label="協力会社" value={company} onChange={setCompany} required placeholder="例: 東邦電気" />
        <TextField label="作業" value={task} onChange={setTask} required placeholder="例: 配線立会" />
        <Btn type="submit" kind="primary">
          手配を追加
        </Btn>
      </form>
    </div>
  );
}
