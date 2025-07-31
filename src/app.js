const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user.js");
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // first validate the data entered by the user
    validateSignUpData(req);

    // encript the password.

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("user added successfully !");
  } catch (e) {
    res.status(400).send("error saving the user" + e.message);
  }
});


app.post("/login", async (req, res) => {
  try {

    const {emailId,password} = req.body 

    const user = await User.findOne({emailId: emailId})
    if(!user){
      throw new Error('Email id is not present in the database !')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(isPasswordValid){
      res.send('Login successfull !')
    }else {
      throw new Error('password is not correct !')
    }

  } catch (e) {
    res.status(400).send("error saving the user " + e.message);
  }
});

// get user by email.

app.get("/user", async (req, res) => {
  const email = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: email });
    // const user = await User.find({emailId: email})
    if (!user) {
      res.status(404).send("user not found !");
    } else {
      res.send(user);
    }
  } catch (e) {
    res.status(400).send("something went wrong !");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(400).send("something went wrong !");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("user deleted successfully !");
  } catch (e) {
    res.status(400).send("something went wrong !");
  }
});

// to update the data .
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed !");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills cant be more than 10 !");
    }

    await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("user updated successfully !");
  } catch (e) {
    res.status(400).send("something went wrong !");
  }
});

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
