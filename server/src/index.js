const express = require("express")
const cors = require("cors");
const {v4: uuidv4} = require("uuid");
const bcrypt = require("bcrypt");
const {StreamChat} = require("stream-chat")
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const api_key = process.env.API_KEY;
const api_secret = process.env.API_SECRET;
const serverClient = StreamChat.getInstance(api_key, api_secret);


app.post("/signup", async(req,res) => {
    try{
        const {firstName, lastName, username, password} = req.body;
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = serverClient.createToken(userId);

        res.json({token, userId, firstName, lastName, username, hashedPassword})
    }catch(err){
        console.log(err);
        res.json(err)
    }
})
app.post("/login", async(req,res) => {
    try{
        const {username, password} = req.body;
        const {users} = await serverClient.queryUsers({name: username});
        if(users.length === 0) return res.json({message: "User not found"});

        const token = serverClient.createToken(users[0].id);
        const passwordMatch = await bcrypt.compare(password, users[0].hashedPassword);

        if(passwordMatch){
            res.json({token,
                    firstName: users[0].firstName, 
                    lastName: users[0].lastName, 
                    username, 
                    userId: users[0].id,
                })
        }

    }
    catch(err){
        console.log(err);
        res.json(err);
    }
})



port = 3000;
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
})