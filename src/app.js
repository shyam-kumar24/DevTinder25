
const express = require("express")

const app = express()

const { adminAuth, userAuth } = require('./middlewares/auth.js')

// handle auth and middleware for all GET, POST, ... requests
app.use('/admin', adminAuth)


app.get('/user', userAuth, (req,res) => {
    res.send('user data sent !')
})


app.get('/admin/getAllData', (req,res) => {
   res.send('All data sent!')
})


app.get('/admin/deleteUser', (req,res) => {
   res.send('Deleted a user !')
})


app.listen(3000, () => {
    console.log('server is successfully listening on port 3000 !');
})

