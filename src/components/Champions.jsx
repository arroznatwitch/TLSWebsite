import { t } from "../textos";
import McHead from "./McHead";
import { StreamLink } from "./StreamIcon";

const medals = ["🥇","🥈","🥉"];
const PODIUM_TAGS = { winner: 0, second: 1, third: 2 };

function getPodium(season) {
  if (season.type === "solo") {
    const players = season.players || [];
    const byTag = [];
    for (const p of players) {
      const idx = PODIUM_TAGS[p.tag?.type];
      if (idx !== undefined && !byTag[idx]) byTag[idx] = p;
    }
    if (byTag.filter(Boolean).length > 0) return byTag.filter(Boolean);
    return (season.podium || [])
      .map(nick => players.find(p => p.nick === nick))
      .filter(Boolean);
  }
  return (season.podium || [])
    .map(name => (season.teams || []).find(tm => tm.name === name))
    .filter(Boolean);
}

const PLACES = ["1.º lugar", "2.º lugar", "3.º lugar"];

export default function Champions({ seasons, embedded = false }) {
  const withPodium = (seasons || [])
    .map(s => ({ season: s, podium: getPodium(s) }))
    .filter(x => x.podium.length > 0)
    .reverse(); // mais recente primeiro

  return (
    <div className="champions">
      {!embedded && (
        <div className="champ-head">
          <h2 className="champ-title">{t("champions")}</h2>
          <p className="champ-sub">{t("championsSub")}</p>
        </div>
      )}

      {withPodium.length === 0 && <p className="wp-empty">{t("championsEmpty")}</p>}

      {/* Mesmo desenho dos Recordes: um cartão por edição, uma linha por lugar */}
      <div className="records">
        {withPodium.map(({ season, podium }) => (
          <section key={season.id} className="rec-card">
            <header className="rec-head">
              <span className="rec-icon"><img src="/icons/teams/tls.png" alt="" /></span>
              <h3 className="rec-title">{season.label}</h3>
              <span className="rec-season champ-type">
                {season.type === "solo" ? "Solo" : "Equipas"}
              </span>
            </header>
            <div className="rec-rows">
              {podium.map((entry, i) => (
                <div key={entry.nick || entry.name} className={`rec-row aw-row champ-row champ-row-${i + 1}`}>
                  <span className="aw-row-label">
                    <span className="aw-row-icon" aria-hidden="true">{medals[i]}</span>
                    {PLACES[i]}
                  </span>

                  {season.type === "solo" ? (
                    <>
                      <span className="rec-holder">
                        <McHead nick={entry.nick} uuid={entry.uuid} size={24} className="mc-head-sm" />
                        <span className="rec-nick">{entry.nick}</span>
                      </span>
                      <span className="aw-row-link"><StreamLink channel={entry.twitch} size={14} /></span>
                    </>
                  ) : (
                    <>
                      <span className="rec-holder">
                        <img src={entry.icon} alt="" className="team-icon-img" />
                        <span className="rec-nick">{entry.nameKey ? t(entry.nameKey) : entry.name}</span>
                        <span className="rec-tied"
                          title={(entry.players || []).map(p => p.nick).join(", ")}>
                          {(entry.players || []).map(p => (
                            <McHead key={p.nick} nick={p.nick} uuid={p.uuid} size={18}
                              className="rec-tied-head" alt={p.nick} />
                          ))}
                        </span>
                      </span>
                      <span className="aw-row-link" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
