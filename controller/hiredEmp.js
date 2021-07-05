const HiredEmp = require('../models/HiredEmp') ;
const Emp = require('../models/Employee') ;
const Opening = require('../models/Opening') ;
const BudgetCode = require('../models/BudgetCode') ;
const Request = require('../models/Request');
const ObjectId = require('mongoose').Types.ObjectId;
const {sendMail} = require('../utils');

//TODO: check employee should not be already hired
module.exports.addEmp = async (req, res , next) => {
    try
    {
        const {name, email, applicationId, position} = req.body;

        let emp = await HiredEmp.find(req.body);
        console.log(emp);
        if(emp.length === 0)
        {
            emp = new HiredEmp({
                name: name,
                email: email,
                applicationId: applicationId,
                position: position
            });

            await emp.save();

            res.send("success");
        }
    }
    catch(err)
    {
        res.json({
            message:"Please try again!" ,
            type : "error"
        }) ; 
    }
}

module.exports.assignBudgetCodeToEmp = async (req, res) => {
    try
    {
        let hiredemp = await HiredEmp.find({});

        for(employee of hiredemp) 
        {
            let opening = await Opening.findOne({status: 'OPENED', position: employee.position, budgetCode: {$ne : '$'}});
            //update employee table;

            if(opening === null  || opening === undefined) {
                continue;
            }

            console.log('opening', opening);

            let request = await Request.findById(ObjectId(opening.requestId));
            console.log('req,', request);

            let emp = new Emp({
                name: employee.name,
                email: employee.email,
                team: request.requestBody.team,
                position: employee.position,
                budgetCode: opening.budgetCode,
                requestAssigned: request._id
            });
            await emp.save();

            let code = await BudgetCode.findOne({budgetCode : opening.budgetCode});

            console.log('code', code);
            code.status = 'FTE Assigned';
            code.assignedTo = employee.email;
            code.team = request.requestBody.team;
            code.reportingManager = request.requestBody.reportingManager;

            await code.save();

            opening.status = 'CLOSED';
            await opening.save();

            request.state = 'RESOLVED';
            await request.save();

            console.log('request', request);

            await HiredEmp.deleteOne(employee);

            res.send('sucess');

        }
    }
    catch(err)
    {
        res.json({
            message:"Please try again!" ,
            type : "error"
        }) ; 
    }
}

module.exports.getUnallocatedHiredEmp = async (req, res) => {
    try
    {
        let hiredEmp = await HiredEmp.find({});
        res.render("get_hiredEmp.ejs" , 
        {
            path:'get_hiredEmp' ,
            title:'Hired Employees' ,
            hiredEmp: hiredEmp,
        })
    }
    catch(err)
    {
        res.json({
            message:"Please try again!" ,
            type : "error"
        }) ; 
    }
}

module.exports.getFilteredUnallocatedHiredEmp = async (req, res) => {
    try
    {
        let obj = {};
        const {position} = req.body;

        if(position != 'Position') {
            obj.position = position;
        }

        let hiredEmp = await HiredEmp.find(obj);
        res.render("get_hiredEmp.ejs" , 
        {
            path:'get_hiredEmp' ,
            title:'Hired Employees' ,
            hiredEmp: hiredEmp,
        })
    }
    catch(err)
    {
        res.json({
            message:"Please try again!" ,
            type : "error"
        }) ; 
    }
}


module.exports.getHiredEmp = async (req, res) => {
    try
    {
        let emp = await Emp.find({}).populate('requestAssigned').exec();
        let hiredEmp = await HiredEmp.find({});

        console.log('emp', emp);
        for(value of hiredEmp) {
            value.budgetCode = 'UNASSIGNED';
        }
        emp = [...emp, ...hiredEmp];

        res.render("get_emp.ejs" , 
        {
            path:'get_emp' ,
            title:'Hired Employees' ,
            emp: emp,
        })
    }
    catch(err)
    {
        res.json({
            message:"Please try again!" ,
            type : "error"
        }) ; 
    }
}

module.exports.getFilteredHiredEmp = async (req, res) => {
    try
    {
        let obj = {};
        const {position} = req.body;

        if(position != 'Position') {
            obj.position = position;
        }

        let emp = await Emp.find(obj).populate('requestAssigned').exec();
        let hiredEmp = await HiredEmp.find(obj);

        // console.log('emp', emp);
        for(value of hiredEmp) {
            value.budgetCode = 'UNASSIGNED';
        }
        emp = [...emp, ...hiredEmp];

        res.render("get_emp.ejs" , 
        {
            path:'get_emp' ,
            title:'Hired Employees' ,
            emp: emp,
        })
    }
    catch(err)
    {
        res.json({
            message:"Please try again!" ,
            type : "error"
        }) ; 
    }
}

module.exports.tableHandler = async(req, res, next) => {
    try{
        res.render("tableHandler.ejs" , 
        {
            path:'tableHandler' ,
            title:'Table List' ,
        })
    }
    catch(err)
    {
        res.json({
            message:"Please try again!" ,
            type : "error"
        }) ; 
    }
}


