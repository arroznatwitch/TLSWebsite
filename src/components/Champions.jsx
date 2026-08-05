import { useLang } from "../hooks/useLang";
import McHead from "./McHead";
import { StreamLink } from "./StreamIcon";

const medals = ["🥇","🥈","🥉"];

// Ordem do pódio a partir das tags do jogador (winner / second / third).
// As tags são a fonte principal porque são explícitas e por jogador; o array
// "podium" do seasons.json serve de reserva para épocas antigas.
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
  // Épocas por equipas: o pódio guarda os nomes das equipas.
  return (season.podium || [])
    .map(name => (season.teams || []).find(tm => tm.name === name))
    .filter(Boolean);
}

export default function Champions({ seasons }) {
  const { t } = useLang();

  // Só mostra épocas que já tenham pódio definido.
  const withPodium = (seasons || [])
    .map(s => ({ season: s, podium: getPodium(s) }))
    .filter(x => x.podium.length > 0)
    .reverse(); // mais recente primeiro

  return (
    <div className="champions">
      <div className="champ-head">
        <h2 className="champ-title">{t("champions")}</h2>
        <p className="champ-sub">{t("championsSub")}</p>
      </div>

      {withPodium.length === 0 && <p className="wp-empty">{t("championsEmpty")}</p>}

      {withPodium.map(({ season, podium }) => (
        <div key={season.id} className="champ-season">
          <p className="champ-season-label">{season.label}</p>
          <div className="champ-podium">
            {podium.map((entry, i) => (
              <div key={entry.nick || entry.name} className={`champ-card champ-${i + 1}`}>
                <span className="champ-medal">{medals[i]}</span>

                {season.type === "solo" ? (
                  <div className="champ-player">
                    <McHead nick={entry.nick} uuid={entry.uuid} size={32} className="mc-head" />
                    <span className="champ-nick">{entry.nick}</span>
                    <StreamLink channel={entry.twitch} size={14} />
                  </div>
                ) : (
                  <div className="champ-team">
                    <div className="champ-team-top">
                      <img src={entry.icon} alt="" className="team-icon-img" loading="lazy" />
                      <span className="champ-nick">{entry.nameKey ? t(entry.nameKey) : entry.name}</span>
                    </div>
                    <div className="champ-team-members">
                      {(entry.players || []).map(p => (
                        <div key={p.nick} className="champ-member">
                          <McHead nick={p.nick} uuid={p.uuid} size={24} className="mc-head-sm" />
                          <span className="champ-member-nick">{p.nick}</span>
                          <StreamLink channel={p.twitch} size={12} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
