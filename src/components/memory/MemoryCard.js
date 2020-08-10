import React from "react";
import "./MemoryCard.css";

function MemoryCard({ isFlipped, color, onClick }) {
  return (
    <div className="memory-scene" onClick={onClick}>
      <div className={"memory-card-container" + (isFlipped ? " flipped" : "")}>
        <div className={"memory-card memory-card-back"}></div>
        <div className={"memory-card memory-card-front " + color}></div>
      </div>
    </div>
  );
}

export default MemoryCard;
