import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { IndustryPill } from "../components/IndustryPill.tsx";
import { findMock } from "../data/catalog.ts";
import { mockViews } from "../mocks/registry.ts";

export function MockPage() {
  const { slug } = useParams();
  const meta = findMock(slug);

  useEffect(() => {
    document.title = meta ? `${meta.title}｜現場モック集` : "現場モック集";
  }, [meta]);

  if (!meta) {
    return (
      <main className="shell">
        <Link className="back" to="/">
          <span aria-hidden="true">← </span>戻る
        </Link>
        <h1 className="detail-title">モックがありません</h1>
        <p className="hint">一覧から選んでください。</p>
      </main>
    );
  }

  const View = mockViews[meta.slug];

  return (
    <main className="shell">
      <Link className="back" to="/">
        <span aria-hidden="true">← </span>戻る
      </Link>
      <h1 className="detail-title">{meta.title}</h1>
      <dl className="meta">
        <div>
          <dt>業界</dt>
          <dd>
            <IndustryPill industry={meta.industry} />
          </dd>
        </div>
        <div>
          <dt>課題</dt>
          <dd>{meta.problem}</dd>
        </div>
        <div>
          <dt>なぜ今</dt>
          <dd>{meta.whyNow}</dd>
        </div>
        <div>
          <dt>AIの役割</dt>
          <dd>{meta.aiRole}</dd>
        </div>
      </dl>
      <section className="mock-body" aria-label="モック本体">
        <View />
      </section>
      <p className="mock-foot">これはモックです／本番接続なし</p>
    </main>
  );
}
