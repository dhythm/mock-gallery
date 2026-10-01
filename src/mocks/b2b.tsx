import { useState } from "react";
import {
  Badge,
  Banner,
  Btn,
  Segmented,
  SelectField,
  TextField,
} from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { nextId, shortDate } from "../data/demo.ts";
import "./document-workflows.css";

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
    {
      id: "x1",
      partner: "東北食品",
      item: "醤油 18L×20",
      due: "2026-10-06",
      amount: 54000,
      status: "下書き",
    },
    {
      id: "x2",
      partner: "みどり商店",
      item: "酢 1L×12",
      due: "2026-10-03",
      amount: 9800,
      status: "下書き",
    },
    {
      id: "x3",
      partner: "港町食堂",
      item: "米 30kg",
      due: "2026-10-02",
      amount: 12600,
      status: "受注確定",
    },
  ]);
  const visible = rows.filter((row) =>
    `${row.partner} ${row.item} ${row.amount}`.includes(query.trim()),
  );
  const current = visible.find((row) => row.id === selected) ?? visible[0];
  const pending = rows.filter((row) => row.status === "下書き").length;

  return (
    <div className="stack doc-workflow">
      <div className="doc-work-header">
        <div>
          <span className="eyebrow">ORDER INBOX</span>
          <h2>受信した注文を、受注へ。</h2>
          <p className="hint">原稿の内容を確認してから確定します</p>
        </div>
        <div className="doc-mini-metrics">
          <div>
            <strong>{pending}</strong>
            <span>確認待ち</span>
          </div>
          <div>
            <strong>{rows.length - pending}</strong>
            <span>受注確定</span>
          </div>
        </div>
      </div>
      <div className="doc-inbox-layout">
        <section className="doc-inbox-list" aria-label="受信一覧">
          <div className="doc-inbox-search">
            <TextField
              label="検索（得意先・品目・金額）"
              value={query}
              onChange={setQuery}
              placeholder="例: 醤油"
            />
            <span className="hint">受信一覧 · {visible.length}件</span>
          </div>
          {visible.length === 0 ? (
            <div className="doc-empty">該当する受信はありません</div>
          ) : (
            visible.map((row) => (
              <article
                key={row.id}
                className={`doc-inbox-row${current?.id === row.id ? " is-selected" : ""}`}
              >
                <div className="doc-row-top">
                  <strong>{row.partner}</strong>
                  <Badge tone={row.status === "受注確定" ? "ok" : "warn"}>
                    {row.status}
                  </Badge>
                </div>
                <p>{row.item}</p>
                <div className="doc-row-bottom">
                  <span className="hint">
                    納期 {shortDate(row.due)}
                    <br />
                    {row.amount.toLocaleString("ja-JP")}円
                  </span>
                  <Btn
                    kind={current?.id === row.id ? "primary" : "default"}
                    onClick={() => {
                      setSelected(row.id);
                      toast(`${row.partner}の下書きを開きました`);
                    }}
                  >
                    開く
                  </Btn>
                </div>
              </article>
            ))
          )}
        </section>
        <section className="doc-review" aria-label="OCR下書きの確認">
          {current ? (
            <>
              <div className="doc-row-top">
                <div>
                  <span className="eyebrow">REVIEW</span>
                  <h2>OCR下書き</h2>
                </div>
                <span className="doc-file-mark">FAX</span>
              </div>
              <div className="doc-order-sheet">
                <div className="doc-sheet-top">
                  <span>注文内容</span>
                  <span>受信番号 {current.id.toUpperCase()}</span>
                </div>
                <h3>
                  {current.partner}
                  <small>ご注文</small>
                </h3>
                <dl className="doc-details">
                  <div>
                    <dt>品目・数量</dt>
                    <dd>{current.item}</dd>
                  </div>
                  <div>
                    <dt>ご希望納期</dt>
                    <dd>{shortDate(current.due)}</dd>
                  </div>
                  <div className="doc-total">
                    <dt>受注金額</dt>
                    <dd>
                      {current.amount.toLocaleString("ja-JP")}
                      <small> 円</small>
                    </dd>
                  </div>
                </dl>
              </div>
              <Banner tone={current.status === "受注確定" ? "ok" : "info"}>
                {current.status === "受注確定"
                  ? "内容の確認が完了しました"
                  : "読取は下書きです。確定は人が行います。"}
              </Banner>
              <div className="doc-review-footer">
                <p className="hint">この読みは裏方です。送信はしません。</p>
                <Btn
                  kind="primary"
                  disabled={current.status === "受注確定"}
                  onClick={() => {
                    setRows((list) =>
                      list.map((row) =>
                        row.id === current.id
                          ? { ...row, status: "受注確定" }
                          : row,
                      ),
                    );
                    toast(`${current.partner}のFAXを受注確定しました`);
                  }}
                >
                  受注確定
                </Btn>
              </div>
            </>
          ) : (
            <div className="doc-empty">
              検索条件を変えると、受信した注文が表示されます
            </div>
          )}
        </section>
      </div>
      <section className="workspace-section doc-entry-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">NEW ARRIVAL</span>
            <h2>受信を手入力で追加</h2>
          </div>
          <span className="hint">追加した注文は下書きになります</span>
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
            setQuery("");
            setPartner("");
            setItem("");
            toast("受信を追加しました。OCR下書きは人が直します");
          }}
        >
          <TextField
            label="得意先"
            value={partner}
            onChange={setPartner}
            required
          />
          <TextField label="品目" value={item} onChange={setItem} required />
          <Btn type="submit">受信を追加</Btn>
        </form>
      </section>
    </div>
  );
}

