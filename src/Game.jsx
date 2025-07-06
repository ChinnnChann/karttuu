import React, { useState } from "react";

const suits = ["♠", "♥", "♦", "♣"];
const values = ["7", "8", "9", "10", "J", "Q", "K", "A"];

const generateDeck = () => {
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  return shuffle(deck);
};

const shuffle = (deck) => {
  let d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
};

const cardValue = (val) => {
  const order = { "7": 1, "8": 2, "9": 3, "10": 4, J: 5, Q: 6, K: 7, A: 8 };
  return order[val];
};

const Card = ({ card }) => (
  <div className="border p-2 rounded bg-white text-black text-xl">
    {card.value}{card.suit}
  </div>
);

export default function Game() {
  const [deck, setDeck] = useState(generateDeck());
  const [playerCards, setPlayerCards] = useState([]);
  const [aiCards, setAiCards] = useState([]);
  const [round, setRound] = useState(1);
  const [leadSuit, setLeadSuit] = useState(null);
  const [battle, setBattle] = useState([]);
  const [winner, setWinner] = useState(null);
  const [finalBattle, setFinalBattle] = useState(false);
  const [aiRevealed, setAiRevealed] = useState(false);

  const startGame = () => {
    const newDeck = generateDeck();
    setDeck(newDeck);
    setPlayerCards(newDeck.slice(0, 4));
    setAiCards(newDeck.slice(4, 8));
    setRound(1);
    setLeadSuit(null);
    setBattle([]);
    setWinner(null);
    setFinalBattle(false);
    setAiRevealed(false);
  };

  const playRound = (card) => {
    const aiCard = aiCards.find((c) => leadSuit ? c.suit === leadSuit : true) || aiCards[0];
    const newPlayerCards = playerCards.filter((c) => c !== card);
    const newAiCards = aiCards.filter((c) => c !== aiCard);
    const newBattle = [...battle, { player: card, ai: aiCard }];

    let newLeadSuit = leadSuit;
    if (!leadSuit) newLeadSuit = card.suit;

    setPlayerCards(newPlayerCards);
    setAiCards(newAiCards);
    setBattle(newBattle);
    setLeadSuit(newLeadSuit);
    setRound(round + 1);

    if (round === 3) {
      const lastBattle = newBattle[newBattle.length - 1];
      const playerWin =
        lastBattle.player.suit === newLeadSuit &&
        (!lastBattle.ai.suit ||
          cardValue(lastBattle.player.value) > cardValue(lastBattle.ai.value));
      setWinner(playerWin ? "Player" : "AI");
      setFinalBattle(true);
    }
  };

  const revealFinal = () => {
    setAiRevealed(true);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Empat Daun: Tebak Maut 🃏</h1>

      {!playerCards.length && (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={startGame}>
          Start Game
        </button>
      )}

      {playerCards.length > 0 && (
        <>
          <div className="space-y-2">
            <h2 className="text-xl">Your Hand:</h2>
            <div className="flex gap-2">
              {playerCards.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => playRound(card)}
                  disabled={round > 3}
                >
                  <Card card={card} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl">Ronde {round > 4 ? 4 : round}</h2>
            {battle.map((b, i) => (
              <div key={i} className="flex gap-4">
                <p>🧍 You: {b.player.value}{b.player.suit}</p>
                <p>🤖 AI: {b.ai.value}{b.ai.suit}</p>
              </div>
            ))}
          </div>

          {finalBattle && !aiRevealed && (
            <div>
              <h2 className="text-lg">🔥 Final Card Reveal 🔥</h2>
              <p>{winner === "Player" ? "You" : "AI"} choose the suit</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded mt-2" onClick={revealFinal}>
                Reveal Final Cards
              </button>
            </div>
          )}

          {aiRevealed && (
            <div className="space-y-2">
              <h3 className="text-lg font-bold">Final Cards</h3>
              <p>🧍 You: {playerCards[0].value}{playerCards[0].suit}</p>
              <p>🤖 AI: {aiCards[0].value}{aiCards[0].suit}</p>
              {playerCards[0].suit === aiCards[0].suit ? (
                cardValue(playerCards[0].value) > cardValue(aiCards[0].value) ? (
                  <p>✅ You Win Final!</p>
                ) : (
                  <p>❌ AI Wins Final!</p>
                )
              ) : (
                <p>🟥 Jenis kartu beda! Yang ikutan kalah otomatis 😭</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
    }
