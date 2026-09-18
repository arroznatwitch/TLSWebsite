import McHead from "./McHead";
import data from "../data/records.json";

// Recordes do TLS, agrupados por categoria (Kills, Tempo vivo, ...).
// Os valores vêm de records.json e são escritos à mão — não são calculados,
// porque alguns (ex.: "num só jogo") dependem de dados que o site não guarda.
//
// Uma categoria usa ou "records" (as três marcas fixas abaixo) ou "rows"
// (linhas livres, cada uma com o seu rótulo — é o caso das Mortes).
const SCOPES = [
  { id: "game",    label: "Num jogo" },
  { id: "edition", label: "Numa edição" },
  // Soma de todas as edições: é "quem tem mais", não uma marca de um só momento.
  { id: "allTime", label: "Mais no total" },
];

function rowsFor(cat) {
  if (cat.rows) {
    return cat.rows.map((r, i) => ({ key: i, label: r.label, rec: r, highlight: !!r.highlight }));
  }
  return SCOPES
    .filter(s => cat.records?.[s.id])
    .map(s => ({ key: s.id, label: s.label, rec: cat.records[s.id], highlight: s.id === "allTime" }));
}

function Holder({ rec }) {
  // nick === null -> recorde ainda por bater; sem nick -> linha sem jogador (ex.: totais)
  if (rec.nick === null) return <span className="rec-nobody">Ninguém</span>;
  if (!rec.nick) return null;
  const tied = rec.tied || [];
  return (
    <>
      <McHead nick={rec.nick} size={24} className="mc-head-sm" />
      <span className="rec-nick">{rec.display || rec.nick}</span>
      {tied.length > 0 && (
        <span className="rec-tied" title={`Empatado com ${tied.join(", ")}`}>
          {tied.map(n => (
            <McHead key={n} nick={n} size={18} className="rec-tied-head" alt={n} />
          ))}
        </span>
      )}
    </>
  );
}

function RecordRow({ cat, label, rec, highlight }) {
  return (
    <div className={`rec-row ${highlight ? "all-time" : ""}`}>
      <span className="rec-scope">{label}</span>
      <span className="rec-value">
        <b>{rec.value}</b> <small>{rec.value === 1 ? cat.unitOne : cat.unit}</small>
      </span>
      <span className="rec-holder"><Holder rec={rec} /></span>
      {rec.season && <span className="rec-season">{rec.season}</span>}
    </div>
  );
}

export default function Records() {
  return (
    <div className="records">
      {(data.categories || []).map(cat => (
        <section key={cat.id} className={`rec-card rec-${cat.id}`}>
          <header className="rec-head">
            <span className="rec-icon"><img src={cat.icon} alt="" /></span>
            <h3 className="rec-title">{cat.title}</h3>
          </header>
          <div className="rec-rows">
            {rowsFor(cat).map(r => (
              <RecordRow key={r.key} cat={cat} label={r.label} rec={r.rec} highlight={r.highlight} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
