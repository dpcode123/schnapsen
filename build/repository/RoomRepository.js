const playRooms = new Map();
export default class {
    constructor() {
        this.getPlayRooms = () => {
            return playRooms;
        };
        this.getPlayRoomById = (roomId) => {
            if (playRooms.has(roomId)) {
                return playRooms.get(roomId);
            }
            return;
        };
        this.deletePlayRoomById = (roomId) => {
            return playRooms.delete(roomId);
        };
    }
}
