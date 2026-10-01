import { useState } from "react";
import { Badge, Banner, Btn, Preview, TextField } from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { DEMO_TODAY, nextId } from "../data/demo.ts";
import "./field-workflows.css";

const waits = [
  { id: "none", label: "なし", minutes: 0 },
  { id: "lt15", label: "15分未満", minutes: 10 },
  { id: "mid", label: "15〜30分", minutes: 20 },
  { id: "long", label: "30〜60分", minutes: 45 },
  { id: "over", label: "60分以上", minutes: 75 },
] as const;
type WaitId = (typeof waits)[number]["id"];
type Stop = { id: string; place: string; arrived: string; wait: WaitId };

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
  const total = stops.reduce((sum, stop) => sum + (waits.find((item) => item.id === stop.wait)?.minutes ?? 0), 0);
  const text = [
    `ドライバー日報 ${DEMO_TODAY}`, "佐藤健一 / 品川 100 あ 1203",
    ...stops.map((stop) => `${stop.arrived} ${stop.place} 荷待ち:${waits.find((item) => item.id === stop.wait)?.label ?? ""}`),
    `荷待ち合計: ${total}分`, saved ? "状態: 確定" : "状態: 下書き",
  ].join("\n");

  return (
    <div className="stack field-workflow">
      <div className="field-overview"><div><span className="eyebrow">DRIVER DAILY LOG · {DEMO_TODAY}</span><h2>運行の流れを、ひと目で。</h2><p className="hint">佐藤健一 / 品川 100 あ 1203</p></div><Badge tone={saved ? "ok" : "muted"}>{saved ? "確定" : "下書き"}</Badge></div>
      <div className="stats field-stats">
        <div className="stat"><span>停留の記録</span><strong>{stops.length}<small> 件</small></strong><span>出発・到着を時刻で記録</span></div>
        <div className={`stat${total >= 60 ? " field-stat-alert" : ""}`}><span>荷待ち合計</span><strong>{total}<small> 分</small></strong><span>選択したタグからの概算</span></div>
        <div className="stat"><span>荷待ちがある停留</span><strong>{stops.filter((stop) => stop.wait !== "none").length}<small> 件</small></strong><span>待機の発生場所を見える化</span></div>
      </div>
      <div className="field-columns">
        <div className="stack">
          <section className="workspace-section stack">
            <div className="section-heading"><div><span className="eyebrow">ROUTE TIMELINE</span><h2>停留と荷待ち</h2></div><span className="hint">タグをタップして変更</span></div>
            <ol className="field-route">
              {stops.map((stop, index) => <li key={stop.id} className="field-stop">
                <div className="field-stop-time"><span className="field-stop-dot" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><time>{stop.arrived}</time></div>
                <div className="field-stop-body"><div className="field-stop-heading"><h3>{stop.place}</h3><Badge tone={stop.wait === "none" ? "muted" : "warn"}>荷待ち {waits.find((wait) => wait.id === stop.wait)?.label}</Badge></div>
                  <div className="field-wait-tags" role="group" aria-label={`${stop.place}の荷待ちタグ`}>
                    {waits.map((wait) => <button key={wait.id} type="button" className="btn" aria-pressed={stop.wait === wait.id} onClick={() => {
                      setStops((current) => current.map((item) => item.id === stop.id ? { ...item, wait: wait.id } : item));
                      setSaved(false); toast(`${stop.place}の荷待ちを${wait.label}にしました`);
                    }}>{wait.label}</button>)}
                  </div>
                </div>
              </li>)}
            </ol>
          </section>
          <section className="workspace-section stack">
            <div><span className="eyebrow">ADD A STOP</span><h2>次の停留を記録</h2></div>
            <form className="form-grid field-inline-form" onSubmit={(event) => {
              event.preventDefault(); setStops((current) => [...current, { id: nextId("s"), place: place.trim(), arrived, wait: "none" }]);
              setPlace(""); setSaved(false); toast("停留を追加しました");
            }}>
              <TextField label="停留" value={place} onChange={setPlace} required placeholder="例: 川口商店" />
              <TextField label="到着" value={arrived} onChange={setArrived} required />
              <Btn type="submit" kind="primary">停留を追加</Btn>
            </form>
          </section>
        </div>
        <aside className="stack">
          <section className="workspace-section stack field-report-summary">
            <div><span className="eyebrow">TODAY'S SUMMARY</span><h2>日報の確認</h2></div>
            <Banner tone={total >= 60 ? "warn" : "info"}>荷待ち合計 {total}分</Banner>
            <p className="hint">停留ごとの荷待ちタグが、日報に反映されます。内容を確認して確定してください。</p>
            <Btn kind="primary" onClick={() => { setSaved(true); toast(`日報を確定しました。荷待ち合計 ${total}分`); }}>日報を確定</Btn>
            {saved ? <Badge tone="ok">確定</Badge> : null}
          </section>
          <section className="workspace-section field-preview"><span className="eyebrow">OUTPUT PREVIEW</span><Preview title="日報イメージ" text={text} /></section>
        </aside>
      </div>
    </div>
  );
}
