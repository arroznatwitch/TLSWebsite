import { useTheme } from "../hooks/useTheme";
import { useLang } from "../hooks/useLang";
import { useDesign } from "../hooks/useDesign";

export default function SettingsPanel({ open, onClose }) {
  const { dark, setDark } = useTheme();
  const { lang, setLang, t } = useLang();
  const { design, setDesign } = useDesign();
  if (!open) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <div className="sp-header">
          <span>{t("settings")}</span>
          <button className="sp-close" onClick={onClose}>✕</button>
        </div>
        <div className="sp-row">
          <span>{dark ? t("darkMode") : t("lightMode")}</span>
          <button className={`toggle ${dark ? "on" : ""}`} onClick={() => setDark(!dark)}>
            <span className="toggle-knob" />
          </button>
        </div>
        <div className="sp-row">
          <span>{t("design")}</span>
          <div className="lang-group">
            {[["classic", t("designClassic")], ["mcc", t("designMcc")]].map(([id, label]) => (
              <button key={id} className={`lang-pill ${design===id?"on":""}`} onClick={() => setDesign(id)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="sp-row">
          <span>{t("language")}</span>
          <div className="lang-group">
            {["pt","en","es"].map(l => (
              <button key={l} className={`lang-pill ${lang===l?"on":""}`} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
