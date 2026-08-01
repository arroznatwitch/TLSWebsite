import { useState } from "react";
import { useLang } from "../hooks/useLang";
import { SwordIcon, ArrowIcon, ClockIcon, GoldenAppleIcon, BarrierIcon } from "./McIcons";
import { StreamMini } from "./StreamIcon";
import PointsLegend from "./PointsLegend";
import McHead from "./McHead";
import { playerPoints, playerStats } from "../utils/points";

const medals = ["🥇","🥈","🥉"];

export default function AllTime({ seasons }) {
  const { t } = useLang();
  const [mode, setMode] = useState("normal");

  const playerMap = {};

  function ensure(nick, channel) {
    if (!playerMap[nick]) {
      playerMap[nick] = { nick, channel: null, points: 0, kills: 0, deaths: 0, assists: 0, timeLive: 0, revives: 0, editions: 0 };
    }
    if (channel) playerMap[nick].channel = channel;
  }

  for (const season of seasons) {
    const autoPoints = season.autoPoints === true;
    const nicksInSeason = new Set();

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
        nicksInSeason.add(p.nick);
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
          nicksInSeason.add(p.nick);
        }
      }
    }

    // Conta a época apenas uma vez por jogador, mesmo que apareça 2x nela.
    for (const nick of nicksInSeason) playerMap[nick].editions += 1;
  }

  // Normal: pontos totais. Complexo: pontos ÷ nº de edições, sempre arredondado
  // para cima (nunca decimais) — nivela quem jogou mais épocas.
  const players = Object.values(playerMap).map(p => ({
    ...p,
    _avg: p.editions > 0 ? Math.ceil(p.points / p.editions) : 0,
  }));
  const rows = [...players].sort((a, b) =>
    mode === "complex" ? b._avg - a._avg : b.points - a.points
  );
  const isComplex = mode === "complex";

  return (
    <>
      <div className="lb-wrap">
        <div className="lb-toolbar">
          <button className={`sort-btn ${mode==="normal"?"active":""}`}  onClick={() => setMode("normal")}>{t("modeNormal")}</button>
          <button className={`sort-btn ${mode==="complex"?"active":""}`} onClick={() => setMode("complex")}>{t("modeComplex")}</button>
        </div>
        <div className="lb-head at-lb-grid">
          <span className="c-pos">#</span>
          <span className="c-name">{t("player")}</span>
          <span className="c-val twitch-col"></span>
          <span className="c-val">{t("points")}</span>
          <span className="c-val col-icon"><SwordIcon       size={15} label={t("kills")}    /></span>
          <span className="c-val col-icon at-col-extra"><BarrierIcon     size={15} label={t("deaths")}   /></span>
          <span className="c-val col-icon at-col-extra"><ArrowIcon       size={15} label={t("assists")}  /></span>
          <span className="c-val col-icon at-col-extra"><ClockIcon       size={15} label={t("timeLive")} /></span>
          <span className="c-val col-icon at-col-extra"><GoldenAppleIcon size={15} label={t("revives")}  /></span>
        </div>

        {rows.map((p, i) => (
          <div key={p.nick} className={`lb-row solo-row rank-${i+1} at-lb-grid`}>
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
            <span className="c-val pts">{isComplex ? p._avg : p.points}</span>
            <span className="c-val">{p.kills}</span>
            <span className="c-val at-col-extra">{p.deaths}</span>
            <span className="c-val at-col-extra">{p.assists}</span>
            <span className="c-val at-col-extra">{p.timeLive}</span>
            <span className="c-val at-col-extra">{p.revives}</span>
          </div>
        ))}
      </div>
      <PointsLegend showRevives={true} showDmg={false} note={isComplex ? t("modeComplexNote") : null} />
    </>
  );
}
