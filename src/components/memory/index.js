import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "./index.css";
import MemoryCard from "./MemoryCard";
import StatusBar from "./StatusBar";

const colors = [
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "purple"
];

function generateCards() {
  const cards = [];
  for (let i = 0; i < colors.length; i++) {
    cards.push({ key: i * 2, isFlipped: false, color: colors[i] });
    cards.push({ key: i * 2 + 1, isFlipped: false, color: colors[i] });
  }
  return cards.sort(() => Math.random() - 0.5);
}

function setCardsFlipped(cards, cardsToFlip) {
  return cards.map(card => {
    if (cardsToFlip.includes(card.key)) {
      return {
        ...card,
        isFlipped: !card.isFlipped
      };
    }
    return card;
  });
}

function Memory() {
  const [game, setGame] = useState({ cards: generateCards() });
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (startTime === 0) return;
    const intervalId = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [startTime]);

  function onRestart() {
    setGame({ cards: generateCards() });
    setStartTime(0);
    setElapsedTime(0);
  }

  function onCardClick(card) {
    if (card.isFlipped) {
      return;
    }
    setGame(({ cards, firstCard, secondCard }) => {
      if (!firstCard) {
        return {
          cards: setCardsFlipped(cards, [card.key]),
          firstCard: card
        };
      }
      if (!secondCard) {
        return {
          cards: setCardsFlipped(cards, [card.key]),
          firstCard: firstCard,
          secondCard: card
        };
      }
      if (firstCard.color === secondCard.color) {
        return {
          cards: setCardsFlipped(cards, [card.key]),
          firstCard: card
        };
      }
      return {
        cards: setCardsFlipped(cards, [
          card.key,
          firstCard.key,
          secondCard.key
        ]),
        firstCard: card
      };
    });
    //if (startTime!== 0) setStartTime(Date.now());
    setStartTime(oldStartTime => {
      if (oldStartTime === 0) {
        return Date.now();
      }
      return oldStartTime;
    });
  }

  return (
    <div>
      <div className="game-container">
        <StatusBar
          status={"Time: " + elapsedTime + "ms"}
          onRestart={onRestart}
        ></StatusBar>
        <div className="memory-grid">
          {game.cards.map(card => (
            <MemoryCard
              {...card}
              onClick={() => onCardClick(card)}
            ></MemoryCard>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Memory;
