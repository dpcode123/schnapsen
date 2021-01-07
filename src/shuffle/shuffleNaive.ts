/**
 * Naive shuffling algorithm
 */
export function shuffleNaive(array) {

    // Loop through all elements
    for (let i = 0; i < array.length; i++) {
        // get random element index
        const r = Math.floor(Math.random() * array.length);
        
        // swap it with current element
        const t = array[i];
        array[i] = array[r];
        array[r] = t;
    }
    return array;
}
