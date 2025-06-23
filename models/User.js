const mongoose = require('mongoose');
const {isEmail}= require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: [true, "Email address is required"],
        unique: true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid email address']
    },
    password:{
        type: String,
        required: [true,'Password is required'],
        minlength: [6,"Password must be atleast 6 characters long"]
    },
    totalBooks:{type:Number,default:0},
    books: [{type: mongoose.Schema.Types.ObjectId, ref:'Book'}]

})

userSchema.statics.login = async function (email,password){
    const user = await this.findOne({email});
    if(user){
       const auth = await  bcrypt.compare(password, user.password);

       if(auth){

        return user;
       }
       throw Error('incorrect password');
    }
    throw Error('unknown email');
}


const hashPass = async (password)=>{
    const salt = await bcrypt.genSalt();
    let hashedPass= await bcrypt.hash(password, salt);
    return hashedPass;

}

userSchema.pre('save', async function(){
    if(this.isNew){
        this.password = await hashPass(this.password)
    }
    
})

const User= mongoose.model("User", userSchema);
 module.exports = User;