import React, { useState } from "react";
import "./index.css";
import MinesweeperCell from "./MinesweeperCell";

const size = 10;
const mines = 15;

function generateGrid() {
  const grid = [];
  for (let i = 0; i < size * size; i++) {
    grid.push({
      isOpen: false,
      isMine: false,
      isMarked: false
    });
  }

  for (let i = 0; i < mines; i++) {
    let x = random(size);
    let y = random(size);
    while (grid[y * size + x].isMine) {
      x = random(size);
      y = random(size);
    }
    grid[y * size + x].isMine = true;
  }

  return grid;
}

function random(max) {
  return Math.floor(Math.random() * max);
}

function openCell(grid, x, y) {}

function markCell(grid, x, y) {}

function minesAround(grid, x, y) {}

function Minesweeper() {
  const [grid, setGrid] = useState(generateGrid());

  function onCellClick(x, y) {
    setGrid(oldGrid => openCell(oldGrid, x, y));
  }

  function onCellRightClick(x, y) {
    setGrid(oldGrid => markCell(oldGrid, x, y));
  }

  const cells = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = grid[y * size + x];
      cells.push(
        <MinesweeperCell
          key={x + "-" + y}
          {...cell}
          minesAround={minesAround(grid, x, y)}
          onClick={() => onCellClick(x, y)}
          onRightClick={() => onCellRightClick(x, y)}
        />
      );
    }
  }

  return (
    <div className="game-container">
      <div className="ms-grid">{cells}</div>
    </div>
  );
}

export default Minesweeper;
