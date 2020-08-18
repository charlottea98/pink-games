import React from "react";
import Button from "react-bootstrap/Button";
import "./StatusBar.css";

function StatusBar({ status, score, onRestart, showLeaderboard }) {
  return (
    <div className="status-bar">
      <div className="status-row">
        <p className="status">{status}</p>
        <p className="score">{score}</p>
      </div>
      <Button variant="light" className="button" onClick={showLeaderboard}>
        Leaderboard
      </Button>
      <Button variant="light" className="button" onClick={onRestart}>
        Restart
      </Button>
    </div>
  );
}

export default StatusBar;
