import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { GameConnectionObject } from '../ts/types';

dotenv.config();

export function signToken(payload: GameConnectionObject): string {
    const socketJwt: string = jwt.sign(payload, Buffer.from(process.env.SOCKET_TOKEN_SECRET!, 'base64'));
    return socketJwt;
}

export function validateToken(socketJwt: string): GameConnectionObject | undefined {
    const tokenPayload: GameConnectionObject | undefined = jwt.verify(
        socketJwt, 
        Buffer.from(process.env.SOCKET_TOKEN_SECRET!, 'base64'), 
        function(err, decoded) {
            if (err) {return false;}
            return decoded;
        }
    );
    return tokenPayload;
}
