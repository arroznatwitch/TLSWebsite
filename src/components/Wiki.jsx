import { useState, useEffect } from "react";
import { t } from "../textos";
import data from "../data/wiki.json";

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|ico)$/i;

function normalizeIconPath(icon) {
  let path = icon.replace(/\\/g, "/").replace(/^\.?\//, "/");
  path = path.replace(/^\/?public\//i, "/");
  if (!path.startsWith("/")) path = `/${path}`;
  return path;
}

function WikiIcon({ icon, className }) {
  const raw = (icon || "").trim();
  const isUrl = /^https?:\/\//i.test(raw);
  const isImage = !!raw && (isUrl || IMAGE_EXT.test(raw));
  const src = isImage ? (isUrl ? raw : normalizeIconPath(raw)) : null;

  // Usa a mesma lógica do craft: se a textura falhar, repete uma vez a ignorar
  // a cache. O hook tem de ser chamado sempre, mesmo quando é um emoji.
  const tex = useTexture(src);

  if (!icon) return null;
  if (!isImage) return <span className={className} aria-hidden="true">{icon}</span>;
  if (tex.status !== "ok") return <span className={className} aria-hidden="true" />;

  // Texturas pequenas (ícones do Minecraft) ficariam desfocadas ao ser
  // ampliadas — nesses casos usa-se renderização "pixelated".
  const pixelated = tex.width > 0 && tex.width <= 64;
  return (
    <img
      src={tex.url}
      alt=""
      className={`wiki-icon-img ${pixelated ? "is-pixelated" : ""} ${className}`}
    />
  );
}
function useTexture(src) {
  const [state, setState] = useState({ status: "loading", url: src, width: 0 });

  useEffect(() => {
    if (!src) { setState({ status: "fail", url: null, width: 0 }); return; }
    let cancelled = false;

    const attempt = (url, isRetry) => {
      const img = new Image();
      img.onload = () => {
        if (!cancelled) setState({ status: "ok", url, width: img.naturalWidth });
      };
      img.onerror = () => {
        if (cancelled) return;
        if (isRetry) setState({ status: "fail", url: null, width: 0 });
        else attempt(`${src}${src.includes("?") ? "&" : "?"}reload=1`, true);
      };
      img.src = url;
    };

    setState({ status: "loading", url: src, width: 0 });
    attempt(src, false);
    return () => { cancelled = true; };
  }, [src]);

  return state;
}
function CraftSlot({ ing, className = "" }) {
  const tex = useTexture(ing?.icon);
  if (!ing) return <span className={`craft-slot ${className}`} />;

  let content;
  if (tex.status === "fail") {
    content = (
      <span className="craft-swatch" style={{ background: ing.color || "#6f6f6f" }}>
        {ing.short || ""}
      </span>
    );
  } else if (tex.status === "loading") {
    content = null;
  } else if (ing.block) {
    content = (
      <span className="mc-cube" style={{ "--tex": `url("${tex.url}")` }} aria-hidden="true">
        <span className="cube-face cube-top" />
        <span className="cube-face cube-front" />
        <span className="cube-face cube-side" />
      </span>
    );
  } else {
    content = <img src={tex.url} alt={ing.name || ""} />;
  }

  return (
    <span className={`craft-slot filled ${className}`} title={ing.name}>
      {content}
    </span>
  );
}

// Grelha de craft 3x3, como na mesa de trabalho do Minecraft.
// "shape" são 3 linhas de 3 caracteres; cada letra remete para "keys".
function WikiCraft({ craft, result }) {
  const shape = craft?.shape || [];
  return (
    <div className="mc-craft" aria-label="Receita">
      <div className="craft-grid">
        {[0, 1, 2].map(row =>
          [0, 1, 2].map(col => {
            const ch = shape[row]?.[col] ?? " ";
            const ing = ch === " " ? null : craft?.keys?.[ch];
            return <CraftSlot key={`${row}-${col}`} ing={ing} />;
          })
        )}
      </div>
      <span className="craft-arrow" aria-hidden="true">➜</span>
      <CraftSlot ing={result} className="craft-result" />
    </div>
  );
}

// Cada entrada de "body" pode ser:
//  • uma string  -> parágrafo normal (o \n é respeitado, útil para listas)
//  • um objeto   -> { "type": "table", "headers": [...], "rows": [[...], ...] }
//                -> { "type": "items", "items": [{ icon, name, recipe, craft, text }] }
function WikiBlock({ block }) {
  if (typeof block === "string") {
    return <p className="wiki-para">{block}</p>;
  }
  if (block?.type === "items") {
    return (
      <div className="wiki-items">
        {(block.items || []).map((it, i) => (
          <div key={i} className="wiki-item">
            <WikiIcon icon={it.icon} className="wiki-item-icon" />
            <div className="wiki-item-body">
              <p className="wiki-item-name">{it.name}</p>
              {/* Sem grelha de craft (ex.: itens que são dados ao entrar),
                  mostra-se a nota em texto. */}
              {!it.craft && it.recipe && <p className="wiki-item-recipe">{it.recipe}</p>}
              {it.text && <p className="wiki-item-text">{it.text}</p>}
              {it.effectsNote && <p className="wiki-effects-note">{it.effectsNote}</p>}
              {it.effects?.length > 0 && (
                <div className="wiki-effects">
                  {it.effects.map((ef, k) => (
                    <span key={k} className="wiki-effect" title={ef.name}>
                      <CraftSlot ing={{ icon: ef.icon, name: ef.name, color: "#6f6f6f" }} className="effect-icon" />
                      <span className="wiki-effect-name">{ef.name}</span>
                      {ef.detail && <span className="wiki-effect-detail">{ef.detail}</span>}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {it.craft && (
              <WikiCraft craft={it.craft} result={{ icon: it.icon, name: it.name }} />
            )}
          </div>
        ))}
      </div>
    );
  }
  if (block?.type === "table") {
    return (
      <div className="wiki-table-wrap">
        <table className="wiki-table">
          {block.headers?.length > 0 && (
            <thead>
              <tr>{block.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
            </thead>
          )}
          <tbody>
            {(block.rows || []).map((row, i) => (
              <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

export default function Wiki() {
  const articles = data.articles || [];
  const [openId, setOpenId] = useState(articles[0]?.id ?? null);

  if (articles.length === 0) {
    return <p className="wp-empty">{t("wikiEmpty")}</p>;
  }

  const pick = (field) => field?.pt ?? "";

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
              <WikiIcon icon={a.icon} className="wiki-nav-icon" />
              <span>{pick(a.title)}</span>
            </button>
          ))}
        </nav>

        <article className="wiki-content">
          {/* A key faz o React remontar ao trocar de artigo, o que reinicia
              a animação de entrada. */}
          {articles.filter(a => a.id === openId).map(a => (
            <div key={a.id} className="wiki-article">
              <h3 className="wiki-article-title">
                <WikiIcon icon={a.icon} className="wiki-title-icon" />
                {pick(a.title)}
              </h3>
              {(pick(a.body) || []).map((block, i) => <WikiBlock key={i} block={block} />)}
            </div>
          ))}
        </article>
      </div>
    </div>
  );
}
