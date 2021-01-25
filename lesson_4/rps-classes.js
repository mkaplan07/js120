const rs = require('readline-sync');

class Player {
  constructor() {
    this.move = null;
  }
}

class Human {
  constructor() {
    new Player();
    /* Player cannot be invoked without 'new'
    or, class Computer extends Player... super()
    */
  }

  choose() {
    const choices = ['rock', 'paper', 'scissors'];

    let choice = rs.question('Rock, paper, or scissors?\n');
    while (choices.indexOf(choice.toLowerCase()) === -1) {
      choice = rs.question('Rock, paper, or scissors pls.\n');
    }

    this.move = choice.toLowerCase();
  }
}

class Computer extends Player {
  constructor() {
    super();
  }

  choose() {
    const choices = ['rock', 'paper', 'scissors'];

    let randomIdx = Math.floor(Math.random() * choices.length);
    this.move = choices[randomIdx];
  }
}

class RPSGame {
  constructor() {
    this.human = new Human();
    this.computer = new Computer();
  }

  displayMessage(greet) {
    if (greet === 'hi') {
      console.log('Welcome to Rock, Paper, Scissors!');
    } else {
      console.log('Goodbye.');
    }
  }

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
  }

  playAgain() {
    let answer = rs.question('Play again? (y/n)\n');
    return answer.slice(0, 1).toLowerCase() === 'y';
  }

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
};

let game = new RPSGame();
// console.log(game.constructor);
game.play();
