import "./people-workflows.css";
import { useState } from "react";
import { AreaField, Badge, Btn, Segmented, TextField } from "../components/kit.tsx";
import { useToast } from "../components/toast-context.ts";
import { DEMO_TODAY, nextId } from "../data/demo.ts";

type Template = "紹介状" | "診断書";
type Copy = { id: string; template: Template; patient: string; savedOn: string };

export function ClinicDocExport() {
  const toast = useToast();
  const [template, setTemplate] = useState<Template>("紹介状");
  const [patient, setPatient] = useState("佐藤良子");
  const [address, setAddress] = useState("青葉総合病院 消化器内科");
  const [disease, setDisease] = useState("逆流性食道炎");
  const [body, setBody] = useState("上記につき、精査加療をお願いいたします。");
  const [copies, setCopies] = useState<Copy[]>([
    { id: "z1", template: "診断書", patient: "高橋正", savedOn: "2026-09-18" },
  ]);

  return (
    <div className="stack pflow-workspace">
      <div className="pflow-context">
        <div className="pflow-context-main"><div className="pflow-monogram" aria-hidden="true">文</div><div><p className="pflow-kicker">Aoba internal medicine</p><h2>青葉内科クリニック</h2><p className="hint">いつもの文書を整えて、控えを残す。</p></div></div>
        <div className="pflow-metrics"><div className="pflow-metric"><strong>{copies.length}<small>件</small></strong><small>保管済みの控え</small></div></div>
      </div>
      <div className="pflow-columns">
      <section className="pflow-column">
      <div className="pflow-heading"><div><p className="pflow-kicker">01 / Compose</p><h2>文書を作成</h2><p className="hint">テンプレートを選び、必要な情報を入力します。</p></div></div>
      <Segmented
        label="テンプレート"
        value={template}
        onChange={(value) => {
          if (value === template) return;
          setTemplate(value);
          setBody(
            value === "紹介状"
              ? "上記につき、精査加療をお願いいたします。"
              : "上記傷病により、本日より7日間の安静を要すると認めます。",
          );
          toast(`${value}の文面に切り替えました`);
        }}
        options={[
          { value: "紹介状", label: "紹介状" },
          { value: "診断書", label: "診断書" },
        ]}
      />
      <div className="form-grid pflow-form">
        <TextField label="患者名" value={patient} onChange={setPatient} />
        <TextField label="宛先" value={address} onChange={setAddress} />
        <TextField label="傷病名" value={disease} onChange={setDisease} />
      </div>
      <AreaField label="本文" value={body} onChange={setBody} />
      </section>
      <section className="pflow-panel pflow-panel-soft pflow-column">
      <div className="pflow-heading"><div><p className="pflow-kicker">02 / Preview</p><h2>文書イメージ</h2></div><Badge tone="muted">下書き</Badge></div>
      <article className="pflow-document" aria-label={`${template}のプレビュー`}>
        <h3 className="pflow-document-type">{template}</h3>
        <p className="pflow-document-date">作成日: {DEMO_TODAY}</p>
        <dl><div><dt>患者</dt><dd>{patient || "未入力"}</dd></div><div><dt>宛先</dt><dd>{address || "未入力"}</dd></div><div><dt>傷病名</dt><dd>{disease || "未入力"}</dd></div></dl>
        <p className="pflow-document-body">{body}</p>
        <p className="pflow-document-sign">青葉内科クリニック</p>
      </article>
      <p className="pflow-document-caption">控えイメージ · 入力した内容をそのまま表示</p>
      <Btn
        kind="primary"
        onClick={() => {
          setCopies((current) => [
            { id: nextId("z"), template, patient, savedOn: DEMO_TODAY },
            ...current,
          ]);
          toast(`${template}の控えを保管しました`);
        }}
      >
        控えを保管
      </Btn>
      </section>
      </div>
      <section>
      <div className="pflow-heading"><div><p className="pflow-kicker">Document archive</p><h2>保管済みの控え</h2><p className="hint">作成した文書の履歴を確認できます。</p></div><Badge tone="muted">{copies.length}件</Badge></div>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>日付</th>
              <th>種別</th>
              <th>患者</th>
            </tr>
          </thead>
          <tbody>
            {copies.map((copy) => (
              <tr key={copy.id}>
                <td data-label="日付"><span className="pflow-time">{copy.savedOn}</span></td>
                <td data-label="種別"><Badge tone="info">{copy.template}</Badge></td>
                <td data-label="患者"><span className="pflow-person">{copy.patient}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </section>
    </div>
  );
}
