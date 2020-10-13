// delay miliseconds
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// return random int in range 0 to n-1
// example: input 3 -> expected output 0, 1 or 2
function getRandomInt(n) {
    return Math.floor(Math.random() * Math.floor(n));
}
