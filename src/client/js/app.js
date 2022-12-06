import {
  html,
  Component,
  render,
} from "https://unpkg.com/htm/preact/standalone.module.js";
import Card from "./card.js";
import Player from "./player.js";
import Score from "./score.js";

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
      this.syncState(data.state);
      if (data.type == "flip" && !data.state.voting) {
        this.setState({ selected: null });
      }
    };
  }

  syncState = (serverState) => {
    this.setState({
      ...this.state,
      ...serverState,
    });
  };

  setSelected = (val) => {
    this.setState((prev) => {
      const selected = prev.selected == val ? null : val;

      this.ws.send(
        JSON.stringify({
          type: "vote",
          payload: selected,
        })
      );

      return { ...prev, selected };
    });
  };

  setVoting = () => {
    this.setState((prev) => {
      const voting = !prev.voting;

      this.ws.send(
        JSON.stringify({
          type: "flip",
          payload: voting,
        })
      );

      return { ...prev, voting };
    });
  };

  render(_props, state) {
    return html`
      <ul class="players">
        ${Object.entries(state.clients).map(([_id, client]) =>
          Player({ client })
        )}
      </ul>
      <button class="flip" onClick=${() => this.setVoting()}>
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
        : Score({ clients: state.clients })}
    `;
  }
}

render(html`<${App} />`, document.body);
