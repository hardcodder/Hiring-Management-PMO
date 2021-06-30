const Request = require('../models/Request') ;
const Opening = require('../models/Opening') ;
const BudgetCode = require('../models/BudgetCode') ;
const {sendMail} = require('../utils') ;
const ObjectId = require('mongoose').Types.ObjectId;

//assign budget code
//update budget code status
//update request
module.exports.createOpening = async (req , res , next) => {
    try 
    {
        const {requestId, budgetCode}  = req.query;

        console.log('requestId ', requestId);
        console.log('budgetCode ', budgetCode);

        if(budgetCode === '' || budgetCode === null || budgetCode === undefined)
        {
            let request = await Request.findById(ObjectId(requestId)) ;
            let position = request.requestBody.position ;
            let availableCode = await BudgetCode.findOne({position : position.toString(), status: 'Unassigned'}) ;

            console.log(position.toString(), "position");
            console.log("avcode", availableCode);

            if(availableCode)
            {
                let opening = new Opening({
                    requestId : ObjectId(requestId),
                    budgetCode : availableCode.budgetCode,
                    status : 'OPENED'
                })
        
                await opening.save() ;

                availableCode.status = 'Assigned';

                await availableCode.save() ;

                request.acknowledged = true ; 

                await request.save() ;
            }
            else
            {
                let opening = new Opening({
                    requestId : ObjectId(requestId),
                    budgetCode : '$',
                    status : 'OPENED'
                })
        
                await opening.save() ;

                request.acknowledged = true ; 

                await request.save() ;

                return res.redirect(`/getFinanceRequestForm?requestId=${request._id}`)

                //return res.send('we have initiated the request to the finance team!');
            }
        }
        else
        {
            let request = await Request.findById(ObjectId(requestId)) ;
            let opening = new Opening({
                requestId : ObjectId(requestId),
                budgetCode : budgetCode,
                status : 'OPENED'
            })
    
            await opening.save() ;

            request.acknowledged = true ; 

            await request.save() ;
        }
        

        res.send("opening created");
    }
    catch (err) {
        console.log(err) ;
        res.json({
            error : err
        })
    }
}