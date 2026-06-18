import { useLang } from "../hooks/useLang";
import { StreamLink } from "./StreamIcon";

export default function CastersList({ casters }) {
  const { t } = useLang();
  if (!casters || casters.length === 0) return null;

  return (
    <div className="casters-wrap">
      <p className="casters-title">{t("casters")}</p>
      <div className="casters-list">
        {casters.map(c => (
          <div key={c.nick} className="caster-item">
            <img
              src={`https://mc-heads.net/avatar/${c.nick}/32`}
              alt={c.nick}
              className="mc-head"
              loading="lazy"
            />
            <span className="caster-nick">{c.nick}</span>
            <StreamLink channel={c.twitch} size={14} />
          </div>
        ))}
      </div>
    </div>
  );
}
