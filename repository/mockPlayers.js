const mockPlayers = [
    {id: 1001, username: "john", email: "john@example.com", password: "$2b$10$zFywsjyX8v1MiaBMIQPdouwvpHWaf0MR6q.epwWVoE7zToNy23qla"},
    {id: 1002, username: "mark", email: "mark@example.com",  password: "$2b$10$4nZYl0064KepeUhMy6OxOukTj3Vha5538pKmutazBBKoFqo9f2RrO"},
    {id: 1003, username: "ana", email: "ana@example.com",  password: "test"},
    {id: 1004, username: "peter", email: "peter@example.com",  password: "test"},
    {id: 1005, username: "jane", email: "jane@example.com",  password: "test"},
];

function getPlayers(){
    return mockPlayers;
}

module.exports = { getPlayers };