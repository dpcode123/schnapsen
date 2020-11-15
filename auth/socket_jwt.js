import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export function signToken(payload){
    const socketJwt = jwt.sign(payload, Buffer.from(process.env.SOCKET_TOKEN_SECRET, 'base64'));
    return socketJwt;
}

export function validateToken(socketJwt){
    const tokenPayload = jwt.verify(socketJwt, Buffer.from(process.env.SOCKET_TOKEN_SECRET, 'base64'), function(err, decoded) {
        if(err){return false;}
        return decoded;
    });
    return tokenPayload;
}
