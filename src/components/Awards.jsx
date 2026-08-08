import { useLang } from "../hooks/useLang";
import McHead from "./McHead";
import { StreamLink } from "./StreamIcon";
import awardsData from "../data/awards.json";

// Ícone e chave de tradução de cada tipo de prémio.
const AWARD_TYPES = {
  mvp:          { icon: "🏆", labelKey: "awardMvp" },
  revelation:   { icon: "✨", labelKey: "awardRevelation" },
  fanFavourite: { icon: "❤️", labelKey: "awardFanFavourite" },
};

// Procura o jogador em todas as épocas (solo e equipas) para reaproveitar o
// uuid e o link da plataforma que já estão no seasons.json — assim os prémios
// não duplicam dados.
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

export default function Awards({ seasons }) {
  const { t } = useLang();

  // Junta cada edição de prémios com a época correspondente, mais recente
  // primeiro, e ignora prémios que ainda não tenham vencedor definido.
  const editions = (awardsData.editions || [])
    .map(ed => ({
      ...ed,
      season: (seasons || []).find(s => s.id === ed.seasonId),
      awards: (ed.awards || []).filter(a => a.nick && AWARD_TYPES[a.type]),
    }))
    .filter(ed => ed.season && ed.awards.length > 0)
    .reverse();

  return (
    <div className="awards">
      <div className="aw-head">
        <h2 className="aw-title">{t("awards")}</h2>
        <p className="aw-sub">{t("awardsSub")}</p>
      </div>

      {editions.length === 0 && <p className="wp-empty">{t("awardsEmpty")}</p>}

      {editions.map(ed => (
        <div key={ed.seasonId} className="aw-season">
          <p className="aw-season-label">{ed.season.label}</p>
          <div className="aw-grid">
            {ed.awards.map(a => {
              const meta = AWARD_TYPES[a.type];
              const player = findPlayer(seasons, a.nick);
              return (
                <div key={`${a.type}-${a.nick}`} className={`aw-card aw-${a.type}`}>
                  <div className="aw-card-top">
                    <span className="aw-icon" aria-hidden="true">{meta.icon}</span>
                    <span className="aw-label">{t(meta.labelKey)}</span>
                  </div>
                  <div className="aw-winner">
                    <McHead nick={a.nick} uuid={player?.uuid} size={32} className="mc-head" />
                    <span className="aw-nick">{a.nick}</span>
                    <StreamLink channel={player?.twitch} size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
