const jwt = require('jsonwebtoken') ;

const JWT_SECRET = "INNOVACCER_SHAKTI" ;

const User = require('../models/User') ;

module.exports = async (req , res , next) => {
    const {authorization} = req.headers ;
    if(!authorization){
        return res.status(401).json({error:"You must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token , JWT_SECRET , async(err , payload) => {
        if(err)
        {
            return res.status(401).json({error:"You must be logged in"}) ;
        }
        const {_id} = payload ;
        const user = await User.findById(_id) ;
        if(user)
        {
            req.user = user ;
            next() ;
        }
        else
        {
            return res.status(401).json({error:"No user with these credentials exist"}) ;
        }
    })
}