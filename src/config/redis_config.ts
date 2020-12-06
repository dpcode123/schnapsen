import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import dotenv from 'dotenv';
dotenv.config();

const RedisStore: connectRedis.RedisStore = connectRedis(session);

const redisClient: redis.RedisClient = redis.createClient(
    process.env.REDIS_URL!, 
    {no_ready_check: true}
);

export const redisStore: session.Store = new RedisStore({client: redisClient});