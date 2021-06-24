const Request = require('../models/Request') ;
const {sendMail} = require('../utils');

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
        requestBody.reportingManager = req.body.reportingManager ;
        if(type == "New")
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

        let url = `http://localhost:5000/getSingleRequest?requestId=${request._id}`
        const mail_info = 
            {
                to: toBeApprovedBy,
                subject: "New Request Arrived",
                text: "",
                html: `<p>You have a new request. Kindly <a href = ${url}>visit</a></p>`,
            }
            sendMail(mail_info);

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
        res.render("get_generated_requests.ejs" , 
        {
            path:'generated_requests' ,
            title:'Generated Requests' ,
            requests: requests ,
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
        let requests = await Request.find({toBeApprovedBy : req.user.email , state:"OPEN"}) ;
        res.render("to_be_approved_requests.ejs" , 
        {
            path:'to_be_approved_requests' ,
            title:'To Be Approved Requests' ,
            requests: requests ,
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
        let requestId = req.query.requestId ;
        let request = await Request.findById(requestId) ;
        if(request)
        {
            if(request.generatedBy == req.user.email || request.toBeApprovedBy == req.user.email)
            {
                res.render("get_single_request.ejs" , 
                {
                    path:'single_request' ,
                    title:'Single Request' ,
                    request: request ,
                    generator: request.generatedBy == req.user.email ,
                    approver : request.toBeApprovedBy == req.user.email 
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
                if(req.body.comment)
                {
                    const comment = {
                        text : req.body.comment ,
                        writtenBy : req.user.email 
                    }
                    const comments = [comment , ...request.comments] ;
                    request.comments = comments ;
                }

                let send_to = request.generatedBy;
                if(request.generatedBy == req.user.email) 
                {
                    send_to = request.toBeApprovedBy;
                }

                let url = `http://localhost:5000/getComments?requestId=${request._id}`
                const mail_info = 
                    {
                        to: send_to,
                        subject: `New comments added on ${request.requestBody.team} request`,
                        text: "",
                        html: `<p>Kindly <a href = ${url}>visit</a> for more information.</p>`,
                    }
                    sendMail(mail_info);

                await request.save() ;
                res.json({
                    message:"Commented"
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
                request.state = "CANCELLED" ;
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
               //need to vertify whether this email exists or not
                request.toBeApprovedBy = req.body.toBeApprovedBy ;

                let type = req.body.type ;
                
                let requestBody ={};
                requestBody.type = type ;
                requestBody.position = req.body.position ;
                requestBody.team = req.body.team ;
                requestBody.businessCase = req.body.BusinessCase ; 
                requestBody.reportingManager = req.body.reportingManager ;
                if(type == "New")
                {
                    requestBody.priority = req.body.prior ;
                    requestBody.numPersons = req.body.numPersons ;
                }
                else
                {
                    requestBody.personReplacing = req.body.personReplacing ;
                    requestBody.budgetCode = req.body.budgetCode ;
                }

                request.requestBody = requestBody ;

                if(req.body.comment)
                {
                    const comment = {
                        text : req.body.comment ,
                        writtenBy : req.user.email 
                    }
                    const comments = [comment , ...request.comments] ;
                    request.comments = comments ;
                }

                await request.save() ;
                
                res.json({
                    message:"Modified"
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
        console.log(err) ;
        res.json({
            error : err
        })
    }
}

module.exports.getApprovedRequests = async (req , res , next) => {
    try
    {
        let requests = await Request.find({state : "APPROVED"}) ;
        res.render("get_approved_requests.ejs" , 
        {
            path:'approved_requests' ,
            title:'Approved Requests' ,
            requests: requests ,
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

module.exports.getModifyForm = async(req , res , next) => {
    try
    {
        let requestId = req.query.requestId ;
        let request = await Request.findById(requestId) ;
        if(request)
        {
            if(request.generatedBy == req.user.email || request.toBeApprovedBy == req.user.email)
            {
                res.render("modify_form.ejs" , 
                {
                    path:'modify_form' ,
                    title:'Modify Form' ,
                    request:request
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
        console.log(err) ;
        res.json({
            message:"user already exists" ,
            type : "error"
        }) ; 
    }
}

module.exports.getComments = async(req , res , next) => {
    try
    {
        let requestId = req.query.requestId ;
        let request = await Request.findById(requestId) ;
        if(request)
        {
            if(request.generatedBy == req.user.email || request.toBeApprovedBy == req.user.email)
            {
                res.render("getComments.ejs" , 
                {
                    path:'get_comments' ,
                    title:'Comments' ,
                    request:request
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
        console.log(err) ;
        res.json({
            message:"user already exists" ,
            type : "error"
        }) ; 
    }
}