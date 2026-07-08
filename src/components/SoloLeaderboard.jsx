import { useState } from "react";
import { useLang } from "../hooks/useLang";
import { SwordIcon, ArrowIcon, ClockIcon, StrengthIcon, BarrierIcon } from "./McIcons";
import { StreamMini } from "./StreamIcon";
import PointsLegend from "./PointsLegend";
import PlayerTag from "./PlayerTag";
import CastersList from "./CastersList";
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

function calcPoints(p) {
  return (p.kills   ?? 0) * 8
       + (p.deaths  ?? 0) * -6
       + (p.assists ?? 0) * 3
       + (p.timeLive ?? 0)
       + ddrdPoints(p.damageDealt, p.damageTaken);
}

export default function SoloLeaderboard({ season }) {
  const { t } = useLang();
  const showDmg    = season.showDmg    === true;
  const autoPoints = season.autoPoints === true;
  const [sortMode, setSortMode] = useState("death");
  const podium = season.podium ?? [];

  const players = season.players.map(p => ({
    ...p,
    _points: autoPoints ? calcPoints(p) : (p.points ?? 0),
  }));

  const rows = [...players].sort((a, b) => {
    if (sortMode === "death") return (a.deathOrder ?? 999) - (b.deathOrder ?? 999);
    if (!autoPoints && podium.length > 0) {
      const ai = podium.indexOf(a.nick);
      const bi = podium.indexOf(b.nick);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
    }
    return b._points - a._points;
  });

  const gridClass = showDmg ? "lb-grid-dmg" : "lb-grid-nodmg";

  return (
    <>
<div className="lb-wrap">
        <div className="lb-toolbar">
          <button className={`sort-btn ${sortMode==="death"?"active":""}`}  onClick={() => setSortMode("death")}>{t("deathOrder")}</button>
          <button className={`sort-btn ${sortMode==="points"?"active":""}`} onClick={() => setSortMode("points")}>{t("points")}</button>
        </div>
        <div className={`lb-head ${gridClass}`}>
          <span className="c-pos">#</span>
          <span className="c-name">{t("player")}</span>
          <span className="c-val"></span>
          <span className="c-val">{t("points")}</span>
          <span className="c-val col-icon"><SwordIcon   size={15} label={t("kills")}    /></span>
          <span className="c-val col-icon"><BarrierIcon size={15} label={t("deaths")}   /></span>
          <span className="c-val col-icon"><ArrowIcon   size={15} label={t("assists")}  /></span>
          <span className="c-val col-icon"><ClockIcon   size={15} label={t("timeLive")} /></span>
          {showDmg && <span className="c-val col-icon"><StrengthIcon size={15} label="DDRD" /></span>}
        </div>
        {rows.map((p, i) => {
          const diff = (p.damageDealt ?? 0) - (p.damageTaken ?? 0);
          return (
            <div key={p.nick} className={`lb-row solo-row rank-${i+1} ${gridClass}`}>
              <span className="c-pos">
                {i < 3 ? <span className="medal">{medals[i]}</span> : <span className="pos-num">{i+1}</span>}
              </span>
              <span className="c-name player-name">
                <McHead nick={p.nick} uuid={p.uuid} size={32} className="mc-head" />
                <span>{p.nick}</span>
                <PlayerTag tag={p.tag} />
              </span>
              <span className="c-val twitch-col"><StreamMini channel={p.twitch} /></span>
              <span className="c-val pts">{p._points}</span>
              <span className="c-val">{p.kills   ?? 0}</span>
              <span className="c-val">{p.deaths  ?? 0}</span>
              <span className="c-val">{p.assists ?? 0}</span>
              <span className="c-val">{p.timeLive ?? 0}</span>
              {showDmg && <span className={`c-val dmg ${diff>=0?"pos":"neg"}`}>{diff>=0?"+":""}{diff}</span>}
            </div>
          );
        })}
      </div>

      {}
      <CastersList casters={season.casters} />

      <PointsLegend showRevives={false} showDmg={showDmg} />
    </>
  );
}