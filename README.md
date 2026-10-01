# 現場モック集

日本の「アナログ／Excel地獄」向けに、現場で触れる業務画面を並べたモックギャラリーです。ポータルから各画面を開き、ボタン・入力で反応を確認できます。データはブラウザのメモリだけにあり、バックエンドはありません。

## 起動

pnpm 10 と Node.js 22 を想定しています。

```bash
pnpm install
pnpm dev
```

開発サーバは GitHub Pages と同じベースパスです。

http://localhost:5173/mock-gallery/

本番ビルドの確認:

```bash
pnpm build
pnpm preview
```

プレビューは http://localhost:4173/mock-gallery/ です。

## 画面

- `/` ポータル。画面プレビュー付きカード、検索、業界フィルター（単一選択。「すべて」で解除）。検索条件はURLに保持します。
- `/mocks/:slug` 各モック。業界別ナビ、操作手順、折りたたみの背景説明、操作エリア、次のモックへの移動。

カードは「ワークフローのプレビュー → 業界・番号 → タイトル → 要約 → 操作リンク」です。プレビューは軽量なHTML/CSSで描画し、カード全体をひとつのリンクにしています。

## モック一覧

| slug | タイトル | 業界 |
| --- | --- | --- |
| `construction-daily-report` | 現場日報＋写真＋安全点検 | 建設 |
| `construction-corrective-photos` | 是正・指摘事項＋写真台帳 | 建設 |
| `construction-subcontractor-board` | 協力会社への簡易手配ボード | 建設 |
| `logistics-driver-log` | ドライバー日報＋荷待ち時間タグ | 物流・運送 |
| `manufacturing-inspection` | 点検表・設備異常のタブレット完結 | 製造 |
| `manufacturing-checklist-digital` | 点検チェックリスト電子化 | 製造 |
| `care-handover` | 申し送り・記録ライト | 介護 |
| `care-paper-bridge` | 紙スキャン→既存ソフト向け橋渡し | 介護 |
| `care-shift-board` | 介護シフト板 | 介護 |
| `shift-excel-bridge` | シフト希望回収→Excel整形 | 横断 |
| `restaurant-order-loss` | 発注リスト＋在庫ざっくり＋ロス記録 | 飲食 |
| `restaurant-shift-exit` | 外食シフト板（Excel卒業） | 飲食 |
| `property-owner-report` | オーナー向け定期報告パック | 不動産 |
| `farm-gap-log` | 栽培・作業記録→GAP証跡 | 農業 |
| `professional-case-ledger` | 顧客・案件・期限の軽量台帳 | 士業 |
| `professional-intake-box` | 士業取り込み箱 | 士業 |
| `fax-structured-inbox` | FAX／紙発注の構造化受信箱 | B2B・受発注 |
| `wholesale-order-hub` | 卸受注一本化 | B2B・受発注 |
| `ebook-law-lite` | 電帳法ライト＋受注PDF保管 | B2B・受発注 |
| `sme-order-web` | 中小の受発注を薄いWebに | B2B・受発注 |
| `clinic-doc-export` | 診療所文書出口 | 診療所 |
| `paper-form-kit` | 紙帳票デジタル入力キット | 横断 |

## 設計意図

- 暖かなニュートラル色と深緑を基調に、余白・罫線・タイポグラフィで整理する。背景 `#f7f7f2`、面 `#fff`、文字 `#26372f`、補助 `#68756c`、罫線 `#e0e5dc`、アクセント `#305f4b`。
- ポータルはコレクションとして見渡せる構成、各モックは実作業に集中できる構成にする。業界別のレイアウト（受信箱、帳票、シフト、運行、点検など）を用意する。
- 共有スタイルは `src/gallery.css`、操作プリミティブは `src/index.css`、業務別スタイルは `src/mocks/*-workflows.css`。小さい画面は1列にし、広い表だけを枠内でスクロール可能にする。
- タップ領域は 44px 以上。ラベルは短く、業界名は省略しない（物流・運送、B2B・受発注など）。
- AIは必須にしない。使う画面でも分類候補やOCRは下書き表示だけで、確定は人が行う。
- 目指す粒度は Excel 級、紙を同じ見た目のままデジタルにする級。重い業務システムにはしない。
- どの画面でも、追加・確定・タグの切り替えでトースト、状態の変化、行の追加が起きる。保存先はメモリのみ。

## GitHub Pages

公開URL: https://dhythm.github.io/mock-gallery/

`main` への push で `.github/workflows/pages.yml` が `pnpm install --frozen-lockfile` と `pnpm build` を実行し、`dist` を GitHub Pages にデプロイします。Vite の `base` と React Router の basename は `/mock-gallery/` です。深いリンク用に、ビルドの最後で `dist/index.html` を `dist/404.html` に複製します。`public/404.html` は、その複製が無いときの SPA フォールバックです。

Settings → Pages のソースは GitHub Actions にしてください。シークレットは不要です。

## 検証

```bash
pnpm check
```

型チェック・本番ビルド・lint・カタログ整合性・コンポーネント状態テストを実行します。
`qa-gallery-interactions.mjs` は実際のTSXハンドラを小さなフックアダプターで実行するテストで、ブラウザの描画・Reactの再調整・フォーカス・ネイティブフォーム検証は検証しません。

ブラウザでの最終確認は `scripts/qa-gallery-plan.md` を参照してください。今回の実行結果と制約は `scripts/qa-gallery-report.md` に記載します。
