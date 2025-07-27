
const express = require("express")

const app = express()

app.get('/getUserData', (req,res) => {

    try{

        throw new Error('this is error')
        res.send('user data sent!')
        
    }catch(e){
        res.status(500).send('some error contact shaym')
    }
    
})


app.use('/', (err,req,res,next) => {
    if(err){
        res.status(500).send('something went wrong this is not system generated response but a response by shyam !')
    }
})


app.listen(3000, () => {
    console.log('server is successfully listening on port 3000 !');
})

