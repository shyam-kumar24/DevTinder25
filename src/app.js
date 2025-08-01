const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user.js");
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");

app.use(express.json());
app.use(cookieParser());

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
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Email id is not present in the database !");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, "devTinder25", {
        expiresIn: "100d"
      });
      console.log(token);

      res.cookie("token", token, { expires: new Date(Date.now() + 8*3600000)});
      res.send("Login successfull !");
    } else {
      throw new Error("password is not correct !");
    }
  } catch (e) {
    res.status(400).send("error saving the user " + e.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("user does not exist !");
    }

    res.send(user);
  } catch (e) {
    res.status(400).send('something went wrong !')
  }
});


app.post('/sendConnectionRequest', userAuth ,  async(req,res) => {

  const user = req.user
  
  console.log('sending a connection request !');

  res.send(user.firstName + ' sent the connection request !')
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
