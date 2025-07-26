
const express = require("express")

const app = express()

app.use("/shyam",(req,res) => {
    res.send('hello from the server! yes nodemon is working ')
})

app.listen(3000, () => {
    console.log('server is successfully listening on port 3000 !');
})

