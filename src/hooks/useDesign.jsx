import { createContext, useContext, useState, useEffect } from "react";

// Design/tema visual do site: "classic" (o original) ou "mcc" (inspirado no
// MinecraftChampionship). Aplica-se como data-design no <html>, tal como o
// data-theme, e é guardado no localStorage para persistir entre visitas.
const Ctx = createContext();

const read = () => {
  if (typeof window === "undefined") return "classic";
  return window.localStorage.getItem("tls-design") || "classic";
};

export function DesignProvider({ children }) {
  const [design, setDesign] = useState(read);
  useEffect(() => {
    document.documentElement.setAttribute("data-design", design);
    try { window.localStorage.setItem("tls-design", design); } catch { /* ignore */ }
  }, [design]);
  return <Ctx.Provider value={{ design, setDesign }}>{children}</Ctx.Provider>;
}
export const useDesign = () => useContext(Ctx);
