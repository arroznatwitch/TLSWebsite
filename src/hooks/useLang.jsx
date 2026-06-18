import { createContext, useContext, useState } from "react";

const T = {
  pt: {
    allTime:"All-Time", settings:"Definições", darkMode:"Modo Escuro", lightMode:"Modo Claro",
    language:"Idioma", kills:"Abates", assists:"Assistências", timeLive:"Tempo Vivo",
    revives:"Revives", dmgDiff:"Dif. Dano", points:"Pontos", soloEvent:"Solo",
    teamsEvent:"Equipas", close:"Fechar", rank:"#", player:"Jogador", team:"Equipa",
    members:"Membros",
    footer:"The Last Survivor é um evento com mais de 10 streamers diferentes!",
    winner:"Vencedor", deaths:"Mortes", deathOrder:"Por Morte",
    howPointsWork:"Como funcionam os Pontos",
    timeLivePoints:"+1 pt (valor direto)",
    casters:"Casters",
    tagFinal:"FINAL",
    tagPlayoff:"PLAY-OFF",
    tagAbsent:"INDISPONÍVEL",
    tagWinner:"VENCEDOR",
    tagEliminated:"ELIMINADO",
    tagGaveSlot:"CEDEU A VAGA NA FINAL",
    days:"Dias",
    hours:"Horas",
    minutes:"Mins",
    seconds:"Segs",
    eventCountdown:"A começar em",
    manualPointsNote:"Nesta época os pontos foram definidos manualmente pelo organizador.",
  },
  en: {
    allTime:"All-Time", settings:"Settings", darkMode:"Dark Mode", lightMode:"Light Mode",
    language:"Language", kills:"Kills", assists:"Assists", timeLive:"Time Alive",
    revives:"Revives", dmgDiff:"Dmg Diff", points:"Points", soloEvent:"Solo",
    teamsEvent:"Teams", close:"Close", rank:"#", player:"Player", team:"Team",
    members:"Members",
    footer:"The Last Survivor is an event with over 10 different streamers!",
    winner:"Winner", deaths:"Deaths", deathOrder:"By Death",
    howPointsWork:"How Points Work",
    timeLivePoints:"+1 pt (direct value)",
    casters:"Casters",
    tagFinal:"FINAL",
    tagPlayoff:"PLAY-OFF",
    tagAbsent:"UNAVAILABLE",
    tagWinner:"WINNER",
    tagEliminated:"ELIMINATED",
    tagGaveSlot:"GAVE UP A FINAL SPOT",
    days:"Days",
    hours:"Hours",
    minutes:"Mins",
    seconds:"Secs",
    eventCountdown:"Starting in",
    manualPointsNote:"Points in this season were manually set by the organizer.",
  },
};

const Ctx = createContext();
export function LangProvider({ children }) {
  const [lang, setLang] = useState("pt");
  return (
    <Ctx.Provider value={{ lang, setLang, t: k => T[lang][k] ?? k }}>
      {children}
    </Ctx.Provider>
  );
}
export const useLang = () => useContext(Ctx);
