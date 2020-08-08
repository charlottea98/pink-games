import React, { useState } from "react";
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

function Memory() {
  const [cards, setCards] = useState(generateCards);

  function onRestart() {
    setCards(generateCards);
  }

  function onCardClick(card) {
    setCards(oldCards => {
      return oldCards.map(oldCard => {
        if (oldCard.key === card.key) {
          return {
            ...oldCard,
            isFlipped: true
          };
        }
        return oldCard;
      });
    });
  }

  return (
    <div>
      <div className="game-container">
        <StatusBar status="Time: 0s" onRestart={onRestart}></StatusBar>
        <div className="memory-grid">
          {cards.map(card => (
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
