
const express = require("express")

const app = express()

// handle auth and middleware for all GET, POST, ... requests
app.use('/admin', (req,res,next) => {
    console.log('admin auth is getting checked !');
    const token = 'abcdef'
    const isAdminAuthorised = token === 'abcdef'

    if(!isAdminAuthorised){
        res.status(401).send('Unauthorised request')
    }else{
        next()
    }
})


app.get('/user', (req,res) => {
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

