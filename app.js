const express = require("express");
const app = express();

app.use(express.json());

const gameRouter = require("./routes/gameRouter");

app.use(gameRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
