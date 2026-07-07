import { useLang } from "../hooks/useLang";
import { SwordIcon, ArrowIcon, ClockIcon, GoldenAppleIcon, BarrierIcon } from "./McIcons";
import { StreamMini } from "./StreamIcon";
import PointsLegend from "./PointsLegend";
import McHead from "./McHead";

const medals = ["🥇","🥈","🥉"];

function ddrdPoints(dmgDealt, dmgTaken) {
  const diff = (dmgDealt ?? 0) - (dmgTaken ?? 0);
  if (diff >= 21) return 6;
  if (diff >= 11) return 4;
  if (diff >= 1)  return 2;
  if (diff === 0) return 0;
  return -3;
}

function calcPlayerPoints(p) {
  return (p.kills   ?? 0) * 8
       + (p.deaths  ?? 0) * -6
       + (p.assists ?? 0) * 3
       + (p.timeLive ?? 0)
       + (p.revives ?? 0) * 5
       + ddrdPoints(p.damageDealt, p.damageTaken);
}

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
        const pts = autoPoints ? calcPlayerPoints(p) : (p.points ?? 0);
        playerMap[p.nick].points   += pts;
        playerMap[p.nick].kills    += p.kills    ?? 0;
        playerMap[p.nick].deaths   += p.deaths   ?? 0;
        playerMap[p.nick].assists  += p.assists  ?? 0;
        playerMap[p.nick].timeLive += p.timeLive ?? 0;
        playerMap[p.nick].revives  += p.revives  ?? 0;
      }
    } else {
      for (const team of season.teams) {
        const n = team.players.length;
        for (const p of team.players) {
          ensure(p.nick, p.twitch);
          // Pontos: autoPoints calcula pelas stats individuais, senão divide equipa
          const pts = autoPoints
            ? calcPlayerPoints(p)
            : Math.round((team.points ?? 0) / n);
          playerMap[p.nick].points   += pts;
          // Stats individuais têm prioridade sobre divisão da equipa
          playerMap[p.nick].kills    += p.kills    !== undefined ? p.kills    : Math.round((team.kills    ?? 0) / n);
          playerMap[p.nick].deaths   += p.deaths   !== undefined ? p.deaths   : Math.round((team.deaths  ?? 0) / n);
          playerMap[p.nick].assists  += p.assists  !== undefined ? p.assists  : Math.round((team.assists ?? 0) / n);
          playerMap[p.nick].timeLive += p.timeLive !== undefined ? p.timeLive : 0; // só conta se tiver individual
          playerMap[p.nick].revives  += p.revives  !== undefined ? p.revives  : Math.round((team.revives ?? 0) / n);
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
