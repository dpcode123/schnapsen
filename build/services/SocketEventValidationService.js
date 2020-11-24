export default class SocketEventValidationService {
    constructor() {
        this.validate = (tokenPayload, playRoom) => {
            try {
                let isValid = false;
                if (tokenPayload.userId === playRoom.players[tokenPayload.playerInRoom].id
                    &&
                        tokenPayload.username === playRoom.players[tokenPayload.playerInRoom].username) {
                    isValid = true;
                }
                return isValid;
            }
            catch (error) {
                console.error(error);
            }
        };
    }
}
