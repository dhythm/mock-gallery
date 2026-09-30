import { useState } from "react";
import { AreaField, Btn, Preview, Segmented, TextField } from "../components/kit.tsx";
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

  const text = [
    `${template}（控えイメージ）`,
    `患者: ${patient}`,
    `宛先: ${address}`,
    `傷病名: ${disease}`,
    body,
    `作成日: ${DEMO_TODAY}`,
    "青葉内科クリニック",
  ].join("\n");

  return (
    <div className="stack">
      <Segmented
        label="テンプレート"
        value={template}
        onChange={(value) => {
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
      <div className="form-grid">
        <TextField label="患者名" value={patient} onChange={setPatient} />
        <TextField label="宛先" value={address} onChange={setAddress} />
        <TextField label="傷病名" value={disease} onChange={setDisease} />
      </div>
      <AreaField label="本文" value={body} onChange={setBody} />
      <Preview title="文書イメージ" text={text} />
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
                <td>{copy.savedOn}</td>
                <td>{copy.template}</td>
                <td>{copy.patient}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
