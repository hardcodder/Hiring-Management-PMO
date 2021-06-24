const bcrypt = require('bcryptjs') ;
const jwt = require("jsonwebtoken") ;
const User = require('../models/User') ;
const {sendMail} = require('../utils');

const JWT_SECRET = "INNOVACCER_SHAKTI"



module.exports.postSignup = async(req , res , next) => 
{
    try
    {
        let name = req.body.name ;
        let password = req.body.password ;
        let email = req.body.email ;

        let user = await User.findOne({email : email}) ;
        if(user)
        {
            res.json({
                message:"user already exists" ,
                type : "error"
            }) ;
        }
        else
        {
            const hashedPass = await bcrypt.hash(password , 12) ;
            user = new User({
                name:name ,
                email : email ,
                password : hashedPass
            }) ;
            user = await user.save() ;

            const mail_info = 
            {
                to: user.email,
                subject: "Registration Successful",
                text: "Welcome" + user.name + " !",
                html: "<p>You have successfully registered to the app.</p>",
            }
            sendMail(mail_info);

            res.redirect('/login') ;
            }
    }
    catch(err)
    {
        console.log(err);
        res.json({
            error : err
        })
    }
}

module.exports.getLogin = async (req , res , next) => {
    try
    {
        res.render("login.ejs" , 
        {
            path:'login' ,
            title:'Login' ,
        })
    }
    catch(err)
    {
        res.json({
            message:"user already exists" ,
            type : "error"
        }) ; 
    }
}

module.exports.getSignup = async (req , res , next) => {
    try
    {
        res.render("signup.ejs" , 
        {
            path:'signup' ,
            title:'Signup' ,
        })
    }
    catch(err)
    {
        res.json({
            message:"user already exists" ,
            type : "error"
        }) ; 
    }
}

module.exports.postLogin = async (req , res , next) => {
    try
    {
        let email = req.body.email ;
        let password = req.body.password ;
        
        console.log(email) ;

        let user = await User.findOne({email : email}) ;

        if(user)
        {
            const isMatched = await bcrypt.compare(password , user.password) ;
            if(isMatched)
            {
                req.session.user = user ;
                req.session.save( (err)=> {
                    res.redirect('/') ;
                })
            }
            else
            {
                res.json({
                    message: "email and password doesn't match",
                    type: "error",
                  }); 
            }
        }
        else
        {
            res.json({
                message : "No user with this email exists" ,
                type : "error"
            })
        }
    }
    catch(err)
    {
        console.log(err);
        res.json({
            error : err
        })
    }
}