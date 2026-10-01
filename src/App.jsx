import { useEffect, useRef, useState } from 'react';

const NEW_DECK_URL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';

const cardValue = (value) => ({ ACE: 14, KING: 13, QUEEN: 12, JACK: 11 }[value] ?? Number(value));

function getResult(firstCard, secondCard) {
  const firstValue = cardValue(firstCard.value);
  const secondValue = cardValue(secondCard.value);

  if (firstValue === secondValue) {
    return { title: 'A perfect tie', detail: 'The table calls for war.', tone: 'war', winner: 'draws' };
  }

  const winner = firstValue > secondValue ? 'playerOne' : 'playerTwo';
  const player = winner === 'playerOne' ? 'Player one' : 'Player two';
  return { title: `${player} takes the round`, detail: 'Higher card wins this duel.', tone: 'win', winner };
}

function Card({ card, label, accent }) {
  return (
    <article className={`player-card ${accent}`}>
      <div className="player-label">
        <span className="player-orb" aria-hidden="true" />
        {label}
      </div>
      <div className="card-frame">
        {card ? (
          <img src={card.image} alt={`${label} drew the ${card.value} of ${card.suit}`} />
        ) : (
          <div className="card-placeholder" aria-label={`${label} card has not been drawn yet`}>
            <span>?</span>
          </div>
        )}
      </div>
      <p>{card ? `${card.value} of ${card.suit}` : 'Waiting for the draw'}</p>
    </article>
  );
}

export default function App() {
  const [deckId, setDeckId] = useState('');
  const [cards, setCards] = useState([]);
  const [remaining, setRemaining] = useState(52);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState({ playerOne: 0, playerTwo: 0, draws: 0 });
  const [status, setStatus] = useState({ title: 'Deck is being shuffled', detail: 'Preparing a fresh 52-card duel.', tone: 'neutral' });
  const [isLoading, setIsLoading] = useState(true);
  const hasStarted = useRef(false);

  const createDeck = async () => {
    setIsLoading(true);
    setStatus({ title: 'Deck is being shuffled', detail: 'Preparing a fresh 52-card duel.', tone: 'neutral' });

    try {
      const response = await fetch(NEW_DECK_URL);
      if (!response.ok) throw new Error('Unable to create a deck.');
      const data = await response.json();
      setDeckId(data.deck_id);
      setCards([]);
      setRemaining(data.remaining);
      setRound(0);
      setScore({ playerOne: 0, playerTwo: 0, draws: 0 });
      setStatus({ title: 'Ready when you are', detail: 'Draw two cards to begin the duel.', tone: 'neutral' });
    } catch {
      setStatus({ title: 'Connection interrupted', detail: 'Check your connection and shuffle again.', tone: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    createDeck();
  }, []);

  const drawCards = async () => {
    if (!deckId || isLoading) return;

    if (remaining < 2) {
      await createDeck();
      return;
    }

    setIsLoading(true);
    setStatus({ title: 'Cards in motion', detail: 'Drawing from the deck...', tone: 'neutral' });

    try {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`);
      if (!response.ok) throw new Error('Unable to draw cards.');
      const data = await response.json();

      if (data.cards.length < 2) {
        setRemaining(data.remaining ?? 0);
        setStatus({ title: 'The deck is empty', detail: 'Shuffle a new deck to keep playing.', tone: 'error' });
        return;
      }

      const result = getResult(data.cards[0], data.cards[1]);
      setCards(data.cards);
      setRemaining(data.remaining);
      setRound((currentRound) => currentRound + 1);
      setScore((currentScore) => ({
        ...currentScore,
        [result.winner]: currentScore[result.winner] + 1,
      }));
      setStatus(result);
    } catch {
      setStatus({ title: 'Draw failed', detail: 'The card service did not respond. Please try again.', tone: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const needsNewDeck = remaining < 2;

  return (
    <main className="app-shell">
      <div className="aurora aurora-one" aria-hidden="true" />
      <div className="aurora aurora-two" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#game">
          <span className="brand-mark" aria-hidden="true">♠</span>
          <span>Card Duel</span>
        </a>
        <div className="deck-meter" aria-label={`${remaining} cards left in the deck`}>
          <span>Deck</span>
          <strong>{remaining.toString().padStart(2, '0')}</strong>
        </div>
      </header>

      <section className="hero" aria-labelledby="game-title">
        <p className="eyebrow">Two cards. One winner.</p>
        <h1 id="game-title">Make your move.</h1>
        <p className="intro">A small game of chance, wrapped in a midnight arcade.</p>
      </section>

      <section className="duel-console" id="game" aria-live="polite">
        <div className="console-heading">
          <span>Round {round.toString().padStart(2, '0')}</span>
          <span className={`status-dot ${status.tone}`} aria-hidden="true" />
          <span>{isLoading ? 'Processing' : 'Live table'}</span>
        </div>

        <div className="scoreboard" aria-label="Game score board">
          <div className="score-cell player-one-score">
            <span>Player one</span>
            <strong>{score.playerOne}</strong>
            <small>wins</small>
          </div>
          <div className="score-cell draw-score">
            <span>Draws</span>
            <strong>{score.draws}</strong>
            <small>ties</small>
          </div>
          <div className="score-cell player-two-score">
            <span>Player two</span>
            <strong>{score.playerTwo}</strong>
            <small>wins</small>
          </div>
        </div>

        <div className="battlefield">
          <Card card={cards[0]} label="Player one" accent="violet" />
          <div className="versus" aria-hidden="true"><span>VS</span></div>
          <Card card={cards[1]} label="Player two" accent="coral" />
        </div>

        <div className={`result-panel ${status.tone}`}>
          <p>{status.title}</p>
          <span>{status.detail}</span>
        </div>

        <div className="actions">
          <button className="draw-button" type="button" onClick={drawCards} disabled={isLoading || !deckId}>
            <span>{isLoading ? 'Shuffling the odds...' : needsNewDeck ? 'Shuffle new deck' : 'Draw two cards'}</span>
            <b aria-hidden="true">→</b>
          </button>
          <button className="reset-button" type="button" onClick={createDeck} disabled={isLoading}>
            Reset game
          </button>
        </div>
      </section>

      <footer>Built for a quick, friendly duel. © 2026 Bereket Woldemariyam</footer>
    </main>
  );
}
