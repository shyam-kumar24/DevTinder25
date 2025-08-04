const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { validateSignUpData } = require('../utils/validation');

const authRouter = express.Router()


authRouter.post("/signup", async (req, res) => {
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


authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Email id is not present in the database !");
    }

    const isPasswordValid = await user.validatePassword(password)
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login successfull !");
    } else {
      throw new Error("password is not correct !");
    }
  } catch (e) {
    res.status(400).send("error saving the user " + e.message);
  }
});


authRouter.post('/logout', async (req,res) => {
    res.cookie("token", null, {
      expires: new Date(Date.now())
    });
    res.send('logged out successfully !')
})


module.exports = authRouter