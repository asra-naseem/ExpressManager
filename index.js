const express = require("express");
const app = express();
const fs = require("fs");
const PORT = 8000;
const mongoose = require("Mongoose");
const users = require('./MOCK_DATA.json');
//connecting mongoose
mongoose.connect("mongodb://127.0.0.1:27017/expressusermanager").
then(()=>console.log("MongoDB connected")).
catch((err)=>console.log("Mongo Error",err));
//schema
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    last_name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
       // unique: true
    },
    gender:{
        type:String,
        
    },
    
});
//Model
const User = mongoose.model('user',userSchema);
//Routes
app.use(express.urlencoded({extended:false}));

app.get("/api/users",async(req,res)=>{
    const alldbusers=await User.find({});
    return res.json(alldbusers);
});
app.get("/users", async(req, res) => {
    const alldbusers=await User.find({});
    const html = `<ul>${alldbusers.map((user) => `<li>${user.firstName}</li>`).join('')}</ul>`;
    res.send(html);
});
app.get("/api/user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user" });
    }
});

app.post("/api/users",async(req,res)=>{
    const body = req.body;

    if(!body||!body.first_name||!body.last_name||!body.email||!body.gender){
        res.status(400).json({msg:"All fields are required.."});
    }
    console.log(body);
//     users.push({...body,id:users.length+1});
//     fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{res.json({staus:"approved",id:users.length
// });
const result= await User.create({
    firstName:body.first_name,
    last_name:body.last_name,
    email:body.email,
    gender:body.gender,
});
console.log(result);
return res.status(201).json({msg:"Success"});
});  

app.patch("/api/users/:id",async(req,res)=>{
   // const body = req.body;
    // const id = Number(req.params.id);

    // // Find the user index in the array
    // const userIndex = users.findIndex(user => user.id === id);

    // if (userIndex === -1) {
    //     res.status(404).json({ status: "error", message: "User not found" });
    //     return;
    // }

    // Update the user's details
    // users[userIndex] = { ...users[userIndex], ...body };

    // // Write the updated array to MOCK_DATA.json
    // fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
    //     if (err) {
    //         res.status(500).json({ status: "error", message: "Failed to update user" });
    //     } else {
    //         res.json({ status: "approved", id: id });
    //     }
    // });
    await User.findByIdAndUpdate(req.params.id,{last_name:"changed"});
     return res.json(({status:"Success"}));
});


app.delete("/api/users/:id",async(req,res)=>{
   // const body = req.body;
    // const id = Number(req.params.id);

    // // Find the user index in the array
    // const userIndex = users.findIndex(user => user.id === id);
    // users.splice(id,1);
    // fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
    //     if (err) {
    //         res.status(500).json({ status: "error", message: "Failed to update user" });
    //     } else {
    //         res.json({ status: "approved", id: id });
    //     }
    // });
    await User.findByIdAndDelete(req.params.id);
    return res.json({msg:"Success"})

});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
