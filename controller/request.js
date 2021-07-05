const Request = require('../models/Request') ;
const User = require('../models/User') ;
const {sendMail} = require('../utils');

module.exports.generateRequest = async(req , res , next) => 
{
    try
    {
        // console.log(req.user);  
        let generatedBy = req.user.email || req.user.emails[0].value;
        
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

        let comments = [] ;

        if(req.body.comment)
        {
            let comment = {
                text : req.body.comment ,
                writtenBy : generatedBy
            }
    
            comments = [comment] ;
        }
        
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

        res.redirect(`/getSingleRequest?requestId=${request._id}`) ;

        let url = `http://localhost:5000/getSingleRequest?requestId=${request._id}`
        const mail_info = 
            {
                to: toBeApprovedBy,
                subject: "New Request Arrived",
                text: "",
                html: `<p>You have a new request. Kindly <a href = ${url}>visit</a></p>`,
            }
            sendMail(mail_info);

        
    }
    catch(err)
    {
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

        let comments = [] ;

        if(req.body.comment)
        {
            let comment = {
                text : req.body.comment ,
                writtenBy : generatedBy
            }

            comments = [comment] ;
        }  

        console.log(comments) ;

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

        res.redirect('/getGeneratedFinanceRequests') ;
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
        let email = req.user.email || req.user.emails[0].value;

        let approved = await Request.countDocuments({generatedBy : email , finance:false , state:"APPROVED"}) ;

        let unapproved = await Request.countDocuments({generatedBy : email , finance:false , state:"OPEN"}) ;
        
        let cancelled = await Request.countDocuments({generatedBy : email , finance:false , state:"CANCELLED"}) ;

        let resolved = await Request.countDocuments({generatedBy : email , finance:false , state:"RESOLVED"}) ;

        let requests ;

        if(req.query.state == null || req.query.state == '' || req.query.state == undefined)
        {
            requests = await Request.find({generatedBy : email , finance:false}) ;
            
        }
        else
        {
            requests = await Request.find({generatedBy : email , finance:false , state:req.query.state}) ;   
        }
        res.render("get_generated_requests.ejs" , 
            {
                path:'generated_requests' ,
                title:'Generated Requests' ,
                requests: requests ,
                approved : approved , 
                unapproved : unapproved ,
                cancelled : cancelled ,
                resolved : resolved ,
                isAuth : req.user
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

module.exports.getGeneratedFinanceRequests = async (req , res , next) => 
{
    try
    {
        let email = req.user.email;

        let approved = await Request.countDocuments({generatedBy : email , finance:true , state:"APPROVED"}) ;

        let unapproved = await Request.countDocuments({generatedBy : email , finance:true , state:"OPEN"}) ;

        let cancelled = await Request.countDocuments({generatedBy : email , finance:true , state:"CANCELLED"}) ;

        let resolved = await Request.countDocuments({generatedBy : email , finance:true , state:"RESOLVED"}) ;

        let requests ;

        if(req.query.state == null || req.query.state == '' || req.query.state == undefined)
        {
            requests = await Request.find({generatedBy : email , finance:true}) ;
        }
        else
        {
            requests = await Request.find({generatedBy : email , finance:true , state : req.query.state}) ;  
        }
        res.render("get_genereated_finance_requests.ejs" , 
        {
            path:'generated_finance_requests' ,
            title:'Generated Finance Requests' ,
            requests: requests ,
            approved : approved , 
            unapproved : unapproved ,
            cancelled : cancelled ,
            resolved : resolved ,
            isAuth : req.user
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

module.exports.getToBeApprovedRequests = async (req , res , next) => {
    try
    {
        let user = req.user.email || req.user.emails[0].value;
        let requests = await Request.find({toBeApprovedBy : user , state:"OPEN" , finance:false }) ;
        res.render("to_be_approved_requests.ejs" , 
        {
            path:'to_be_approved_requests' ,
            title:'To Be Approved Requests' ,
            requests: requests ,
            isAuth : req.user
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
            isAuth : req.user
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
        let user = req.user.email || req.user.emails[0].value;
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
                    ta : req.user.team == "ta" ,
                    acknowledged : request.acknowledged ,
                    isAuth : req.user
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
                    finance : req.user.team == "finance" ,
                    isAuth : req.user
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
                isAuth : req.user
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
        let user = req.user.email || req.user.emails[0].value;
        if(request)
        {
            if(request.generatedBy == user || request.toBeApprovedBy == user)
            {
                if(req.body.comment)
                {
                    const comment = {
                        text : req.body.comment ,
                        writtenBy : user
                    }
                    const comments = [comment , ...request.comments] ;
                    request.comments = comments ;
                }

                let send_to = request.generatedBy;
                if(request.generatedBy == user) 
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
                // res.json({
                //     message:"Commented"
                // })
                res.redirect(`getComments?requestId=${request._id}`) ;
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
        let user = req.user.email || req.user.emails[0].value;
        if(request)
        {
            if(request.generatedBy == user || request.toBeApprovedBy == user)
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
        let user = req.user.email || req.user.emails[0].value;
        if(request)
        {
            if(request.toBeApprovedBy == user)
            {
                request.state = "APPROVED" ;
                await request.save() ;
                if(req.user.team == "hiring")
                {
                    res.redirect('/getToBeApprovedRequests') ;
                }
                else
                {
                    res.redirect('/getToBeApprovedFinanceRequests') ;
                }
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
        let user = req.user.email || req.user.emails[0].value;
        if(request)
        {
            if(request.generatedBy == user)
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
                        writtenBy : user 
                    }
                    const comments = [comment , ...request.comments] ;
                    request.comments = comments ;
                }

                await request.save() ;

                res.redirect(`/getSingleRequest?requestId=${request._id}`) ;
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
        console.log(req.query) ;
        let application = 0 ;
        let infra = 0 ;
        let product = 0 ;
        let team4 = 0 ;
        if(req.query.team == null || req.query.team == "" || req.query.team == undefined)
        {
            let requests = await Request.find({state : "APPROVED" , acknowledged:false}) ;
            let new_requests = requests.filter((rqst => {
                if(rqst.requestBody.team == "APPLICATION")
                {
                    application++ ;
                }
                else if(rqst.requestBody.team == "INFRA")
                {
                    infra++ ;
                }
                else if(rqst.requestBody.team == "PRODUCT")
                {
                    product++ ;
                }
                else if(rqst.requestBody.team == "TEAM4")
                {
                    team4++ ;
                }

                return rqst.requestBody.team == req.query.team
            }))
            res.render("get_approved_requests.ejs" , 
            {
                path:'approved_requests' ,
                title:'Approved Requests' ,
                requests: requests ,
                application : application ,
                infra:infra ,
                product : product ,
                team4:team4 ,
                isAuth : req.user
            })
        }
        else
        {
            let requests = await Request.find({state : "APPROVED" , acknowledged:false}) ;

            

            let new_requests = requests.filter((rqst => {
                if(rqst.requestBody.team == "APPLICATION")
                {
                    application++ ;
                }
                else if(rqst.requestBody.team == "INFRA")
                {
                    infra++ ;
                }
                else if(rqst.requestBody.team == "PRODUCT")
                {
                    product++ ;
                }
                else if(rqst.requestBody.team == "TEAM4")
                {
                    team4++ ;
                }

                return rqst.requestBody.team == req.query.team
            }))

            console.log(requests) ;
            res.render("get_approved_requests.ejs" , 
            {
                path:'approved_requests' ,
                title:'Approved Requests' ,
                requests: new_requests ,
                application : application ,
                infra:infra ,
                product : product ,
                team4:team4 ,
                isAuth : req.user
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

module.exports.getApprovedFinanceRequests = async (req , res , next) => {
    try
    {
        let requests = await Request.find({state : "APPROVED" , finance:true , acknowledged:false}) ;
        res.render("get_approved_finance_requests.ejs" , 
        {
            path:'approved_finance_requests' ,
            title:'Approved Finance Requests' ,
            requests: requests ,
            isAuth : req.user
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
            isAuth : req.user
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
                    request:request ,
                    isAuth : req.user
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
                    request:request ,
                    isAuth : req.user
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
        let user = req.user.email || req.user.emails[0].value;
        if(request)
        {
            if(request.generatedBy == user || request.toBeApprovedBy == user)
            {
                res.render("modify_form.ejs" , 
                {
                    path:'modify_form' ,
                    title:'Modify Form' ,
                    request:request ,
                    isAuth : req.user
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
        let user = req.user.email || req.user.emails[0].value;
        if(request)
        {
            if(request.generatedBy == user || request.toBeApprovedBy == user)
            {
                res.render("getComments.ejs" , 
                {
                    path:'get_comments' ,
                    title:'Comments' ,
                    request:request ,
                    isAuth : req.user
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

//TA team screen
module.exports.getAllApprovedRequests = async (req , res , next) => 
{
    try
    {
        let email = req.user.email || req.user.emails[0].value;
        let user = await User.findOne({email: email});

        // console.log('user', user);

        if(user.type != 'ta') 
        {
            return res.send("you are unauthorized to enter this area!");
        }
        let requests = await Request.find
                    ({
                        $and : [
                            {state : "APPROVED"},
                            {
                                $or : [
                                    {acknowledged: false}, 
                                    {acknowledged: {$exists : false}}
                                ]
                            }
                        ]
                        
                    }) ;

        console.log("requests: ", requests);
        res.render("get_allApproved_requests.ejs" , 
        {
            path:'allApproved_requests' ,
            title:'Approved Requests' ,
            requests: requests ,
            isAuth : req.user
        })
    }
    catch(err)
    {
        res.json({
            error : err
        })
    }
}

module.exports.getSingleApprovedRequest = async (req , res , next) => {
    try
    {
        let email = req.user.email || req.user.emails[0].value;
        let user = await User.findOne({email: email});
        let requestId = req.query.requestId ;
        let request = await Request.findById(requestId) ;
        if(request)
        {
            if(user.type === 'ta')
            {
                res.render("get_singleApproved_request.ejs" , 
                {
                    path:'single_approved_request' ,
                    title:'Single Approved Request' ,
                    request: request ,
                    isAuth : req.user
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
