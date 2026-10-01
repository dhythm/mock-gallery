import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { industryOrder, mockCatalog } from "../data/catalog.ts";
import type { Industry } from "../data/catalog.ts";
import { industryIcons, presentations } from "../data/presentation.ts";
import { IndustryPill } from "../components/IndustryPill.tsx";
import { Brand } from "../components/Brand.tsx";
import { Icon } from "../components/Icon.tsx";
import { DemoPreview } from "../components/DemoPreview.tsx";

type Filter = Industry | "すべて";
export function PortalPage() {
  const [params, setParams] = useSearchParams();
  const rawIndustry = params.get("industry");
  const industry: Filter = industryOrder.includes(rawIndustry as Industry) ? rawIndustry as Industry : "すべて";
  const query = params.get("q") ?? "";
  useEffect(() => { document.title = "現場モック集｜仕事の、ひとつ先を試す。"; }, []);
  const visible = mockCatalog.filter(item => (industry === "すべて" || item.industry === industry) && `${item.title} ${item.industry} ${item.problem} ${item.mvpSummary}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  function updateFilter(next: Filter) { const nextParams = new URLSearchParams(params); if (next === "すべて") nextParams.delete("industry"); else nextParams.set("industry", next); setParams(nextParams, { replace: true, preventScrollReset: true }); }
  const featured = mockCatalog[0];
  return (
    <div className="portal-page">
      <a className="skip-link" href="#catalog">モック一覧へ移動</a>
      <header className="site-header"><div className="site-header-inner"><Brand /><a className="header-link" href="#catalog">モックを探す <Icon name="arrow" size={16} /></a><span className="availability"><i />すべて、ブラウザで試せます</span></div></header>
      <main>
        <section className="portal-hero shell" aria-labelledby="hero-title">
          <div className="hero-copy"><p className="eyebrow"><span />現場から考える、小さなデジタル化</p><h1 id="hero-title">いつもの仕事に、<br /><span>ちょうどいい</span>仕組みを。</h1><p className="hero-description">紙も、Excelも、FAXも。<br />現場の「こうだったら」を、触れる画面にしました。</p><div className="hero-bottom"><a className="hero-cta" href="#catalog">22のモックを見てみる <Icon name="arrow" /></a><span className="hero-note">登録不要・本番接続なし</span></div></div>
          <Link className="hero-feature" to={`/mocks/${featured.slug}`} aria-label="現場日報＋写真＋安全点検のモックを試す"><div className="feature-kicker"><span>FEATURED MOCK</span><span>01 / 22</span></div><DemoPreview item={featured} featured /><div className="feature-caption"><div><span>まずは、ここから。</span><strong>現場の一日を、ひとつの画面に。</strong></div><span className="round-arrow"><Icon name="arrow" /></span></div></Link>
        </section>
        <div className="collection-band"><div className="shell"><span><b>22</b> 触れるモック</span><span><b>11</b> の業界</span><p><Icon name="check" size={16} />入力して、押して、変化を確かめる。</p></div></div>
        <section className="catalog-section shell" id="catalog" aria-labelledby="catalog-heading">
          <div className="catalog-heading"><div><p className="eyebrow">THE COLLECTION</p><h2 id="catalog-heading">現場に合う、画面を探す。</h2></div><label className="catalog-search"><Icon name="search" size={19} /><span className="sr-only">モックを検索</span><input type="search" placeholder="キーワードで探す" value={query} onChange={event => { const next = new URLSearchParams(params); if (event.target.value) next.set("q", event.target.value); else next.delete("q"); setParams(next, { replace: true, preventScrollReset: true }); }} /></label></div>
          <div className="catalog-layout"><aside className="catalog-sidebar"><span className="filter-label" id="industry-filter">業界から探す</span><div className="filters" role="group" aria-labelledby="industry-filter"><button type="button" className="chip" aria-pressed={industry === "すべて"} onClick={() => updateFilter("すべて")}><Icon name="grid" size={18} /><span>すべて</span><small>22</small></button>{industryOrder.map(item => <button key={item} type="button" className="chip" data-industry={item} aria-pressed={industry === item} onClick={() => updateFilter(item)}><Icon name={industryIcons[item]} size={18} /><span>{item}</span><small>{mockCatalog.filter(mock => mock.industry === item).length}</small></button>)}</div><p className="sidebar-note"><Icon name="file" size={18} />小さく試す。<br />使い方が見えてくる。</p></aside>
          <div className="catalog-results"><div className="results-heading"><p aria-live="polite"><strong>{industry === "すべて" ? "すべてのモック" : industry}</strong><span>{visible.length} 件</span></p><span>クリックして操作できます <Icon name="arrow" size={15} /></span></div>
          <div className="cards">{visible.map(item => <Link key={item.slug} className="card" data-industry={item.industry} to={`/mocks/${item.slug}`}><DemoPreview item={item} /><div className="card-copy"><div className="card-meta"><IndustryPill industry={item.industry} /><span>No. {String(mockCatalog.indexOf(item) + 1).padStart(2, "0")}</span></div><h3>{item.title}</h3><p className="card-summary">{item.mvpSummary}</p><div className="card-bottom"><span>{presentations[item.slug].label}</span><span>試してみる <Icon name="arrow" size={17} /></span></div></div></Link>)}</div>
          {visible.length === 0 && <div className="empty-state"><Icon name="search" size={32} /><h3>一致するモックがありません</h3><p>別のキーワードや業界で探してみてください。</p><button className="btn primary" onClick={() => setParams({})}>条件をクリア</button></div>}
          </div></div>
        </section>
      </main>
      <footer className="portal-footer shell"><Brand /><p>データはブラウザのメモリの中だけ。<br />ページを再読み込みすると、最初の状態に戻ります。</p><span>BUILD SMALL. WORK BETTER.</span></footer>
    </div>
  );
}
