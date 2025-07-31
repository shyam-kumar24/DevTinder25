const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user.js");

app.use(express.json())

app.post("/signup", async (req, res) => {

  const user = new User(req.body);

  try {
    await user.save();
    res.send("user added successfully !");
  } catch (e) {
    res.status(400).send("error saving the user", e.message);
  }
});


// get user by email.

app.get('/user', async (req,res) => {

  const email = req.body.emailId
  
  try{
    const user = await User.findOne({emailId: email})
    // const user = await User.find({emailId: email})
    if(!user){
      res.status(404).send('user not found !')
    }else{
      res.send(user)
    }
  }catch(e){
    res.status(400).send('something went wrong !')
  }
})


app.get('/feed', async (req,res) => {
    try{
      const users = await User.find({})
      res.send(users)
    }catch(e){
      res.status(400).send('something went wrong !')
    }
})


app.delete('/user', async (req,res) => {
  const userId = req.body.userId
  try{
    await User.findByIdAndDelete(userId)
    res.send('user deleted successfully !')
  }catch(e){
    res.status(400).send('something went wrong !')
  }
})

// to update the data . 
app.patch('/user', async (req,res) => {
    const userId = req.body.userId 
    const data = req.body 
    try{

        const ALLOWED_UPDATES = [
          "userId",
          "photoUrl",
          "about",
          "gender",
          "age",
          "skills"
        ] 

        const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k))
        if(!isUpdateAllowed){
          throw new Error("Update not allowed !")
        }
        await User.findByIdAndUpdate({_id: userId}, data)
        res.send('user updated successfully !')
    }catch(e){
        res.status(400).send('something went wrong !')
    }
})












connectDB()
  .then(() => {
    console.log("database connected successfully !");
    app.listen(3000, () => {
      console.log("server is successfully listening on port 3000 !");
    });
  })
  .catch((err) => {
    console.log("something happened wrong !");
  });

