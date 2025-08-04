const express = require('express')
const { userAuth } = require("../middlewares/auth");
const {validateEditProfileData} = require('../utils/validation')

const profileRouter = express.Router()

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("user does not exist !");
    }

    res.send(user);
  } catch (e) {
    res.status(400).send("something went wrong !");
  }
});


profileRouter.patch('/profile/edit', userAuth, async (req,res) => {
    try{
      if(!validateEditProfileData(req)){
        throw new Error('Invalid Edit Request !')
      }

      const loggedInUser = req.user
      await loggedInUser.save()

      Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])

      res.send(`${loggedInUser.firstName} , your profile updated successfully !`)
    }catch(e){
      res.status(400).send("Error: "+ e.message)
    }
})


module.exports = profileRouter