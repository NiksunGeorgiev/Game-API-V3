const Card = require("./card");

class Deck {
  constructor() {
    this.cards = [];

    const suits = ["hearts", "diamonds", "spades", "clubs"];
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    for (const suit of suits) {
      for (const rank of ranks) {
        const card = new Card(suit, rank);
        this.cards.push(card);
      }
    }
  }

  count() {
    return this.cards.length;
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  draw(n) {
    return this.cards.splice(-n);
  }
}

module.exports = Deck;
