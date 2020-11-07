const validate = (tokenPayload, playRoom) => {
    try {
        let isValid = false;

        if(tokenPayload.userId === playRoom.players[tokenPayload.playerInRoom].id
            && 
            tokenPayload.username === playRoom.players[tokenPayload.playerInRoom].username) 
            {
                isValid = true;
        }

        return isValid;
        
    } catch (error) {
        console.error(error)
    }

}


module.exports = {
    validate
}