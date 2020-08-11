import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMIMkbMf5DII6XrCXigqQLndFpcdCHp4I",
  authDomain: "pink-games-8689c.firebaseapp.com",
  databaseURL: "https://pink-games-8689c.firebaseio.com",
  projectId: "pink-games-8689c",
  storageBucket: "pink-games-8689c.appspot.com",
  messagingSenderId: "497722920926",
  appId: "1:497722920926:web:e9e5674db7683aac69d74f",
  measurementId: "G-BYYZRR7YGY"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(<App />, document.getElementById("app"));
