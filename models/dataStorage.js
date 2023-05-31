const fs = require("fs");
const path = require("path");

const Deck = require("../models/deck");

class DataStorage {
  constructor(filepath) {
    this.filepath = filepath;
    this.createDirectory();
  }

  createDirectory() {
    const directory = path.dirname(this.filepath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  getAllGames() {
    try {
      const rawData = fs.readFileSync(this.filepath, "utf-8");
      const games = JSON.parse(rawData);

      for (const gameId in games) {
        const game = games[gameId];
        game.deck = Object.assign(new Deck(), game.deck);
      }

      return games;
    } catch (error) {
      console.error("Error reading game data:", error);
      return {};
    }
  }
  saveGame(game) {
    try {
      const games = this.getAllGames();
      games[game.id] = game;
      fs.writeFileSync(this.filepath, JSON.stringify(games, "null", " "));
      return true;
    } catch (error) {
      console.error("Failed to save game:", error);
      return false;
    }
  }
}

module.exports = DataStorage;
