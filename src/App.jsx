import { useState } from "react";
import { ThemeProvider } from "./hooks/useTheme";
import { LangProvider, useLang } from "./hooks/useLang";
import LoadingScreen from "./components/LoadingScreen";
import MaintenanceScreen from "./components/MaintenanceScreen";
import { MAINTENANCE } from "./config";
import SettingsPanel from "./components/SettingsPanel";
import SoloLeaderboard from "./components/SoloLeaderboard";
import TeamsLeaderboard from "./components/TeamsLeaderboard";
import AllTime from "./components/AllTime";
import data from "./data/seasons.json";
import EventCountdown from "./components/EventCountdown";
import Supporters from "./components/Supporters";
import WatchParty from "./components/WatchParty";
import "./App.css";

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  );
}

function Inner() {
  const { t, lang } = useLang();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tab, setTab] = useState("alltime");
  const seasons = data.seasons;
  const active = seasons.find(s => s.id === tab);
  // Season com Watch Party = a mais recente com data de evento (TLS III)
  const wpSeason = seasons.find(s => s.eventDate) || seasons[seasons.length - 1];

  return (
    <div className="app">
      <header className="header">
        <img src="/logo.png" alt="The Last Survivor" className="header-logo" />
        <button className="gear-btn" onClick={() => setSettingsOpen(true)} aria-label={t("settings")}>
          <GearIcon />
        </button>
      </header>

      <nav className="nav">
        {seasons.map(s => (
          <button key={s.id} className={`nav-tab ${tab===s.id?"active":""}`} onClick={() => setTab(s.id)}>
            {s.label}
            <span className="nav-sub">{s.type==="solo" ? t("soloEvent") : t("teamsEvent")}</span>
          </button>
        ))}
        <button className={`nav-tab nav-tab-rank ${tab==="alltime"?"active":""}`} onClick={() => setTab("alltime")} style={{marginLeft:"auto"}}>
          {t("allTime")}
          <span className="nav-sub">{t("ranking")}</span>
        </button>
        {wpSeason && (
          <button className={`nav-tab nav-tab-wp ${tab==="watchparty"?"active":""}`} onClick={() => setTab("watchparty")}>
            {t("watchParty")}
            <span className="nav-sub">{wpSeason.label}</span>
          </button>
        )}
        <button className={`nav-tab nav-tab-sup ${tab==="supporters"?"active":""}`} onClick={() => setTab("supporters")}>
          {t("supporters")}
          <span className="nav-sub">♥</span>
        </button>
      </nav>

      <div className="content-with-sidebar">
        <main className="main">
          {tab === "alltime"
            ? <AllTime seasons={seasons} />
            : tab === "watchparty"
              ? <WatchParty season={wpSeason} />
              : tab === "supporters"
                ? <Supporters />
                : active?.type === "solo"
                  ? <SoloLeaderboard season={active} />
                  : <TeamsLeaderboard season={active} />
          }
        </main>
        <aside className="sidebar">
          {data.nextEvent && <EventCountdown eventDate={data.nextEvent.date} label={data.nextEvent.label} />}
          {seasons.some(s => s.eventDate && new Date(s.eventDate) > new Date()) &&
            seasons.filter(s => s.eventDate && new Date(s.eventDate) > new Date()).map(s => (
              <EventCountdown key={s.id} eventDate={s.eventDate} label={s.label} />
            ))
          }
          <a href="https://craftandhelps.com" target="_blank" rel="noopener noreferrer" className="cah-banner">
            <img
              src="/Logo_CAH.png"
              alt="Craft and Helps"
              className="cah-logo"
            />
            <span className="cah-title">CRAFT AND HELPS</span>
          </a>
          <a href="https://ko-fi.com/playtls" target="_blank" rel="noopener noreferrer" className="kofi-banner">
            <img
              src="/support_me_on_kofi_beige.webp"
              alt={t("kofiSupportLine")}
              className="kofi-img"
            />
          </a>
        </aside>
      </div>

      <footer className="footer">
        <p className="footer-text">
          {(() => {
            const txt = t("footer");
            const b = "The Last Survivor";
            const i = txt.indexOf(b);
            return i === -1 ? txt : <>{txt.slice(0, i)}<span className="footer-brand">{b}</span>{txt.slice(i + b.length)}</>;
          })()}
        </p>
        <div className="footer-socials">
          <a href="https://instagram.com/tls.thelastsurvivor" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href="https://tiktok.com/@tls.thelastsurvivor" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="TikTok">
            <TikTokIcon />
          </a>
        </div>
        <p className="footer-copy">© 2024 – 2026 · The Last Survivor</p>
        <p className="footer-disclaimer footer-disclaimer-strong">
          {t("footerDisclaimer")}
        </p>
        <p className="footer-credit">
          {t("avatarsCredit")}{" "}
          <a href="https://crafthead.net/" target="_blank" rel="noopener noreferrer" className="crafthead-link">Crafthead</a>
        </p>
      </footer>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  if (MAINTENANCE) return <MaintenanceScreen />;
  return (
    <ThemeProvider>
      <LangProvider>
        {loading && <LoadingScreen onDone={() => setLoading(false)} />}
        <Inner />
      </LangProvider>
    </ThemeProvider>
  );
}