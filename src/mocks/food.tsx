import "./people-workflows.css";
import { useState } from "react";
import { Badge, Banner, Btn, Preview, SelectField, Stepper, TextField } from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { nextId } from "../data/demo.ts";

const week = ["月", "火", "水", "木", "金", "土", "日"] as const;
const wishMarks = ["", "○", "休", "入"] as const;
type WishMark = (typeof wishMarks)[number];

type WishRow = { id: string; name: string; team: string; days: WishMark[] };

export function ShiftExcelBridge() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [team, setTeam] = useState("食堂ひかり");
  const [exported, setExported] = useState(false);
  const [rows, setRows] = useState<WishRow[]>([
    { id: "w1", name: "田中", team: "食堂ひかり", days: ["○", "○", "休", "○", "入", "入", "休"] },
    { id: "w2", name: "佐々木", team: "あおばケア", days: ["休", "○", "○", "○", "休", "○", "○"] },
  ]);

  const header = ["名前", "所属", ...week].join("\t");
  const tsv = [header, ...rows.map((row) => [row.name, row.team, ...row.days].join("\t"))].join("\n");

  return (
    <div className="stack pflow-workspace">
      <div className="pflow-context">
        <div className="pflow-context-main"><div className="pflow-monogram" aria-hidden="true">希</div><div><p className="pflow-kicker">Availability collection</p><h2>みんなの希望を、一枚に</h2><p className="hint">飲食と介護の希望を、同じ表に揃えます。自動作成はしません。</p></div></div>
        <div className="pflow-metrics"><div className="pflow-metric"><strong>{rows.length}<small>名</small></strong><small>希望の収集対象</small></div><div className="pflow-metric"><strong>{rows.reduce((total, row) => total + row.days.filter(Boolean).length, 0)}<small>枠</small></strong><small>入力済み</small></div></div>
      </div>
      <div className="pflow-heading"><div><h2>週間の希望一覧</h2><p className="hint">○ 入れる / 休 休み / 入 時間指定 / 空 未入力</p></div><Badge tone={exported ? "ok" : "muted"}>{exported ? "書き出し済み" : "編集中"}</Badge></div>
      <p className="pflow-scroll-hint">左右にスクロールして、曜日ごとの希望を選択できます</p>
      <div className="table-wrap pflow-board pflow-wish-board">
        <table className="data">
          <thead>
            <tr>
              <th>名前</th>
              <th>所属</th>
              {week.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td data-label="名前"><strong>{row.name}</strong></td>
                <td data-label="所属">{row.team}</td>
                {row.days.map((mark, index) => (
                  <td key={`${row.id}-${week[index]}`} data-label={week[index]}>
                    <select
                      className="select"
                      aria-label={`${row.name} ${week[index]}`}
                      value={wishMarks.includes(mark) ? mark : ""}
                      onChange={(event) => {
                        const value = event.target.value as WishMark;
                        setRows((current) =>
                          current.map((item) =>
                            item.id === row.id
                              ? {
                                  ...item,
                                  days: item.days.map((day, dayIndex) =>
                                    dayIndex === index ? value : day,
                                  ),
                                }
                              : item,
                          ),
                        );
                        setExported(false);
                        toast(`${row.name}の${week[index]}を${value || "空"}にしました`);
                      }}
                    >
                      <option value="">空</option>
                      <option value="○">○ 入れる</option>
                      <option value="休">休</option>
                      <option value="入">入 時間指定</option>
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="pflow-inline-form">
      <div className="pflow-heading"><div><h3>スタッフを一覧に追加</h3><p className="hint">所属を選び、一週間の希望を入力します。</p></div></div>
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          setRows((current) => [
            ...current,
            { id: nextId("w"), name: name.trim(), team, days: ["", "", "", "", "", "", ""] },
          ]);
          setName("");
          setExported(false);
          toast("希望を追加しました");
        }}
      >
        <TextField label="名前" value={name} onChange={setName} required />
        <SelectField
          label="所属"
          value={team}
          onChange={setTeam}
          options={[
            { value: "食堂ひかり", label: "食堂ひかり（飲食）" },
            { value: "あおばケア", label: "あおばケア（介護）" },
          ]}
        />
        <Btn type="submit" kind="primary">希望を追加</Btn>
      </form>
      </section>
      <div className="pflow-footer"><p className="hint">普段のExcelをそのまま使える、タブ区切りの表を生成します。</p>
      <Btn
        kind="primary"
        onClick={() => {
          setExported(true);
          toast("Excelに貼れる表を出しました");
        }}
      >
        Excel形式で書き出し
      </Btn>
      </div>
      {exported ? <Preview title="タブ区切り（Sheets / Excel）" text={tsv} /> : null}
    </div>
  );
}

type Stock = "多" | "普通" | "少";
type Loss = { id: string; item: string; qty: number; reason: string };
type OrderItem = { id: string; name: string; unit: string; qty: number; stock: Stock };

export function RestaurantOrderLoss() {
  const toast = useToast();
  const [item, setItem] = useState("鶏もも");
  const [qty, setQty] = useState("1");
  const [reason, setReason] = useState("廃棄");
  const [sent, setSent] = useState(false);
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: "o1", name: "鶏もも", unit: "kg", qty: 4, stock: "少" },
    { id: "o2", name: "キャベツ", unit: "玉", qty: 6, stock: "普通" },
    { id: "o3", name: "米", unit: "kg", qty: 10, stock: "多" },
    { id: "o4", name: "食用油", unit: "缶", qty: 1, stock: "少" },
  ]);
  const [losses, setLosses] = useState<Loss[]>([
    { id: "l1", item: "キャベツ", qty: 1, reason: "期限" },
  ]);

  return (
    <div className="stack pflow-workspace">
      <div className="pflow-context">
        <div className="pflow-context-main"><div className="pflow-monogram" aria-hidden="true">仕</div><div><p className="pflow-kicker">Daily kitchen operations</p><h2>今日の仕入れとロス</h2><p className="hint">棚を見ながら、必要な分だけ発注。</p></div></div>
        <div className="pflow-metrics"><div className="pflow-metric"><strong>{orders.filter((order) => order.stock === "少").length}<small>品</small></strong><small>在庫少なめ</small></div><div className="pflow-metric"><strong>{losses.length}<small>件</small></strong><small>ロスの記録</small></div></div>
      </div>
      <Banner tone={sent ? "ok" : "info"}>{sent ? "今日の発注は確定済です" : "発注はまだ下書きです"}</Banner>
      <div className="pflow-columns pflow-order-columns">
      <section className="pflow-column">
      <div className="pflow-heading"><div><p className="pflow-kicker">01 / Stock & order</p><h2>発注と棚の概数</h2><p className="hint">在庫は3段階。数量は仕入れ単位で調整します。</p></div><Badge tone="muted">{orders.length}品目</Badge></div>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>品目</th>
              <th>発注</th>
              <th>在庫</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td data-label="品目"><strong>{order.name}</strong></td>
                <td data-label="発注"><div className="pflow-quantity">
                  <Stepper
                    label={`${order.name}の発注数`}
                    value={order.qty}
                    onChange={(value) => {
                      setOrders((current) =>
                        current.map((row) => (row.id === order.id ? { ...row, qty: value } : row)),
                      );
                      setSent(false);
                      toast(`${order.name}の発注を${value}${order.unit}にしました`);
                    }}
                  />
                  <span className="hint">{order.unit}</span>
                </div></td>
                <td data-label="在庫">
                  <div className="actions pflow-stock-controls" role="group" aria-label={`${order.name}の在庫`}>
                    {(["多", "普通", "少"] as const).map((stock) => (
                      <button
                        key={stock}
                        type="button"
                        className="btn"
                        aria-pressed={order.stock === stock}
                        onClick={() => {
                          setOrders((current) =>
                            current.map((row) => (row.id === order.id ? { ...row, stock } : row)),
                          );
                          toast(`${order.name}の在庫を${stock}にしました`);
                        }}
                      >
                        {stock}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </section>
      <section className="pflow-panel pflow-panel-soft pflow-column">
      <div className="pflow-heading"><div><p className="pflow-kicker">02 / Loss log</p><h2>ロス</h2><p className="hint">廃棄や提供ミスも、小さな記録から。</p></div></div>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>品目</th>
              <th>数量</th>
              <th>理由</th>
            </tr>
          </thead>
          <tbody>
            {losses.map((loss) => (
              <tr key={loss.id}>
                <td data-label="品目">{loss.item}</td>
                <td data-label="数量">{loss.qty}</td>
                <td data-label="理由"><Badge tone="warn">{loss.reason}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="form-grid pflow-form"
        onSubmit={(event) => {
          event.preventDefault();
          const quantity = Number(qty);
          if (!Number.isFinite(quantity) || quantity <= 0) {
            toast("数量は0より大きい数値で入力してください");
            return;
          }
          setLosses((current) => [
            ...current,
            { id: nextId("l"), item, qty: quantity, reason },
          ]);
          toast(`${item}のロスを記録しました`);
        }}
      >
        <SelectField
          label="品目"
          value={item}
          onChange={setItem}
          options={orders.map((order) => ({ value: order.name, label: order.name }))}
        />
        <TextField label="数量" value={qty} onChange={setQty} required />
        <SelectField
          label="理由"
          value={reason}
          onChange={setReason}
          options={[
            { value: "廃棄", label: "廃棄" },
            { value: "提供ミス", label: "提供ミス" },
            { value: "期限", label: "期限" },
          ]}
        />
        <Btn type="submit">ロスを記録</Btn>
      </form>
      </section>
      </div>
      <div className="pflow-footer"><p className="hint">{orders.filter((order) => order.qty > 0).length}品目の発注内容を確認して確定します。</p>
      <Btn
        kind="primary"
        onClick={() => {
          setSent(true);
          toast("発注リストを確定しました（FAXイメージ、接続なし）");
        }}
      >
        発注を確定
      </Btn>
      </div>
    </div>
  );
}

const roles = ["ホール昼", "ホール夜", "キッチン"] as const;
type RoleName = string;

type ShiftCell = { role: RoleName; day: string; name: string };

export function RestaurantShiftExit() {
  const toast = useToast();
  const [roleName, setRoleName] = useState("");
  const [published, setPublished] = useState(false);
  const [roleList, setRoleList] = useState<RoleName[]>([...roles]);
  const [cells, setCells] = useState<ShiftCell[]>(() => {
    const initial: ShiftCell[] = [];
    for (const role of roles) {
      for (const day of week) {
        const filled = role === "キッチン" || day === "月" || day === "火";
        initial.push({ role, day, name: filled ? (role === "キッチン" ? "佐藤" : "山本") : "" });
      }
    }
    return initial;
  });

  const openCount = cells.filter((cell) => cell.name === "").length;

  return (
    <div className="stack pflow-workspace">
      <div className="pflow-context">
        <div className="pflow-context-main"><div className="pflow-monogram" aria-hidden="true">食</div><div><p className="pflow-kicker">Hikari / Main store</p><h2>食堂ひかり 本店</h2><p className="hint">役割ごとの空きを埋めて、一週間を整える。</p></div></div>
        <div className="pflow-metrics"><div className="pflow-metric"><strong>{cells.length - openCount}<small>枠</small></strong><small>配置済み</small></div><div className="pflow-metric"><strong>{openCount}<small>枠</small></strong><small>空き</small></div><div className="pflow-metric"><strong>{roleList.length}</strong><small>役割</small></div></div>
      </div>
      <Banner tone={published ? "ok" : "info"}>
        {published ? "食堂ひかり 本店のシフトは公開中です" : "下書きです。公開するとスタッフから見えます"}
      </Banner>
      <div className="pflow-heading"><div><h2>週間シフト</h2><p className="hint">セルを押すと、担当者を配置・解除できます。</p></div><Badge tone={openCount ? "warn" : "ok"}>空き {openCount}枠</Badge></div>
      <div className="pflow-coverage" aria-label="曜日ごとの配置状況">{week.map((day) => <div className="pflow-day" key={day}><strong>{day}</strong><span className={cells.some((cell) => cell.day === day && !cell.name) ? "pflow-short" : ""}>{cells.filter((cell) => cell.day === day && cell.name).length}/{roleList.length}</span></div>)}</div>
      <p className="pflow-scroll-hint">左右にスクロールして一週間を確認できます</p>
      <div className="table-wrap pflow-board">
        <table className="shift">
          <thead>
            <tr>
              <th>役割</th>
              {week.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roleList.map((role) => (
              <tr key={role}>
                <th scope="row">{role}</th>
                {week.map((day) => {
                  const cell = cells.find((item) => item.role === role && item.day === day);
                  const name = cell?.name ?? "";
                  return (
                    <td key={`${role}-${day}`}>
                      <button
                        type="button"
                        aria-label={`${day} ${role} ${name || "空き"}、クリックで変更`}
                        className={`cell-btn${name ? "" : " is-short"}`}
                        onClick={() => {
                          const next = name ? "" : "田中";
                          setCells((current) => {
                            const exists = current.some((item) => item.role === role && item.day === day);
                            if (!exists) return [...current, { role, day, name: next }];
                            return current.map((item) =>
                              item.role === role && item.day === day ? { ...item, name: next } : item,
                            );
                          });
                          setPublished(false);
                          toast(next ? `${day}${role}に田中を入れました` : `${day}${role}を空にしました`);
                        }}
                      >
                        {name || "空き"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pflow-footer"><p className="hint">公開後に配置を変更すると、再び下書きになります。</p>
      <div className="actions">
        <Btn
          kind="primary"
          onClick={() => {
            setPublished(true);
            toast("シフトを公開しました");
          }}
        >
          シフトを公開
        </Btn>
        {published ? <Badge tone="ok">公開中</Badge> : <Badge tone="muted">下書き</Badge>}
      </div>
      </div>
      <form
        className="form-grid pflow-inline-form"
        onSubmit={(event) => {
          event.preventDefault();
          const role = roleName.trim();
          if (!role) { toast("役割を入力してください"); return; }
          if (roleList.includes(role)) { toast("同じ役割は登録済みです"); return; }
          setRoleList((current) => [...current, role]);
          setCells((current) => [...current, ...week.map((day) => ({ role, day, name: "" }))]);
          setRoleName("");
          setPublished(false);
          toast(`${role}の行を追加しました`);
        }}
      >
        <TextField label="役割" value={roleName} onChange={setRoleName} required placeholder="例: まかない" />
        <Btn type="submit">役割を追加</Btn>
      </form>
    </div>
  );
}
