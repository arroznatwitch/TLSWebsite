import { useTheme } from "../hooks/useTheme";
import { useLang } from "../hooks/useLang";

export default function SettingsPanel({ open, onClose }) {
  const { dark, setDark } = useTheme();
  const { lang, setLang, t } = useLang();
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
