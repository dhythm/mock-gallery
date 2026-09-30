import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { industryOrder, mockCatalog } from "../data/catalog.ts";
import type { Industry } from "../data/catalog.ts";
import { IndustryPill } from "../components/IndustryPill.tsx";

type Filter = Industry | "すべて";

export function PortalPage() {
  const [industry, setIndustry] = useState<Filter>("すべて");

  useEffect(() => {
    document.title = "現場モック集";
  }, []);

  const visible =
    industry === "すべて"
      ? mockCatalog
      : mockCatalog.filter((item) => item.industry === industry);

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <div>
            <h1>現場モック集</h1>
            <p className="lead">
              紙・Excel・FAXの作業を、現場の画面として触れるモックです。データはこのブラウザの中だけにあります。
            </p>
          </div>
          <span className="mock-badge">22モック</span>
        </div>
      </header>
      <main className="shell">
        <div className="filter-row">
          <span className="filter-label" id="industry-filter">
            業界
          </span>
          <div className="filters" role="group" aria-labelledby="industry-filter">
            <button
              type="button"
              className="chip"
              aria-pressed={industry === "すべて"}
              onClick={() => setIndustry("すべて")}
            >
              すべて
            </button>
            {industryOrder.map((item) => (
              <button
                key={item}
                type="button"
                className="chip"
                data-industry={item}
                aria-pressed={industry === item}
                onClick={() => setIndustry(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <p className="count">
          {industry === "すべて" ? `${visible.length}件` : `${industry} ${visible.length}件`}
        </p>

        <div className="cards">
          {visible.map((item) => (
            <Link
              key={item.slug}
              className="card"
              data-industry={item.industry}
              to={`/mocks/${item.slug}`}
            >
              <h2>{item.title}</h2>
              <IndustryPill industry={item.industry} />
              <p className="card-problem">{item.problem}</p>
              <p className="card-summary">{item.mvpSummary}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
