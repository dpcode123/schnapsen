const playRooms = new Map();

export default class {
    constructor() {

        this.getPlayRooms = function () {
            return playRooms;
        };

        this.getPlayRoomById = function (roomId) {
            // check if room exist
            if (playRooms.has(roomId)) {
                return playRooms.get(roomId);
            }
            // room doesn't exist
            return false;
        };

        this.deletePlayRoomById = function (roomId) {
            return playRooms.delete(roomId);
        };
    }
}
