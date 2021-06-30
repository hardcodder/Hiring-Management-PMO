module.exports.isTa = (req , res , next) => {
    if(req.user)
    {
       if(req.user.team == "ta")
       {
           return next() ;
       }
    }
    res.redirect('/login') ;
}