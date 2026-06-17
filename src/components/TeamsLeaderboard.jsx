import { useState } from "react";
import { useLang } from "../hooks/useLang";
import { SwordIcon, ArrowIcon, ClockIcon, GoldenAppleIcon, StrengthIcon, BarrierIcon } from "./McIcons";
import { StreamMini } from "./StreamIcon";
import PointsLegend from "./PointsLegend";

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

export default function TeamsLeaderboard({ season }) {
  const { t } = useLang();
  const [expanded, setExpanded] = useState(null);
  const showDmg    = season.showDmg    === true;
  const autoPoints = season.autoPoints === true;

  const podium = season.podium ?? [];

  // Calcula pontos de cada equipa se autoPoints
  const teams = season.teams.map(team => ({
    ...team,
    players: team.players.map(p => ({
      ...p,
      _points: autoPoints ? calcPlayerPoints(p) : null,
    })),
    _points: autoPoints
      ? team.players.reduce((s, p) => s + calcPlayerPoints(p), 0)
      : (team.points ?? 0),
  }));

  const rows = [...teams].sort((a, b) => {
    const ai = podium.indexOf(a.name);
    const bi = podium.indexOf(b.name);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return b._points - a._points;
  });

  const statCols = showDmg ? 8 : 7;
  const memberGrid = `1fr 28px 60px repeat(${statCols - 1}, 52px)`;

  return (
    <>
      <div className="lb-wrap">
        <div className="lb-head teams-lb-head">
          <span className="c-pos">#</span>
          <span className="c-name">{t("team")}</span>
          <span className="c-twitches">{t("members")}</span>
          <span className="c-val"></span>
        </div>

        {rows.map((team, i) => {
          const open = expanded === team.name;
          const totalKills   = team.players.reduce((s,p) => s + (p.kills   ?? 0), 0) || team.kills;
          const totalDeaths  = team.players.reduce((s,p) => s + (p.deaths  ?? 0), 0) || (team.deaths ?? 0);
          const totalAssists = team.players.reduce((s,p) => s + (p.assists ?? 0), 0) || team.assists;
          const totalTime    = team.players.reduce((s,p) => s + (p.timeLive?? 0), 0) || team.timeLive;
          const totalRevives = team.players.reduce((s,p) => s + (p.revives ?? 0), 0) || team.revives;
          const diff = (team.damageDealt ?? 0) - (team.damageTaken ?? 0);

          return (
            <div key={team.name}>
              <div
                className={`lb-row team-row teams-lb-row ${i < 3 ? "top" : ""} ${open ? "open" : ""}`}
                onClick={() => setExpanded(open ? null : team.name)}
                style={{ cursor: "pointer", borderLeft: `3px solid ${team.color}` }}
              >
                <span className="c-pos">
                  {i < 3 ? <span className="medal">{medals[i]}</span> : <span className="pos-num">{i+1}</span>}
                </span>
                <span className="c-name player-name">
                  <img src={`${import.meta.env.BASE_URL}${team.icon.replace(/^\//, "")}`} alt={team.name} className="team-icon-img" loading="lazy"/>
                  <span>{team.name}</span>
                </span>
                <span className="c-twitches">
                  {team.players.map(p => (
                    <span key={p.nick} title={p.nick} className="twitch-avatar-wrap">
                      <img src={`https://mc-heads.net/avatar/${p.nick}/24`} alt={p.nick} className="mc-head-sm" loading="lazy"/>
                    </span>
                  ))}
                </span>
                <span className="c-val chev">{open ? "▲" : "▼"}</span>
              </div>

              {open && (
                <div className="team-expanded">
                  {/* Totais da equipa */}
                  <div className="team-stats-row">
                    <div className="team-stat">
                      <span className="ts-label">{t("points")}</span>
                      <span className="ts-val pts">{team._points}</span>
                    </div>
                    <div className="team-stat">
                      <span className="ts-label"><SwordIcon size={12}/> {t("kills")}</span>
                      <span className="ts-val">{totalKills}</span>
                    </div>
                    <div className="team-stat">
                      <span className="ts-label"><BarrierIcon size={12}/> {t("deaths")}</span>
                      <span className="ts-val">{totalDeaths}</span>
                    </div>
                    <div className="team-stat">
                      <span className="ts-label"><ArrowIcon size={12}/> {t("assists")}</span>
                      <span className="ts-val">{totalAssists}</span>
                    </div>
                    <div className="team-stat">
                      <span className="ts-label"><GoldenAppleIcon size={12}/> {t("revives")}</span>
                      <span className="ts-val">{totalRevives}</span>
                    </div>
                    {showDmg && (
                      <div className="team-stat">
                        <span className="ts-label"><StrengthIcon size={12}/> DDRD</span>
                        <span className={`ts-val dmg ${diff>=0?"pos":"neg"}`}>{diff>=0?"+":""}{diff}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats individuais */}
                  <div className="team-members-table">
                    <div className="tm-head" style={{ gridTemplateColumns: memberGrid }}>
                      <span>{t("player")}</span>
                      <span></span>
                      <span className="c-val">{t("points")}</span>
                      <span className="c-val col-icon"><SwordIcon      size={12} label={t("kills")}    /></span>
                      <span className="c-val col-icon"><BarrierIcon    size={12} label={t("deaths")}   /></span>
                      <span className="c-val col-icon"><ArrowIcon      size={12} label={t("assists")}  /></span>
                      <span className="c-val col-icon"><ClockIcon      size={12} label={t("timeLive")} /></span>
                      <span className="c-val col-icon"><GoldenAppleIcon size={12} label={t("revives")} /></span>
                      {showDmg && <span className="c-val">DDRD</span>}
                    </div>
                    {team.players.map(p => {
                      const pdiff = (p.damageDealt ?? 0) - (p.damageTaken ?? 0);
                      const ppts  = autoPoints ? p._points : "—";
                      return (
                        <div key={p.nick} className="tm-row" style={{ gridTemplateColumns: memberGrid }}>
                          <span className="player-name" style={{ gap: 8 }}>
                            <img src={`https://mc-heads.net/avatar/${p.nick}/24`} alt={p.nick} className="mc-head-sm" loading="lazy"/>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{p.nick}</span>
                          </span>
                          <span className="c-val twitch-col"><StreamMini channel={p.twitch} /></span>
                          <span className="c-val pts" style={{ fontSize: 13 }}>{ppts}</span>
                          <span className="c-val">{p.kills   ?? 0}</span>
                          <span className="c-val">{p.deaths  ?? 0}</span>
                          <span className="c-val">{p.assists ?? 0}</span>
                          <span className="c-val">{p.timeLive ?? 0}</span>
                          <span className="c-val">{p.revives ?? 0}</span>
                          {showDmg && <span className={`c-val dmg ${pdiff>=0?"pos":"neg"}`}>{pdiff>=0?"+":""}{pdiff}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <PointsLegend showRevives={true} showDmg={showDmg} />
    </>
  );
}
