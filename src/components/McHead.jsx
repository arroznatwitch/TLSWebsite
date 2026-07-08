import { useState } from "react";

const buildSources = (nick, uuid, size) => {
  const primary = uuid || nick;
  // Cara 2D COM a camada de overlay (chapéu/óculos): /helm inclui a 2ª camada
  // do skin, ao contrário de /avatar. Pedimos 2x a resolução para ficar nítido.
  const s = Math.min(128, size * 2);
  return [
    `https://crafthead.net/helm/${encodeURIComponent(primary)}/${s}`,
    `https://mc-heads.net/avatar/${encodeURIComponent(primary)}/${s}`,
    `https://minotar.net/helm/${encodeURIComponent(nick || "MHF_Steve")}/${s}`,
    `https://crafthead.net/helm/MHF_Steve/${s}`,
  ];
};

export default function McHead({ nick, uuid, size = 32, className = "mc-head", alt }) {
  const sources = buildSources(nick, uuid, size);
  const [idx, setIdx] = useState(0);
  return (
    <img
      src={sources[idx]}
      alt={alt ?? nick}
      className={className}
      loading="lazy"
      onError={() => setIdx(i => (i < sources.length - 1 ? i + 1 : i))}
    />
  );
}
