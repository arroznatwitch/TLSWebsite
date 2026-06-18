import { useLang } from "../hooks/useLang";

export default function PlayerTag({ tag }) {
  const { t } = useLang();
  if (!tag) return null;

  const PRESETS = {
    final:      { labelKey: "tagFinal",      bg: "rgba(240,165,0,0.15)",    color: "#f0a500", border: "rgba(240,165,0,0.4)"    },
    playoff:    { labelKey: "tagPlayoff",     bg: "rgba(96,165,250,0.15)",   color: "#60a5fa", border: "rgba(96,165,250,0.4)"   },
    absent:     { labelKey: "tagAbsent",      bg: "rgba(156,163,175,0.12)", color: "#9ca3af", border: "rgba(156,163,175,0.3)"  },
    winner:     { labelKey: "tagWinner",      bg: "rgba(240,165,0,0.2)",    color: "#f0c040", border: "rgba(240,165,0,0.5)"    },
    eliminated: { labelKey: "tagEliminated",  bg: "rgba(248,113,113,0.12)", color: "#f87171", border: "rgba(248,113,113,0.3)"  },
    gaveslot:   { labelKey: "tagGaveSlot",    bg: "rgba(156,163,175,0.12)", color: "#9ca3af", border: "rgba(156,163,175,0.3)"  },
  };

  const preset = PRESETS[tag.type] ?? null;
  // Se tiver label custom no JSON usa sempre esse, senão traduz pelo tipo
  const label  = tag.label
    ? (preset?.labelKey ? t(preset.labelKey) : tag.label)
    : (preset?.labelKey ? t(preset.labelKey) : tag.type);

  // Se tiver label custom E não for um preset, usa o label direto (sem tradução)
  const finalLabel = preset
    ? t(preset.labelKey)
    : (tag.label ?? tag.type);

  const bg     = tag.color ? `${tag.color}22` : (preset?.bg    ?? "rgba(255,255,255,0.08)");
  const color  = tag.color ?? preset?.color   ?? "#aaa";
  const border = tag.color ? `${tag.color}55` : (preset?.border ?? "rgba(255,255,255,0.2)");

  return (
    <span className="player-tag" style={{ background: bg, color, border: `1px solid ${border}` }}>
      {finalLabel}
    </span>
  );
}
