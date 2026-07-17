import { useLang } from "../hooks/useLang";
import { SwordIcon, ArrowIcon, ClockIcon, GoldenAppleIcon, BarrierIcon } from "./McIcons";
import { StreamMini } from "./StreamIcon";
import PointsLegend from "./PointsLegend";
import McHead from "./McHead";
import { playerPoints, playerStats } from "../utils/points";

const medals = ["🥇","🥈","🥉"];

export default function AllTime({ seasons }) {
  const { t } = useLang();

  const playerMap = {};

  function ensure(nick, channel) {
    if (!playerMap[nick]) {
      playerMap[nick] = { nick, channel: null, points: 0, kills: 0, deaths: 0, assists: 0, timeLive: 0, revives: 0 };
    }
    if (channel) playerMap[nick].channel = channel;
  }

  for (const season of seasons) {
    const autoPoints = season.autoPoints === true;

    if (season.type === "solo") {
      for (const p of season.players) {
        ensure(p.nick, p.twitch);
        const pts = autoPoints ? playerPoints(p) : (p.points ?? 0);
        const s = playerStats(p);
        playerMap[p.nick].points   += pts;
        playerMap[p.nick].kills    += s.kills;
        playerMap[p.nick].deaths   += s.deaths;
        playerMap[p.nick].assists  += s.assists;
        playerMap[p.nick].timeLive += s.timeLive;
        playerMap[p.nick].revives  += s.revives;
      }
    } else {
      for (const team of season.teams) {
        const n = team.players.length;
        for (const p of team.players) {
          ensure(p.nick, p.twitch);
          const s = playerStats(p);
          const hasIndividual = p.kills !== undefined || Array.isArray(p.phases);

          const pts = autoPoints
            ? playerPoints(p)
            : Math.round((team.points ?? 0) / n);
          playerMap[p.nick].points   += pts;

          playerMap[p.nick].kills    += hasIndividual ? s.kills    : Math.round((team.kills    ?? 0) / n);
          playerMap[p.nick].deaths   += hasIndividual ? s.deaths   : Math.round((team.deaths  ?? 0) / n);
          playerMap[p.nick].assists  += hasIndividual ? s.assists  : Math.round((team.assists ?? 0) / n);
          playerMap[p.nick].timeLive += hasIndividual ? s.timeLive : 0; // só conta se tiver individual
          playerMap[p.nick].revives  += hasIndividual ? s.revives  : Math.round((team.revives ?? 0) / n);
        }
      }
    }
  }

  const rows = Object.values(playerMap).sort((a, b) => b.points - a.points);
  const grid = `40px 1fr 32px 70px repeat(5, 62px)`;

  return (
    <>
      <div className="lb-wrap">
        <div className="lb-head" style={{ gridTemplateColumns: grid }}>
          <span className="c-pos">#</span>
          <span className="c-name">{t("player")}</span>
          <span className="c-val"></span>
          <span className="c-val">{t("points")}</span>
          <span className="c-val col-icon"><SwordIcon       size={15} label={t("kills")}    /></span>
          <span className="c-val col-icon"><BarrierIcon     size={15} label={t("deaths")}   /></span>
          <span className="c-val col-icon"><ArrowIcon       size={15} label={t("assists")}  /></span>
          <span className="c-val col-icon"><ClockIcon       size={15} label={t("timeLive")} /></span>
          <span className="c-val col-icon"><GoldenAppleIcon size={15} label={t("revives")}  /></span>
        </div>

        {rows.map((p, i) => (
          <div key={p.nick} className={`lb-row solo-row rank-${i+1}`} style={{ gridTemplateColumns: grid }}>
            <span className="c-pos">
              {i < 3 ? <span className="medal">{medals[i]}</span> : <span className="pos-num">{i+1}</span>}
            </span>
            <span className="c-name player-name">
              <McHead nick={p.nick} uuid={p.uuid} size={32} className="mc-head" />
              <span>{p.nick}</span>
            </span>
            <span className="c-val twitch-col">
              <StreamMini channel={p.channel} />
            </span>
            <span className="c-val pts">{p.points}</span>
            <span className="c-val">{p.kills}</span>
            <span className="c-val">{p.deaths}</span>
            <span className="c-val">{p.assists}</span>
            <span className="c-val">{p.timeLive}</span>
            <span className="c-val">{p.revives}</span>
          </div>
        ))}
      </div>
      <PointsLegend showRevives={true} showDmg={false} />
    </>
  );
}
