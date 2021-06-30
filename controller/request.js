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
        requestBody.reportingManager = req.body.reportingManager ;
        if(type == "New")
        {
            requestBody.priority = req.body.prior ;
            requestBody.numPersons = 1 ;
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
            comments : comments ,
            finance : false ,
            acknowledged : false
        })

        console.log(request) ;

        await request.save() ;

        res.redirect('/getGeneratedRequests') ;
    }
    catch(err)
    {
        console.log(err) ;
        res.json({
            error : err
        })
    }
}

module.exports.generateFinanceRequest = async (req , res , next) => {
    try
    {
        let generatedBy = req.user.email ;
        
        //need to ankit maheshwari's email
        let toBeApprovedBy = req.body.toBeApprovedBy ;

        let type = "Finance" ;
        
        let requestBody ={};
        requestBody.type = type ;
        requestBody.position = req.body.position ;
        requestBody.team = req.body.team ;
        requestBody.businessCase = req.body.BusinessCase ; 
        requestBody.reportingManager = req.body.reportingManager ;
        
        requestBody.priority = req.body.prior ;
        requestBody.referencingRequestId = req.body.refId ;
        console.log(req.body.refId) ;
        let tempReq = await Request.findById(req.body.refId) ;
        tempReq.acknowledged = true ;
        await tempReq.save() ;

        let comment = {
            text : req.body.comment ,
            writtenBy : generatedBy
        }

        let comments = [comment] ;

        let state = "OPEN" ;

        let request = new Request({
            generatedBy : generatedBy ,
            toBeApprovedBy : toBeApprovedBy ,
            requestBody : requestBody ,
            state : state ,
            comments : comments ,
            finance : true ,
            acknowledged : false
        })

        console.log(request) ;

        await request.save() ;

        res.redirect('/getGeneratedRequests') ;
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
        let requests = await Request.find({generatedBy : req.user.email , finance:false}) ;
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

module.exports.getGeneratedFinanceRequests = async (req , res , next) => 
{
    try
    {
        let requests = await Request.find({generatedBy : req.user.email , finance:true}) ;
        res.render("get_genereated_finance_requests.ejs" , 
        {
            path:'generated_finance_requests' ,
            title:'Generated Finance Requests' ,
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
        let requests = await Request.find({toBeApprovedBy : req.user.email , state:"OPEN" , finance:false }) ;
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

module.exports.getToBeApprovedFinanceRequests = async (req , res , next) => {
    try
    {
        let requests = await Request.find({toBeApprovedBy : req.user.email , state:"OPEN" , finance:true}) ;
        res.render("to_be_approved_finance_requests.ejs" , 
        {
            path:'to_be_approved_finance_requests' ,
            title:'To Be Approved Finance Requests' ,
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
            if(request.generatedBy == req.user.email || request.toBeApprovedBy == req.user.email || req.user.team == "ta")
            {
                res.render("get_single_request.ejs" , 
                {
                    path:'single_request' ,
                    title:'Single Request' ,
                    request: request ,
                    generator: request.generatedBy == req.user.email ,
                    approver : request.toBeApprovedBy == req.user.email ,
                    ta : req.user.team == "ta"
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

module.exports.getSingleFinanceRequest = async (req , res , next) => {
    try
    {
        let requestId = req.query.requestId ;
        let request = await Request.findById(requestId) ;
        if(request)
        {
            if(request.generatedBy == req.user.email || request.toBeApprovedBy == req.user.email || req.user.team == "finance")
            {
                res.render("get_single_finance_request.ejs" , 
                {
                    path:'single_finance_request' ,
                    title:'Single Finance Request' ,
                    request: request ,
                    generator: request.generatedBy == req.user.email ,
                    approver : request.toBeApprovedBy == req.user.email ,
                    finance : req.user.team == "finance"
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

module.exports.getSingleOriginalRequest = async (req , res , next) => {
    try
    {
        let requestId = req.query.requestId ;
        let request = await Request.findById(requestId) ;
        if(request)
        {
            res.render("get_single_original_request.ejs" , 
            {
                path:'single_original_request' ,
                title:'Single Original Request' ,
                request: request ,
            })
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
                    requestBody.numPersons = 1 ;
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
        let requests = await Request.find({state : "APPROVED" , acknowledged:false}) ;
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

module.exports.getApprovedFinanceRequests = async (req , res , next) => {
    try
    {
        let requests = await Request.find({state : "APPROVED" , finance:true}) ;
        res.render("get_approved_finance_requests.ejs" , 
        {
            path:'approved_finance_requests' ,
            title:'Approved Finance Requests' ,
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

module.exports.getBudgetCodeForm = async(req , res , next) => {
    let requestId = req.query.requestId ;
        let request = await Request.findById(requestId) ;
        if(request)
        {
                res.render("get_budget_code_form.ejs" , 
                {
                    path:'get_budget_code_form' ,
                    title:'Budget Code request Form' ,
                    request:request
                })
        }
        else
        {
            res.json({
                error : "No such request exist"
            })
        }
}

module.exports.getFinanceRequestForm = async(req , res , next) => {
    try
    {
        let requestId = req.query.requestId ;
        let request = await Request.findById(requestId) ;
        if(request)
        {
            if(req.user.team == "ta")
            {
                res.render("finance_request_form.ejs" , 
                {
                    path:'finance_request_form' ,
                    title:'Finance request Form' ,
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
        res.json({
            message:"user already exists" ,
            type : "error"
        }) ; 
    }
}

module.exports.getNewForm = async(req , res , next) => {
    try
    {
        res.render("new_form.ejs" , 
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