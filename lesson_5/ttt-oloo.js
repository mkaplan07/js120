let rs = require('readline-sync');

let Square = {
  UNUSED_SQUARE: ' ',
  HUMAN_MARKER: 'X',
  COMPUTER_MARKER: 'O',

  init(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
    return this;
  },

  toString() {
    return this.marker;
  },

  setMarker(marker) {
    this.marker = marker;
  },

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  },

  getMarker() {
    return this.marker;
  }
};

let Board = {
  init() {
    this.squares = {};

    for (let idx = 1; idx <= 9; idx += 1) {
      this.squares[idx] = Object.create(Square).init();
    }

    return this;
  },

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
  },

  clearDisplay(msg = '') {
    console.clear();
    console.log(msg);
    this.display();
  },

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  },

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  },

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });
    return markers.length;
  },

  isFull() {
    return !this.unusedSquares().length;
  }
};

let Player = {
  initialize(marker) {
    this.marker = marker;
    return this;
  },

  getMarker() {
    return this.marker;
  },
};

let Human = Object.create(Player);
let Computer = Object.create(Player);

Human.init = function() {
  return this.initialize(Square.HUMAN_MARKER);
};

Computer.init = function() {
  return this.initialize(Square.COMPUTER_MARKER);
};

let TTTGame = {
  init() {
    this.board = Object.create(Board).init();
    this.human = Object.create(Human).init();
    this.computer = Object.create(Computer).init();

    return this;
  },

  ROWS: [[1, 2, 3], [4, 5, 6], [7, 8, 9],
    [1, 4, 7], [2, 5, 8], [3, 6, 9],
    [1, 5, 9], [3, 5, 7]],

  play() {
    this.board.clearDisplay(this.displayWelcomeMessage());

    while (true) {
      this.humanMoves();
      if (this.gameOver()) break;

      this.computerMoves();
      if (this.gameOver()) break;

      this.board.clearDisplay();
    }

    this.printResult();
    this.displayGoodbyeMessage();
  },

  displayWelcomeMessage() {
    return "Welcome to Tic Tac Toe!";
  },
  displayGoodbyeMessage() {
    console.log("Thanks for playing Tic Tac Toe! Goodbye!");
  },

  humanMoves() {
    let choice;
    while (true) {
      let validChoices = this.board.unusedSquares();
      choice = rs.question(`Choose a square (${validChoices.join(", ")}):\n`);

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log('');
    }

    this.board.markSquareAt(choice, this.human.getMarker());
  },

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    let idx = Math.floor(Math.random() * validChoices.length);

    this.board.markSquareAt(validChoices[idx], this.computer.getMarker());
  },

  isWinner(player) {
    return TTTGame.ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  },

  gameOver() {
    return this.isWinner(this.human) ||
      this.isWinner(this.computer) ||
        this.board.isFull();
  },

  printResult() {
    this.board.clearDisplay();

    if (this.isWinner(this.human)) {
      console.log('You win!');
    } else if (this.isWinner(this.computer)) {
      console.log('Computer wins!');
    } else {
      console.log('The board is full!');
    }
  }
};

let game = Object.create(TTTGame).init();
game.play();
