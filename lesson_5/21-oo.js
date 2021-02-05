/*
https://launchschool.com/lessons/93a83d87/assignments/83ff3989
Deck constructor { SUITS.forEach, RANKS.forEach } this.shuffleCards()
Player constructor { money & resetHand() } + methods like updateBank & checkBank
Dealer constructor { resetHand() },
  Object.assign(Player/Dealer.prototype, Hand)

Math is part of TwentyOneGame –
  "...the point values are specific to the game of 21,
  not to a general purpose playing card."
*/

let rs = require('readline-sync');

class Side {
  constructor() {
    this.bank = 100;
  }

  init() {
    // unlike this.bank & cards (Deck), these are reset every game
    this.hand = [];
    this.aces = 0;
    this.total = 0;
  }

  hit(card) {
    this.hand.push(card);

    if (card === 'A') {
      this.aces += 1;
    }

    this.total += this.getVal(card);
  }

  getVal(card) {
    if ('JQK'.includes(card)) {
      return 10;
    } else if (card === 'A') {
      return 11;
    } else {
      return Number(card);
    }
  }

  checkAces() {
    while (this.total > 21) {
      if (this.aces) {
        this.total -= 10;
        this.aces -= 1;
      } else {
        break;
      }
    }
  }

  calcHand() {
    this.checkAces(this.total);
    return this.total;
  }

  isBust() {
    return this.calcHand() > 21;
  }
}

class Player extends Side {
  constructor() {
    super();
  }
}

class Dealer extends Side {
  constructor() {
    super();
  }
}

class Deck {
  constructor() {
    this.cards = this.shuffle();
  }

  static RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

  shuffle() {
    let cards = {};
    Deck.RANKS.forEach(function(rank) {
      cards[rank] = 8; // two decks
    });
    return cards;
  }

  deal() {
    let idx = Math.floor(Math.random() * Deck.RANKS.length);
    this.cards[Deck.RANKS[idx]] -= 1;
    return Deck.RANKS[idx];
  }
}

class Game {
  constructor() {
    this.player = new Player();
    this.dealer = new Dealer();
    this.deck = new Deck();

    this.winner = undefined;
  }

  play() {
    console.clear();
    this.greeter(true);
    while (true) {
      this.start();

      this.goPlayer();

      /*eslint no-unused-expressions: [2, { allowTernary: true }]*/
      this.player.isBust() ? this.displayBust(this.player) : this.goDealer();

      this.handleResult();

      if (this.checkBank()) {
        console.log(this.checkBank());
        break;
      }

      if (!this.playAgain()) break;

      console.clear();
      this.shuffleCheck();
    }
    this.greeter(false);
  }

  greeter(msg) {
    console.log(`♣ ♦ ♥ ♠ ${msg ? 'Welcome to 21' : 'Goodbye'}`);
  }

  start() {
    this.player.init();
    this.dealer.init();

    while (this.dealer.hand.length < 2) {
      this.player.hit(this.deck.deal());
      this.dealer.hit(this.deck.deal());
    }
  }

  hitOrStay() {
    let ans = rs.question(`(H)it or (S)tay?\n`);
    while (!'HhSs'.includes(ans[0])) {
      ans = rs.question(`H or S, pls.\n`);
    }
    return ans[0].toLowerCase();
  }

  goPlayer() {
    console.log(`\nBank $${this.player.bank}`);
    this.displayStatus(this.player);

    while (this.hitOrStay() === 'h') {
      this.player.hit(this.deck.deal());

      if (this.player.isBust()) break;

      this.displayStatus(this.player);
    }
  }

  goDealer() {
    this.displayStatus(this.dealer);

    while (this.dealer.calcHand() < 17) {
      this.dealer.hit(this.deck.deal());
      console.log(`Dealer takes a card, ${this.dealer.hand.slice(-1).pop()}`);

      if (this.dealer.isBust()) {
        this.displayBust(this.dealer);
        break;
      }

      this.displayStatus(this.dealer);
    }
  }

  displayStatus(side) {
    if (side === this.player) {
      console.log(`Your total: ${this.player.calcHand()} [${this.player.hand}]`);
      console.log(`Vs. dealer's ${this.dealer.hand[1]}`);
    } else {
      console.log(`Dealer total: ${this.dealer.calcHand()} [${this.dealer.hand}]`);
    }
  }

  displayBust(side) {
    if (side === this.player) {
      console.log(`Busted at ${this.player.calcHand()} [${this.player.hand}]`);
    } else {
      console.log(`Dealer busts at ${this.dealer.calcHand()} [${this.dealer.hand}]`);
    }
  }

  handleResult() {
    this.getWinner();
    this.displayWinner();
    this.updateBank();
  }

  getWinner() {
    if (this.player.isBust()) {
      this.winner = 'Dealer';
    } else if (this.dealer.isBust()) {
      this.winner = 'You';
    } else if (this.player.calcHand() > this.dealer.calcHand()) {
      this.winner = 'You';
    } else if (this.dealer.calcHand() > this.player.calcHand()) {
      this.winner = 'Dealer';
    } else {
      this.winner = 'Push';
    }
  }

  displayWinner() {
    if (this.winner === 'You') {
      console.log(`${this.winner} win!`);
    } else if (this.winner === 'Dealer') {
      console.log(`${this.winner} wins!`);
    } else {
      console.log(this.winner);
    }
  }

  updateBank() {
    if (this.winner === 'You') {
      this.player.bank += 25;
    } else if (this.winner === 'Dealer') {
      this.player.bank -= 25;
    }
  }

  checkBank() {
    if (this.player.bank === 200) {
      return `=> Bank $${this.player.bank}`;
    } else if (this.player.bank === 0) {
      return `=> Bank $${this.player.bank}`;
    } else {
      return false;
    }
  }

  playAgain() {
    let ans = rs.question('Play again?\n');
    while (!'YyNn'.includes(ans[0])) {
      ans = rs.question('Y or N, pls.\n');
    }

    return ans[0].toLowerCase() === 'y';
  }

  shuffleCheck() {
    let keys = Object.keys(this.deck.cards);
    let used = keys.filter(key => this.deck.cards[key] < 6);

    if (used.length)  {
      this.deck = new Deck();
      console.log(`low on ${used.join('s, ')}s, shuffling...`);
    } else {
      console.log('♣ ♦ ♥ ♠');
    }
  }
}

let twentyOne = new Game();
twentyOne.play();
