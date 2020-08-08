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

function setCardsFlipped(cards, cardToFlip, isFlipped) {
  return cards.map(card => {
    if (card.key === cardToFlip.key) {
      console.log(cardToFlip.color);
      return {
        ...card,
        isFlipped: isFlipped
      };
    }
    return card;
  });
}

function Memory() {
  const [game, setGame] = useState({ cards: generateCards() });

  function onRestart() {
    setGame({ cards: generateCards() });
  }

  function onCardClick(card) {
    if (card.isFlipped) {
      return;
    }
    setGame(({ cards, firstCard, secondCard }) => {
      if (!firstCard) {
        return {
          cards: setCardsFlipped(cards, card, true),
          firstCard: card
        };
      }
      if (!secondCard) {
        return {
          cards: setCardsFlipped(cards, card, true),
          firstCard: firstCard,
          secondCard: card
        };
      }
      if (firstCard.color === secondCard.color) {
        return {
          cards: setCardsFlipped(cards, card, true),
          firstCard: card
        };
      }
      return {
        cards: setCardsFlipped(
          setCardsFlipped(
            setCardsFlipped(cards, firstCard, false),
            secondCard,
            false
          ),
          card,
          true
        ),
        firstCard: card
      };
    });
  }

  return (
    <div>
      <div className="game-container">
        <StatusBar status="Time: 0s" onRestart={onRestart}></StatusBar>
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
