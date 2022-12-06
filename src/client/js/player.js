import { html } from "https://unpkg.com/htm/preact/index.mjs?module";

const Player = ({ client }) => {
  return html`
    <li>${client.name} ${client.vote && html`<span>voted</span>`}</li>
  `;
};

export default Player;
