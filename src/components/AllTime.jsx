import { useState } from "react";
import { t } from "../textos";
import { SwordIcon, ArrowIcon, ClockIcon, GoldenAppleIcon, BarrierIcon } from "./McIcons";
import { StreamMini } from "./StreamIcon";
import PointsLegend from "./PointsLegend";
import McHead from "./McHead";
import { aggregatePlayers } from "../utils/ranking";

const medals = ["🥇","🥈","🥉"];

export default function AllTime({ seasons }) {
  const [mode, setMode] = useState("normal");
  const players = Object.values(aggregatePlayers(seasons)).map(p => ({ ...p, _avg: p.avg }));
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