type Channel = "電話" | "FAX" | "メール";
type Order = {
  id: string;
  channel: Channel;
  partner: string;
  item: string;
  status: "未確認" | "確認済";
};

export function WholesaleOrderHub() {
  const toast = useToast();
  const [filter, setFilter] = useState<Channel | "すべて">("すべて");
  const [channel, setChannel] = useState<Channel>("電話");
  const [partner, setPartner] = useState("");
  const [item, setItem] = useState("");
  const [rows, setRows] = useState<Order[]>([
    {
      id: "h1",
      channel: "電話",
      partner: "みどり商店",
      item: "醤油 2本",
      status: "未確認",
    },
    {
      id: "h2",
      channel: "FAX",
      partner: "東北食品",
      item: "酢 1ケース",
      status: "未確認",
    },
    {
      id: "h3",
      channel: "メール",
      partner: "港町食堂",
      item: "米 30kg",
      status: "確認済",
    },
  ]);
  const visible = rows.filter(
    (row) => filter === "すべて" || row.channel === filter,
  );
  const pending = rows.filter((row) => row.status === "未確認").length;

  return (
    <div className="stack doc-workflow">
      <div className="doc-work-header">
        <div>
          <span className="eyebrow">ORDER DESK</span>
          <h2>すべての注文を、ひとつの受注台帳に。</h2>
          <p className="hint">電話・FAX・メールの確認漏れを防ぎます</p>
        </div>
        <div className="doc-mini-metrics">
          <div>
            <strong>{pending}</strong>
            <span>未確認</span>
          </div>
          <div>
            <strong>{rows.length}</strong>
            <span>受注件数</span>
          </div>
        </div>
      </div>
      <section className="workspace-section">
        <div className="section-heading">
          <h2>受注一覧</h2>
          <span className="hint">{visible.length}件を表示</span>
        </div>
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
                <th>
                  <span className="doc-visually-hidden">操作</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  <td data-label="経路">
                    <Badge tone="info">{row.channel}</Badge>
                  </td>
                  <td data-label="得意先">
                    <strong>{row.partner}</strong>
                  </td>
                  <td data-label="内容">{row.item}</td>
                  <td data-label="状態">
                    <Badge tone={row.status === "確認済" ? "ok" : "warn"}>
                      {row.status}
                    </Badge>
                  </td>
                  <td data-label="操作">
                    {row.status === "未確認" ? (
                      <Btn
                        kind="primary"
                        onClick={() => {
                          setRows((current) =>
                            current.map((itemRow) =>
                              itemRow.id === row.id
                                ? { ...itemRow, status: "確認済" }
                                : itemRow,
                            ),
                          );
                          toast(`${row.channel}受注を確認済にしました`);
                        }}
                      >
                        確認済にする
                      </Btn>
                    ) : (
                      <span className="doc-complete-note">確認完了</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 ? (
            <div className="doc-empty">この経路の受注はまだありません</div>
          ) : null}
        </div>
      </section>
      <section className="workspace-section doc-entry-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">QUICK ENTRY</span>
            <h2>新しい受注を記録</h2>
          </div>
          <span className="hint">電話を受けながら、その場で入力</span>
        </div>
        <form
          className="form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            setRows((current) => [
              {
                id: nextId("h"),
                channel,
                partner: partner.trim(),
                item: item.trim(),
                status: "未確認",
              },
              ...current,
            ]);
            setFilter("すべて");
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
          <TextField
            label="得意先"
            value={partner}
            onChange={setPartner}
            required
          />
          <TextField label="内容" value={item} onChange={setItem} required />
          <Btn type="submit" kind="primary">
            受注を追加
          </Btn>
        </form>
      </section>
    </div>
  );
}

