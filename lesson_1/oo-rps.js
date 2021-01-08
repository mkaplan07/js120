const rs = require('readline-sync');

function createPlayer() {
  return {
    move: null,
  };
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      const choices = ['rock', 'paper', 'scissors'];

      let choice = rs.question('Rock, paper, or scissors?\n');
      while (choices.indexOf(choice.toLowerCase()) === -1) {
        choice = rs.question('Rock, paper, or scissors pls.\n');
      }

      this.move = choice.toLowerCase();
    }
  };

  return Object.assign(playerObject, humanObject);
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    choose() {
      const choices = ['rock', 'paper', 'scissors'];

      let randomIdx = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIdx];
    }
  };

  return Object.assign(playerObject, computerObject);
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

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
};

RPSGame.play();
