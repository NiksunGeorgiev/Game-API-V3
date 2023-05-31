const express = require("express");
const app = express();

app.use(express.json());

const gameRouter2 = require("./routes/gameRouter");

app.use(gameRouter2);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
