import { redisClient } from '../config/redis_client.js';
import { promisify } from 'util';

export default class SettingsRepositoryRedis {

    constructor() { }

    getCardBackDesigns = async (): Promise<string[] | undefined> => {
        const getLrangeAsync = promisify(redisClient.LRANGE).bind(redisClient);

        return await getLrangeAsync("cardBackDesigns", 0, -1)
            .then(results => {
                if(results) {
                    let resultsStrings: string[] = [];
                    // parse each result and add to array
                    results.forEach(r => {
                        resultsStrings.push(JSON.parse(r));
                    });
                    return resultsStrings;
                } else {
                    console.log('No results');
                    return undefined;
                }
            })
            .catch(err => {
                console.error(err);
                return undefined;
            });
            
    }

    getCardFaceDesigns = async (): Promise<string[] | undefined> => {
        const getLrangeAsync = promisify(redisClient.LRANGE).bind(redisClient);

        return await getLrangeAsync("cardFaceDesigns", 0, -1)
            .then(results => {
                if(results) {
                    let resultsStrings: string[] = [];
                    // parse each result and add to array
                    results.forEach(r => {
                        resultsStrings.push(JSON.parse(r));
                    });
                    return resultsStrings;
                } else {
                    console.log('No results');
                    return undefined;
                }
            })
            .catch(err => {
                console.error(err);
                return undefined;
            });
            
    }

}
