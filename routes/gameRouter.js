const express = require("express");
const router = express.Router();

const gameControler = require("../controllers/gameController");

router.post("/game", gameControler.createGame);
router.put("/game/:id/shuffle", gameControler.shuffleDeck);
router.put("/game/:id/draw/:n", gameControler.drawnCards);
router.post("/compare-cards", gameControler.compareCards);

router.get("/", gameControler.loadGames);

module.exports = router;
