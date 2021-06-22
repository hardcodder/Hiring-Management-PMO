const Request = require('../models/Request') ;

module.exports.generateRequest = async(req , res , next) => 
{
    try
    {
        let generatedBy = req.user.email ;
        
        //need to vertify whether this email exists or not
        let toBeApprovedBy = req.body.toBeApprovedBy ;

        let type = req.body.type ;
        
        let requestBody ={};
        requestBody.type = type ;
        requestBody.position = req.body.position ;
        requestBody.team = req.body.team ;
        requestBody.businessCase = req.body.BusinessCase ; 
        if(type = "New")
        {
            requestBody.priority = req.body.prior ;
            requestBody.numPersons = req.body.numPersons ;
        }
        else
        {
            requestBody.personReplacing = req.body.personReplacing ;
            requestBody.budgetCode = req.body.budgetCode ;
        }

        let comment = {
            text : req.body.comment ,
            writtenBy : generatedBy
        }

        let comments = [comment] ;

        console.log(typeof requestBody)

        let state = "OPEN" ;

        let request = new Request({
            generatedBy : generatedBy ,
            toBeApprovedBy : toBeApprovedBy ,
            requestBody : requestBody ,
            state : state ,
            comments : comments
        })

        console.log(request) ;

        await request.save() ;

        res.json({
            message : "request generated" ,
            type : "success"
        })
    }
    catch(err)
    {
        console.log(err) ;
        res.json({
            error : err
        })
    }
}

module.exports.getGeneratedRequests = async (req , res , next) => 
{
    try
    {
        let requests = await Request.find({generatedBy : req.user.email}) ;
        res.json({
            requests : requests
        })
    }
    catch(err)
    {
        res.json({
            error : err
        })
    }
}

module.exports.getToBeApprovedRequests = async (req , res , next) => {
    try
    {
        let requests = await Request.find({toBeApprovedBy : req.user.email}) ;
        res.json({
            requests : requests
        })
    }
    catch(err)
    {
        res.json({
            error : err
        })
    }
}

module.exports.getSingleRequest = async (req , res , next) => {
    try
    {
        let requestId = req.body.requestId ;
        let request = await Request.findById(requestId) ;
        if(request)
        {
            if(request.generatedBy == req.user.email || request.toBeApprovedBy == req.user.email)
            {
                res.json({
                    request : request
                })
            }
            else
            {
                res.json({
                    error : "You dont have the permission to view this request"
                }) 
            }
        }
        else
        {
            res.json({
                error : "No such request exist"
            })
        }
    }
    catch(err)
    {
        res.json({
            error : err
        })
    }
}

module.exports.addComment = async (req , res , next) => {
    try
    {
        let requestId = req.body.requestId ;
        let request = await Request.findById(requestId) ;
        if(request)
        {
            if(request.generatedBy == req.user.email || request.toBeApprovedBy == req.user.email)
            {
                const comment = {
                    text : req.body.text ,
                    writtenBy : req.user.email 
                }
                const comments = [comment , ...request.comments] ;
                request.comments = comments ;
                request = await request.save() ;
                res.json({
                    request : request
                })
            }
            else
            {
                res.json({
                    error : "You dont have the permission to view this request"
                }) 
            }
        }
        else
        {
            res.json({
                error : "No such request exist"
            })
        }
    }
    catch(err)
    {
        res.json({
            error : err
        })
    }
}

module.exports.cancelRequest = async (req , res , next) => {
    try
    {
        let requestId = req.body.requestId ;
        let request = await Request.findById(requestId) ;
        if(request)
        {
            if(request.generatedBy == req.user.email || request.toBeApprovedBy == req.user.email)
            {
                request.state = "CANCEL" ;
                await request.save() ;
                res.json({
                    message : "Cancelled"
                })
            }
            else
            {
                res.json({
                    error : "You dont have the permission to view this request"
                }) 
            }
        }
        else
        {
            res.json({
                error : "No such request exist"
            })
        }
    }
    catch(err)
    {
        res.json({
            error : err
        })
    }
}

module.exports.approveRequest = async (req , res , next) => {
    try
    {
        let requestId = req.body.requestId ;
        let request = await Request.findById(requestId) ;
        if(request)
        {
            if(request.toBeApprovedBy == req.user.email)
            {
                request.state = "APPROVED" ;
                await request.save() ;
                res.json({
                    message : "approved"
                })
            }
            else
            {
                res.json({
                    error : "You dont have the permission to approve this request"
                }) 
            }
        }
        else
        {
            res.json({
                error : "No such request exist"
            })
        }
    }
    catch(err)
    {
        res.json({
            error : err
        })
    }
}

module.exports.modifyRequest = async (req , res , next) => {
    try
    {
        let requestId = req.body.requestId ;
        let request = await Request.findById(requestId) ;
        if(request)
        {
            if(request.generatedBy == req.user.email)
            {
                const comment = {
                    text : req.body.text ,
                    writtenBy : req.user.email
                }
        
                const comments = [comment , ...request.comments] ;
        
                request.comments = comments ;

                request.requestBody = req.body.requestBody ;

                request = await request.save() ;

                res.json({
                    request : request
                })

            }
            else
            {
                res.json({
                    error : "You dont have the permission to view this request"
                }) 
            }
        }
        else
        {
            res.json({
                error : "No such request exist"
            })
        }
    }
    catch(err)
    {
        res.json({
            error : err
        })
    }
}

module.exports.getApprovedRequests = async (req , res , next) => {
    try
    {
        let requests = await Request.find({state : "APPROVED"}) ;
        res.json({
            requests : requests
        })
    }
    catch(err)
    {
        res.json({
            error : err
        })
    }
}

module.exports.getRequestForm = async(req , res , next) => {
    try
    {
        res.render("request_form.ejs" , 
        {
            path:'request_form' ,
            title:'Request Form' ,
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