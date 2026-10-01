import type { CatalogItem } from "../data/catalog.ts";
import { presentations } from "../data/presentation.ts";
import { Icon } from "./Icon.tsx";

/** Lightweight illustrations of each workflow, never nested interactive controls. */
export function DemoPreview({ item, featured = false }: { item: CatalogItem; featured?: boolean }) {
  const { kind, label, rows } = presentations[item.slug];
  return (
    <div className={`demo-preview preview-${kind}${featured ? " is-featured" : ""}`} data-industry={item.industry} aria-hidden="true">
      <div className="mini-window">
        <div className="mini-top"><span className="mini-brand" /><strong>{label}</strong><span className="mini-dots">···</span></div>
        <div className="mini-content">
          {kind === "board" ? <div className="mini-board">{rows.map((row, i) => <div key={row}><span className="mini-column-label">{["未処理", "進行中", "完了"][i]}</span><div className="mini-ticket"><span className="mini-tag" />{row}<i /><i /></div>{i === 0 && <div className="mini-ticket mini-ticket-short"><i /><i /></div>}</div>)}</div>
          : kind === "schedule" ? <><div className="mini-week"><b>週間シフト</b><span>月　火　水　木　金</span></div><div className="mini-schedule">{rows.map((row, i) => <div key={row}><span>{row}</span>{[0, 1, 2, 3, 4].map(n => <i key={n} className={(n + i) % 4 === 0 ? "is-empty" : ""}>{(n + i) % 4 === 0 ? "休" : "勤務"}</i>)}</div>)}</div></>
          : kind === "document" ? <div className="mini-document"><div className="mini-doc-side"><Icon name="file" size={24} /><span>PDF</span><i /><i /></div><div className="mini-doc-sheet"><b>{label}</b>{rows.map(row => <div key={row}><span>{row}</span><i /></div>)}<span className="mini-seal">確認</span></div></div>
          : kind === "route" ? <div className="mini-route">{rows.map((row, i) => <div key={row}><span className="mini-time">{["08:30", "09:15", "11:00"][i]}</span><i /><span>{row}<small>{["記録済", "作業中", "確認待ち"][i]}</small></span></div>)}</div>
          : kind === "table" ? <div className="mini-table"><div className="mini-table-head"><span>項目</span><span>ステータス</span></div>{rows.map((row, i) => <div key={row}><span>{row}</span><span className={`mini-status status-${i}`}>{["確認待ち", "進行中", "完了"][i]}</span></div>)}</div>
          : <div className="mini-report"><div className="mini-fields"><b>{rows[0]}</b><div className="mini-field-pair"><span>天候 <strong>晴</strong></span><span>人員 <strong>18 名</strong></span></div><div className="mini-textarea">{rows[1]}<i /><i /></div><div className="mini-button">記録を確定 <Icon name="arrow" size={10} /></div></div><div className="mini-report-side"><span className="mini-metric">{item.industry === "不動産" ? "96.8" : "3 / 4"}<small>{item.industry === "不動産" ? "入居率 %" : "確認済み"}</small></span><span className="mini-check"><Icon name="check" size={10} />{rows[2]}</span><div className="mini-photo"><Icon name="image" size={24} /></div></div></div>}
        </div>
      </div>
    </div>
  );
}
