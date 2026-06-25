import { useState, useMemo } from "react";
import { useLang } from "../hooks/useLang";

// Domínio(s) pai exigidos pelo embed da Twitch.
// Funciona em localhost, GitHub Pages e domínio próprio.
function getParents() {
  const hosts = new Set();
  if (typeof window !== "undefined" && window.location?.hostname) {
    hosts.add(window.location.hostname);
  }
  hosts.add("localhost");
  hosts.add("arroznatwitch.github.io");
  hosts.add("playthelastsurvivor.com");
  hosts.add("www.playthelastsurvivor.com");
  return [...hosts];
}

// Extrai o canal/handle a partir do link guardado no seasons.json
function parseStream(twitch) {
  if (!twitch) return null;
  const clean = twitch.replace(/^https?:\/\//, "").replace(/\/+$/, "");

  if (clean.includes("youtube.com") || clean.includes("youtu.be")) {
    // youtube.com/@Handle  -> embed do canal ao vivo
    const m = clean.match(/@([^/?]+)/);
    return { type: "youtube", id: m ? m[1] : null, url: `https://${clean}` };
  }
  // twitch.tv/canal
  const m = clean.match(/twitch\.tv\/([^/?]+)/i);
  return { type: "twitch", id: m ? m[1] : null, url: `https://${clean}` };
}

function StreamFrame({ stream }) {
  const parents = useMemo(() => getParents(), []);
  if (!stream?.id) return null;

  if (stream.type === "twitch") {
    const parentParams = parents.map(p => `parent=${p}`).join("&");
    const src = `https://player.twitch.tv/?channel=${stream.id}&${parentParams}&muted=true&autoplay=false`;
    return (
      <iframe
        title={stream.id}
        src={src}
        allowFullScreen
        frameBorder="0"
        scrolling="no"
      />
    );
  }

  // YouTube: embed do live stream do canal através do handle
  const src = `https://www.youtube.com/embed/live_stream?channel=&user=${stream.id}`;
  // Fallback fiável: abrir o canal ao vivo num iframe via query do handle
  const ytSrc = `https://www.youtube.com/embed?listType=user_uploads&list=${stream.id}`;
  return (
    <iframe
      title={stream.id}
      src={ytSrc || src}
      allowFullScreen
      frameBorder="0"
      allow="autoplay; encrypted-media"
    />
  );
}

export default function WatchParty({ season }) {
  const { t } = useLang();

  // Junta jogadores + casters, sem duplicados (por nick)
  const streamers = useMemo(() => {
    const all = [...(season?.players || []), ...(season?.casters || [])];
    const seen = new Set();
    return all.filter(p => {
      const key = (p.nick || "").toLowerCase();
      if (!p.twitch || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(p => ({ ...p, stream: parseStream(p.twitch) }));
  }, [season]);

  const [active, setActive] = useState(streamers[0]?.nick || null);
  const activeStreamer = streamers.find(s => s.nick === active) || streamers[0];

  if (streamers.length === 0) {
    return <p className="wp-empty">{t("wpEmpty")}</p>;
  }

  return (
    <div className="wp">
      <div className="wp-head">
        <h2 className="wp-title">{t("watchParty")}</h2>
        <p className="wp-sub">{t("wpSub")}</p>
      </div>

      {/* Player principal grande */}
      <div className="wp-main">
        <div className="wp-main-frame">
          <StreamFrame stream={activeStreamer?.stream} />
        </div>
        <div className="wp-main-info">
          <img
            src={`https://mc-heads.net/avatar/${activeStreamer?.nick}/32`}
            alt={activeStreamer?.nick}
            className="mc-head"
            loading="lazy"
          />
          <span className="wp-main-nick">{activeStreamer?.nick}</span>
          <a
            href={activeStreamer?.stream?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="wp-open"
          >
            {t("wpOpenChannel")}
          </a>
        </div>
      </div>

      {/* Grelha com todos os POVs em simultâneo */}
      <p className="wp-grid-label">{t("wpAllPovs")}</p>
      <div className="wp-grid">
        {streamers.map(s => (
          <button
            key={s.nick}
            className={`wp-cell ${s.nick === active ? "active" : ""}`}
            onClick={() => setActive(s.nick)}
          >
            <div className="wp-cell-frame">
              <StreamFrame stream={s.stream} />
              <span className="wp-cell-overlay" aria-hidden="true" />
            </div>
            <div className="wp-cell-info">
              <img
                src={`https://mc-heads.net/avatar/${s.nick}/32`}
                alt={s.nick}
                className="mc-head-sm"
                loading="lazy"
              />
              <span className="wp-cell-nick">{s.nick}</span>
            </div>
          </button>
        ))}
      </div>

      <p className="wp-note">{t("wpNote")}</p>
    </div>
  );
}