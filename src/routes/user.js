const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // this populate line is fetching the firstName and lastName of the user from where connection has come

    res.json({
      message: "Data fetched successfully !",
      data: connectionRequests,
    });
  } catch (e) {
    res.status(404).send("Error " + e.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({ data });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {

    const loggedInUser = req.user;
// do you know params and query are different . 
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1)*limit

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    // yaha par un ids ko hataya ja raha hai jisse connection hai means ham bheje hain ya wo bheja hai .
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    // yaha finally db call kar ke upar ke sabhi ids ko hataya ja raha hai.
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
      // here i want to find all the people who are not in the above array and also whose id is not equal to the logged in user id
    //   $nin : not in 
    //  $ne : not equal to 
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.send(users);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = userRouter;
