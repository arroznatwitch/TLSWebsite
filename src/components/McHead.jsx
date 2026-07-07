import { useState } from "react";

// Avatar de Minecraft com cadeia de fallback.
//
// Porque é que alguns jogadores apareciam "bugados": o mc-heads.net resolve a
// cabeça pelo NOME ATUAL da conta. Se o jogador mudou de nome (o nick no
// seasons.json fica desatualizado), tem maiúsculas/minúsculas estranhas, ou o
// serviço está lento/limitado, o pedido falha e ficava um quadrado vazio.
//
// Solução:
//  - Se o jogador tiver "uuid" no seasons.json usamos isso (estável mesmo
//    quando muda de nome) — é a forma mais fiável de fixar um jogador.
//  - Em caso de erro, tentamos o minotar e por fim uma cabeça padrão (Steve),
//    para nunca ficar um espaço em branco.
const buildSources = (nick, uuid, size) => {
  const primary = uuid || nick;
  return [
    `https://mc-heads.net/avatar/${encodeURIComponent(primary)}/${size}`,
    `https://minotar.net/helm/${encodeURIComponent(nick || "MHF_Steve")}/${size}`,
    `https://mc-heads.net/avatar/MHF_Steve/${size}`,
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
