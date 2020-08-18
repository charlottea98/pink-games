import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export function fetchLeaderboard(game, orderBy) {
  const auth = firebase.auth();
  const db = firebase.firestore();
  return auth
    .signInAnonymously()
    .then(() => {
      let query = db.collection(game);
      orderBy.forEach(rule => {
        query = query.orderBy(...rule);
      });
      return query.get();
    })
    .then(querySnapshot => {
      let leaderboard = [];
      querySnapshot.forEach(doc => {
        leaderboard.push(doc.data());
      });
      return leaderboard;
    })
    .catch(function(error) {
      console.log("Error getting leaderboard: ", error);
    });
}

export function saveScore(game, score) {
  const auth = firebase.auth();
  const db = firebase.firestore();

  return auth
    .signInAnonymously()
    .then(() => db.collection(game).add(score))
    .catch(error => console.log("Error saving score: ", error));
}

export function prettifyTime(time) {
  const seconds_total = time / 1000;
  const minutes = Math.floor(seconds_total / 60);
  const seconds = Math.floor(seconds_total % 60);
  if (minutes > 0) {
    return minutes + "min " + seconds + "s";
  } else {
    return seconds + "s";
  }
}
