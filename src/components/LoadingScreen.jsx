import { useEffect, useState } from "react";

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const DURATION = 1200;

    const tick = (now) => {
      const pct = Math.min(100, ((now - start) / DURATION) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setLeaving(true);
        setTimeout(() => onDone?.(), 400); // espera o fade-out
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className={`loading-screen ${leaving ? "leaving" : ""}`}>
      <img src="/logo.png" alt="The Last Survivor" className="loading-logo" />
      <div className="loading-bar">
        <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
