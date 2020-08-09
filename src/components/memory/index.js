import React, { useState, useEffect, useRef } from "react";
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
  const [wrongPair, setWrongPair] = useState([]);
  //const [timeoutIds, setTimeoutIds] = useState([]);
  const timeoutIds = useRef([]);

  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (startTime === 0) return;
    const intervalId = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [startTime]);

  useEffect(() => {
    if (wrongPair.length === 0) return;
    const timeoutId = setTimeout(() => {
      setGame(oldGame => {
        const newCards = setCardsFlipped(
          oldGame.cards,
          wrongPair.map(card => card.key)
        );
        return {
          cards: newCards,
          firstCard: oldGame.firstCard
        };
      });
    }, 1000);
    //setTimeoutIds(oldTimeoutIds => oldTimeoutIds.concat(timeoutId));
    timeoutIds.current = timeoutIds.current.concat(timeoutId);
  }, [wrongPair]);

  useEffect(() => {
    return () => {
      timeoutIds.current.forEach(id => clearTimeout(id));
    };
  }, []);

  function onRestart() {
    timeoutIds.current.forEach(id => clearTimeout(id));
    timeoutIds.current = [];
    setGame({ cards: generateCards() });
    setStartTime(0);
    setElapsedTime(0);
  }

  function onCardClick(card) {
    if (card.isFlipped) {
      return;
    }
    setGame(({ cards, firstCard }) => {
      const newCards = setCardsFlipped(cards, [card.key]);

      if (!firstCard) {
        return {
          cards: newCards,
          firstCard: card
        };
      } else {
        if (firstCard.color !== card.color) {
          setWrongPair([firstCard, card]);
        }
        return {
          cards: newCards
        };
      }
    });
    setStartTime(oldStartTime => {
      if (oldStartTime === 0) {
        return Date.now();
      }
      return oldStartTime;
    });
  }

  /*
      if (!secondCard) {
        return {
          cards: newCards,
          firstCard: firstCard,
          secondCard: card
        };
      }
      if (firstCard.color === secondCard.color) {
        return {
          cards: newCards,
          firstCard: card
        };
      }
      return {
        cards: newCards,
        firstCard: card
      };
    });
    */
  //if (startTime!== 0) setStartTime(Date.now());

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
