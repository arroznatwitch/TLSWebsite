// Cálculo de pontos, partilhado pelos vários leaderboards.
//
// Normalmente um jogador tem as stats diretamente no objeto (kills, deaths, ...).
// Mas quando uma época tem fases que valem pontos diferentes (ex.: TLS III em
// que o play-off vale só 25% dos pontos totais), o jogador usa em vez disso
// um array "phases": [{ weight, kills, deaths, ... }, ...] — cada fase com o
// seu peso. Isto é INDEPENDENTE do "tag" (que muda quando o jogador é
// eliminado), por isso nunca se mistura com o estado do tag.
export function ddrdPoints(dmgDealt, dmgTaken) {
  const diff = (dmgDealt ?? 0) - (dmgTaken ?? 0);
  if (diff >= 21) return 6;
  if (diff >= 11) return 4;
  if (diff >= 1)  return 2;
  if (diff === 0) return 0;
  return -3;
}

// Pontos "em bruto" de um bloco de stats (sem peso de fase).
function rawStatPoints(s) {
  return (s.kills    ?? 0) * 8
       + (s.deaths   ?? 0) * -6
       + (s.assists  ?? 0) * 3
       + (s.timeLive ?? 0)
       + (s.revives  ?? 0) * 5
       + ddrdPoints(s.damageDealt, s.damageTaken);
}

// Pontos totais de um jogador, aplicando o peso de cada fase quando existir.
export function playerPoints(p) {
  if (Array.isArray(p.phases)) {
    return p.phases.reduce((sum, ph) => sum + rawStatPoints(ph) * (ph.weight ?? 1), 0);
  }
  return rawStatPoints(p);
}

// Stats "em bruto" combinadas (para mostrar nas colunas kills/deaths/...).
// Ao contrário dos pontos, estas NÃO são multiplicadas pelo peso da fase —
// o peso só se aplica aos pontos, as contagens mostram-se sempre por inteiro.
export function playerStats(p) {
  if (Array.isArray(p.phases)) {
    return p.phases.reduce((acc, ph) => ({
      kills:       acc.kills       + (ph.kills       ?? 0),
      deaths:      acc.deaths      + (ph.deaths      ?? 0),
      assists:     acc.assists     + (ph.assists     ?? 0),
      timeLive:    acc.timeLive    + (ph.timeLive    ?? 0),
      revives:     acc.revives     + (ph.revives     ?? 0),
      damageDealt: acc.damageDealt + (ph.damageDealt ?? 0),
      damageTaken: acc.damageTaken + (ph.damageTaken ?? 0),
    }), { kills: 0, deaths: 0, assists: 0, timeLive: 0, revives: 0, damageDealt: 0, damageTaken: 0 });
  }
  return {
    kills:       p.kills       ?? 0,
    deaths:      p.deaths      ?? 0,
    assists:     p.assists     ?? 0,
    timeLive:    p.timeLive    ?? 0,
    revives:     p.revives     ?? 0,
    damageDealt: p.damageDealt ?? 0,
    damageTaken: p.damageTaken ?? 0,
  };
}
