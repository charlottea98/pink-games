import React from "react";
import "./MinesweeperCell.css";

function MinesweeperCell({
  isOpen,
  isMarked,
  isMine,
  minesAround,
  onClick,
  onRightClick,
}) {
  return (
    <div
      className={"ms-cell" + (isOpen ? " ms-cell-open" : "")}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();
      }}
    >
      {isMarked && <span className="ms-icon fas fa-flag"></span>}
      {isMine && isOpen && <span className="ms-icon fas fa-bomb"></span>}
      {!isMine && isOpen && minesAround > 0 && (
        <span className={"ms-icon ms-" + minesAround}>{minesAround}</span>
      )}
    </div>
  );
}

export default MinesweeperCell;
