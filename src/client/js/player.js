import { html } from "https://unpkg.com/htm/preact/index.mjs?module";

const Player = ({ id, client }) => {
  return html` <li>${id} ${client.vote && html`<span>voted</span>`}</li> `;
};

export default Player;
