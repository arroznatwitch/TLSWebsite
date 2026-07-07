// Página de manutenção. É mostrada a todos quando MAINTENANCE = true no config.js.
// É independente do resto do site (não precisa de idioma/tema) — texto em
// PT / EN / ES para toda a gente perceber.
export default function MaintenanceScreen() {
  return (
    <div className="maintenance">
      <div className="maintenance-card">
        <img src="/logo.png" alt="The Last Survivor" className="maintenance-logo" />
        <div className="maintenance-bar"><span /></div>
        <h1 className="maintenance-title">Site em manutenção</h1>
        <p className="maintenance-text">
          Estamos a fazer alterações no site. Volta daqui a pouco!
        </p>
        <p className="maintenance-text-sub">
          The site is under maintenance — we&apos;re making some changes. Check back soon.<br />
          El sitio está en mantenimiento — estamos haciendo cambios. Vuelve pronto.
        </p>
      </div>
    </div>
  );
}
