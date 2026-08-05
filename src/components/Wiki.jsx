import { useState } from "react";
import { useLang } from "../hooks/useLang";
import data from "../data/wiki.json";

// Wiki do TLS. O conteúdo vem de src/data/wiki.json, com título e corpo em
// PT/EN/ES. Cada parágrafo é uma entrada do array "body" — quebras de linha
// dentro do texto são respeitadas (útil para listas).
export default function Wiki() {
  const { t, lang } = useLang();
  const articles = data.articles || [];
  const [openId, setOpenId] = useState(articles[0]?.id ?? null);

  if (articles.length === 0) {
    return <p className="wp-empty">{t("wikiEmpty")}</p>;
  }

  const pick = (field) => field?.[lang] ?? field?.en ?? field?.pt ?? "";

  return (
    <div className="wiki">
      <div className="wiki-head">
        <h2 className="wiki-title">{t("wiki")}</h2>
        <p className="wiki-sub">{t("wikiSub")}</p>
      </div>

      <div className="wiki-layout">
        <nav className="wiki-nav">
          {articles.map(a => (
            <button
              key={a.id}
              className={`wiki-nav-item ${a.id === openId ? "active" : ""}`}
              onClick={() => setOpenId(a.id)}
            >
              <span className="wiki-nav-icon" aria-hidden="true">{a.icon}</span>
              <span>{pick(a.title)}</span>
            </button>
          ))}
        </nav>

        <article className="wiki-content">
          {articles.filter(a => a.id === openId).map(a => (
            <div key={a.id}>
              <h3 className="wiki-article-title">
                <span aria-hidden="true">{a.icon}</span> {pick(a.title)}
              </h3>
              {(pick(a.body) || []).map((para, i) => (
                <p key={i} className="wiki-para">{para}</p>
              ))}
            </div>
          ))}
        </article>
      </div>
    </div>
  );
}