type Doc = {
  id: string;
  date: string;
  partner: string;
  amount: number;
  file: string;
};

export function EbookLawLite() {
  const toast = useToast();
  const [partnerQuery, setPartnerQuery] = useState("");
  const [amountQuery, setAmountQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [partner, setPartner] = useState("");
  const [amount, setAmount] = useState("");
  const [docs, setDocs] = useState<Doc[]>([
    {
      id: "d1",
      date: "2026-09-02",
      partner: "東北食品",
      amount: 54000,
      file: "order_0902_東北食品.pdf",
    },
    {
      id: "d2",
      date: "2026-09-18",
      partner: "みどり商店",
      amount: 9800,
      file: "order_0918_みどり商店.pdf",
    },
    {
      id: "d3",
      date: "2026-09-25",
      partner: "港町食堂",
      amount: 12600,
      file: "order_0925_港町食堂.pdf",
    },
  ]);
  const visible = docs.filter(
    (doc) =>
      doc.partner.includes(partnerQuery.trim()) &&
      (dateQuery.trim() === "" || doc.date === dateQuery.trim()) &&
      (amountQuery.trim() === "" ||
        String(doc.amount).includes(amountQuery.trim())),
  );

  return (
    <div className="stack doc-workflow">
      <div className="doc-work-header">
        <div>
          <span className="eyebrow">DOCUMENT ARCHIVE</span>
          <h2>必要な書類に、すぐたどり着く。</h2>
          <p className="hint">
            日付・金額・取引先で検索できる状態だけを残します。
          </p>
        </div>
        <div className="doc-mini-metrics">
          <div>
            <strong>{docs.length}</strong>
            <span>登録書類</span>
          </div>
          <div>
            <strong>{new Set(docs.map((doc) => doc.partner)).size}</strong>
            <span>取引先</span>
          </div>
        </div>
      </div>
      <section className="workspace-section">
        <div className="section-heading">
          <h2>書類を検索</h2>
          <span className="doc-file-mark">PDF</span>
        </div>
        <div className="form-grid">
          <TextField
            label="取引日"
            value={dateQuery}
            onChange={setDateQuery}
            placeholder="2026-09-18"
          />
          <TextField
            label="取引先"
            value={partnerQuery}
            onChange={setPartnerQuery}
            placeholder="みどり"
          />
          <TextField
            label="金額"
            value={amountQuery}
            onChange={setAmountQuery}
            placeholder="9800"
          />
        </div>
        <div className="doc-results-heading">
          <span>{visible.length}件ヒット</span>
          <span className="hint">受注PDFの索引</span>
        </div>
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
                  <td data-label="取引日">{doc.date}</td>
                  <td data-label="取引先">
                    <strong>{doc.partner}</strong>
                  </td>
                  <td data-label="金額" className="doc-number">
                    {doc.amount.toLocaleString("ja-JP")}円
                  </td>
                  <td data-label="ファイル">
                    <span className="doc-file-name">
                      <span className="doc-pdf-tag">PDF</span>
                      {doc.file}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 ? (
            <div className="doc-empty">検索条件に合う書類はありません</div>
          ) : null}
        </div>
      </section>
      <section className="workspace-section doc-entry-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ADD DOCUMENT</span>
            <h2>受注PDFを索引に登録</h2>
          </div>
          <span className="hint">デモ用の書類情報を追加します</span>
        </div>
        <form
          className="form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            const value = Number(amount);
            if (!Number.isFinite(value) || value < 0) {
              toast("金額は0以上の数値で入力してください");
              return;
            }
            const file = `order_0930_${partner.trim()}.pdf`;
            setDocs((current) => [
              {
                id: nextId("d"),
                date: "2026-09-30",
                partner: partner.trim(),
                amount: value,
                file,
              },
              ...current,
            ]);
            setPartner("");
            setAmount("");
            setPartnerQuery("");
            setAmountQuery("");
            setDateQuery("");
            toast("受注PDFを索引に登録しました");
          }}
        >
          <TextField
            label="取引先"
            value={partner}
            onChange={setPartner}
            required
          />
          <TextField
            label="金額（円）"
            value={amount}
            onChange={setAmount}
            required
          />
          <Btn type="submit" kind="primary">
            書類を登録
          </Btn>
        </form>
      </section>
    </div>
  );
}

