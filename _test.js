const express = require('express')
const app = express()
const port = 3001

/*
app.get('/', (request, response) => {
    console.log('222');
});*/


let obj = {}, map = new Map(), n = 1000000, nn = 50;



for (let i = 1; i <= nn; i++){
    console.log(i + '.-------------------------------------------------');
    //console.time(i);
    for (let i = 1; i <= n; i++) {
        //console.log(i);console.log(i);
        map.set(i.toString(),i);
    }
    //console.timeEnd(i);


    let hasLOW, hasMAX, getLOW, getMAX;

    console.time('hasLOW');
    hasLOW = map.has('123');
    console.timeEnd('hasLOW');  

    console.time('hasMAX');
    hasMAX = map.has((n-1).toString());
    console.timeEnd('hasMAX');

    console.time('getLOW');
    getLOW = map.get(123);
    console.timeEnd('getLOW');  

    console.time('getMAX');
    getMAX = map.get(n);
    console.timeEnd('getMAX');
}




app.listen(port, () => {
  //console.log(`App running on port ${port}.`)
})