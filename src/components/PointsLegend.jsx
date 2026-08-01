import { useLang } from "../hooks/useLang";
import { SwordIcon, ArrowIcon, ClockIcon, StrengthIcon, BarrierIcon, GoldenAppleIcon } from "./McIcons";

export default function PointsLegend({ showRevives = false, showDmg = false, note = null }) {
  const { t } = useLang();
  return (
    <div className="points-legend">
      <p className="pl-title">{t("howPointsWork")}</p>
      <div className="pl-grid">
        <div className="pl-item pos">
          <SwordIcon size={13} label=""/>
          <span>{t("kills")}</span>
          <b>+8 pts</b>
        </div>
        <div className="pl-item neg">
          <BarrierIcon size={13} label=""/>
          <span>{t("deaths")}</span>
          <b>−6 pts</b>
        </div>
        <div className="pl-item pos">
          <ArrowIcon size={13} label=""/>
          <span>{t("assists")}</span>
          <b>+3 pts</b>
        </div>
        <div className="pl-item pos">
          <ClockIcon size={13} label=""/>
          <span>{t("timeLive")}</span>
          <b>{t("timeLivePoints")}</b>
        </div>
        {showRevives && (
          <div className="pl-item pos">
            <GoldenAppleIcon size={13} label=""/>
            <span>{t("revives")}</span>
            <b>+5 pts</b>
          </div>
        )}
        {showDmg && (
          <div className="pl-item">
            <StrengthIcon size={13} label=""/>
            <span>DDRD</span>
            <b className="ddrd-table">≥+21→+6 &nbsp;·&nbsp; ≥+11→+4 &nbsp;·&nbsp; ≥+1→+2 &nbsp;·&nbsp; 0→0 &nbsp;·&nbsp; neg→−3</b>
          </div>
        )}
      </div>
      {note && <p className="pl-note">{note}</p>}
    </div>
  );
}
