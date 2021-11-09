/* global jQuery */
/* global $ */

// This is absolutely dumb.

var nodes = {
    ".FIRST": []
};

function doThisFirstSoThatEverythingWorks() {
    console.log("doing things.");
    $.get('quotes1.csv', function(data) {       // The logic here was mostly taken from http://www.bitsofpancake.com/programming/markov-chain-text-generator. I rewrote it a bit and added features and made the code a bit more clear.
        var text = data.replace(/\;|\"|\,|\?|-|\(|\)|\<|\>|\<i\>|\<\\i\>/g, "").toLowerCase().split(/\s+/g);
        nodes[".FIRST"].push(text[0]);

        for(var i = 0; i < text.length; i++) {
            if (!nodes[text[i]]) nodes[text[i]] = [];   // If the word isn't yet in the nodes object, add it
            nodes[text[i]].push(text[i + 1]);           // Add the following word to the node's array of following words

            if (~text[i].indexOf(".")) nodes['.FIRST'].push(text[i + 1]);
        }
        console.log(nodes);
        generate();
    });
}

function generate() {
    var quote = "";
    var currentNode = ".FIRST";
    var notDone = true;
    var rng = 0;
    var count = 0;
    var limit = Math.floor(Math.random()*29)+1;

    var notEndWords = [
        'a',
	    'and',
	    'the',
	    'an',
	    'to',
	    'our',
	    'it',
	    'i\'d',
	    'for',
	    'of',
	    'than',
	    'was',
	    'in',
	    'is',
	    'from',
	    'your',
	    'that',
	    'as',
	    'than',
	    'he',
	    'its',
	    'but',
	    'their',
	    'than',
	    'you\'re',
    ];

    while(notDone && count <= limit) {
        rng = Math.floor(Math.random()*nodes[currentNode].length);

        if ((~nodes[currentNode][rng].indexOf(".") || count == limit) && !notEndWords.includes(nodes[currentNode][rng])) {
            notDone = false;
            if(!~nodes[currentNode][rng].indexOf(".")) {
              quote += nodes[currentNode][rng]+".";
            } else {
              quote += nodes[currentNode][rng];
            }
            console.log(quote);
            $("#quoteContainer").html("\""+quote+"\"");
        } else {
          console.log(currentNode, nodes[currentNode][rng]);
          if(currentNode == nodes[currentNode][rng]) {
            count--;
          } else { quote += nodes[currentNode][rng]+" "; };
        }
        currentNode = nodes[currentNode][rng];
        count++;
    }
}
