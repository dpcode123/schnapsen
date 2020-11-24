import PlayRoom from "../model/PlayRoom";

const playRooms = new Map();

export default class {

    constructor() {}

    getPlayRooms = (): Map<string, PlayRoom> => {
        return playRooms;
    };

    getPlayRoomById = (roomId: string): PlayRoom | undefined => {
        if (playRooms.has(roomId)) {
            return playRooms.get(roomId);
        }
        return;
    };

    deletePlayRoomById = (roomId: string): boolean => {
        return playRooms.delete(roomId);
    };
    
}
