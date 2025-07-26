
const express = require("express")

const app = express()

app.get("/user", (req,res) => {
    res.send({firstName: 'shyam', lastName: 'kumar'})
})


app.post("/user", (req,res) => {
    console.log('saving data to database');
    res.send('bhai data to save ho gaya !')
})


app.use("/shyam",(req,res) => {
    res.send('hello from the server! yes nodemon is working ')
})


app.delete('/user', (req,res) => {
    // code to delete the data!
    res.send('deleted successfully !')
})


app.listen(3000, () => {
    console.log('server is successfully listening on port 3000 !');
})

