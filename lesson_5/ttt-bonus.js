let rs = require('readline-sync');

class Square {
  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }
  // Part 2, override Object.prototype.toString()
  toString() {
    return this.marker;
  }
  setMarker(marker) {
    this.marker = marker;
  }
  getMarker() {
    return this.marker;
    /*
    Part 5,
    "We could use toString... but our interest is the value
    of the marker, not what it looks like on the board.
    Using getMarker() makes the intent easier to discern."
    */
  }
  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }
}
// Part 2, "the static keyword... is still a work in progress"
Square.UNUSED_SQUARE = ' ';
Square.HUMAN_MARKER = 'X';
Square.BOT_MARKER = 'O';

class Board {
  constructor() {
    this.init();
  }

  init() {
    this.squares = {};
    for (let idx = 1; idx <= 9; idx += 1) {
      this.squares[idx] = new Square();
    }
  }

  display() {
    console.log('');
    console.log('1    |2    |3');
    console.log(`  ${this.squares[1]}  |  ${this.squares[2]}  |  ${this.squares[3]}`);
    console.log('     |     |');
    console.log('-----+-----+-----');
    console.log('4    |5    |6');
    console.log(`  ${this.squares[4]}  |  ${this.squares[5]}  |  ${this.squares[6]}`);
    console.log('     |     |');
    console.log('-----+-----+-----');
    console.log('7    |8    |9');
    console.log(`  ${this.squares[7]}  |  ${this.squares[8]}  |  ${this.squares[9]}`);
    console.log('     |     |');
    console.log('');
  }

  clearDisplay(msg) {
    console.clear();
    console.log(msg);
    this.display();
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });
    return markers.length;
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
    // reassigns obj[key].marker from ' ' to 'X' or 'O'
  }

  isUnusedSquare(key) {
    return this.squares[key].isUnused();
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.isUnusedSquare(key));
    /*
    to start, each k is set to new Square(),
    an obj whose .marker is interpolated to ' '

    That is, each k is a Square instance
    whose STATE (.marker) started at ' ' &
    may be updated by markSquareAt()
    */
  }

  isFull() {
    return !this.unusedSquares().length;
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
    this.score = 0;
  }

  getMarker() {
    return this.marker;
  }

  getScore() {
    return this.score;
  }

  incrementScore() {
    this.score += 1;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Bot extends Player {
  constructor() {
    super(Square.BOT_MARKER);
  }
}

class TTTGame {
  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.bot = new Bot();
  }

  static ROWS = [[1, 2, 3], [4, 5, 6], [7, 8, 9],
    [1, 4, 7], [2, 5, 8], [3, 6, 9],
    [1, 5, 9], [3, 5, 7]];

  static MIN = 2;
  static MAX = (TTTGame.MIN * 2) - 1;

  static joinOr(arr, sep = ', ', word = 'or') {
    let main = arr.slice(0, -1);
    let last = arr.slice(-1);

    if (arr.length === 1) {
      return arr[0];
    } else if (arr.length === 2) {
      return `${main} ${word} ${last}`;
    } else {
      return `${main.join(sep)}${sep}${word} ${last}`;
    }
  }

  play() {
    this.board.clearDisplay(this.displayWelcomeMessage());
    let first = this.getFirst();

    while (true) {
      this.playOnce(first);

      this.updateScore();
      this.printResult();

      if (this.endMatch()) {
        this.displayMatchWinner();
        break;
      }
      if (!this.playAgain()) break;

      this.board.init();
      this.board.clearDisplay(this.displayScore());
      first = !first;
    }

    this.displayGoodbyeMessage();
  }

  displayWelcomeMessage() {
    return "Welcome to Tic Tac Toe!";
  }

  displayGoodbyeMessage() {
    console.log("Thanks for playing Tic Tac Toe! Goodbye!");
  }

  displayScore() {
    return ` You: ${this.human.getScore()},  Bot: ${this.bot.getScore()}`;
  }

  getFirst() {
    let first = rs.question("Who's first, human or bot?\n");
    while (!'HhBb'.includes(first[0])) {
      first = rs.question('(H)uman or (B)ot, pls.\n');
    }
    return first[0].toLowerCase() === 'h';
  }

  goHuman() {
    let choice;
    while (true) {
      let validChoices = this.board.unusedSquares();
      choice = rs.question(`Choose a square (${TTTGame.joinOr(validChoices)}):\n`);

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log('');
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  goBot() {
    let choice;
    if (this.powerMove(this.bot)) {
      choice = this.powerMove(this.bot);
    } else if (this.powerMove(this.human)) {
      choice = this.powerMove(this.human);
    } else if (this.board.isUnusedSquare(5)) {
      choice = 5;
    } else {
      let validChoices = this.board.unusedSquares();
      let idx = Math.floor(Math.random() * validChoices.length);
      choice = validChoices[idx];
    }

    this.board.markSquareAt(choice, this.bot.getMarker());
    this.board.clearDisplay(this.displayScore());
  }

  powerMove(player) {
    for (let idx = 0; idx < TTTGame.ROWS.length; idx += 1) {
      let row = TTTGame.ROWS[idx];
      if (this.board.countMarkersFor(player, row) === 2) {
        let idx = row.findIndex(key => this.board.isUnusedSquare(key));
        if (idx >= 0) return row[idx];
      }
    }
    return null;
  }

  playOnce(player) {
    while (true) {
      /*eslint no-unused-expressions: [2, { allowTernary: true }]*/
      player ? this.goHuman() : this.goBot();

      if (this.gameOver()) break;
      player = !player;
    }
  }

  isWinner(player) {
    return TTTGame.ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  gameOver() {
    return this.isWinner(this.human) ||
      this.isWinner(this.bot) ||
        this.board.isFull();
  }

  updateScore() {
    if (this.isWinner(this.human)) {
      this.human.incrementScore();
    } else if (this.isWinner(this.bot)) {
      this.bot.incrementScore();
    }
  }

  printResult() {
    this.board.clearDisplay(this.displayScore());

    if (this.isWinner(this.human)) {
      console.log('You win!');
    } else if (this.isWinner(this.bot)) {
      console.log('Bot wins!');
    } else {
      console.log('The board is full!');
    }
  }

  endMatch() {
    return this.human.getScore() === TTTGame.MIN ||
     this.bot.getScore() === TTTGame.MIN;
  }

  displayMatchWinner() {
    let msg;
    if (this.human.getScore() > this.bot.getScore()) {
      msg = `✨You: ${this.human.getScore()},  Bot: ${this.bot.getScore()}`;
      this.board.clearDisplay(msg);
      console.log(`You win ${TTTGame.MIN} of ${TTTGame.MAX}!`);
    } else {
      msg = ` You: ${this.human.getScore()}, ✨Bot: ${this.bot.getScore()}`;
      this.board.clearDisplay(msg);
      console.log(`Bot wins ${TTTGame.MIN} of ${TTTGame.MAX}!`);
    }
  }

  playAgain() {
    let ans = rs.question('Play again?\n');
    while (!ans || !'yn'.includes(ans.toLowerCase())) {
      ans = rs.question('y or n, pls.\n');
    }
    return 'Yy'.includes(ans);
  }
}

let game = new TTTGame();
game.play();
