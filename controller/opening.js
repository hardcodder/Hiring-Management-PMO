const Request = require('../models/Request') ;
const Opening = require('../models/Opening') ;
const BudgetCode = require('../models/BudgetCode') ;
const {sendMail} = require('../utils') ;
const ObjectId = require('mongoose').Types.ObjectId;

//assign budget code
//update budget code status
//update request
// module.exports.createOpening = async (req , res , next) => {
//     try 
//     {
//         const {requestId, budgetCode}  = req.query;

//         console.log('requestId ', requestId);
//         console.log('budgetCode ', budgetCode);

//         if(budgetCode === '' || budgetCode === null || budgetCode === undefined)
//         {
//             let request = await Request.findById(ObjectId(requestId)) ;
//             let position = request.requestBody.position ;
//             let availableCode = await BudgetCode.findOne({position : position.toString(), status: 'Unassigned'}) ;

//             console.log(position.toString(), "position");
//             console.log("avcode", availableCode);

//             if(availableCode)
//             {
//                 let opening = new Opening({
//                     requestId : ObjectId(requestId),
//                     budgetCode : availableCode.budgetCode,
//                     status : 'OPENED'
//                 })
        
//                 await opening.save() ;

//                 availableCode.status = 'Assigned';

//                 await availableCode.save() ;

//                 request.acknowledged = true ; 

//                 await request.save() ;
//             }
//             else
//             {
//                 let opening = new Opening({
//                     requestId : ObjectId(requestId),
//                     budgetCode : '$',
//                     status : 'OPENED'
//                 })
        
//                 await opening.save() ;

//                 request.acknowledged = true ; 

//                 await request.save() ;


//                 //return res.send('we have initiated the request to the finance team!');
//             }
//         }
//         else
//         {
//             let request = await Request.findById(ObjectId(requestId)) ;
//             let opening = new Opening({
//                 requestId : ObjectId(requestId),
//                 budgetCode : budgetCode,
//                 status : 'OPENED'
//             })
    
//             await opening.save() ;

//             request.acknowledged = true ; 

//             await request.save() ;
//         }
        

//         res.send("opening created");
//     }
//     catch (err) {
//         console.log(err) ;
//         res.json({
//             error : err
//         })
//     }
// }

module.exports.createOpening = async (req , res , next) => {
    try 
    {
        const {requestId, budgetCode}  = req.query;

        console.log('requestId ', requestId);
        console.log('budgetCode ', budgetCode);

        if(budgetCode === '' || budgetCode === null || budgetCode === undefined)
        {
            let request = await Request.findById(ObjectId(requestId)) ;
            console.log("HELLO1") ;
            console.log(request) ;
            let position = request.requestBody.position ;
            let availableCode = await BudgetCode.findOne({position : position.toString(), status: 'Unassigned'}) ;

            console.log(position.toString(), "position");
            console.log("avcode", availableCode);

            if(availableCode)
            {
                let opening = new Opening({
                    requestId : ObjectId(requestId),
                    budgetCode : availableCode.budgetCode,
                    team: request.requestBody.team,
                    priority: request.requestBody.priority,
                    position : position,
                    status : 'OPENED'
                })
        
                await opening.save() ;

                availableCode.status = 'Opening Assigned';

                await availableCode.save() ;

                request.acknowledged = true ; 

                await request.save() ;
            }
            else
            {

                let opening = new Opening({
                    requestId : ObjectId(requestId),
                    budgetCode : '$',
                    team: request.requestBody.team,
                    priority: request.requestBody.priority,
                    position: position,
                    status : 'OPENED'
                })
        
                await opening.save() ;

                request.acknowledged = true ; 

                await request.save() ;
                return res.redirect(`/getFinanceRequestForm?requestId=${request._id}`)

            }
        }
        else
        {

            let request = await Request.findById(ObjectId(requestId)) ;
            let opening = new Opening({
                requestId : ObjectId(requestId),
                budgetCode : budgetCode,
                team: request.requestBody.team,
                priority: request.requestBody.priority,
                position: request.requestBody.position ,
                status : 'OPENED'
            })
    
            await opening.save() ;

            request.acknowledged = true ; 

            await request.save() ;
        }
        

        res.render("message_page.ejs" , 
        {
            path:'message_page' ,
            title:'Message' ,
            message : "Opening has been successfully created" ,
            messageType:"success" ,
            isAuth : req.user
        })
    }
    catch (err) {
        console.log(err) ;
        res.json({
            error : err
        })
    }
}

module.exports.getOpenings = async (req, res, next) => {
    try
    {
        let openings = await Opening.find({});

        res.render("allOpenings.ejs" , 
        {
            path:'getOpenings' ,
            title:'Openings' ,
            openings: openings,
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

module.exports.postOpenings = async (req, res, next) => {
    try
    {
        const {budgetCode, position , requestId}= req.body;

        let request = await Request.findById(requestId) ;
        request.acknowledged = true ;
        request.state = "RESOLVED" ;
        await request.save() ;

        console.log(request) ;

        console.log(req.body);
        let code = new BudgetCode({
            budgetCode : budgetCode,
            position : position,
            status : 'Unassigned'
        })

        await code.save() ;

        code = await BudgetCode.findOne({budgetCode : budgetCode});

        let openings = await Opening.find({position : position, budgetCode : '$'}).sort({priority : 1});
        
        console.log(openings);
        if(openings.length) 
        {
            openings[0].budgetCode = code.budgetCode;

            await openings[0].save() ;
            
            code.status = 'Opening Assigned';

            await code.save() ;

        }

        res.render("message_page.ejs" , 
        {
            path:'message_page' ,
            title:'Message' ,
            message : "Budget Code has been successfully assigned ." ,
            messageType:"success" ,
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