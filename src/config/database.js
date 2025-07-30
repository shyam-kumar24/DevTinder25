const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namasteNode:namasteNode25sk@namastenode.tpaztr7.mongodb.net/devTinder"
  );
};

module.exports = connectDB

