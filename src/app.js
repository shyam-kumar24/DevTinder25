const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require('./models/user.js')


app.post('/signup', async (req,res) => {
  const user = new User({
    firstName: 'shyam',
    lastName: 'kumar',
    emailId: 'shyam@kumar.com',
    password: 'shyam@123'
  })

  await user.save()
  res.send('user added successfully !')
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


app.get("/getUserData", (req, res) => {
  try {
    throw new Error("this is error");
    res.send("user data sent!");
  } catch (e) {
    res.status(500).send("some error contact shaym");
  }
});


app.use("/", (err, req, res, next) => {
  if (err) {
    res
      .status(500)
      .send(
        "something went wrong this is not system generated response but a response by shyam !"
      );
  }
});
