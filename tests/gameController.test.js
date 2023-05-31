const path = require("path");
const request = require("supertest");
const express = require("express");
const gameRouter = require("../routes/gameRouter");
const app = express();
app.use(express.json());
app.use(gameRouter);
const DataStorage = require("../models/dataStorage");
const Deck = require("../models/deck");

const filepath = path.resolve(__dirname, "..", "data", "game-data.json");
const dataStorage = new DataStorage(filepath);

describe("Game API", () => {
  it("should create a new game", async () => {
    const player1 = "Player 1";
    const player2 = "Player 2";

    const response = await request(app)
      .post("/game")
      .send({ player1, player2 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.players).toEqual([player1, player2]);

    const games = dataStorage.getAllGames();

    const gameId = response.body.id;
    expect(games).toHaveProperty(gameId);
    expect(games[gameId].players).toEqual([player1, player2]);
    expect(games[gameId].deck).toBeDefined();
  });

  it("should shuffle the deck of an existing game", async () => {
    createTestGame();

    const response = await request(app).put("/game/1/shuffle");

    expect(response.status).toBe(204);
  });

  it("should draw the specified number of cards from an existing game", async () => {
    const numCardsToDraw = 3;
    const games = dataStorage.getAllGames();
    const game = games["1"];

    const response = await request(app).put(`/game/1/draw/${numCardsToDraw}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(numCardsToDraw);

    const updatedGames = dataStorage.getAllGames();
    const updatedGame = updatedGames["1"];

    expect(updatedGame.deck.count()).toBe(game.deck.count() - numCardsToDraw);
  });
});

const createTestGame = () => {
  const game = {
    id: "1",
    players: ["Player 1", "Player 2"],
    deck: new Deck(),
  };

  dataStorage.saveGame(game);

  return game;
};
