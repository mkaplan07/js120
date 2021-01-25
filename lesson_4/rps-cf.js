const rs = require('readline-sync');

function Player() {
  this.move = null;
}

function Human() {
  Player.call(this);
  /* Why not new Player()?
  "Since Player.prototype doesn't have any methods,
  Human.prototype doesn't need to inherit from it.
  We only need to reuse the Player constructor
  in our Human constructor."

  https://launchschool.com/posts/e740fdd0
  "...the state from Player needs to be copied into the [Human] object."

  Blue: "If you later add methods to Player.prototype..."
  */
}

Human.prototype.choose = function() {
  const choices = ['rock', 'paper', 'scissors'];

  let choice = rs.question('Rock, paper, or scissors?\n');
  while (choices.indexOf(choice.toLowerCase()) === -1) {
    choice = rs.question('Rock, paper, or scissors pls.\n');
  }

  this.move = choice.toLowerCase();
}

function Computer() {
  Player.call(this);
}

Computer.prototype.choose = function() {
  const choices = ['rock', 'paper', 'scissors'];

  let randomIdx = Math.floor(Math.random() * choices.length);
  this.move = choices[randomIdx];
}

function RPSGame() {
  this.human = new Human();
  this.computer = new Computer();
}

RPSGame.prototype = {
  displayMessage(greet) {
    if (greet === 'hi') {
      console.log('Welcome to Rock, Paper, Scissors!');
    } else {
      console.log('Goodbye.');
    }
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You chose: ${humanMove}`);
    console.log(`Computer chose: ${computerMove}`);

    let humanChoices = ['rock', 'paper', 'scissors'];
    let computerChoices = ['paper', 'scissors', 'rock'];

    if (humanMove === computerMove) {
      console.log('It\'s a tie!');
    } else if (humanChoices.indexOf(humanMove)
                === computerChoices.indexOf(computerMove)) {
      console.log('Computer wins!');
    } else {
      console.log('You win!');
    }
  },

  playAgain() {
    let answer = rs.question('Play again? (y/n)\n');
    return answer.slice(0, 1).toLowerCase() === 'y';
  },

  play() {
    this.displayMessage('hi');
    while (true) {
      this.human.choose();
      this.computer.choose();
      this.displayWinner();
      if (!this.playAgain()) break;
    }

    this.displayMessage('bye');
  }
}

RPSGame.prototype.constructor = RPSGame;
/* RPSGame.prototype = {} w/ no .constructor
RPSGame.prototype.methodName = function() {},
  & we wouldn't have to do this
  */

let game = new RPSGame();
// console.log(game.constructor);
game.play();
