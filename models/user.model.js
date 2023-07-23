

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const UserSchema = mongoose.Schema({
    name : {
        type : String,
        required :[true , 'pleases your name required'],
        trim : true,
        minLength : [3, 'min length 3']
    },
    email : {
        type : String,
        required : [true , 'please provide your email address'],
        unique : true,
    },
    lastName : {
        type : String,
        default : 'last name'
    },
    role : {
        type : String,
        enum : ['user','admin'],
        default : 'user'
    },
    location : {
        type : String,
        default : 'my city'
    },
    avatar : String,
    avatarPublicId : String,
    password : {
        type : String,
        required : [true, 'please provide your password'],
        minLength : [6, 'password must be at least 6 characters']
    }
})

UserSchema.pre('save' , async function () {
    if(!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})


UserSchema.methods.CreateJWT = function () {
    return jwt.sign({userId : this._id , name : this.name , email : this.email , role : this.role}, process.env.JWT_SECRET , {
        expiresIn : '1d'
    })
}

UserSchema.methods.ComparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}


export const UserModel = mongoose.model('user',UserSchema)