import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const redisClient: redis.RedisClient = redis.createClient(
    process.env.REDIS_URL!, 
    {no_ready_check: true}
);