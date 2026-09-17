import { useState, useMemo, useRef } from "react";
import { t } from "../textos";
import McHead from "./McHead";
import data from "../data/draw.json";
import { aggregatePlayers } from "../utils/ranking";

const PLAYERS = data.players || [];
const COLORS = data.teamColors || [];
const DEFAULTS = data.defaults || { teamSize: 3, numTeams: 8 };
const SPLIT = data.tierSplit || { t3: 0.25, t1: 0.25 };

function computeTiers(activeSorted) {
  const n = activeSorted.length;
  const n3 = Math.floor(n * SPLIT.t3);
  const n1 = Math.floor(n * SPLIT.t1);
  const t3 = activeSorted.slice(0, n3);
  const t1 = n1 > 0 ? activeSorted.slice(n - n1) : [];
  const t2 = activeSorted.slice(n3, n - n1);
  return { t3, t2, t1 };
}

function buildIndex(activeSorted) {
  const { t3, t2, t1 } = computeTiers(activeSorted);
  const info = new Map();
  t3.forEach((p, i) => info.set(p.rank, { tier: 3, pos: i + 1 }));
  t2.forEach((p, i) => info.set(p.rank, { tier: 2, pos: i + 1 }));
  t1.forEach((p, i) => info.set(p.rank, { tier: 1, pos: i + 1 }));

  const sizeA = Math.floor(t3.length / 2);
  const shareA = t3.length > 0
    ? Math.round((t2.length * sizeA) / t3.length)
    : t2.length;
  return {
    info,
    counts: { t3: t3.length, t2: t2.length, t1: t1.length },
    // Um N3 na posição pos3 aceita um N2 na posição pos2?
    accepts: (pos3, pos2) =>
      pos3 <= sizeA ? pos2 <= shareA + 1 : pos2 >= shareA,
  };
}

function canJoin(player, team, idx) {
  const a = idx.info.get(player.rank);
  const tiers = team.map(o => idx.info.get(o.rank).tier);

  // Regra 4: um N1 nunca fica sem um N3 ao lado (logo nunca fica só com N2).
  if (a.tier === 1 && !tiers.includes(3)) return false;
  // E um N2 não pode entrar numa equipa que tenha um N1 sem N3.
  if (a.tier === 2 && tiers.includes(1) && !tiers.includes(3)) return false;

  for (const other of team) {
    const b = idx.info.get(other.rank);
    if (a.tier === 1 && b.tier === 1) return false;
    if (a.tier === 3 && b.tier === 3) return false;
    if (a.tier === 3 && b.tier === 2 && !idx.accepts(a.pos, b.pos)) return false;
    if (a.tier === 2 && b.tier === 3 && !idx.accepts(b.pos, a.pos)) return false;
  }
  return true;
}

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function solveTeams(players, numTeams, teamSize, idx) {
  const LIMIT = 400000;
  let steps = 0;

  const attempt = () => {
    steps = 0;
    const order = shuffle(players).sort((a, b) => {
      const w = p => { const tr = idx.info.get(p.rank).tier; return tr === 3 ? 0 : tr === 1 ? 1 : 2; };
      return w(a) - w(b);
    });
    const teams = Array.from({ length: numTeams }, () => []);

    const place = (i) => {
      if (steps++ > LIMIT) return false;
      if (i >= order.length) return true;
      const p = order[i];
      for (const ti of shuffle(teams.map((_, k) => k))) {
        if (teams[ti].length >= teamSize) continue;
        if (!canJoin(p, teams[ti], idx)) continue;
        teams[ti].push(p);
        if (place(i + 1)) return true;
        teams[ti].pop();
      }
      return false;
    };
    return place(0) ? teams : null;
  };

  for (let i = 0; i < 8; i++) {
    const r = attempt();
    if (r) return r;
  }
  return null;
}

