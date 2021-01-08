function bookFactory(title, author, read = false) {
  return {
    title,
    author,
    read,

    getDescription() {
      return `${this.title} was written by ${this.author}. ` +
        `I ${this.read ? 'have' : 'haven\'t'} read it.`;
    },

    readBook() {
      this.read = true;
    },
  }
}

let mythos = bookFactory('Mythos', 'Stephen Fry', true);
let meTalk = bookFactory('Me Talk Pretty One Day', 'David Sedaris');
let aunts = bookFactory('Aunts Aren\'t Gentlemen', 'PG Wodehouse');

console.log(mythos.getDescription());

console.log(meTalk.getDescription());
meTalk.readBook();
console.log('meTalk.read:', meTalk.read);
console.log(meTalk.getDescription());
