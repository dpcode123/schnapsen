/**
  * Fisher-Yates shuffle
  * https://bost.ocks.org/mike/shuffle/
  * https://blog.codinghorror.com/the-danger-of-naivete/
  * https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
  */
export function shuffle(array) {
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}