
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid email address !')
            }
        }
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
        enum: {
            values: ["male","female","other"],
            message: `{VALUE} is not a valid gender type`
        },
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


userSchema.methods.getJWT = async function(){

    const user = this
    const token = await jwt.sign({ _id: user._id }, "devTinder25", {
        expiresIn: "100d"
      });

    return token
};


userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)

    return isPasswordValid
}

module.exports = mongoose.model('User', userSchema )

