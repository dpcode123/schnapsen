const users = [];

function getAllUsers(){
    return users;
}

// Join user
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// Gets current user
function getUserById(id) {
    return users.find(user => user.id === id);
}

// Gets user's index in room (0 or 1)
function getUserIndexInRoom(roomUsers, id){
    return roomUsers.findIndex(user => user.id === id);
}

// User leaves
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getUsersByRoom(room) {
    return users.filter(user => user.room === room);
}

// Removes all users from room
function removeAllUsersFromRoom(room){
    let usersInRoom = getUsersByRoom(room);

    usersInRoom.forEach(user => {
        userLeave(user.id);
    });
}

module.exports = {
  userJoin,
  getUserById,
  userLeave,
  getUsersByRoom,
  getAllUsers,
  removeAllUsersFromRoom,
  getUserIndexInRoom
};
