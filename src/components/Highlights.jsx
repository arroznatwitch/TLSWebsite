import { useState } from "react";
import { t } from "../textos";
import Champions from "./Champions";
import Awards from "./Awards";

// Aba única que junta Campeões, Prémios e Recordes. Antes eram três abas na
// navegação, o que enchia demasiado o topo. Para acrescentar outra secção,
// basta juntá-la a SECTIONS.
const SECTIONS = [
  { id: "champions", label: "champions" },
  { id: "awards",    label: "awards" },
  { id: "records",   label: "records" },
];

export default function Highlights({ seasons }) {
  const [section, setSection] = useState("champions");

  return (
    <div className="highlights">
      <div className="hl-head">
        <h2 className="hl-title">{t("awards")}</h2>
        <p className="hl-sub">{t("highlightsSub")}</p>
      </div>

      <div className="lb-toolbar">
        {SECTIONS.map(s => (
          <button key={s.id}
            className={`sort-btn ${section === s.id ? "active" : ""}`}
            onClick={() => setSection(s.id)}>
            {t(s.label)}
          </button>
        ))}
      </div>

      {section === "champions" && <Champions seasons={seasons} embedded />}
      {section === "awards"    && <Awards seasons={seasons} embedded />}
      {section === "records"   && <p className="wp-empty">{t("recordsEmpty")}</p>}
    </div>
  );
}
