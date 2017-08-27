const FuzzySearch = require("../src/index");
const debug = require("debug")("fuzzySearch-bin");
const argv = require('minimist')(process.argv.slice(2));

const words = require("../testdata")["english_wordlist_2k"];
const sentences = require("../testdata")["hearthstone_cardlist"];

const fs = new FuzzySearch(sentences);

let matches = fs.search("awesome");
matches.slice(0, 10).map(v => {
  console.log(fs.highlight(v, "awesome"));
});
