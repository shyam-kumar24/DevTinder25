
const express = require("express")

const app = express()


app.use("/user",
    (req,res,next) => {
        console.log('this is first response!');
        // res.send('route handler 1')
        next()
    },
    (req,res ) => {
        console.log('this is second response!');
        res.send('route handler 2')
    }
)


app.listen(3000, () => {
    console.log('server is successfully listening on port 3000 !');
})