export default function Draw({ seasons }) {

  const [source, setSource] = useState("list");
  const [teamSize, setTeamSize] = useState(DEFAULTS.teamSize);
  // No máximo tantas equipas quantas as cores disponíveis, para nunca haver
  // duas equipas com a mesma cor.
  const [numTeams, setNumTeams] = useState(
    Math.min(COLORS.length, Math.max(2, DEFAULTS.numTeams))
  );
  // Enquanto não mexeres no nº de equipas à mão, ele acompanha quem está
  // ativo: excluis 3 dos 27 e passa sozinho de 9 para 8 equipas de 3.
  const [autoTeams, setAutoTeams] = useState(true);
  const [excluded, setExcluded] = useState(() => new Set());
  const [teams, setTeams] = useState(null);
  const [revealed, setRevealed] = useState(0);
  const [flying, setFlying] = useState(null);
  const [error, setError] = useState(null);

  const poolRefs = useRef(new Map());
  const slotRefs = useRef(new Map());

  const ranking = useMemo(() => aggregatePlayers(seasons || []), [seasons]);
  const scoreOf = useMemo(
    () => (p) => ranking[p.nick]?.avg ?? 0,
    [ranking]
  );

  const active = useMemo(() => {
    const list = PLAYERS.filter(p => !excluded.has(p.rank));
    return source === "ranking"
      ? list.sort((a, b) => (scoreOf(b) - scoreOf(a)) || (a.rank - b.rank))
      : list.sort((a, b) => a.rank - b.rank);
  }, [excluded, source, scoreOf]);

  const idx = useMemo(() => buildIndex(active), [active]);

  // Ajusta o nº de equipas ao número de jogadores ativos (se der certinho).
  const fittedTeams = useMemo(() => {
    if (teamSize < 2 || active.length < teamSize) return null;
    if (active.length % teamSize !== 0) return null;
    const n = active.length / teamSize;
    return n >= 2 && n <= COLORS.length ? n : null;
  }, [active.length, teamSize]);

  const effectiveTeams = autoTeams && fittedTeams ? fittedTeams : numTeams;
  const needed = teamSize * effectiveTeams;
  const balanced = active.length === needed && active.length > 0;

  const revealOrder = useMemo(() => {
    if (!teams) return [];
    const order = [];
    for (let slot = 0; slot < teamSize; slot++) {
      for (let ti = 0; ti < teams.length; ti++) {
        if (teams[ti][slot]) order.push({ ti, slot });
      }
    }
    return order;
  }, [teams, teamSize]);

  const remaining = useMemo(() => {
    if (!teams) return [];
    const drawn = new Set(
      revealOrder.slice(0, revealed).map(o => teams[o.ti][o.slot].rank)
    );
    return active.filter(p => !drawn.has(p.rank));
  }, [teams, revealOrder, revealed, active]);

  const toggle = (rank) => {
    if (teams) return;
    setExcluded(prev => {
      const next = new Set(prev);
      if (next.has(rank)) next.delete(rank); else next.add(rank);
      return next;
    });
  };

  const start = () => {
    setError(null);
    const result = solveTeams(active, effectiveTeams, teamSize, idx);
    if (!result) { setError(t("drawImpossible")); return; }
    setTeams(result);
    setRevealed(0);
  };

  const reset = () => { setTeams(null); setRevealed(0); setFlying(null); setError(null); };

  const drawNext = () => {
    if (flying) return;
    const step = revealOrder[revealed];
    if (!step) return;
    const player = teams[step.ti][step.slot];
    const fromEl = poolRefs.current.get(player.rank);
    const toEl = slotRefs.current.get(`${step.ti}-${step.slot}`);

    if (!fromEl || !toEl) { setRevealed(r => r + 1); return; }

    const from = fromEl.getBoundingClientRect();
    const to = toEl.getBoundingClientRect();
    setFlying({ player, from, to });
    setTimeout(() => { setFlying(null); setRevealed(r => r + 1); }, 620);
  };

  const revealAll = () => { setFlying(null); setRevealed(revealOrder.length); };
  const done = teams && revealed >= revealOrder.length;

  const tierOf = (p) => idx.info.get(p.rank)?.tier ?? 2;

  const displayList = useMemo(() => {
    const all = [...PLAYERS];
    return source === "ranking"
      ? all.sort((a, b) => (scoreOf(b) - scoreOf(a)) || (a.rank - b.rank))
      : all.sort((a, b) => a.rank - b.rank);
  }, [source, scoreOf]);

  return (
    <div className="draw">
      <div className="draw-head">
        <h2 className="draw-title">{t("draw")}</h2>
        <p className="draw-sub">{t("drawSub")}</p>
      </div>

      {!teams && (
        <>
          <div className="draw-setup">
            <div className="draw-field">
              <span>{t("drawSource")}</span>
              <div className="draw-source">
                <button className={`draw-src-btn ${source === "list" ? "on" : ""}`}
                  onClick={() => setSource("list")}>{t("drawSourceList")}</button>
                <button className={`draw-src-btn ${source === "ranking" ? "on" : ""}`}
                  onClick={() => setSource("ranking")}>{t("drawSourceRanking")}</button>
              </div>
            </div>
            <label className="draw-field">
              <span>{t("drawTeamSize")}</span>
              <input type="number" min="2" max="8" value={teamSize}
                onChange={e => setTeamSize(Math.max(2, Math.min(8, +e.target.value || 2)))} />
            </label>
            <label className="draw-field">
              <span>{t("drawNumTeams")}</span>
              <input type="number" min="2" max={COLORS.length} value={effectiveTeams}
                onChange={e => {
                  setAutoTeams(false);
                  setNumTeams(Math.max(2, Math.min(COLORS.length, +e.target.value || 2)));
                }} />
            </label>
            <div className={`draw-count ${balanced ? "ok" : "bad"}`}>
              {active.length} / {needed} {t("drawPlayers")}
            </div>
            <button className="draw-btn primary" disabled={!balanced} onClick={start}>
              {t("drawStart")}
            </button>
          </div>


          <p className="draw-tiers">
            {t("drawTierSplit")}: <b>N3 {idx.counts.t3}</b> · <b>N2 {idx.counts.t2}</b> · <b>N1 {idx.counts.t1}</b>
          </p>

          {!balanced && <p className="draw-hint">{t("drawUnbalanced")}</p>}
          {error && <p className="draw-error">{error}</p>}

          {source === "ranking" && <p className="draw-hint">{t("drawRankingNote")}</p>}

          <p className="draw-section-label">{t("drawPool")}</p>
          <div className="draw-pool">
            {displayList.map(p => {
              const off = excluded.has(p.rank);
              const tier = off ? null : tierOf(p);
              const score = scoreOf(p);
              return (
                <button key={p.rank} className={`draw-player ${off ? "off" : `tier-${tier}`}`}
                  onClick={() => toggle(p.rank)}>
                  <McHead nick={p.nick} uuid={p.uuid} size={24} className="mc-head-sm" />
                  <span className="draw-player-name">{p.display}</span>
                  {source === "ranking" && (
                    <span className={`draw-score ${score === 0 ? "zero" : ""}`}>{score}</span>
                  )}
                  <span className="draw-tier">{off ? "—" : `N${tier}`}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {teams && (
        <>
          <div className="draw-controls">
            <button className="draw-btn primary" disabled={done || !!flying} onClick={drawNext}>
              {done ? t("drawFinished") : t("drawNext")}
            </button>
            <button className="draw-btn" onClick={revealAll} disabled={done}>{t("drawRevealAll")}</button>
            <button className="draw-btn" onClick={reset}>{t("drawReset")}</button>
            <span className="draw-progress">{Math.min(revealed, revealOrder.length)} / {revealOrder.length}</span>
          </div>

          <div className="draw-teams">
            {teams.map((team, ti) => {
              const c = COLORS[ti % COLORS.length];
              return (
                <div key={ti} className="draw-team" style={{ borderLeftColor: c.color }}>
                  <div className="draw-team-head">
                    <img src={c.icon} alt="" className="team-icon-img" />
                    <span className="draw-team-name" style={{ color: c.color }}>{t(`team_${c.id}`)}</span>
                  </div>
                  <div className="draw-team-players">
                    {Array.from({ length: teamSize }).map((_, slot) => {
                      const oi = revealOrder.findIndex(o => o.ti === ti && o.slot === slot);
                      const hidden = oi === -1 || oi >= revealed;
                      const p = team[slot];
                      return (
                        <div key={slot}
                          ref={el => { if (el) slotRefs.current.set(`${ti}-${slot}`, el); }}
                          className={`draw-slot ${hidden || !p ? "empty" : "filled"}`}>
                          {hidden || !p ? "?" : (
                            <>
                              <McHead nick={p.nick} uuid={p.uuid} size={24} className="mc-head-sm" />
                              <span className="draw-player-name">{p.display}</span>
                              <span className="draw-tier">N{tierOf(p)}</span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Jogadores que ainda faltam ser sorteados */}
          {remaining.length > 0 && (
            <>
              <p className="draw-section-label draw-remaining-label">
                {t("drawRemaining")} ({remaining.length})
              </p>
              <div className="draw-pool draw-pool-remaining">
                {remaining.map(p => (
                  <div key={p.rank}
                    ref={el => { if (el) poolRefs.current.set(p.rank, el); }}
                    className={`draw-player tier-${tierOf(p)} ${flying?.player.rank === p.rank ? "leaving" : ""}`}>
                    <McHead nick={p.nick} uuid={p.uuid} size={24} className="mc-head-sm" />
                    <span className="draw-player-name">{p.display}</span>
                    <span className="draw-tier">N{tierOf(p)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Cartão que voa do pool até à equipa */}
      {flying && (
        <div className="draw-flying" aria-hidden="true"
          style={{
            left: flying.from.left, top: flying.from.top,
            width: flying.from.width, height: flying.from.height,
            "--dx": `${flying.to.left - flying.from.left}px`,
            "--dy": `${flying.to.top - flying.from.top}px`,
          }}>
          <McHead nick={flying.player.nick} uuid={flying.player.uuid} size={24} className="mc-head-sm" />
          <span className="draw-player-name">{flying.player.display}</span>
        </div>
      )}
    </div>
  );
}
