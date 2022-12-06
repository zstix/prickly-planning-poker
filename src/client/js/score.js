import { html } from "https://unpkg.com/htm/preact/index.mjs?module";

// Fisher-Yates
const shuffle = (arr) => {
  let currentIndex = arr.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }

  return arr;
};

const Score = ({ clients }) => {
  const votes = shuffle(Object.values(clients).map((c) => c.vote));

  return html`
    <ul class="votes">
      ${votes.map(
        (vote) => html`
          <li class=${vote == "?" ? "unknown" : ""}><span>${vote}</span></li>
        `
      )}
    </ul>
  `;
};

export default Score;
