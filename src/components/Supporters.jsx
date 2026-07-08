import { useLang } from "../hooks/useLang";
import McHead from "./McHead";
import data from "../data/supporters.json";

// Aba de apoiadores — mostra TODOS numa grelha (reflui em várias colunas,
// por isso 50+ apoiadores continuam a caber bem, em vez de uma lista comprida).
// A lista vem de src/data/supporters.json.
export default function Supporters() {
  const { t } = useLang();
  const supporters = data.supporters || [];

  return (
    <div className="supporters-page">
      <div className="sp-head">
        <h2 className="sp-title">{t("supporters")}</h2>
        <p className="sp-sub">{t("supportersSub")}</p>
      </div>

      {supporters.length === 0 ? (
        <p className="wp-empty">{t("supportersEmpty")}</p>
      ) : (
        <div className="supporters-grid">
          {supporters.map(s => (
            <div key={s.nick} className="supporter-card">
              <McHead nick={s.nick} uuid={s.uuid} size={32} className="mc-head" />
              <span className="supporter-nick">{s.nick}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
