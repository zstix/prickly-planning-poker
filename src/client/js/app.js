import {
  html,
  Component,
  render,
} from "https://unpkg.com/htm/preact/standalone.module.js";
import Card from "./card.js";

const CARD_VALS = [1, 2, 3, 5, 8, 13, "?"];

class App extends Component {
  state = {
    selected: null,
    voting: true,
  };

  setSelected = (selected) => {
    this.setState((prev) => ({
      selected: prev.selected == selected ? null : selected,
    }));
  };

  render(_props, state) {
    return html`
      <ul class="players">
        <li>User A ✅</li>
        <li>User B</li>
        <li>User C</li>
      </ul>
      <button
        class="flip"
        onClick=${() => this.setState({ voting: !state.voting })}
      >
        ${state.voting ? "Flip" : "Reset"}!
      </button>
      ${state.voting
        ? html` <ul class="cards">
            ${CARD_VALS.map((val) =>
              Card({
                val,
                selected: state.selected === val,
                handleClick: () => this.setSelected(val),
              })
            )}
          </ul>`
        : html`<div>score</div>`}
    `;
  }
}

render(html`<${App} />`, document.body);
