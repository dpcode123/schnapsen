const bcrypt = require('bcrypt');
// Players
const { getPlayers } = require('../repository/mockPlayers');
const players = getPlayers();


const add_user = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        players.push({
            id: Date.now().toString(),
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        //console.log(players);
        res.redirect('/login');
    } catch(err) {
        console.log(err);
        res.redirect('/register');
    }
}


module.exports = {
    add_user
}