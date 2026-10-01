const ui = {
  button: document.querySelector("#drawButton"),
  status: document.querySelector("#status"),
  outcome: document.querySelector("#outcome"),
  player1: document.querySelector("#player1"),
  player2: document.querySelector("#player2"),
  player1Placeholder: document.querySelector("#player1Placeholder"),
  player2Placeholder: document.querySelector("#player2Placeholder"),
  player1Card: document.querySelector("#player1Card"),
  player2Card: document.querySelector("#player2Card"),
  player1Score: document.querySelector("#player1Score"),
  player2Score: document.querySelector("#player2Score"),
  roundLabel: document.querySelector("#roundLabel"),
  deckCount: document.querySelector("#deckCount"),
};
let deckId = "";
let scores = { player1: 0, player2: 0 };
let round = 0;
let deckRemaining = 52;
function setStatus(message) {
  ui.status.textContent = message;
}
function setOutcome(message, type = "") {
  ui.outcome.className = `outcome ${type}`.trim();
  ui.outcome.querySelector("h3").textContent = message;
}
function formatCard(card) {
  return `${card.value.toLowerCase()} of ${card.suit.toLowerCase()}`;
}
function updateLedger() {
  ui.player1Score.textContent = String(scores.player1).padStart(2, "0");
  ui.player2Score.textContent = String(scores.player2).padStart(2, "0");
  ui.roundLabel.textContent = `Round ${String(round).padStart(2, "0")}`;
  ui.deckCount.textContent = `${deckRemaining} ${deckRemaining === 1 ? "card" : "cards"} in the shoe`;
}
function showCard(player, card) {
  const image = ui[player];
  const placeholder = ui[`${player}Placeholder`];
  image.hidden = false;
  image.src = card.image;
  image.alt = `${player === "player1" ? "Player one" : "Player two"} drew the ${formatCard(card)}`;
  placeholder.hidden = true;
  ui[`${player}Card`].textContent = formatCard(card);
}
function cardValue(value) {
  return { ACE: 14, KING: 13, QUEEN: 12, JACK: 11 }[value] || Number(value);
}
async function createDeck() {
  setStatus("Shuffling a fresh deck…");
  try {
    const response = await fetch(
      "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
    );
    const data = await response.json();
    if (!data.success) throw new Error("Deck service did not return a deck.");
    deckId = data.deck_id;
    deckRemaining = data.remaining;
    updateLedger();
    setStatus("The deck has been cut. Place your hands.");
  } catch (error) {
    setStatus("The card room is offline. Check your connection and try again.");
    setOutcome("No deck, no decision.", "tie");
    ui.button.disabled = true;
  }
}
async function drawCards() {
  if (!deckId || ui.button.disabled) return;
  ui.button.disabled = true;
  ui.button.querySelector(".button-top").textContent = "Dealing…";
  setStatus("Two cards leave the shoe.");
  try {
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`,
    );
    const data = await response.json();
    if (!data.success || data.cards.length < 2) {
      setStatus("The shoe is empty. A new deck will be cut shortly.");
      setOutcome("That was the final hand.", "tie");
      await createDeck();
      return;
    }
    const [first, second] = data.cards;
    deckRemaining = data.remaining;
    round += 1;
    showCard("player1", first);
    showCard("player2", second);
    const firstValue = cardValue(first.value);
    const secondValue = cardValue(second.value);
    if (firstValue > secondValue) {
      scores.player1 += 1;
      setOutcome("Player One takes the hand.", "player-one");
      setStatus("A clean win. The ledger has been marked.");
    } else if (firstValue < secondValue) {
      scores.player2 += 1;
      setOutcome("Player Two takes the hand.", "player-two");
      setStatus("A clean win. The ledger has been marked.");
    } else {
      setOutcome("A tie. The room calls for war.", "tie");
      setStatus("Equal ranks. Draw again to settle the matter.");
    }
    updateLedger();
  } catch (error) {
    setStatus("The deal was interrupted. Try the hand again.");
    setOutcome("The cards slipped from the table.", "tie");
  } finally {
    ui.button.disabled = false;
    ui.button.querySelector(".button-top").textContent = "Draw";
  }
}
ui.button.addEventListener("click", drawCards);
createDeck();
