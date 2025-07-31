
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    emailId : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        validate(value){
            if(!['male', 'female','other'].includes(value)){
                throw new Error('gender data is not valid . ')
            }
        }
    },
    photoUrl: {
        type: String
    },
    about: {
        type: String,
        default: 'this is a default about of the user '
    },
    skills: {
        type: [String]
    }
   },
   {
    timestamps: true
   }
)

module.exports = mongoose.model('User', userSchema )

