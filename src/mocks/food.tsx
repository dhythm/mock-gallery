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
    <div className="stack">
      <p className="hint">飲食と介護の希望を、同じ表に揃えます。自動作成はしません。</p>
      <div className="table-wrap">
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
                <td>{row.name}</td>
                <td>{row.team}</td>
                {row.days.map((mark, index) => (
                  <td key={`${row.id}-${week[index]}`}>
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
      <Btn
        kind="primary"
        onClick={() => {
          setExported(true);
          toast("Excelに貼れる表を出しました");
        }}
      >
        Excel形式で書き出し
      </Btn>
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
    <div className="stack">
      <Banner tone={sent ? "ok" : "info"}>{sent ? "今日の発注は確定済です" : "発注はまだ下書きです"}</Banner>
      <h2>発注と棚の概数</h2>
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
                <td>{order.name}</td>
                <td>
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
                  <span className="hint"> {order.unit}</span>
                </td>
                <td>
                  <div className="actions">
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
      <h2>ロス</h2>
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
                <td>{loss.item}</td>
                <td>{loss.qty}</td>
                <td><Badge tone="warn">{loss.reason}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          setLosses((current) => [
            ...current,
            { id: nextId("l"), item, qty: Number(qty) || 0, reason },
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
    <div className="stack">
      <Banner tone={published ? "ok" : "info"}>
        {published ? "食堂ひかり 本店のシフトは公開中です" : "下書きです。公開するとスタッフから見えます"}
      </Banner>
      <p className="hint">空き {openCount}枠</p>
      <div className="table-wrap">
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
                <th>{role}</th>
                {week.map((day) => {
                  const cell = cells.find((item) => item.role === role && item.day === day);
                  const name = cell?.name ?? "";
                  return (
                    <td key={`${role}-${day}`}>
                      <button
                        type="button"
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
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          const role = roleName.trim();
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
