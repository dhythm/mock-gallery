import { useState } from "react";
import { Badge, Banner, Btn, PhotoSlot, Segmented, TextField } from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { nextId } from "../data/demo.ts";

type AssetStatus = "未実施" | "異常なし" | "異常";

type Asset = {
  id: string;
  name: string;
  area: string;
  status: AssetStatus;
  photo?: string;
};

export function ManufacturingInspection() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [activeId, setActiveId] = useState("a1");
  const [noise, setNoise] = useState<"未" | "良" | "否">("未");
  const [leak, setLeak] = useState<"未" | "良" | "否">("未");
  const [assets, setAssets] = useState<Asset[]>([
    { id: "a1", name: "コンプレッサー#2", area: "第1工場", status: "未実施" },
    { id: "a2", name: "ボイラー#1", area: "動力室", status: "異常なし" },
    { id: "a3", name: "クレーン南", area: "屋外", status: "未実施" },
  ]);

  const pending = assets.filter((item) => item.status === "未実施").length;
  const active = assets.find((item) => item.id === activeId) ?? assets[0];

  return (
    <div className="stack">
      <Banner tone={pending > 0 ? "alert" : "ok"}>
        {pending > 0 ? `未実施 ${pending}件。次のシフトの前に閉じてください` : "未実施はありません"}
      </Banner>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>設備</th>
              <th>場所</th>
              <th>状態</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.name}</td>
                <td>{asset.area}</td>
                <td>
                  <Badge
                    tone={asset.status === "未実施" ? "alert" : asset.status === "異常" ? "warn" : "ok"}
                  >
                    {asset.status}
                  </Badge>
                </td>
                <td>
                  <Btn
                    kind={asset.id === active?.id ? "primary" : "default"}
                    onClick={() => {
                      setActiveId(asset.id);
                      setNoise("未");
                      setLeak("未");
                      toast(`${asset.name}の点検を開きました`);
                    }}
                  >
                    点検する
                  </Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {active ? (
        <div className="stack">
          <h2>{active.name}</h2>
          <Segmented
            label="異音"
            value={noise}
            onChange={setNoise}
            options={[
              { value: "未", label: "異音: 未" },
              { value: "良", label: "異音: 良" },
              { value: "否", label: "異音: 否" },
            ]}
          />
          <Segmented
            label="漏れ"
            value={leak}
            onChange={setLeak}
            options={[
              { value: "未", label: "漏れ: 未" },
              { value: "良", label: "漏れ: 良" },
              { value: "否", label: "漏れ: 否" },
            ]}
          />
          {active.photo ? <PhotoSlot name={active.photo} /> : null}
          <div className="actions">
            <Btn
              kind="primary"
              disabled={noise === "未" || leak === "未"}
              onClick={() => {
                const abnormal = noise === "否" || leak === "否";
                const photo = abnormal ? `${active.name}_異常.jpg` : undefined;
                setAssets((current) =>
                  current.map((item) =>
                    item.id === active.id
                      ? { ...item, status: abnormal ? "異常" : "異常なし", photo }
                      : item,
                  ),
                );
                toast(
                  abnormal
                    ? `${active.name}を異常で記録し、写真を付けました`
                    : `${active.name}を異常なしで記録しました`,
                );
              }}
            >
              点検を記録
            </Btn>
            {active.status === "異常" ? (
              <Btn
                onClick={() => {
                  setAssets((current) =>
                    current.map((item) =>
                      item.id === active.id ? { ...item, status: "異常なし", photo: undefined } : item,
                    ),
                  );
                  toast(`${active.name}の異常を閉じました`);
                }}
              >
                異常を閉じる
              </Btn>
            ) : null}
          </div>
        </div>
      ) : null}
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          const id = nextId("a");
          setAssets((current) => [
            ...current,
            { id, name: name.trim(), area: "追加設備", status: "未実施" },
          ]);
          setName("");
          toast("設備を追加しました。状態は未実施です");
        }}
      >
        <TextField label="設備名" value={name} onChange={setName} required placeholder="例: プレス2号" />
        <Btn type="submit">設備を追加</Btn>
      </form>
    </div>
  );
}

type CheckResult = "未" | "良" | "否";

type CheckItem = { id: string; label: string; result: CheckResult; note: string };

export function ManufacturingChecklistDigital() {
  const toast = useToast();
  const [label, setLabel] = useState("");
  const [stamped, setStamped] = useState(false);
  const [items, setItems] = useState<CheckItem[]>([
    { id: "c1", label: "非常停止の動作", result: "良", note: "" },
    { id: "c2", label: "安全カバーの固定", result: "未", note: "" },
    { id: "c3", label: "油圧の漏れ", result: "未", note: "" },
    { id: "c4", label: "周辺の油拭き", result: "良", note: "" },
  ]);

  function setResult(id: string, result: CheckResult) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, result } : item)));
    setStamped(false);
    toast(`良否を${result}にしました`);
  }

  return (
    <div className="paper">
      <h2 className="paper-head">日常点検表（プレス1号）</h2>
      <p className="hint">日付 2026-09-30 / 担当 中村 / 紙の並びのまま</p>
      <div className="table-wrap">
        <table className="paper-table">
          <thead>
            <tr>
              <th>項目</th>
              <th>良否</th>
              <th>メモ</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.label}</td>
                <td>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn"
                      aria-pressed={item.result === "良"}
                      onClick={() => setResult(item.id, "良")}
                    >
                      良
                    </button>
                    <button
                      type="button"
                      className="btn"
                      aria-pressed={item.result === "否"}
                      onClick={() => setResult(item.id, "否")}
                    >
                      否
                    </button>
                  </div>
                </td>
                <td>
                  <input
                    className="input"
                    aria-label={`${item.label}のメモ`}
                    value={item.note}
                    onChange={(event) => {
                      const note = event.target.value;
                      setItems((current) =>
                        current.map((row) => (row.id === item.id ? { ...row, note } : row)),
                      );
                      setStamped(false);
                    }}
                  />
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
          setItems((current) => [
            ...current,
            { id: nextId("c"), label: label.trim(), result: "未", note: "" },
          ]);
          setLabel("");
          setStamped(false);
          toast("点検項目を追加しました");
        }}
      >
        <TextField label="項目を追加" value={label} onChange={setLabel} required placeholder="例: 照明" />
        <Btn type="submit">行を追加</Btn>
      </form>
      <div className="stamp-slot">
        {stamped ? <div className="stamp">記録済</div> : <span className="hint">未記録</span>}
      </div>
      <Btn
        kind="primary"
        onClick={() => {
          if (items.some((item) => item.result === "未")) {
            toast("未の項目が残っています");
            return;
          }
          setStamped(true);
          toast("点検表を記録済にしました");
        }}
      >
        記録する
      </Btn>
    </div>
  );
}
