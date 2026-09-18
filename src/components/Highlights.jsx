import { useState } from "react";
import { t } from "../textos";
import Champions from "./Champions";
import Awards from "./Awards";
import Records from "./Records";

// Aba única que junta Campeões, Prémios e Recordes. Antes eram abas separadas
// na navegação, o que enchia demasiado o topo. Para acrescentar outra secção,
// basta juntá-la a SECTIONS.
const SECTIONS = [
  { id: "champions", label: "champions", intro: "O pódio de cada edição." },
  { id: "awards",    label: "awards",    intro: "MVP, jogador revelação e favorito dos fãs." },
  { id: "records",   label: "records",   intro: "As melhores marcas da história do TLS." },
];

export default function Highlights({ seasons }) {
  const [section, setSection] = useState("champions");
  const current = SECTIONS.find(s => s.id === section);

  return (
    <div className="highlights">
      <div className="hl-head">
        <h2 className="hl-title">{t("awards")}</h2>
        <p className="hl-sub">{t("highlightsSub")}</p>
      </div>

      <div className="hl-tabs" role="tablist">
        {SECTIONS.map(s => (
          <button key={s.id} role="tab"
            aria-selected={section === s.id}
            className={`hl-tab ${section === s.id ? "active" : ""}`}
            onClick={() => setSection(s.id)}>
            {t(s.label)}
          </button>
        ))}
      </div>

      <p className="hl-intro">{current.intro}</p>

      <div key={section} className="hl-panel">
        {section === "champions" && <Champions seasons={seasons} embedded />}
        {section === "awards"    && <Awards seasons={seasons} embedded />}
        {section === "records"   && <Records />}
      </div>
    </div>
  );
}
