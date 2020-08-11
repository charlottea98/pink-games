import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function ResultModal({
  show,
  handleClose,
  header,
  body,
  fetchLeaderboard,
  saveScore
}) {
  const [leaderboard, setLeaderboard] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    if (show) {
      fetchLeaderboard().then(lb => setLeaderboard(lb));
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{body}</p>
        {leaderboard ? (
          leaderboard.map((entry, i) => <p key={i}>{entry}</p>)
        ) : (
          <p>Loading leaderboard...</p>
        )}

        {saveScore && (
          <Form.Control
            type="text"
            placeholder="Your name"
            onChange={event => setName(event.target.value)}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="light"
          onClick={() => {
            if (saveScore) saveScore(name);
            handleClose();
          }}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ResultModal;
