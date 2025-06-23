const jwt = require('jsonwebtoken');

const checkAuth = (req,res, next)=>{
    const token = req.cookies.jwt;

    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();

        }catch(err){
            console.log(err);
            return res.status(401).json({message:"Unauthorised, JWT token invalid"})
        }
        
    }
    else {
        console.log("no token");
        return res.status(400).json({message: "Unauthorised, jwt required"})
    }
}
module.exports = checkAuth;