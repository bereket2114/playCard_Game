# Play Card Game

A lightweight two-player card game built with Node.js and Express. Draw two cards from a shuffled deck, compare their values, and see which player wins the round.

## Features

- Starts a new shuffled 52-card deck when the page loads
- Draws one card for each player per round
- Displays card artwork returned by the Deck of Cards API
- Ranks Ace high, followed by King, Queen, Jack, and numbered cards
- Announces the round winner or a tie (*Time for War!*)
- Shows a game-over message after the deck is exhausted
- Uses a responsive, dark-themed interface styled with Tailwind CSS

## Built with

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- Vanilla JavaScript
- [Tailwind CSS](https://tailwindcss.com/) via CDN
- [Deck of Cards API](https://deckofcardsapi.com/)

## Getting started

### Prerequisites

Install a current version of [Node.js](https://nodejs.org/). npm is included with Node.js.

### Installation

1. Clone the repository and enter the project directory.

   ```bash
   git clone https://github.com/bereket2114/playCard_Game.git
   cd playCard_Game
   ```

2. Install the dependencies.

   ```bash
   npm install
   ```

3. Create `config/.env` and add a port value.

   ```env
   PORT=2121
   ```

4. Start the server.

   ```bash
   npm start
   ```

5. Open [http://localhost:2121](http://localhost:2121) in your browser.

## How to play

1. Select **Draw your cards**.
2. The game draws one card for Player 1 and Player 2.
3. The higher-value card wins the round. An Ace is worth 14, King 13, Queen 12, and Jack 11.
4. If both cards have the same value, the round is a tie and the game announces *Time for War!*.
5. Continue drawing until no cards remain in the deck.

## Project structure

```text
.
├── config/               # Local environment configuration
├── controller/           # Request handlers
├── public/               # Browser JavaScript and styles
├── router/               # Express routes
├── view/                 # Game page
├── server.js             # Application entry point
└── package.json          # Scripts and dependencies
```

## Available script

```bash
npm start
```

Runs the Express server defined in `server.js`.

## Notes

The game needs an internet connection at runtime because card data and card images are loaded from the Deck of Cards API. Tailwind CSS and the Plus Jakarta Sans font are also loaded from CDNs.

## Author

Bereket Woldemariyam
