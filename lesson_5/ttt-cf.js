// cfs & prototypes, the pseudo-classical pattern

let rs = require('readline-sync');

function Square(marker) {
  this.marker = marker || Square.UNUSED_SQUARE;
}

Square.UNUSED_SQUARE = ' ';
Square.HUMAN_MARKER = 'X';
Square.COMPUTER_MARKER = 'O';

Square.prototype.toString = function() {
  return this.marker;
};

Square.prototype.setMarker = function(marker) {
  this.marker = marker;
};

Square.prototype.isUnused = function() {
  return this.marker === Square.UNUSED_SQUARE;
};

Square.prototype.getMarker = function() {
  return this.marker;
};

function Board() {
  this.squares = {};

  for (let idx = 1; idx <= 9; idx += 1) {
    this.squares[idx] = new Square();
  }
}

Board.prototype.display = function() {
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
};

Board.prototype.clearDisplay = function(msg) {
  console.clear();
  console.log(msg || '');
  this.display();
};

Board.prototype.markSquareAt = function(key, marker) {
  this.squares[key].setMarker(marker);
};

Board.prototype.unusedSquares = function() {
  let keys = Object.keys(this.squares);
  return keys.filter(key => this.squares[key].isUnused());
};

Board.prototype.countMarkersFor = function(player, keys) {
  let markers = keys.filter(key => {
    return this.squares[key].getMarker() === player.getMarker();
  });
  return markers.length;
};

Board.prototype.isFull = function() {
  return this.unusedSquares().length === 0;
};

function Player(marker) {
  this.marker = marker;
}

Player.prototype.getMarker = function() {
  return this.marker;
};

function Human() {
  Player.call(this, Square.HUMAN_MARKER);
}

function Computer() {
  Player.call(this, Square.COMPUTER_MARKER);
}

Human.prototype = Object.create(Player.prototype);
Human.prototype.constructor = Human;

Computer.prototype = Object.create(Player.prototype);
Computer.prototype.constructor = Computer;

function TTTGame() {
  this.board = new Board();
  this.human = new Human();
  this.computer = new Computer();
}

TTTGame.ROWS = [[1, 2, 3], [4, 5, 6], [7, 8, 9],
                  [1, 4, 7], [2, 5, 8], [3, 6, 9],
                    [1, 5, 9], [3, 5, 7]];

TTTGame.prototype.play = function() {
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
};

TTTGame.prototype.displayWelcomeMessage = function() {
  return 'Welcome to Tic Tac Toe!';
};

TTTGame.prototype.displayGoodbyeMessage = function() {
  console.log("Thanks for playing Tic Tac Toe! Goodbye!");
};

TTTGame.prototype.humanMoves = function() {
  let choice;
  while (true) {
    let validChoices = this.board.unusedSquares();
    choice = rs.question(`Choose a square (${validChoices.join(", ")}):\n`);

    if (validChoices.includes(choice)) break;

    console.log("Sorry, that's not a valid choice.");
    console.log('');
  }

  this.board.markSquareAt(choice, this.human.getMarker());
};

TTTGame.prototype.computerMoves = function() {
  let validChoices = this.board.unusedSquares();
  let idx = Math.floor(Math.random() * validChoices.length);

  this.board.markSquareAt(validChoices[idx], this.computer.getMarker());
};

TTTGame.prototype.isWinner = function(player) {
  return TTTGame.ROWS.some(row => {
    return this.board.countMarkersFor(player, row) === 3;
  });
};

TTTGame.prototype.gameOver = function() {
  return this.isWinner(this.human) ||
    this.isWinner(this.computer) ||
      this.board.isFull();
};

TTTGame.prototype.printResult = function() {
  this.board.clearDisplay();

  if (this.isWinner(this.human)) {
    console.log('You win!');
  } else if (this.isWinner(this.computer)) {
    console.log('Computer wins!');
  } else {
    console.log('The board is full!');
  }
};

let game = new TTTGame();
game.play();
