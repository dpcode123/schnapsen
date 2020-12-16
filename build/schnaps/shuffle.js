/**
 * Fisher-Yates shuffle
 */
export function shuffle(array) {
    let m = array.length;
    // While there are remaining elements to shuffle
    while (m) {
        // get random element index
        const r = Math.floor(Math.random() * m--);
        // swap it with current element
        const t = array[m];
        array[m] = array[r];
        array[r] = t;
    }
    return array;
}
