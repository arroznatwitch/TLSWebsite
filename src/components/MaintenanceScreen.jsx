export default function MaintenanceScreen() {
  return (
    <div className="maintenance">
      <div className="maintenance-card">
        <img src="/logo.png" alt="The Last Survivor" className="maintenance-logo" />
        <div className="maintenance-bar"><span /></div>
        <h1 className="maintenance-title">Website em manutenção</h1>
        <p className="maintenance-text">
          Estamos a fazer alterações no website. Volta daqui a pouco!
        </p>
        <p className="maintenance-text-sub">
          The website is under maintenance — we&apos;re making some changes. Check back soon.<br />
          El sitio está en mantenimiento — estamos haciendo cambios. Vuelve pronto.
        </p>
      </div>
    </div>
  );
}
