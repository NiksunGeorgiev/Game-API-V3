const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Deck = require("../models/deck");
const Card = require("../models/card");
const DataStorage = require("../models/dataStorage");

const filepath = path.resolve(__dirname, "..", "data", "game-data.json");
const dataStorage = new DataStorage(filepath);

const createGame = (req, res) => {
  const { player1, player2 } = req.body;

  if (!player1 || !player2) {
    return res.status(400).json({ error: "Both players must be provided" });
  }

  // create a Deck and shuffle
  const deck = new Deck();
  deck.shuffle();

  // Create game
  const game = {
    id: uuidv4(),
    players: [player1, player2],
    deck: deck,
  };

  //save
  dataStorage.saveGame(game);

  res.status(201).json({
    id: game.id,
    players: game.players,
  });
};

const shuffleDeck = (req, res) => {
  const gameId = req.params.id;

  const games = dataStorage.getAllGames();

  const game = games[gameId];

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  game.deck.shuffle();

  dataStorage.saveGame(game);

  res.sendStatus(204);
};

const drawnCards = (req, res) => {
  const gameId = req.params.id;
  const n = req.params.n;

  const games = dataStorage.getAllGames();

  if (!games[gameId]) {
    return res.status(404).json({ error: "Game not found" });
  }

  const game = games[gameId];

  if (game.deck.count() === 0) {
    return res.status(400).json({ error: "Deck is empty" });
  }

  const drawnCards = game.deck.draw(n);

  dataStorage.saveGame(game);

  res.json(drawnCards);
};

const compareCards = (req, res) => {
  const { cards } = req.body;

  if (!cards || cards.length < 2) {
    return res
      .status(400)
      .json({ error: "At least two cards must be provided for comparison" });
  }

  let highestRank = -1;
  let highestCard = null;

  for (const cardString of cards) {
    const card = Card.fromString(cardString);

    if (!card) {
      return res.status(400).json({ error: "Invalid card format" });
    }

    if (card.rank > highestRank) {
      highestRank = card.rank;
      highestCard = card;
    }
  }

  res.json(highestCard);
};

const loadGames = (req, res) => {
  const games = dataStorage.getAllGames();
  res.json(games);
};

module.exports = {
  createGame,
  shuffleDeck,
  drawnCards,
  compareCards,
  loadGames,
};
