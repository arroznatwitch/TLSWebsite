// Política de privacidade. Deliberadamente seca e curta: o site não recolhe
// nada, e um texto mais elaborado só soaria a papel de empresa.
// Se um dia houver analytics, contas, ou se o Watch Party for ligado (os
// iframes da Twitch/YouTube criam cookies), isto tem de ser reescrito.
const ATUALIZADO = "17/09/2026";

const PARAGRAFOS = [
  "O site não recolhe dados. Não tem contas, formulários, publicidade nem analytics, e não usa cookies.",
  "O alojamento é no GitHub Pages, que regista o IP das visitas. As cabeças dos jogadores vêm do Crafthead, do mc-heads ou do minotar, e esses sites também veem o IP de quem abre a página.",
  "Os links para as redes sociais e para o Ko-fi levam para fora do site.",
];

export default function Privacy() {
  return (
    <article className="privacy">
      <h2 className="privacy-title">Privacidade</h2>
      {PARAGRAFOS.map((p, i) => (
        <p key={i} className={i === 0 ? "privacy-lead" : "privacy-para"}>{p}</p>
      ))}
      <p className="privacy-updated">Última vez atualizado em: {ATUALIZADO}</p>
    </article>
  );
}
