const express = require("express");
const app = express();
const fs = require("fs");
const PORT = 8000;
const users = require('./MOCK_DATA.json');
//Routes
app.use(express.urlencoded({extended:false}));
app.get("/api/users",(req,res)=>{
    return res.json(users);
});
app.get("/users", (req, res) => {
    const html = `<ul>${users.map(user => `<li>${user.first_name}</li>`).join('')}</ul>`;
    res.send(html);
});
app.get("/api/user/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user)=>user.id===id);
    return res.json(user);
});
app.post("/api/users",(req,res)=>{
    const body = req.body;
    console.log(body);
    users.push({...body,id:users.length+1});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err,data)=>{res.json({staus:"approved",id:users.length
});
});  
});
app.patch("/api/users/:id",(req,res)=>{
    const body = req.body;
    const id = Number(req.params.id);

    // Find the user index in the array
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        res.status(404).json({ status: "error", message: "User not found" });
        return;
    }

    // Update the user's details
    users[userIndex] = { ...users[userIndex], ...body };

    // Write the updated array to MOCK_DATA.json
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            res.status(500).json({ status: "error", message: "Failed to update user" });
        } else {
            res.json({ status: "approved", id: id });
        }
    });
});


app.delete("/api/users/:id",(req,res)=>{
   // const body = req.body;
    const id = Number(req.params.id);

    // Find the user index in the array
    const userIndex = users.findIndex(user => user.id === id);
    users.splice(id,1);
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err) => {
        if (err) {
            res.status(500).json({ status: "error", message: "Failed to update user" });
        } else {
            res.json({ status: "approved", id: id });
        }
    });

});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
