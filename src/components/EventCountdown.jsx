import { useState, useEffect } from "react";
import { useLang } from "../hooks/useLang";

function getTimeLeft(target) {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function EventCountdown({ eventDate, label }) {
  const { t } = useLang();
  const target = new Date(eventDate).getTime();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!timeLeft) return null;

  const pad = n => String(n).padStart(2, "0");

  return (
    <div className="sidebar-countdown">
      <p className="scd-label">{label}</p>
      <div className="scd-row">
        <div className="scd-unit">
          <span className="scd-num">{pad(timeLeft.days)}</span>
          <span className="scd-sub">{t("days")}</span>
        </div>
        <span className="scd-sep">:</span>
        <div className="scd-unit">
          <span className="scd-num">{pad(timeLeft.hours)}</span>
          <span className="scd-sub">{t("hours")}</span>
        </div>
        <span className="scd-sep">:</span>
        <div className="scd-unit">
          <span className="scd-num">{pad(timeLeft.minutes)}</span>
          <span className="scd-sub">{t("minutes")}</span>
        </div>
        <span className="scd-sep">:</span>
        <div className="scd-unit">
          <span className="scd-num">{pad(timeLeft.seconds)}</span>
          <span className="scd-sub">{t("seconds")}</span>
        </div>
      </div>
    </div>
  );
}
