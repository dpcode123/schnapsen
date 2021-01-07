import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import dotenv from 'dotenv';
//import { redisClient } from './redis_client.js';
import  { redisClient }  from './redis_client.js';



const RedisStore: connectRedis.RedisStore = connectRedis(session);

/* const redisClient: redis.RedisClient = redis.createClient(
    process.env.REDIS_URL!, 
    {no_ready_check: true}
); */

export const redisStore: session.Store = new RedisStore({client: redisClient});






/* 
redisClient.SET("key1", "value1", redis.print);
redisClient.GET("key1", redis.print); 
redisClient.DEL("key2", redis.print);
redisClient.KEYS('*', redis.print);
*/

//redisClient.FLUSHALL(redis.print);

/* redisClient.GET("sess:DDyq_PBj9En-Vmr3Dc1zd-9i_zCIxa39", redis.print);  */

/* const cardFaceDesigns = JSON.stringify({id: '1', name: 'Custom design - single face'});
const cardFaceDesigns1 = JSON.stringify({id: '2', name: 'Custom design - double face'});

redisClient.RPUSH('cardFaceDesigns', cardFaceDesigns, redis.print);
redisClient.RPUSH('cardFaceDesigns', cardFaceDesigns1, redis.print); */


//redisClient.KEYS('key?', redis.print);
/* 
redisClient.DEL("key2", redis.print);
redisClient.DEL("list5", redis.print);
redisClient.DEL("key3", redis.print);
redisClient.DEL("key1", redis.print); */
/* 
redisClient.KEYS('*', redis.print); */