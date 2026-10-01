import type { Industry, Slug } from "./catalog.ts";
import type { IconName } from "../components/Icon.tsx";

export const industryIcons: Record<Industry, IconName> = {
  建設: "building", "物流・運送": "truck", 製造: "tool", 介護: "heart", 飲食: "food", 不動産: "home", 農業: "leaf", 士業: "briefcase", "B2B・受発注": "inbox", 診療所: "medical", 横断: "grid",
};
export type PreviewKind = "report" | "board" | "table" | "schedule" | "document" | "route";
type Presentation = { label: string; kind: PreviewKind; rows: readonly string[]; steps: readonly string[] };
export const presentations: Record<Slug, Presentation> = {
  "construction-daily-report": { label: "現場日報", kind: "report", rows: ["東陽町マンション新築", "3Fスラブ配筋", "安全点検 3 / 4"], steps: ["日報を入力", "安全・写真を確認", "日報を確定"] },
  "construction-corrective-photos": { label: "是正管理", kind: "table", rows: ["外部足場", "3Fバルコニー", "1F仮囲い"], steps: ["指摘を確認", "是正を記録", "台帳を更新"] },
  "construction-subcontractor-board": { label: "協力会社ボード", kind: "board", rows: ["青葉鉄筋", "北沢設備", "川田塗装"], steps: ["手配を登録", "作業を進める", "完了を記録"] },
  "logistics-driver-log": { label: "運行日報", kind: "route", rows: ["車庫を出発", "荷主で積み込み", "納品先に到着"], steps: ["停留を記録", "荷待ちをタグ付け", "日報を確定"] },
  "manufacturing-inspection": { label: "設備点検", kind: "table", rows: ["コンプレッサー#2", "ボイラー#1", "クレーン南"], steps: ["設備を選ぶ", "良否を記録", "異常に対応"] },
  "manufacturing-checklist-digital": { label: "日常点検表", kind: "document", rows: ["非常停止の動作", "安全カバーの固定", "油圧の漏れ"], steps: ["項目を点検", "良否を付ける", "記録済にする"] },
  "care-handover": { label: "申し送りノート", kind: "report", rows: ["利用者ごとの記録", "食事・水分・体調", "次の担当へ共有"], steps: ["利用者を選ぶ", "申し送りを残す", "CSVを確認"] },
  "care-paper-bridge": { label: "書類の取り込み", kind: "document", rows: ["スキャンを確認", "利用者と種別", "取り込み用CSV"], steps: ["書類を確認", "分類を確定", "CSVを出力"] },
  "care-shift-board": { label: "介護シフト", kind: "schedule", rows: ["早番", "日勤", "遅番"], steps: ["配置を確認", "希望休を反映", "不足を確認"] },
  "shift-excel-bridge": { label: "シフト希望", kind: "schedule", rows: ["希望休", "勤務できる時間", "Excelへ受け渡し"], steps: ["希望を入力", "一覧で確認", "Excelへ受け渡し"] },
  "restaurant-order-loss": { label: "キッチン在庫", kind: "table", rows: ["トマト", "鶏もも肉", "牛乳"], steps: ["在庫を確認", "発注数を調整", "ロスを記録"] },
  "restaurant-shift-exit": { label: "店舗シフト", kind: "schedule", rows: ["ランチ", "ディナー", "週の勤務予定"], steps: ["週間シフトを確認", "空き枠を埋める", "シフトを公開"] },
  "property-owner-report": { label: "月次オーナー報告", kind: "report", rows: ["月次収支", "物件の連絡履歴", "報告パック"], steps: ["収支を確認", "履歴をまとめる", "報告を作成"] },
  "farm-gap-log": { label: "圃場の作業記録", kind: "route", rows: ["北圃場", "防除・施肥", "GAP証跡"], steps: ["圃場を選ぶ", "作業を記録", "証跡を確認"] },
  "professional-case-ledger": { label: "案件と期限", kind: "table", rows: ["顧客・手続", "今週の期限", "進行中の案件"], steps: ["期限を確認", "案件を更新", "完了を記録"] },
  "professional-intake-box": { label: "資料の受領箱", kind: "board", rows: ["メール", "郵送", "持参"], steps: ["資料を受領", "種別を確認", "担当へ渡す"] },
  "fax-structured-inbox": { label: "FAX受信箱", kind: "document", rows: ["得意先", "品目・納期", "OCRの下書き"], steps: ["受信を確認", "下書きを修正", "受注を確定"] },
  "wholesale-order-hub": { label: "受注センター", kind: "table", rows: ["電話からの注文", "FAXからの注文", "メールからの注文"], steps: ["受注を確認", "欠品を確認", "確認済にする"] },
  "ebook-law-lite": { label: "電子書類保管", kind: "document", rows: ["取引日", "取引先・金額", "PDF保管"], steps: ["書類を索引化", "条件で検索", "控えを確認"] },
  "sme-order-web": { label: "受発注台帳", kind: "table", rows: ["取引先", "品目・数量", "確認と確定"], steps: ["明細を入力", "内容を確認", "版を確定"] },
  "clinic-doc-export": { label: "診療所の文書", kind: "document", rows: ["紹介状", "診断書", "日付つきの控え"], steps: ["文書を選ぶ", "内容を入力", "控えを保管"] },
  "paper-form-kit": { label: "デジタル帳票", kind: "document", rows: ["いつもの帳票", "同じ枠に入力", "CSVに受け渡し"], steps: ["帳票を選ぶ", "枠に入力", "CSVを確認"] },
};
