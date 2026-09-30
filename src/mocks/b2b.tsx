import { useState } from "react";
import { Badge, Banner, Btn, Segmented, SelectField, TextField } from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { nextId, shortDate } from "../data/demo.ts";

type FaxItem = {
  id: string;
  partner: string;
  item: string;
  due: string;
  amount: number;
  status: "下書き" | "受注確定";
};

export function FaxStructuredInbox() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [partner, setPartner] = useState("");
  const [item, setItem] = useState("");
  const [selected, setSelected] = useState("x1");
  const [rows, setRows] = useState<FaxItem[]>([
    { id: "x1", partner: "東北食品", item: "醤油 18L×20", due: "2026-10-06", amount: 54000, status: "下書き" },
    { id: "x2", partner: "みどり商店", item: "酢 1L×12", due: "2026-10-03", amount: 9800, status: "下書き" },
    { id: "x3", partner: "港町食堂", item: "米 30kg", due: "2026-10-02", amount: 12600, status: "受注確定" },
  ]);

  const visible = rows.filter((row) => {
    const haystack = `${row.partner} ${row.item} ${row.amount}`;
    return haystack.includes(query.trim());
  });
  const current = rows.find((row) => row.id === selected) ?? visible[0];

  return (
    <div className="stack">
      <Banner tone="info">読取は下書きです。確定は人が行います。</Banner>
      <TextField label="検索（得意先・品目・金額）" value={query} onChange={setQuery} placeholder="例: 醤油" />
      <div className="split">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>得意先</th>
                <th>品目</th>
                <th>納期</th>
                <th>金額</th>
                <th>状態</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  <td>{row.partner}</td>
                  <td>{row.item}</td>
                  <td>{shortDate(row.due)}</td>
                  <td>{row.amount.toLocaleString("ja-JP")}</td>
                  <td>
                    <Badge tone={row.status === "受注確定" ? "ok" : "muted"}>{row.status}</Badge>
                  </td>
                  <td>
                    <Btn
                      kind={current?.id === row.id ? "primary" : "default"}
                      onClick={() => {
                        setSelected(row.id);
                        toast(`${row.partner}の下書きを開きました`);
                      }}
                    >
                      開く
                    </Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {current ? (
          <div className="ticket">
            <h2>OCR下書き</h2>
            <p>{current.partner}</p>
            <p>{current.item}</p>
            <p>納期 {shortDate(current.due)} / {current.amount.toLocaleString("ja-JP")}円</p>
            <p className="hint">この読みは裏方です。送信はしません。</p>
            <Btn
              kind="primary"
              disabled={current.status === "受注確定"}
              onClick={() => {
                setRows((list) =>
                  list.map((row) => (row.id === current.id ? { ...row, status: "受注確定" } : row)),
                );
                toast(`${current.partner}のFAXを受注確定しました`);
              }}
            >
              受注確定
            </Btn>
          </div>
        ) : (
          <p className="hint">該当する受信はありません</p>
        )}
      </div>
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          const id = nextId("x");
          setRows((list) => [
            {
              id,
              partner: partner.trim(),
              item: item.trim(),
              due: "2026-10-08",
              amount: 10000,
              status: "下書き",
            },
            ...list,
          ]);
          setSelected(id);
          setPartner("");
          setItem("");
          toast("受信を追加しました。OCR下書きは人が直します");
        }}
      >
        <TextField label="得意先" value={partner} onChange={setPartner} required />
        <TextField label="品目" value={item} onChange={setItem} required />
        <Btn type="submit">受信を追加</Btn>
      </form>
    </div>
  );
}

type Channel = "電話" | "FAX" | "メール";
type Order = { id: string; channel: Channel; partner: string; item: string; status: "未確認" | "確認済" };

export function WholesaleOrderHub() {
  const toast = useToast();
  const [filter, setFilter] = useState<Channel | "すべて">("すべて");
  const [channel, setChannel] = useState<Channel>("電話");
  const [partner, setPartner] = useState("");
  const [item, setItem] = useState("");
  const [rows, setRows] = useState<Order[]>([
    { id: "h1", channel: "電話", partner: "みどり商店", item: "醤油 2本", status: "未確認" },
    { id: "h2", channel: "FAX", partner: "東北食品", item: "酢 1ケース", status: "未確認" },
    { id: "h3", channel: "メール", partner: "港町食堂", item: "米 30kg", status: "確認済" },
  ]);

  const visible = rows.filter((row) => filter === "すべて" || row.channel === filter);

  return (
    <div className="stack">
      <Segmented
        label="受信経路"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "すべて", label: "すべて" },
          { value: "電話", label: "電話" },
          { value: "FAX", label: "FAX" },
          { value: "メール", label: "メール" },
        ]}
      />
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>経路</th>
              <th>得意先</th>
              <th>内容</th>
              <th>状態</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id}>
                <td><Badge tone="info">{row.channel}</Badge></td>
                <td>{row.partner}</td>
                <td>{row.item}</td>
                <td><Badge tone={row.status === "確認済" ? "ok" : "warn"}>{row.status}</Badge></td>
                <td>
                  {row.status === "未確認" ? (
                    <Btn
                      kind="primary"
                      onClick={() => {
                        setRows((current) =>
                          current.map((itemRow) =>
                            itemRow.id === row.id ? { ...itemRow, status: "確認済" } : itemRow,
                          ),
                        );
                        toast(`${row.channel}受注を確認済にしました`);
                      }}
                    >
                      確認済にする
                    </Btn>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          setRows((current) => [
            { id: nextId("h"), channel, partner: partner.trim(), item: item.trim(), status: "未確認" },
            ...current,
          ]);
          setPartner("");
          setItem("");
          toast(`${channel}の受注を追加しました`);
        }}
      >
        <SelectField
          label="経路"
          value={channel}
          onChange={setChannel}
          options={[
            { value: "電話", label: "電話" },
            { value: "FAX", label: "FAX" },
            { value: "メール", label: "メール" },
          ]}
        />
        <TextField label="得意先" value={partner} onChange={setPartner} required />
        <TextField label="内容" value={item} onChange={setItem} required />
        <Btn type="submit" kind="primary">受注を追加</Btn>
      </form>
    </div>
  );
}

