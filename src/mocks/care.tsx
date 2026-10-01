import "./people-workflows.css";
import { useMemo, useState } from "react";
import { Badge, Banner, Btn, Preview, Segmented, SelectField, TextField } from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { nextId } from "../data/demo.ts";

const residents = ["山田花子", "鈴木一郎", "高橋梅"] as const;
type Resident = (typeof residents)[number];
const noteKinds = ["食事", "排泄", "バイタル", "申し送り"] as const;
type NoteKind = (typeof noteKinds)[number];

type Note = { id: string; resident: Resident; kind: NoteKind; body: string; at: string };

export function CareHandover() {
  const toast = useToast();
  const [resident, setResident] = useState<Resident | "全員">("全員");
  const [kind, setKind] = useState<NoteKind>("申し送り");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState<Resident>("山田花子");
  const [csvOn, setCsvOn] = useState(false);
  const [notes, setNotes] = useState<Note[]>([
    { id: "n1", resident: "山田花子", kind: "食事", body: "朝食8割。水分100", at: "08:10" },
    { id: "n2", resident: "鈴木一郎", kind: "バイタル", body: "BP 138/82 体温 36.6", at: "09:05" },
    { id: "n3", resident: "高橋梅", kind: "申し送り", body: "午後、家族面会の予定", at: "10:20" },
  ]);

  const visible = notes.filter((note) => resident === "全員" || note.resident === resident);
  const csv = ["時刻,利用者,区分,内容", ...notes.map((note) => `${note.at},${note.resident},${note.kind},${note.body}`)].join("\n");

  return (
    <div className="stack pflow-workspace">
      <div className="pflow-context">
        <div className="pflow-context-main">
          <div className="pflow-monogram" aria-hidden="true">記</div>
          <div><p className="pflow-kicker">Daily care notes</p><h2>今日の申し送り</h2><p className="hint">利用者ごとの小さな変化を、次の担当者へ。</p></div>
        </div>
        <div className="pflow-metrics">
          <div className="pflow-metric"><strong>{notes.length}<small>件</small></strong><small>本日の記録</small></div>
          <div className="pflow-metric"><strong>{new Set(notes.map((note) => note.resident)).size}<small>名</small></strong><small>記録のある利用者</small></div>
        </div>
      </div>
      <div className="pflow-columns">
      <section className="pflow-column" aria-label="利用者の記録">
      <div className="pflow-heading"><div><p className="pflow-kicker">01 / Timeline</p><h2>記録を確認</h2></div><Badge tone="muted">{visible.length}件を表示</Badge></div>
      <Segmented
        label="利用者"
        value={resident}
        onChange={setResident}
        options={[
          { value: "全員", label: "全員" },
          ...residents.map((name) => ({ value: name, label: name })),
        ]}
      />
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>時刻</th>
              <th>利用者</th>
              <th>区分</th>
              <th>内容</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((note) => (
              <tr key={note.id}>
                <td data-label="時刻"><span className="pflow-time">{note.at}</span></td>
                <td data-label="利用者"><span className="pflow-person">{note.resident}</span></td>
                <td data-label="区分"><Badge tone="info">{note.kind}</Badge></td>
                <td data-label="内容">{note.body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </section>
      <section className="pflow-panel pflow-panel-soft">
      <div className="pflow-heading"><div><p className="pflow-kicker">02 / New record</p><h2>気づきを残す</h2><p className="hint">短いメモから、その場で記録できます。</p></div></div>
      <form
        className="form-grid pflow-form"
        onSubmit={(event) => {
          event.preventDefault();
          setNotes((current) => [
            ...current,
            { id: nextId("n"), resident: target, kind, body: body.trim(), at: "11:40" },
          ]);
          setBody("");
          setCsvOn(false);
          toast(`${target}の${kind}を追加しました`);
        }}
      >
        <SelectField
          label="利用者"
          value={target}
          onChange={setTarget}
          options={residents.map((name) => ({ value: name, label: name }))}
        />
        <SelectField
          label="区分"
          value={kind}
          onChange={setKind}
          options={noteKinds.map((item) => ({ value: item, label: item }))}
        />
        <TextField label="内容" value={body} onChange={setBody} required placeholder="例: 午後の服薬を確認" />
        <Btn type="submit" kind="primary">記録を追加</Btn>
      </form>
      </section>
      </div>
      <div className="pflow-footer">
      <p className="hint">記録をまとめて、既存ソフトへの取り込みや紙の申し送りに。</p>
      <div className="actions">
        <Btn
          onClick={() => {
            setCsvOn(true);
            toast("CSVイメージを出しました");
          }}
        >
          CSVイメージ
        </Btn>
        <Btn
          onClick={() => {
            toast("印刷イメージを開きました（接続なし）");
          }}
        >
          印刷イメージ
        </Btn>
      </div>
      </div>
      {csvOn ? <Preview title="取り込み用CSV" text={csv} /> : null}
    </div>
  );
}

type ScanKind = "未分類" | "バイタル" | "食事" | "契約";

type Scan = {
  id: string;
  file: string;
  resident: string;
  kind: ScanKind;
  hint: string;
};

export function CarePaperBridge() {
  const toast = useToast();
  const [file, setFile] = useState("");
  const [exported, setExported] = useState(false);
  const [scans, setScans] = useState<Scan[]>([
    { id: "p1", file: "scan_0930_001.pdf", resident: "山田花子", kind: "未分類", hint: "バイタル" },
    { id: "p2", file: "scan_0930_002.pdf", resident: "鈴木一郎", kind: "食事", hint: "食事" },
    { id: "p3", file: "scan_0929_014.pdf", resident: "高橋梅", kind: "未分類", hint: "契約" },
  ]);

  const csv = ["ファイル,利用者,種別", ...scans.map((scan) => `${scan.file},${scan.resident},${scan.kind}`)].join("\n");
  const unclassified = scans.filter((scan) => scan.kind === "未分類").length;

  return (
    <div className="stack pflow-workspace">
      <div className="pflow-context">
        <div className="pflow-context-main"><div className="pflow-monogram" aria-hidden="true">紙</div><div><p className="pflow-kicker">Paper to record</p><h2>紙の記録を、使えるデータへ</h2><p className="hint">内容を確かめてから、既存ソフトへ橋渡し。</p></div></div>
        <div className="pflow-metrics"><div className="pflow-metric"><strong>{scans.length}<small>件</small></strong><small>取り込み済み</small></div><div className="pflow-metric"><strong>{scans.length - unclassified}<small>件</small></strong><small>分類済み</small></div></div>
      </div>
      <div className="pflow-process" aria-label="取り込みの流れ"><div><b>01</b><span>スキャン<small>ファイルを追加</small></span></div><div><b>02</b><span>人が確認<small>利用者・種別を分類</small></span></div><div><b>03</b><span>書き出し<small>既存ソフトへ</small></span></div></div>
      <Banner tone={unclassified > 0 ? "warn" : "ok"}>
        {unclassified > 0 ? `未分類 ${unclassified}件。候補は裏方の当たりです` : "未分類はありません"}
      </Banner>
      <section aria-label="スキャン一覧">
      <div className="pflow-heading"><div><h2>確認待ちの書類</h2><p className="hint">候補は参考情報です。種別は確認して選びます。</p></div><Badge tone={unclassified ? "warn" : "ok"}>未分類 {unclassified}件</Badge></div>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>ファイル</th>
              <th>利用者</th>
              <th>種別</th>
              <th>候補</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((scan) => (
              <tr key={scan.id}>
                <td data-label="ファイル"><strong>{scan.file}</strong></td>
                <td data-label="利用者">{scan.resident}</td>
                <td data-label="種別">
                  <select
                    className="select"
                    aria-label={`${scan.file}の種別`}
                    value={scan.kind}
                    onChange={(event) => {
                      const kind = event.target.value as ScanKind;
                      setScans((current) =>
                        current.map((item) => (item.id === scan.id ? { ...item, kind } : item)),
                      );
                      setExported(false);
                      toast(`${scan.file}を${kind}にしました`);
                    }}
                  >
                    {(["未分類", "バイタル", "食事", "契約"] as const).map((kind) => (
                      <option key={kind}>{kind}</option>
                    ))}
                  </select>
                </td>
                <td data-label="候補">
                  <span className="hint">候補: {scan.hint}（裏方。人が分類）</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </section>
      <section className="pflow-inline-form">
      <div className="pflow-heading"><div><h3>書類を追加</h3><p className="hint">新しいスキャンは「未分類」として一覧に加わります。</p></div></div>
      <form
        className="form-grid"
        onSubmit={(event) => {
          event.preventDefault();
          setScans((current) => [
            ...current,
            {
              id: nextId("p"),
              file: file.trim(),
              resident: "未設定",
              kind: "未分類",
              hint: "申し送り",
            },
          ]);
          setFile("");
          setExported(false);
          toast("スキャンを追加しました");
        }}
      >
        <TextField label="ファイル名" value={file} onChange={setFile} required placeholder="scan_0930_003.pdf" />
        <Btn type="submit" kind="primary">スキャンを追加</Btn>
      </form>
      </section>
      <div className="pflow-footer"><p className="hint">{scans.length}件の書類情報を書き出します。出力前に未分類をご確認ください。</p>
      <Btn
        onClick={() => {
          setExported(true);
          toast("取り込み用CSVを出しました");
        }}
      >
        CSVを出す
      </Btn>
      </div>
      {exported ? <Preview title="既存ソフト向けCSV" text={csv} /> : null}
    </div>
  );
}

const days = ["月", "火", "水", "木", "金", "土", "日"] as const;
const shiftCycle = ["", "早", "遅", "夜", "休"] as const;
type ShiftMark = (typeof shiftCycle)[number];
const required: Record<Exclude<ShiftMark, "" | "休">, number> = { 早: 2, 遅: 2, 夜: 1 };

type Staff = { id: string; name: string; days: ShiftMark[] };

function countShift(staff: Staff[], dayIndex: number, mark: ShiftMark) {
  return staff.filter((person) => person.days[dayIndex] === mark).length;
}

export function CareShiftBoard() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [staff, setStaff] = useState<Staff[]>([
    { id: "u1", name: "佐々木", days: ["早", "早", "早", "遅", "遅", "休", "休"] },
    { id: "u2", name: "井上", days: ["遅", "遅", "遅", "早", "早", "休", "休"] },
    { id: "u3", name: "木村", days: ["夜", "夜", "休", "夜", "夜", "早", "遅"] },
    { id: "u4", name: "林", days: ["早", "遅", "遅", "遅", "休", "遅", "早"] },
  ]);

  const shortages = useMemo(() => {
    const lines: string[] = [];
    days.forEach((day, index) => {
      (["早", "遅", "夜"] as const).forEach((mark) => {
        const count = countShift(staff, index, mark);
        if (count < required[mark]) lines.push(`${day}${mark} ${count}/${required[mark]}`);
      });
    });
    return lines;
  }, [staff]);

  return (
    <div className="stack pflow-workspace">
      <div className="pflow-context">
        <div className="pflow-context-main"><div className="pflow-monogram" aria-hidden="true">勤</div><div><p className="pflow-kicker">Weekly staffing</p><h2>一週間の配置を見渡す</h2><p className="hint">必要人数: 早番2名・遅番2名・夜勤1名 / 日</p></div></div>
        <div className="pflow-metrics"><div className="pflow-metric"><strong>{staff.length}<small>名</small></strong><small>スタッフ</small></div><div className="pflow-metric"><strong>{shortages.length}<small>枠</small></strong><small>配置基準に未達</small></div></div>
      </div>
      <div className="pflow-coverage" aria-label="曜日ごとの配置人数">{days.map((day, index) => <div className="pflow-day" key={day}><strong>{day}</strong>{(["早", "遅", "夜"] as const).map((mark) => <span className={countShift(staff, index, mark) < required[mark] ? "pflow-short" : ""} key={mark}>{mark} {countShift(staff, index, mark)}/{required[mark]}</span>)}</div>)}</div>
      {shortages.length > 0 ? <details className="pflow-shortage-details"><summary>配置が必要な {shortages.length}枠を確認</summary><p>人数不足: {shortages.join("、")}</p></details> : <Banner tone="ok">配置基準は足りています</Banner>}
      <div className="pflow-heading"><div><h2>スタッフ別シフト</h2><p className="hint">セルを押すと、空 → 早 → 遅 → 夜 → 休の順に切り替わります。</p></div></div>
      <div className="pflow-legend"><span><i className="pflow-dot" />早番</span><span><i className="pflow-dot pflow-dot-late" />遅番</span><span><i className="pflow-dot pflow-dot-night" />夜勤</span><span><i className="pflow-dot pflow-dot-open" />枠線は人数不足</span></div>
      <p className="pflow-scroll-hint">左右にスクロールして一週間を確認できます</p>
      <div className="table-wrap pflow-board">
        <table className="shift">
          <thead>
            <tr>
              <th>スタッフ</th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map((person) => (
              <tr key={person.id}>
                <th scope="row">{person.name}</th>
                {person.days.map((mark, index) => {
                  const short =
                    mark !== "" &&
                    mark !== "休" &&
                    countShift(staff, index, mark) < required[mark];
                  return (
                    <td key={`${person.id}-${days[index]}`}>
                      <button
                        type="button"
                        aria-label={`${person.name} ${days[index]} ${mark || "空"}、クリックで変更`}
                        data-shift={mark}
                        className={`cell-btn${short ? " is-short" : ""}${mark === "休" || mark === "" ? " is-off" : ""}`}
                        onClick={() => {
                          const next = shiftCycle[(shiftCycle.indexOf(mark) + 1) % shiftCycle.length] ?? "";
                          setStaff((current) =>
                            current.map((row) =>
                              row.id === person.id
                                ? {
                                    ...row,
                                    days: row.days.map((value, dayIndex) =>
                                      dayIndex === index ? next : value,
                                    ),
                                  }
                                : row,
                            ),
                          );
                          toast(`${person.name}の${days[index]}を${next || "空"}にしました`);
                        }}
                      >
                        {mark || "空"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pflow-footer"><p className="hint">寄せられた希望休を反映して、配置を調整しましょう。</p>
      <div className="actions">
        <Btn
          kind="primary"
          onClick={() => {
            setStaff((current) =>
              current.map((person) =>
                person.name === "林"
                  ? { ...person, days: person.days.map((mark, index) => (index === 5 ? "休" : mark)) }
                  : person,
              ),
            );
            toast("希望休を板に反映しました（林・土曜）");
          }}
        >
          希望を反映
        </Btn>
      </div>
      </div>
      <form
        className="form-grid pflow-inline-form"
        onSubmit={(event) => {
          event.preventDefault();
          setStaff((current) => [
            ...current,
            { id: nextId("u"), name: name.trim(), days: ["", "", "", "", "", "", ""] },
          ]);
          setName("");
          toast("スタッフを追加しました。配置は未入力です");
        }}
      >
        <TextField label="スタッフ名" value={name} onChange={setName} required placeholder="例: 森田" />
        <Btn type="submit">スタッフを追加</Btn>
      </form>
    </div>
  );
}
