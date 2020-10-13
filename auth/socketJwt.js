require('dotenv').config();
const jwt = require('jsonwebtoken');


function signToken(payload){
    const socketJwt = jwt.sign(payload, Buffer.from(process.env.SOCKET_TOKEN_SECRET, 'base64'));

    return socketJwt;
}

function validateToken(socketJwt){

    const tokenPayload = jwt.verify(socketJwt, Buffer.from(process.env.SOCKET_TOKEN_SECRET, 'base64'), function(err, decoded) {
        if(err){return false;}
        
        //console.log(decoded);
        return decoded;
    });

    return tokenPayload;
}


module.exports = { signToken, validateToken };