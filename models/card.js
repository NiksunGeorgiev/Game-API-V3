class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  isFaceCard() {
    return this.rank > 10;
  }

  static getRankFromRankString(rankString) {
    const ranks = [
      "Ace",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "Jack",
      "Queen",
      "King",
    ];
    const rankIndex = ranks.indexOf(rankString);
    if (rankIndex === -1) {
      return null;
    }
    return rankIndex + 1;
  }

  static fromString(cardString) {
    const parts = cardString.split(" of ");
    if (parts.length !== 2) {
      return null;
    }

    const rankString = parts[0];
    const suitString = parts[1];

    const rank = this.getRankFromRankString(rankString);
    const suit = suitString.toLowerCase();

    if (!rank || !suit) {
      return null;
    }

    return new Card(suit, rank);
  }
}

module.exports = Card;
