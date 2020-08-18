import React, { useState, useEffect } from "react";
import "./index.css";
import TouchController from "./TouchController";
import StatusBar from "../StatusBar";
import prettifyTime from "../memory/index";
import ResultModal from "../ResultModal";
import * as utils from "../../utils";
import Preloads from "./Preloads";

const width = 20;
const height = 12;
const initialIntervalMs = 400;

function generateGame() {
  const snake = {
    head: { x: width / 2, y: height / 2 },
    tail: [{ x: width / 2 - 1, y: height / 2 }],
    dir: "right"
  };
  return {
    snake,
    food: generateFood(snake),
    isOver: false,
    commands: []
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

function isOpposite(dir1, dir2) {
  return (
    (dir1 === "right" && dir2 === "left") ||
    (dir1 === "left" && dir2 === "right") ||
    (dir1 === "up" && dir2 === "down") ||
    (dir1 === "down" && dir2 === "up")
  );
}

function tick(game) {
  if (game.isOver) return game;
  const { snake, food, commands } = game;

  let newCommands = [...commands];
  //sålänge det finns commands och det är ett giltigt move
  while (
    newCommands.length > 0 &&
    (isOpposite(newCommands[0], snake.dir) || newCommands[0] === snake.dir)
  ) {
    newCommands = newCommands.slice(1); // tar bort nollte element i listan
  }

  let newDir = snake.dir;
  if (newCommands.length > 0) {
    newDir = newCommands[0];
    newCommands = newCommands.slice(1);
  }

  let newHead = snake.head; //kan behöva ändras

  switch (newDir) {
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
    newHead.y === height ||
    snake.tail.some(cell => isEqual(cell, newHead))
  ) {
    return {
      ...game,
      isOver: true
    };
  }

  const newSnake = {
    ...snake,
    head: newHead,
    // mergar tail med gamla huvud annars tar bort en del av tail
    tail: [snake.head].concat(
      snake.tail.slice(0, snake.tail.length - (isEqual(newHead, food) ? 0 : 1))
    ),
    dir: newDir
  };

  return {
    ...game,
    snake: newSnake,
    food: isEqual(food, newHead) ? generateFood(newSnake) : food,
    commands: newCommands
  };
}

function getIntervalMs(game) {
  const food = game.snake.tail.length - 1;
  return initialIntervalMs * Math.pow(0.95, Math.floor(food / 3));
}

function Snake() {
  const [game, setGame] = useState(generateGame());
  const [gameOver, setGameOver] = useState(false);
  const [intervalMs, setIntervalMs] = useState(initialIntervalMs);

  const [startTime, setStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [scoreIsSaved, setScoreIsSaved] = useState(false);

  useEffect(() => {
    if (!gameOver) {
      const intervalId = setInterval(() => {
        setGame(oldGame => {
          const newGame = tick(oldGame);
          if (newGame.isOver) {
            setGameOver(true);
            setShowModal(true);
          }
          setIntervalMs(getIntervalMs(newGame));
          return newGame;
        });
      }, intervalMs);
      return () => clearInterval(intervalId);
    }
  }, [gameOver, intervalMs]);

  useEffect(() => {
    // städa upp win
    if (!gameOver) {
      const intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [startTime, gameOver]);

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
    addCommand(newDir);
  }

  function addCommand(dir) {
    setGame(oldGame => {
      return {
        ...oldGame,
        commands: [...oldGame.commands, dir]
      };
    });
  }

  function onChangeDir(dir) {}

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
        <div key={`${x}-${y}`} className={"snake-cell " + className}></div>
      );
    }
  }

  function onRestart() {
    setGame(generateGame());
    setGameOver(false);
    setIntervalMs(initialIntervalMs);
    setStartTime(Date.now());
    setElapsedTime(0);
    setScoreIsSaved(false);
  }

  function fetchLeaderboard() {
    return utils
      .fetchLeaderboard("snake", [
        ["score", "desc"],
        ["timeMs", "asc"]
      ])
      .then(lb => {
        return lb.map(({ name, score }, i) => `${i + 1}. ${name}: ${score}`);
      });
  }

  function saveScore(name) {
    if (name) {
      utils
        .saveScore("snake", {
          name: name,
          timeMs: elapsedTime,
          score: game.snake.tail.length - 1
        })
        .then(() => setScoreIsSaved(true));
    }
  }

  return (
    <div className="game-container">
      <Preloads />
      <StatusBar
        status={"Time: " + utils.prettifyTime(elapsedTime)}
        score={"Score: " + (game.snake.tail.length - 1)}
        onRestart={onRestart}
        showLeaderboard={() => setShowModal(true)}
      ></StatusBar>
      <div className="snake-grid">{cells}</div>
      <ResultModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        header={gameOver ? "Game Over..." : "Leaderboard"}
        body={gameOver ? "Your score was " + (game.snake.tail.length - 1) : ""}
        fetchLeaderboard={fetchLeaderboard}
        saveScore={gameOver && !scoreIsSaved && saveScore}
      />
      <TouchController onChangeDir={addCommand} />
    </div>
  );
}

export default Snake;
