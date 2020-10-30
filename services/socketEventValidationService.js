const validate = (tokenPayload, playRoom) => {
    let isValid = false;

    if(tokenPayload.userId === playRoom.players[tokenPayload.playerInRoom].id
        && 
        tokenPayload.username === playRoom.players[tokenPayload.playerInRoom].username) 
        {
            isValid = true;
    }

    return isValid;

}


module.exports = {
    validate
}