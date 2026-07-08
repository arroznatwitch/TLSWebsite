import { useLang } from "../hooks/useLang";

export default function PlayerTag({ tag }) {
  const { t } = useLang();
  if (!tag) return null;

  const PRESETS = {
    final:      { labelKey: "tagFinal",      bg: "rgba(240,165,0,0.15)",    color: "#f0a500", border: "rgba(240,165,0,0.4)"    },
    second:     { labelKey: "tagSecond",      bg: "rgba(176,184,181,0.15)", color: "#c0c8d0", border: "rgba(192,200,208,0.6)"  },
    third:      { labelKey: "tagThird",       bg: "rgba(192,120,64,0.18)",  color: "#d4904a", border: "rgba(212,144,74,0.6)"   },
    playoff:    { labelKey: "tagPlayoff",     bg: "rgba(1,93,78,0.18)",   color: "#15a58c", border: "rgba(1,93,78,0.5)"   },
    finalist:   { labelKey: "tagFinalist",    bg: "rgba(1,93,78,0.18)",   color: "#15a58c", border: "rgba(1,93,78,0.5)"   },
    absent:     { labelKey: "tagAbsent",      bg: "rgba(156,163,175,0.12)", color: "#9ca3af", border: "rgba(156,163,175,0.3)"  },
    winner:     { labelKey: "tagWinner",      bg: "rgba(240,165,0,0.2)",    color: "#f0c040", border: "rgba(240,165,0,0.5)"    },
    eliminated: { labelKey: "tagEliminated",  bg: "rgba(248,113,113,0.12)", color: "#f87171", border: "rgba(248,113,113,0.3)"  },
    gaveslot:   { labelKey: "tagGaveSlot",    bg: "rgba(156,163,175,0.12)", color: "#9ca3af", border: "rgba(156,163,175,0.3)"  },
    eliminatedGroupA: { labelKey: "tagEliminatedGroupA",  bg: "rgba(248,113,113,0.12)", color: "#f87171", border: "rgba(248,113,113,0.3)"  },
    eliminatedGroupB: { labelKey: "tagEliminatedGroupB",  bg: "rgba(248,113,113,0.12)", color: "#f87171", border: "rgba(248,113,113,0.3)"  },
    eliminatedGroupC: { labelKey: "tagEliminatedGroupC",  bg: "rgba(248,113,113,0.12)", color: "#f87171", border: "rgba(248,113,113,0.3)"  },
  };

  const preset = PRESETS[tag.type] ?? null;
  const label  = tag.label
    ? (preset?.labelKey ? t(preset.labelKey) : tag.label)
    : (preset?.labelKey ? t(preset.labelKey) : tag.type);

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
