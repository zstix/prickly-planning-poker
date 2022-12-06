import {
  html,
  Component,
  render,
} from "https://unpkg.com/htm/preact/standalone.module.js";
import Card from "./card.js";

const CARD_VALS = [1, 2, 3, 5, 8, 13, "?"];

class App extends Component {
  ws = new WebSocket("ws://127.0.0.1:8999");

  state = {
    selected: null,
    voting: true,
    clients: [],
  };

  componentDidMount() {
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "connection": // TODO: constants
          console.log(data.state);
          this.updatePlayers(data.state);
          break;
      }
    };
  }

  // TODO; update everything?
  updatePlayers = (serverState) => {
    this.setState({
      ...this.state,
      ...serverState,
    });
  };

  setSelected = (selected) => {
    this.setState((prev) => ({
      selected: prev.selected == selected ? null : selected,
    }));
  };

  render(_props, state) {
    return html`
      <ul class="players">
        ${Object.entries(state.clients).map(
          ([client]) => html` <li>${client}</li> `
        )}
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
