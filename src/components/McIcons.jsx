function McIcon({ src, alt, label, size = 18, tooltipDir = "down" }) {
  return (
    <span className={`mc-icon-wrap tooltip-${tooltipDir}`} data-tooltip={label} title={label}>
      <img src={`/${src}`} alt={alt} width={size} height={size} style={{ imageRendering: "pixelated", display: "block" }} />
    </span>
  );
}

export function SwordIcon({ size = 18, label = "Abates", tooltipDir = "down" }) {
  return <McIcon src="icons/mc/sword.png" alt="Espada" label={label} size={size} tooltipDir={tooltipDir} />;
}
export function ArrowIcon({ size = 18, label = "Assistências", tooltipDir = "down" }) {
  return <McIcon src="icons/mc/arrow.png" alt="Flecha" label={label} size={size} tooltipDir={tooltipDir} />;
}
export function ClockIcon({ size = 18, label = "Tempo Vivo", tooltipDir = "down" }) {
  return <McIcon src="icons/mc/clock.png" alt="Relógio" label={label} size={size} tooltipDir={tooltipDir} />;
}
export function GoldenAppleIcon({ size = 18, label = "Revives", tooltipDir = "down" }) {
  return <McIcon src="icons/mc/golden_apple.png" alt="Maçã Dourada" label={label} size={size} tooltipDir={tooltipDir} />;
}
export function StrengthIcon({ size = 18, label = "Dif. Dano", tooltipDir = "down" }) {
  return <McIcon src="icons/mc/strength.png" alt="Poção de Força" label={label} size={size} tooltipDir={tooltipDir} />;
}
export function BarrierIcon({ size = 18, label = "Mortes", tooltipDir = "down" }) {
  return <McIcon src="icons/mc/barrier.png" alt="Barreira" label={label} size={size} tooltipDir={tooltipDir} />;
}
