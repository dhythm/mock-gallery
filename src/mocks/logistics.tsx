import { useState } from "react";
import { Badge, Banner, Btn, Preview, TextField } from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { DEMO_TODAY, nextId } from "../data/demo.ts";

const waits = [
  { id: "none", label: "なし", minutes: 0 },
  { id: "lt15", label: "15分未満", minutes: 10 },
  { id: "mid", label: "15〜30分", minutes: 20 },
  { id: "long", label: "30〜60分", minutes: 45 },
  { id: "over", label: "60分以上", minutes: 75 },
] as const;

type WaitId = (typeof waits)[number]["id"];

type Stop = {
  id: string;
  place: string;
  arrived: string;
  wait: WaitId;
};

export function LogisticsDriverLog() {
  const toast = useToast();
  const [place, setPlace] = useState("");
  const [arrived, setArrived] = useState("13:30");
  const [saved, setSaved] = useState(false);
  const [stops, setStops] = useState<Stop[]>([
    { id: "s1", place: "本社ヤード 出発", arrived: "06:40", wait: "none" },
    { id: "s2", place: "浦安倉庫", arrived: "08:10", wait: "long" },
    { id: "s3", place: "越谷センター", arrived: "11:05", wait: "lt15" },
  ]);

  const total = stops.reduce((sum, stop) => {
    const found = waits.find((item) => item.id === stop.wait);
    return sum + (found?.minutes ?? 0);
  }, 0);

  const text = [
    `ドライバー日報 ${DEMO_TODAY}`,
    "佐藤健一 / 品川 100 あ 1203",
    ...stops.map((stop) => {
      const label = waits.find((item) => item.id === stop.wait)?.label ?? "";
      return `${stop.arrived} ${stop.place} 荷待ち:${label}`;
    }),
    `荷待ち合計: ${total}分`,
    saved ? "状態: 確定" : "状態: 下書き",
  ].join("\n");

  return (
    <div className="stack">
      <Banner tone={total >= 60 ? "warn" : "info"}>荷待ち合計 {total}分</Banner>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>時刻</th>
              <th>停留</th>
              <th>荷待ちタグ</th>
            </tr>
          </thead>
          <tbody>
            {stops.map((stop) => (
              <tr key={stop.id}>
                <td>{stop.arrived}</td>
                <td>{stop.place}</td>
                <td>
                  <div className="actions">
                    {waits.map((wait) => (
                      <button
                        key={wait.id}
                        type="button"
                        className="btn"
                        aria-pressed={stop.wait === wait.id}
                        onClick={() => {
                          setStops((current) =>
                            current.map((item) =>
                              item.id === stop.id ? { ...item, wait: wait.id } : item,
                            ),
                          );
                          setSaved(false);
                          toast(`${stop.place}の荷待ちを${wait.label}にしました`);
                        }}
                      >
                        {wait.label}
                      </button>
                    ))}
                  </div>
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
          setStops((current) => [
            ...current,
            { id: nextId("s"), place: place.trim(), arrived, wait: "none" },
          ]);
          setPlace("");
          setSaved(false);
          toast("停留を追加しました");
        }}
      >
        <TextField label="停留" value={place} onChange={setPlace} required placeholder="例: 川口商店" />
        <TextField label="到着" value={arrived} onChange={setArrived} required />
        <Btn type="submit" kind="primary">
          停留を追加
        </Btn>
      </form>
      <div className="actions">
        <Btn
          kind="primary"
          onClick={() => {
            setSaved(true);
            toast(`日報を確定しました。荷待ち合計 ${total}分`);
          }}
        >
          日報を確定
        </Btn>
        <Badge tone={saved ? "ok" : "muted"}>{saved ? "確定" : "下書き"}</Badge>
      </div>
      <Preview title="日報イメージ" text={text} />
    </div>
  );
}
