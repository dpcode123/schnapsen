/**
 * Card
 * @param { string } tier - J,Q,K,X,A
 * @param { string } suit - herc, karo, pik, tref
 * @param { number } points - 2,3,4,10,11
 * @param { string } name - j-herc, q-karo...
 */
export default class Card {
    tier: string;
    suit: string;
    points: number;
    name: string;

    constructor(tier: string, suit: string, points: number, name: string) {
        this.tier = tier;
        this.suit = suit;
        this.points = points;
        this.name = name;
    }
}