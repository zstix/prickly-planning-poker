import { html } from "https://unpkg.com/htm/preact/index.mjs?module";

const Card = ({ val, selected, handleClick }) => {
  const className = [
    val == "?" ? "unknown" : "",
    selected ? "selected" : "",
  ].join(" ");

  return html`
    <li class=${className} onClick=${handleClick}>
      <span>${val}</span>
    </li>
  `;
};

export default Card;