type Doc = { id: string; date: string; partner: string; amount: number; file: string };

export function EbookLawLite() {
  const toast = useToast();
  const [partnerQuery, setPartnerQuery] = useState("");
  const [amountQuery, setAmountQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [partner, setPartner] = useState("");
  const [amount, setAmount] = useState("");
  const [docs, setDocs] = useState<Doc[]>([
    { id: "d1", date: "2026-09-02", partner: "東北食品", amount: 54000, file: "order_0902_東北食品.pdf" },
    { id: "d2", date: "2026-09-18", partner: "みどり商店", amount: 9800, file: "order_0918_みどり商店.pdf" },
    { id: "d3", date: "2026-09-25", partner: "港町食堂", amount: 12600, file: "order_0925_港町食堂.pdf" },
  ]);

  const visible = docs.filter((doc) => {
    const partnerOk = doc.partner.includes(partnerQuery.trim());
    const dateOk = dateQuery.trim() === "" || doc.date === dateQuery.trim();
    const amountOk = amountQuery.trim() === "" || String(doc.amount).includes(amountQuery.trim());
    return partnerOk && dateOk && amountOk;
  });

  return (
    <div className="stack">
      <p className="hint">日付・金額・取引先で検索できる状態だけを残します。</p>
      <div className="form-grid">
        <TextField label="取引日" value={dateQuery} onChange={setDateQuery} placeholder="2026-09-18" />
        <TextField label="取引先" value={partnerQuery} onChange={setPartnerQuery} placeholder="みどり" />
        <TextField label="金額" value={amountQuery} onChange={setAmountQuery} placeholder="9800" />
      </div>
      <p className="count">{visible.length}件ヒット</p>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>取引日</th>
              <th>取引先</th>
              <th>金額</th>
              <th>ファイル</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.date}</td>
                <td>{doc.partner}</td>
                <td>{doc.amount.toLocaleString("ja-JP")}</td>
                <td>{doc.file}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          const value = Number(amount);
          const file = `order_0930_${partner.trim()}.pdf`;
          setDocs((current) => [
            { id: nextId("d"), date: "2026-09-30", partner: partner.trim(), amount: value, file },
            ...current,
          ]);
          setPartner("");
          setAmount("");
          toast("受注PDFを索引に登録しました");
        }}
      >
        <TextField label="取引先" value={partner} onChange={setPartner} required />
        <TextField label="金額（円）" value={amount} onChange={setAmount} required />
        <Btn type="submit" kind="primary">書類を登録</Btn>
      </form>
    </div>
  );
}

type Line = { id: string; item: string; qty: number; price: number; status: "下書き" | "確定" };

export function SmeOrderWeb() {
  const toast = useToast();
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("1000");
  const [version, setVersion] = useState(3);
  const [lines, setLines] = useState<Line[]>([
    { id: "e1", item: "醤油 18L", qty: 20, price: 2700, status: "確定" },
    { id: "e2", item: "酢 1L", qty: 12, price: 320, status: "下書き" },
  ]);

  const draft = lines.some((line) => line.status === "下書き");

  return (
    <div className="stack">
      <div className="actions">
        <Badge tone="info">最新版 v{version}</Badge>
        <Badge tone={draft ? "warn" : "ok"}>{draft ? "下書き行あり" : "全行確定"}</Badge>
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>品目</th>
              <th>数量</th>
              <th>単価</th>
              <th>金額</th>
              <th>状態</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.id}>
                <td>{line.item}</td>
                <td>
                  <input
                    className="input"
                    aria-label={`${line.item}の数量`}
                    value={line.qty}
                    onChange={(event) => {
                      const next = Number(event.target.value) || 0;
                      setLines((current) =>
                        current.map((row) =>
                          row.id === line.id ? { ...row, qty: next, status: "下書き" } : row,
                        ),
                      );
                    }}
                  />
                </td>
                <td>{line.price.toLocaleString("ja-JP")}</td>
                <td>{(line.qty * line.price).toLocaleString("ja-JP")}</td>
                <td><Badge tone={line.status === "確定" ? "ok" : "muted"}>{line.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          setLines((current) => [
            ...current,
            {
              id: nextId("e"),
              item: item.trim(),
              qty: Number(qty) || 0,
              price: Number(price) || 0,
              status: "下書き",
            },
          ]);
          setItem("");
          toast("行を追加しました。版はまだ確定前です");
        }}
      >
        <TextField label="品目" value={item} onChange={setItem} required />
        <TextField label="数量" value={qty} onChange={setQty} required />
        <TextField label="単価" value={price} onChange={setPrice} required />
        <Btn type="submit">行を追加</Btn>
      </form>
      <Btn
        kind="primary"
        onClick={() => {
          setLines((current) => current.map((line) => ({ ...line, status: "確定" })));
          setVersion((current) => current + 1);
          toast(`受注表をv${version + 1}で確定しました`);
        }}
      >
        この版を確定
      </Btn>
    </div>
  );
}
