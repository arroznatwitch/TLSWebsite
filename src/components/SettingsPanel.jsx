import { useTheme } from "../hooks/useTheme";
import { t } from "../textos";

export default function SettingsPanel({ open, onClose, drawEnabled, setDrawEnabled }) {
  const { dark, setDark } = useTheme();
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
          <button className={`toggle ${dark ? "on" : ""}`}
            aria-pressed={dark}
            onClick={() => setDark(!dark)}>
            <span className="toggle-knob" />
          </button>
        </div>
        <div className="sp-row">
          <span>{t("drawToggle")}</span>
          <button className={`toggle ${drawEnabled ? "on" : ""}`}
            aria-pressed={drawEnabled}
            onClick={() => setDrawEnabled(!drawEnabled)}>
            <span className="toggle-knob" />
          </button>
        </div>
      </div>
    </div>
  );
}
