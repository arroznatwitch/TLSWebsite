import { useState, useMemo } from "react";
import { useLang } from "../hooks/useLang";
import McHead from "./McHead";

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

function parseStream(twitch, youtubeChannelId) {
  if (!twitch) return null;
  const clean = twitch.replace(/^https?:\/\//, "").replace(/\/+$/, "");

  if (clean.includes("youtube.com") || clean.includes("youtu.be")) {
    const m = clean.match(/@([^/?]+)/);
    return { type: "youtube", id: m ? m[1] : null, channelId: youtubeChannelId || null, url: `https://${clean}` };
  }
  // twitch.tv/canal
  const m = clean.match(/twitch\.tv\/([^/?]+)/i);
  return { type: "twitch", id: m ? m[1] : null, url: `https://${clean}` };
}

function StreamFrame({ stream, muted }) {
  const parents = useMemo(() => getParents(), []);
  if (!stream?.id && !stream?.channelId) return null;

  if (stream.type === "twitch") {
    const parentParams = parents.map(p => `parent=${p}`).join("&");
    const src = `https://player.twitch.tv/?channel=${stream.id}&${parentParams}&autoplay=true&muted=${muted ? "true" : "false"}`;
    return (
      <iframe
        title={stream.id}
        src={src}
        allowFullScreen
        frameBorder="0"
        scrolling="no"
        allow="autoplay; fullscreen"
      />
    );
  }

  if (stream.channelId) {
    const src = `https://www.youtube.com/embed/live_stream?channel=${stream.channelId}&autoplay=1&mute=${muted ? 1 : 0}`;
    return (
      <iframe
        title={stream.id || stream.channelId}
        src={src}
        allowFullScreen
        frameBorder="0"
        allow="autoplay; encrypted-media; fullscreen"
      />
    );
  }

  return (
    <div className="wp-yt-fallback">
      <span className="wp-yt-badge">YouTube</span>
    </div>
  );
}

export default function WatchParty({ season }) {
  const { t } = useLang();

  const streamers = useMemo(() => {
    const all = [...(season?.players || []), ...(season?.casters || [])];
    const seen = new Set();
    return all.filter(p => {
      const key = (p.nick || "").toLowerCase();
      if (!p.twitch || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(p => ({ ...p, stream: parseStream(p.twitch, p.youtubeChannelId) }));
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

      {}
      <div className="wp-main">
        <div className="wp-main-frame">
          <StreamFrame key={`main-${activeStreamer?.nick}`} stream={activeStreamer?.stream} muted={false} />
        </div>
        <div className="wp-main-info">
          <McHead nick={activeStreamer?.nick} uuid={activeStreamer?.uuid} size={32} className="mc-head" />
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

      {}
      <p className="wp-grid-label">{t("wpAllPovs")}</p>
      <div className="wp-grid">
        {streamers.map(s => (
          <button
            key={s.nick}
            className={`wp-cell ${s.nick === active ? "active" : ""}`}
            onClick={() => setActive(s.nick)}
          >
            <div className="wp-cell-frame">
              {}
              <StreamFrame stream={s.stream} muted={true} />
              <span className="wp-cell-overlay" aria-hidden="true" />
            </div>
            <div className="wp-cell-info">
              <McHead nick={s.nick} uuid={s.uuid} size={32} className="mc-head-sm" />
              <span className="wp-cell-nick">{s.nick}</span>
            </div>
          </button>
        ))}
      </div>

      <p className="wp-note">{t("wpNote")}</p>
    </div>
  );
}
