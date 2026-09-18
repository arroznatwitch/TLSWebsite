import { t } from "../textos";
import McHead from "./McHead";
import { StreamLink } from "./StreamIcon";
import awardsData from "../data/awards.json";

const AWARD_TYPES = {
  mvp:          { icon: "🏆", labelKey: "awardMvp" },
  revelation:   { icon: "✨", labelKey: "awardRevelation" },
  fanFavourite: { icon: "❤️", labelKey: "awardFanFavourite" },
};

function findPlayer(seasons, nick) {
  if (!nick) return null;
  const key = nick.toLowerCase();
  for (const season of seasons || []) {
    for (const p of season.players || []) {
      if ((p.nick || "").toLowerCase() === key) return p;
    }
    for (const team of season.teams || []) {
      for (const p of team.players || []) {
        if ((p.nick || "").toLowerCase() === key) return p;
      }
    }
    for (const c of season.casters || []) {
      if ((c.nick || "").toLowerCase() === key) return c;
    }
  }
  return null;
}

// "-" no awards.json quer dizer que o prémio não existiu nessa edição.
const isEmpty = nick => !nick || nick.trim() === "-";

export default function Awards({ seasons, embedded = false }) {
  const editions = (awardsData.editions || [])
    .map(ed => ({
      ...ed,
      season: (seasons || []).find(s => s.id === ed.seasonId),
      awards: (ed.awards || []).filter(a => AWARD_TYPES[a.type]),
    }))
    .filter(ed => ed.season && ed.awards.some(a => !isEmpty(a.nick)))
    .reverse();

  return (
    <div className="awards">
      {!embedded && (
        <div className="aw-head">
          <h2 className="aw-title">{t("awards")}</h2>
          <p className="aw-sub">{t("awardsSub")}</p>
        </div>
      )}

      {editions.length === 0 && <p className="wp-empty">{t("awardsEmpty")}</p>}

      {/* Mesmo desenho dos Recordes: um cartão por edição, uma linha por prémio */}
      <div className="records">
        {editions.map(ed => (
          <section key={ed.seasonId} className="rec-card">
            <header className="rec-head">
              <span className="rec-icon"><img src="/icons/teams/tls.png" alt="" /></span>
              <h3 className="rec-title">{ed.season.label}</h3>
            </header>
            <div className="rec-rows">
              {ed.awards.map(a => {
                const meta = AWARD_TYPES[a.type];
                const empty = isEmpty(a.nick);
                const player = empty ? null : findPlayer(seasons, a.nick);
                return (
                  <div key={a.type} className={`rec-row aw-row aw-${a.type}`}>
                    <span className="aw-row-label">
                      <span className="aw-row-icon" aria-hidden="true">{meta.icon}</span>
                      {t(meta.labelKey)}
                    </span>
                    <span className="rec-holder">
                      {empty ? (
                        <span className="rec-nobody">Não atribuído</span>
                      ) : (
                        <>
                          <McHead nick={a.nick} uuid={player?.uuid} size={24} className="mc-head-sm" />
                          <span className="rec-nick">{a.nick}</span>
                        </>
                      )}
                    </span>
                    <span className="aw-row-link">
                      {!empty && <StreamLink channel={player?.twitch} size={14} />}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
