export const industryOrder = [
  "建設",
  "物流・運送",
  "製造",
  "介護",
  "飲食",
  "不動産",
  "農業",
  "士業",
  "B2B・受発注",
  "診療所",
  "横断",
] as const;

export type Industry = (typeof industryOrder)[number];

export type MockMeta = {
  slug: string;
  title: string;
  industry: Industry;
  problem: string;
  whyNow: string;
  aiRole: string;
  mvpSummary: string;
};

export const mockCatalog = [
  {
    slug: "construction-daily-report",
    title: "現場日報＋写真＋安全点検",
    industry: "建設",
    problem: "日報・KY・写真が紙とLINEに分かれ、事務が転記している",
    whyNow: "写真はもう現場のスマホで撮っている。残す場所が無いだけ",
    aiRole: "なし",
    mvpSummary: "天候・人員・KY・作業写真を1画面で残し、日報PDFのイメージを出す",
  },
  {
    slug: "construction-corrective-photos",
    title: "是正・指摘事項＋写真台帳",
    industry: "建設",
    problem: "指摘が口頭と写真フォルダに分かれ、是正漏れが次の検査で出る",
    whyNow: "期限と是正前写真だけでも、再指摘は減る",
    aiRole: "なし",
    mvpSummary: "未是正と是正済を写真つきで分け、期限超過を一覧の上に出す",
  },
  {
    slug: "construction-subcontractor-board",
    title: "協力会社への簡易手配ボード",
    industry: "建設",
    problem: "誰がいつ来るかが、監督の電話とLINEの中にしかない",
    whyNow: "協力会社は少人数。看板1枚の情報で当日は回る",
    aiRole: "なし",
    mvpSummary: "手配・作業中・完了を写真つきで並べ、口頭の確認を減らす",
  },
  {
    slug: "logistics-driver-log",
    title: "ドライバー日報＋荷待ち時間タグ",
    industry: "物流・運送",
    problem: "荷待ちが日報の余白に書かれ、請求の根拠にならない",
    whyNow: "分数が見えれば、運賃と荷主への相談材料になる",
    aiRole: "なし。タグはドライバーのタップだけで足りる",
    mvpSummary: "運行の停留ごとに荷待ち分数をタグで残し、日報を確定する",
  },
  {
    slug: "manufacturing-inspection",
    title: "点検表・設備異常のタブレット完結",
    industry: "製造",
    problem: "点検表が紙のまま事務所に戻り、異常の写真が別フォルダにある",
    whyNow: "未実施が見えないまま、次のシフトが設備を動かす",
    aiRole: "なし",
    mvpSummary: "未実施を目立たせ、異常は写真つきでその場の点検を閉じる",
  },
  {
    slug: "manufacturing-checklist-digital",
    title: "点検チェックリスト電子化",
    industry: "製造",
    problem: "紙と見た目が違う画面は、現場が使わずに元の帳票へ戻る",
    whyNow: "格子と項目を保てば、印の代わりに記録済で回る",
    aiRole: "なし",
    mvpSummary: "紙の点検表と同じ並びで良否を付け、記録済の印を残す",
  },
  {
    slug: "care-handover",
    title: "申し送り・記録ライト",
    industry: "介護",
    problem: "申し送りノートを、介護記録ソフトへ手で転記している",
    whyNow: "ソフトを替えなくても、印刷とCSVがあれば渡せる",
    aiRole: "なし",
    mvpSummary: "利用者ごとの申し送りをその場で残し、CSVイメージで書き出す",
  },
  {
    slug: "care-paper-bridge",
    title: "紙スキャン→既存ソフト向け橋渡し",
    industry: "介護",
    problem: "スキャンPDFの名前が日付だけで、既存ソフトに取り込めない",
    whyNow: "受け渡し用の一覧とCSVだけ先に作れば、本体入替は後でよい",
    aiRole: "薄い裏方。分類名の候補を出すだけで、確定は人が行う",
    mvpSummary: "スキャンを利用者と種別で整え、取り込み用CSVを出す",
  },
  {
    slug: "care-shift-board",
    title: "介護シフト板",
    industry: "介護",
    problem: "希望休が紙で、早番・遅番の人数不足が前日まで見えない",
    whyNow: "人員配置の穴は、当日では埋まらない",
    aiRole: "なし",
    mvpSummary: "希望を板に反映し、時間帯ごとの過不足を赤く示す",
  },
  {
    slug: "shift-excel-bridge",
    title: "シフト希望回収→Excel整形",
    industry: "横断",
    problem: "希望がLINEと紙に混ざり、責任者がExcelへ貼り直している",
    whyNow: "飲食も介護も、最初の痛みは自動作成ではなく集計",
    aiRole: "なし",
    mvpSummary: "希望休と入れる時間を受け、SheetsやExcelに貼れる表にする",
  },
  {
    slug: "restaurant-order-loss",
    title: "発注リスト＋在庫ざっくり＋ロス記録",
    industry: "飲食",
    problem: "発注はFAX、在庫は勘、ロスは捨てた時点で消える",
    whyNow: "正確なグラムでなくても、週の増減が見えれば手が打てる",
    aiRole: "なし",
    mvpSummary: "発注数・棚の概数・ロス理由を1つのリストに残す",
  },
  {
    slug: "restaurant-shift-exit",
    title: "外食シフト板（Excel卒業）",
    industry: "飲食",
    problem: "シフトExcelが店長のPCにしかなく、当日の変更が口頭になる",
    whyNow: "スタッフは自分の枠と空きがスマホで見えれば足りる",
    aiRole: "なし",
    mvpSummary: "店舗の週間シフトを公開し、空いた枠にその場で人を入れる",
  },
  {
    slug: "property-owner-report",
    title: "オーナー向け定期報告パック",
    industry: "不動産",
    problem: "収支と連絡履歴が別ファイルで、報告の前日にまとめ直している",
    whyNow: "毎月同じ型。寄せるだけでオーナーに渡せる",
    aiRole: "なし",
    mvpSummary: "収支の概要と連絡履歴を、1つのPDFパックイメージにまとめる",
  },
  {
    slug: "farm-gap-log",
    title: "栽培・作業記録→GAP証跡",
    industry: "農業",
    problem: "防除と施肥がノートにあり、審査の前に書き写している",
    whyNow: "GAPは記憶ではなく、その日の記録が証跡になる",
    aiRole: "なし",
    mvpSummary: "圃場・作業・使用資材をその日のうちに残し、証跡PDFにする",
  },
  {
    slug: "professional-case-ledger",
    title: "顧客・案件・期限の軽量台帳",
    industry: "士業",
    problem: "期限が手帳とExcelの二重管理で、直前まで気づかない",
    whyNow: "案件は数十件。重い案件管理はまだ要らない",
    aiRole: "なし",
    mvpSummary: "顧客・手続・期限を1枚にし、期限超過を一覧の先頭に出す",
  },
  {
    slug: "professional-intake-box",
    title: "士業取り込み箱",
    industry: "士業",
    problem: "メール・郵送・持参の資料が、担当の机で未処理のまま滞る",
    whyNow: "中身の作業の前に、受領と分類だけ箱に載せられる",
    aiRole: "薄い裏方。種別の当たりを表示するだけ",
    mvpSummary: "届いた資料を未処理で溜めず、種別を付けて担当へ渡す",
  },
  {
    slug: "fax-structured-inbox",
    title: "FAX／紙発注の構造化受信箱",
    industry: "B2B・受発注",
    problem: "FAXのPDFが山になり、得意先・品目・納期を目で拾っている",
    whyNow: "届いたままでは、検索して残す電帳法の要件に合わない",
    aiRole: "薄い裏方。OCRの結果は下書きだけ。確定は人が行う",
    mvpSummary: "受信FAXを得意先・納期・金額で検索し、人が受注確定する",
  },
  {
    slug: "wholesale-order-hub",
    title: "卸受注一本化",
    industry: "B2B・受発注",
    problem: "電話・FAX・メールの受注が別台帳で、欠品の連絡が漏れる",
    whyNow: "入口を増やさず、1つの受注リストに寄せれば追い切れる",
    aiRole: "なし",
    mvpSummary: "受信経路つきで受注を1枚にし、確認済まで進める",
  },
  {
    slug: "ebook-law-lite",
    title: "電帳法ライト＋受注PDF保管",
    industry: "B2B・受発注",
    problem: "受注PDFが年月フォルダに入り、金額や取引先で探せない",
    whyNow: "電子取引データは、日付・金額・取引先で検索できる保存が要る",
    aiRole: "なし",
    mvpSummary: "受注PDFを日付・金額・取引先で索引し、その場で検索する",
  },
  {
    slug: "sme-order-web",
    title: "中小の受発注を薄いWebに",
    industry: "B2B・受発注",
    problem: "受発注Excelがメールで回り、どれが最新の行か分からない",
    whyNow: "行の追加と確定だけWebにすれば、版の分裂は止まる",
    aiRole: "なし",
    mvpSummary: "Excelの受注表と同じ列をWebで直し、確定で版を固定する",
  },
  {
    slug: "clinic-doc-export",
    title: "診療所文書出口",
    industry: "診療所",
    problem: "紹介状と診断書が個人のWordにあり、控えが医院に残らない",
    whyNow: "文書の型は数種類。出口だけ整え、カルテ本体は触らない",
    aiRole: "なし",
    mvpSummary: "テンプレから紹介状・診断書を作り、控えを日付つきで保管する",
  },
  {
    slug: "paper-form-kit",
    title: "紙帳票デジタル入力キット",
    industry: "横断",
    problem: "システム化で見た目が変わると、現場は紙の帳票に戻る",
    whyNow: "同じ格子のまま入れ、CSVで今の集計に渡せる",
    aiRole: "なし",
    mvpSummary: "帳票を選び、紙と同じ枠に入力してCSVイメージを出す",
  },
] as const satisfies readonly MockMeta[];

export type CatalogItem = (typeof mockCatalog)[number];
export type Slug = CatalogItem["slug"];

export function findMock(slug: string | undefined) {
  return mockCatalog.find((item) => item.slug === slug);
}
