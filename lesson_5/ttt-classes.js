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
  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
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
}
// Part 2, "the static keyword... is still a work in progress"
Square.UNUSED_SQUARE = ' ';
Square.HUMAN_MARKER = 'X';
Square.COMPUTER_MARKER = 'O';

// depedencies: Square
class Board {
  constructor() {
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

  clearDisplay(msg = '') {
    console.clear();
    console.log(msg);
    this.display();
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
    // reassigns obj[key].marker from ' ' to 'X' or 'O'
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
    /*
    to start, each k is set to new Square(),
    an obj whose .marker is interpolated to ' '

    That is, each k is a Square instance
    whose STATE (.marker) started at ' ' &
    may be updated by markSquareAt()
    */
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });
    return markers.length;
  }

  isFull() {
    return !this.unusedSquares().length;
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
  }
  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

// depedencies: Board, Human & Computer
class TTTGame {
  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
  }

  static ROWS = [[1, 2, 3], [4, 5, 6], [7, 8, 9],
                  [1, 4, 7], [2, 5, 8], [3, 6, 9],
                    [1, 5, 9], [3, 5, 7]];

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
  }

  displayWelcomeMessage() {
    return "Welcome to Tic Tac Toe!";
  }
  displayGoodbyeMessage() {
    console.log("Thanks for playing Tic Tac Toe! Goodbye!");
  }

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
  }

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    let idx = Math.floor(Math.random() * validChoices.length);

    this.board.markSquareAt(validChoices[idx], this.computer.getMarker());
  }

  isWinner(player) {
    return TTTGame.ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  gameOver() {
    return this.isWinner(this.human) ||
      this.isWinner(this.computer) ||
        this.board.isFull();
  }

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
}

let game = new TTTGame();
game.play();
