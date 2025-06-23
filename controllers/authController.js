const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
const User = require('../models/User');




const handleError = (err)=>{
    let errors= {};
    if(err.code==11000){
        errors.email="Email is already registered";
        return errors;
    }
    if(err.message== "unknown email"){
        errors.email = "Email not registered";
    }
    if(err.message=="incorrect password"){
        errors.password="incorrect password";
    }
    
    if (err.message.includes('User validation failed')){
    Object.values(err.errors).forEach((error)=>{
        errors[error.path]=error.message;
    })
}
    return errors;

}
const maxAge= 24*60*60 // in seconds
const createToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:maxAge})

}


module.exports.signup_post= async (req,res)=>{
    let {email, password}= req.body;
    

    try {
        const user = await User.create({email,password});
        const token = createToken(user._id);
        res.cookie('jwt',token, {httpOnly: true,maxAge: maxAge*1000})
        res.status(201).json(user);

    } catch (err) {
        let errors = handleError(err);
        console.log(err);
        res.status(400).json({errors});
    }
    
}
module.exports.login_post = async (req,res) => {
    const {email,password}= req.body;


    try{
        const user = await User.login(email,password);
         const token = createToken(user._id);
        res.cookie('jwt',token, {httpOnly: true,maxAge: maxAge*1000});
        res.status(201).json({user});

    }
    catch(err){

        console.log(err);
        // console.log(Object.values(err));
        const errors = handleError(err)
        if(email==""){
            errors.email="Email is required"
        }
        if(password==""){
           errors.password="Password is required" 
        }
        res.status(400).json({errors})

    }
   
}

module.exports.signup_get=(req,res)=>{
    res.render("Signup.ejs");
}
module.exports.login_get=(req,res)=>{
    res.render("Login.ejs");
}

module.exports.logout_get = (req,res) => {
    console.log("inside logout")
    res.cookie("jwt",'',{maxAge:1});
    res.status(200).send("logged out")
    console.log('cookie sent')
    
}