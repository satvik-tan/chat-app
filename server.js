const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

app.use(cors());

const jwtPassword = "123";
app.use(express.json());

mongoose.connect("mongodb+srv://admin:orpitbala@cluster0.r1chf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

const User = mongoose.model('Users', {username:String, password: String, name:String, message:[String]});



const ALL_USERS = [
    { username: "admin-1", password: "pass", name: "satvik tandon", message:"" },
    { username: "admin-2", password: "notpass", name: "also satvik but cooler", message:"" }
];

 async function userAddedOrNot(){
const userCount = await User.countDocuments({});
    if(userCount==0){
        await User.insertMany(ALL_USERS);
    }
}

userAddedOrNot();






function userExists(username, password) {
    return ALL_USERS.some(user => user.username === username && user.password === password);
}

function userCheck(req, res, next) {
    const { username, password } = req.body;
    if (!userExists(username, password)) {
        return res.status(403).json({ msg: "user not valid, kal aana" });
    }
    next();
}

app.post("/signin", userCheck, function (req, res) {
    const { username, password } = req.body;
    const token = jwt.sign({ username, password }, jwtPassword); // Create JWT
    return res.json({token });
});

function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ msg: "Authorization header missing!" });
    }

    const token = authHeader
    try {
        const user = jwt.verify(token, jwtPassword); // Verify token
        req.user = user; // Attach user info to req
        next(); // Proceed
    } catch (error) {
        return res.status(403).json({ msg: "Invalid or expired token!" });
    }
}

app.post("/chat", auth, async function (req, res) {
    const { contact, message } = req.body;

    if (!contact || !message) {
        return res.status(400).json({ msg: "Both 'contact' and 'message' are required!" });
    }

    
try{
    const contactPerson = await User.findOneAndUpdate(
        {username: contact}, 
        
        {$push:{message:message}},
        {new:true}

    );
    res.status(200).json({
        msg: "message sent succesfully",
        
    })
}
catch(error){
    return res.status(403).json({msg: "didn't happen yar, sorry"})
}

    
});

app.get("/chat", auth, async function (req, res) {
    token = req.headers.authorization
    decoded = jwt.decode(token);
    username = decoded.username;

    const user = await User.findOne({username});




    

    res.status(200).json({
        msg: user.message
    })

   async function  deleteMessage(username){
    try{
        const result = await User.updateOne(
            {username: username},
            {$unset:{message:1}}
        )

    }
    catch(error){
        console.error("message doesn't exist", error)

    }
   }

    deleteMessage(username);


});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
