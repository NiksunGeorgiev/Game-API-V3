const express = require("express");
const router = express.Router();

const gameControler = require("../controllers/gameController");

const { v4: uuidv4 } = require("uuid");
const Deck = require("../models/deck");
const Card = require("../models/card");

const games = {};

router.post("/game", (req, res) => {
  const { player1, player2 } = req.body;

  // Проверка за валидни имена на играчите
  if (!player1 || !player2) {
    return res.status(400).json({ error: "Both players must be provided" });
  }

  // Инстанциране на ново тесте и разбъркване
  const deck = new Deck();
  deck.shuffle();

  // Създаване на обект за играта
  const game = {
    id: uuidv4(),
    players: [player1, player2],
    deck: deck,
  };

  // Запазване на обекта за играта за по-нататъшно използване

  games[game.id] = game;

  // Връщане на информацията за играта като JSON
  res.status(201).json({
    id: game.id,
    players: game.players,
  });
});

router.post("/game/:id/shuffle", (req, res) => {
  const gameId = req.params.id;

  // Проверка дали играта съществува
  if (!games[gameId]) {
    return res.status(404).json({ error: "Game not found" });
  }

  const game = games[gameId];
  console.log(game);

  // Разбъркване на тестето
  game.deck.shuffle();

  res.sendStatus(204); // Успешно разбъркване, връщаме HTTP статус "204 No Content"
});

// Изтегляне на карта от тестето на конкретна игра
router.post("/game/:id/draw/:n", (req, res) => {
  const gameId = req.params.id;
  const n = req.params.n;
  // Проверка дали играта съществува
  if (!games[gameId]) {
    return res.status(404).json({ error: "Game not found" });
  }

  const game = games[gameId];

  // Проверка дали тестето е празно
  if (game.deck.count() === 0) {
    return res.status(400).json({ error: "Deck is empty" });
  }

  // Изтегляне на карта от тестето
  const drawnCards = game.deck.draw(n);

  res.json(drawnCards);
});

// Сравнение на карти по техния четимо представяне
router.post("/compare-cards", (req, res) => {
  const { cards } = req.body;
  console.log(cards);
  // Проверка дали са предоставени карти за сравнение
  if (!cards || cards.length < 2) {
    return res
      .status(400)
      .json({ error: "At least two cards must be provided for comparison" });
  }

  let highestRank = -1;
  let highestCard = null;

  for (const cardString of cards) {
    const card = Card.fromString(cardString);

    // Проверка дали картата е валидна
    if (!card) {
      return res.status(400).json({ error: "Invalid card format" });
    }

    // Сравнение на ранга на картата с най-високия ранг досега
    if (card.rank > highestRank) {
      highestRank = card.rank;
      highestCard = card;
    }
  }

  res.json(highestCard);
});

module.exports = router;

router.get("/", (req, res) => res.send(games));

module.exports = router;
