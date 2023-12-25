const usersDB = {
    users: require('../model/users.json'),
    setUsers: function(data) { this.users = data }
}
const fsPromises = require('fs/promises')
const path = require('path')
const bcrypt = require('bcrypt')
const { log } = require('console')

const handleNewUser = async(req, res) =>{
    const { user, pass } = req.body
    if(!user || !pass){
         return res.status(400).json({message: 'username and password are required.'}) 
    }

    const duplicate = usersDB.users.find(user => user.id === user);
    if(duplicate){
        return res.status(409).json({ message: 'user already exists'})
    }

    try{
        // encrypt the password
        const hashedPass = await bcrypt.hash(pass, 10);
        // store new user
        const newUser = {
            "username": user,
            "roles": { "User": 2001},
            "password": hashedPass
        };
        usersDB.setUsers([...usersDB.users, newUser]);
       
        fsPromises.writeFile(
            path.join(__dirname, '..' ,'model','users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);

        res.status(200).json({message: `user ${newUser.username} created successfully`});
        

    }catch(err){
        res.status(500).json({ message: err.message});
    }

}

module.exports = {handleNewUser};