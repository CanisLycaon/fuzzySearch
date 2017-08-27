const leven = require("./levenshtein");
const chalk = require("chalk");
const commonStr = require('common-substrings');

class FuzzySearch {
  constructor(words) {
    this.entries = new Set(words);

    // TODO: options
  }

  search(word) {
    if (!word) return [...this.words];

    let tree = this.generateMatchTree(word);

    let matches = [];
    function s(branch) {
      if (branch.entries.length) matches = matches.concat(branch.entries);
      if (!branch.branches.length) return;
      branch.branches.forEach(b => {
        s(b);
      });
    }

    tree.forEach((branch, score) => {
      if (score < word.length * 0.75) s(branch);
    });

    return matches;
  }

  highlight(sentence, word) {
    let result = commonStr.weigh([sentence.toLowerCase(), word.toLowerCase()], {
        minLength : 2, //the minimum length of fragment 
        minOccurrence : 2 , //the minimin occurrence of fragment 
        debug : false,  //whether to show the console messages 
        limit : 10, //the number of element return, return all if 0 or false 
        byLength : false // weigh by max longest fragment in longest string first. 
    });
    result.forEach(r => {
      let reg = new RegExp(r.name, "gi");
      sentence = sentence.replace(reg, chalk.red(r.name));
    });
    return sentence;
  }

  generateMatchTree(word) {
    // TODO: use a real tree
    let matchTree = [];

    let root = matchTree;

    this.entries.forEach(sentence => {
      let scores = this.calculateScore(sentence, word);
      let tree = root;
      let ptree = root;
      while (scores.length) {
        let score = scores.shift();
        tree[score] = tree[score] || {entries:[], branches: []};
        ptree = tree[score];
        tree = tree[score].branches;
      }
      ptree.entries.push(sentence);
    });
    return matchTree;
  }

  calculateScore(sentence, word) {
    // return the score with increase order for each word in this sentences
    return sentence.split(" ").map(w => leven.getEditDistance(w.toLowerCase(), word.toLowerCase())).sort((a, b) => a - b);
  }

  add(word) {
    if (word) this.entries.add(word);
    return this;
  }

  reload(words = []) {
    this.entries.clear();
    this.entries = new Set(words);
    return this;
  }
}

module.exports = FuzzySearch;
