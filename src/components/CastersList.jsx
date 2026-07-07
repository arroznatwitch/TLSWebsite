import { useLang } from "../hooks/useLang";
import { StreamLink } from "./StreamIcon";
import McHead from "./McHead";

export default function CastersList({ casters }) {
  const { t } = useLang();
  if (!casters || casters.length === 0) return null;

  return (
    <div className="casters-wrap">
      <p className="casters-title">{t("casters")}</p>
      <div className="casters-list">
        {casters.map(c => (
          <div key={c.nick} className="caster-item">
            <McHead nick={c.nick} uuid={c.uuid} size={32} className="mc-head" />
            <span className="caster-nick">{c.nick}</span>
            <StreamLink channel={c.twitch} size={14} />
          </div>
        ))}
      </div>
    </div>
  );
}
