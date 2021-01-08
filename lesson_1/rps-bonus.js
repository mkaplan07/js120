let rs = require('readline-sync');

// side effects: none
// RETURNS
function createPlayer() {
  return {
    move: null,
  };
}

// side effects: none
// RETURNS
function createHuman() {
  let player = createPlayer();

  let human = {
    // side effects: mutates rpsGame.human, reads
    choose() {
      let choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];

      let choice = rs.question('Rock, paper, scissors, lizard or spock?\n');
      while (choices.indexOf(choice.toLowerCase()) === -1) {
        choice = rs.question('Rock, paper, scissors, lizard, or spock pls.\n');
      }

      this.move = choice.toLowerCase();
    }
  };

  return Object.assign(player, human);
}

// side effects: none
// RETURNS
function createBot() {
  let player = createPlayer();

  let bot = {
    // side effects: mutates rpsGame.bot
    choose(choices) {
      console.log('choices:', choices);

      let idx = Math.floor(Math.random() * choices.length);
      this.move = choices[idx];
    }
  };

  return Object.assign(player, bot);
}

// side effects: none
// RETURNS
function makeOdds() {
  return {
    choices: ['rock', 'paper', 'scissors', 'lizard', 'spock'],

    // side effects: mutates rpsGame.odds
    updateOdds(botChoice, winner) {
      if (winner === 'bot') {
        this.choices.push(botChoice);
      }
    }
  };
}

// side effects: none
// RETURNS
function createScore() {
  return {
    humanScore: 0,
    botScore: 0,

    // side effects: mutates rpsGame.scores
    updateScore(winner) {
      if (winner === 'you') {
        this.humanScore += 1;
      } else if (winner === 'bot') {
        this.botScore += 1;
      }
    }
  };
}

let rpsGame = {
  human: createHuman(),
  bot: createBot(),
  odds: makeOdds(),
  scores: createScore(),

  // side effects: writes
  displayMessage(greet) {
    console.log(greet === 'hi' ? 'Welcome to Rock, Paper, Scissors!' : 'Goodbye.');
  },

  // side effects: none
  // RETURNS
  getWinner() {
    let combos = {
      rock: ['lizard', 'scissors'],
      paper: ['rock', 'spock'],
      scissors: ['lizard', 'paper'],
      lizard: ['paper', 'spock'],
      spock: ['rock', 'scissors']
    };

    if (this.human.move === this.bot.move) {
      return 'Tie';
    } else if (combos[this.human.move].includes(this.bot.move)) {
      return 'you';
    } else {
      return 'bot';
    }
  },

  // side effects: writes
  printResults(winner) {
    console.log(`You chose: ${this.human.move}`);
    console.log(`Bot chose: ${this.bot.move}`);

    console.log(winner === 'Tie' ? `${winner}!` : `+1 to ${winner}!`);
  },

  // side effects: calls fns w/ side effects
  shareWinner() {
    let winner = this.getWinner();

    this.odds.updateOdds(this.bot.move, winner);
    this.scores.updateScore(winner);

    this.printResults(winner);
  },

  // side effects: none
  // RETURNS
  checkScore() {
    if (this.scores.humanScore === 2) {
      return '=> You win 2 of 3!';
    } else if (this.scores.botScore === 2) {
      return '=> Bot wins 2 of 3!';
    } else {
      return null;
    }
  },

  // side effects: writes
  printScore() {
    console.log(`You: ${this.scores.humanScore}, Bot: ${this.scores.botScore}`);
  },

  // side effects: reads
  // RETURNS
  playAgain() {
    let answer = rs.question('Play again? (y/n)\n');
    return answer.slice(0, 1).toLowerCase() === 'y';
  },

  // side effects: mutates rpsGame.scores, writes, calls fns w/ side effects
  play() {
    this.displayMessage('hi');
    while (true) {
      this.human.choose();
      this.bot.choose(this.odds.choices);

      this.shareWinner();

      if (this.checkScore()) {
        console.log(this.checkScore());
        this.scores = createScore(); // reset rpsGame.scores

        if (this.playAgain()) continue;
        break;
      }

      this.printScore();
      if (!this.playAgain()) break;
    }

    this.displayMessage('bye');
  }
};

rpsGame.play();
