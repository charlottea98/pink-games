import React, { useState, useEffect } from "react";
import "./index.css";

const width = 20;
const height = 12;

function generateGame() {
  const snake = {
    head: { x: width / 2, y: height / 2 },
    tail: [{ x: width / 2 - 1, y: height / 2 }],
    dir: "right"
  };
  return {
    snake,
    food: generateFood(snake),
    isOver: false
  };
}

function generateFood(snake) {
  let { x, y } = snake.head;
  while (
    isEqual(snake.head, { x, y }) ||
    snake.tail.some(cell => isEqual(cell, { x, y }))
  ) {
    x = Math.floor(Math.random() * width);
    y = Math.floor(Math.random() * height);
  }
  return { x, y };
}

function isEqual(cell1, cell2) {
  return cell1.x === cell2.x && cell1.y === cell2.y;
}

function tick(game) {
  const { snake, food } = game;
  let newHead = snake.head;

  switch (snake.dir) {
    case "up":
      newHead = { x: snake.head.x, y: snake.head.y - 1 };
      break;
    case "down":
      newHead = { x: snake.head.x, y: snake.head.y + 1 };
      break;
    case "right":
      newHead = { x: snake.head.x + 1, y: snake.head.y };
      break;
    case "left":
      newHead = { x: snake.head.x - 1, y: snake.head.y };
      break;
  }

  if (
    // kolla om den åker in i sig själv
    newHead.x < 0 ||
    newHead.x === width ||
    newHead.y < 0 ||
    newHead.y === height
  ) {
    return {
      ...game,
      isOver: true
    };
  }

  //console.log(snake.tail.length);
  const newSnake = {
    ...snake,
    head: newHead,
    // mergar tail med gamla huvud annars tar bort en del av tail
    tail: [snake.head].concat(
      snake.tail.slice(0, snake.tail.length - (isEqual(newHead, food) ? 0 : 1))
    )
  };

  return {
    ...game,
    snake: newSnake,
    food: isEqual(food, newHead) ? generateFood(newSnake) : food
  };
}

function Snake() {
  const [game, setGame] = useState(generateGame());
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGame(oldGame => tick(oldGame));
    }, 400);
    return () => clearInterval(intervalId);
  }, [gameOver]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  function handleKeyPress(event) {
    let newDir;
    switch (event.keyCode) {
      case 37:
      case 65:
        newDir = "left";
        break;
      case 38:
      case 87:
        newDir = "up";
        break;
      case 39:
      case 68:
        newDir = "right";
        break;
      case 40:
      case 83:
        newDir = "down";
        break;
    }

    setGame(oldGame => {
      return {
        ...oldGame,
        snake: {
          ...oldGame.snake,
          dir: newDir
        }
      };
    });
  }

  const cells = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = { x, y };
      const className = isEqual(cell, game.snake.head)
        ? "head"
        : game.snake.tail.some(tailCell => isEqual(tailCell, cell))
        ? "tail"
        : isEqual(cell, game.food)
        ? "food"
        : "";

      cells.push(
        <div key={`${x}- ${y}`} className={"snake-cell " + className}></div>
      );
    }
  }

  return (
    <div className="game-container">
      <div className="snake-grid">{cells}</div>
    </div>
  );
}

export default Snake;
