import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IndustryPill } from "../components/IndustryPill.tsx";
import { Brand } from "../components/Brand.tsx";
import { Icon } from "../components/Icon.tsx";
import { findMock, mockCatalog } from "../data/catalog.ts";
import { industryIcons, presentations } from "../data/presentation.ts";
import { mockViews } from "../mocks/registry.ts";

export function MockPage() {
  const { slug } = useParams();
  const meta = findMock(slug);
  useEffect(() => { document.title = meta ? `${meta.title}｜現場モック集` : "画面が見つかりません｜現場モック集"; }, [meta]);
  if (!meta) return <main className="shell not-found"><Brand /><span className="eyebrow">404 / NOT FOUND</span><h1>このモックは見つかりませんでした</h1><p className="hint">一覧から、試してみたい画面を選んでください。</p><Link className="hero-cta" to="/">モック一覧へ <Icon name="arrow" /></Link></main>;
  const View = mockViews[meta.slug];
  const index = mockCatalog.indexOf(meta);
  const siblings = mockCatalog.filter(item => item.industry === meta.industry);
  const next = mockCatalog[(index + 1) % mockCatalog.length];
  const presentation = presentations[meta.slug];
  return (
    <div className="detail-page" data-industry={meta.industry}>
      <a className="skip-link" href="#workspace">操作エリアへ移動</a>
      <header className="workspace-topbar"><Brand /><Link className="back" to="/"><span aria-hidden="true">←</span> モック一覧</Link><span className="demo-status"><i />インタラクティブデモ</span></header>
      <div className="workspace-layout">
        <aside className="workspace-sidebar"><Link className="sidebar-home" to="/"><Icon name="grid" size={18} />コレクション</Link><div className="sidebar-industry"><Icon name={industryIcons[meta.industry]} size={23} /><strong>{meta.industry}</strong><small>{siblings.length} MOCKS</small></div><nav aria-label={`${meta.industry}のモック`}>{siblings.map(item => <Link key={item.slug} to={`/mocks/${item.slug}`} className={item.slug === meta.slug ? "is-current" : ""} aria-current={item.slug === meta.slug ? "page" : undefined}><span>{presentations[item.slug].label}</span><Icon name="chevron" size={15} /></Link>)}</nav><div className="workspace-help"><span className="eyebrow">HOW TO TRY</span><ol>{presentation.steps.map(step => <li key={step}>{step}</li>)}</ol><p>入力やボタンを自由にお試しください。外部への送信はありません。</p></div><span className="sidebar-edition">GENBA COLLECTION<br />MOCK {String(index + 1).padStart(2, "0")} / 22</span></aside>
        <main className="workspace-main">
          <div className="detail-heading"><div className="detail-breadcrumb"><IndustryPill industry={meta.industry} /><span>MOCK {String(index + 1).padStart(2, "0")}</span><span className="local-only">ブラウザ内で動作</span></div><h1 className="detail-title">{meta.title}</h1><p className="detail-summary">{meta.mvpSummary}</p><details className="concept-details"><summary>このモックについて <Icon name="chevron" size={15} /></summary><dl className="meta"><div><dt>解決したい課題</dt><dd>{meta.problem}</dd></div><div><dt>なぜ今</dt><dd>{meta.whyNow}</dd></div><div><dt>AIの役割</dt><dd>{meta.aiRole}</dd></div></dl></details></div>
          <section className="workspace-frame" aria-label="操作できるデモ"><div className="workspace-toolbar"><div><span className="workspace-industry-icon"><Icon name={industryIcons[meta.industry]} size={18} /></span><strong>{presentation.label}</strong></div><span><i />DEMO WORKSPACE</span></div><div className="mock-body" id="workspace" data-industry={meta.industry} data-slug={meta.slug} aria-label="モック本体"><View key={meta.slug} /></div></section>
          <footer className="mock-foot"><span><Icon name="check" size={16} />これはモックです。本番接続なし・保存先はメモリのみ</span><span>再読み込みでリセットされます</span></footer>
          <nav className="demo-next" aria-label="コレクションの移動"><Link to="/">← すべてのモック</Link><Link to={`/mocks/${next.slug}`}><span><small>次のモック</small>{next.title}</span><Icon name="arrow" /></Link></nav>
        </main>
      </div>
    </div>
  );
}
