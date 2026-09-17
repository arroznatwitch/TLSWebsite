import { playerPoints, playerStats } from "./points";

// Só conta como "participou" se tiver alguma stat real. Isto é independente
// da tag (ex.: alguém pode estar marcado "absent" para a final mas ter
// jogado o play-off — nesse caso continua a contar como edição jogada).
export function hasParticipation(s) {
  return s.kills > 0 || s.deaths > 0 || s.assists > 0 || s.timeLive > 0
      || s.revives > 0 || s.damageDealt > 0 || s.damageTaken > 0;
}

// Junta os pontos e as edições de todas as épocas, por jogador.
//
// Devolve um objeto por nick com:
//   points   -> soma de todas as épocas (é o modo "Normal" do Ranking)
//   editions -> em quantas edições jogou mesmo
//   avg      -> pontos ÷ edições, arredondado para cima (o modo "Sazonal")
//
// Usado pelo separador Ranking e também pelo Sorteio, para os dois
// concordarem sempre no mesmo cálculo.
export function aggregatePlayers(seasons) {
  const map = {};

  const ensure = (nick, channel) => {
    if (!map[nick]) {
      map[nick] = { nick, channel: null, points: 0, kills: 0, deaths: 0,
                    assists: 0, timeLive: 0, revives: 0, editions: 0 };
    }
    if (channel) map[nick].channel = channel;
  };

  for (const season of seasons || []) {
    const autoPoints = season.autoPoints === true;
    const nicksInSeason = new Set();

    if (season.type === "solo") {
      for (const p of season.players || []) {
        ensure(p.nick, p.twitch);
        const pts = autoPoints ? playerPoints(p) : (p.points ?? 0);
        const s = playerStats(p);
        map[p.nick].points   += pts;
        map[p.nick].kills    += s.kills;
        map[p.nick].deaths   += s.deaths;
        map[p.nick].assists  += s.assists;
        map[p.nick].timeLive += s.timeLive;
        map[p.nick].revives  += s.revives;
        if (hasParticipation(s)) nicksInSeason.add(p.nick);
      }
    } else {
      for (const team of season.teams || []) {
        const n = team.players.length;
        for (const p of team.players) {
          ensure(p.nick, p.twitch);
          const s = playerStats(p);
          const hasIndividual = p.kills !== undefined || Array.isArray(p.phases);

          map[p.nick].points += autoPoints
            ? playerPoints(p)
            : Math.round((team.points ?? 0) / n);

          map[p.nick].kills    += hasIndividual ? s.kills    : Math.round((team.kills   ?? 0) / n);
          map[p.nick].deaths   += hasIndividual ? s.deaths   : Math.round((team.deaths  ?? 0) / n);
          map[p.nick].assists  += hasIndividual ? s.assists  : Math.round((team.assists ?? 0) / n);
          map[p.nick].timeLive += hasIndividual ? s.timeLive : 0; // só conta se tiver individual
          map[p.nick].revives  += hasIndividual ? s.revives  : Math.round((team.revives ?? 0) / n);
          if (!hasIndividual || hasParticipation(s)) nicksInSeason.add(p.nick);
        }
      }
    }

    // Conta a época apenas uma vez por jogador, mesmo que apareça 2x nela.
    for (const nick of nicksInSeason) map[nick].editions += 1;
  }

  for (const p of Object.values(map)) {
    p.avg = p.editions > 0 ? Math.ceil(p.points / p.editions) : 0;
  }
  return map;
}