type Line = {
  id: string;
  item: string;
  qty: number;
  price: number;
  status: "下書き" | "確定";
};

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
  const total = lines.reduce((sum, line) => sum + line.qty * line.price, 0);

  return (
    <div className="stack doc-workflow">
      <div className="doc-work-header">
        <div>
          <span className="eyebrow">ORDER WORKSHEET</span>
          <h2>受注表</h2>
          <p className="hint">数量を直接編集して、最新の版を確定します</p>
        </div>
        <div className="actions">
          <Badge tone="info">最新版 v{version}</Badge>
          <Badge tone={draft ? "warn" : "ok"}>
            {draft ? "下書き行あり" : "全行確定"}
          </Badge>
        </div>
      </div>
      <section className="workspace-section">
        <div className="section-heading">
          <h2>注文明細</h2>
          <span className="hint">{lines.length}品目 · 数量は編集できます</span>
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
                  <td data-label="品目">
                    <strong>{line.item}</strong>
                  </td>
                  <td data-label="数量">
                    <input
                      className="input doc-qty-input"
                      type="number"
                      min="0"
                      aria-label={`${line.item}の数量`}
                      value={line.qty}
                      onChange={(event) => {
                        const next = Math.max(
                          0,
                          Number(event.target.value) || 0,
                        );
                        setLines((current) =>
                          current.map((row) =>
                            row.id === line.id
                              ? { ...row, qty: next, status: "下書き" }
                              : row,
                          ),
                        );
                      }}
                    />
                  </td>
                  <td data-label="単価" className="doc-number">
                    {line.price.toLocaleString("ja-JP")}円
                  </td>
                  <td data-label="金額" className="doc-number">
                    <strong>
                      {(line.qty * line.price).toLocaleString("ja-JP")}円
                    </strong>
                  </td>
                  <td data-label="状態">
                    <Badge tone={line.status === "確定" ? "ok" : "warn"}>
                      {line.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="doc-order-total">
          <span>
            受注合計 <small>{lines.length}品目</small>
          </span>
          <strong>
            {total.toLocaleString("ja-JP")}
            <small> 円</small>
          </strong>
        </div>
      </section>
      <section className="workspace-section doc-entry-section">
        <div className="section-heading">
          <h2>明細を追加</h2>
          <span className="hint">追加した行は下書きになります</span>
        </div>
        <form
          className="form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            const quantity = Number(qty);
            const unitPrice = Number(price);
            if (
              !Number.isFinite(quantity) ||
              !Number.isFinite(unitPrice) ||
              quantity < 0 ||
              unitPrice < 0
            ) {
              toast("数量と単価は0以上の数値で入力してください");
              return;
            }
            setLines((current) => [
              ...current,
              {
                id: nextId("e"),
                item: item.trim(),
                qty: quantity,
                price: unitPrice,
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
      </section>
      <div className="doc-confirm-bar">
        <div>
          <strong>
            {draft
              ? "変更内容を確認してください"
              : "すべての明細が確定しています"}
          </strong>
          <p className="hint">確定すると版番号が更新されます</p>
        </div>
        <Btn
          kind="primary"
          onClick={() => {
            setLines((current) =>
              current.map((line) => ({ ...line, status: "確定" })),
            );
            setVersion((current) => current + 1);
            toast(`受注表をv${version + 1}で確定しました`);
          }}
        >
          この版を確定
        </Btn>
      </div>
    </div>
  );
}
