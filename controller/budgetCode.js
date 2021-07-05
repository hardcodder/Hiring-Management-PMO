const BudgetCode = require('../models/BudgetCode') ;
var xlsx = require('xlsx');
var fs = require('fs');
const {sendMail} = require('../utils');

module.exports.createBudgetCodeForm = async (req, res , next) => {
    try
    {
        res.render("budgetCode.ejs" , 
        {
            path:'budgetCode' ,
            title:'BudgetCode' ,
            isAuth : req.user
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

module.exports.createBudgetCode = async (req, res , next) => {
    try
    {
        const {budgetCode, position} = req.body;

        let budget = new BudgetCode({
            budgetCode: budgetCode,
            position: position,
            status: "Unassigned"
        })

        await budget.save();

        res.send("Budget Code added successfully!");
    }
    catch(err)
    {
        console.log(err) ;
        res.json({
            error : err
        })
    }
}

module.exports.getBudgetCodes = async (req, res , next) => {
    try
    {
        let budgetCodes = await BudgetCode.find({status : {$ne : 'FTE Assigned'}});

        let count = budgetCodes.length;
        res.render("get_allBudgetCode.ejs" , 
        {
            path:'get_allBudgetCode' ,
            title:'BudgetCodes' ,
            budgetCodes: budgetCodes,
            count: count ,
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

module.exports.getFilteredBudgetCodes = async (req, res , next) => {
    try
    {
        // console.log("filters", req.body);

        let obj = {};
        if(req.body.position != 'Position')
        obj.position = req.body.position;

        if(req.body.status != 'Status')
        obj.status = req.body.status;
        else 
        obj.status = { $ne: 'FTE Assigned' } ;

        let budgetCodes = await BudgetCode.find(obj);

        let count = budgetCodes.length;
        res.render("get_allBudgetCode.ejs" , 
        {
            path:'get_filteredBudgetCode' ,
            title:'BudgetCodes' ,
            budgetCodes: budgetCodes,
            count: count ,
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

module.exports.getAllocatedBudgetCodes = async (req, res , next) => {
    try
    {
        // console.log("filters", req.body);

        let obj = {};
        if(req.body.position != 'Position' && req.body.position != '' && req.body.position != undefined && req.body.position != null)
        obj.position = req.body.position;

        obj.status = 'FTE Assigned';

        let budgetCodes = await BudgetCode.find(obj);

        let count = budgetCodes.length;
        res.render("get_allocatedBudgetCodes.ejs" , 
        {
            path:'get_allocatedBudgetCode' ,
            title:'FTE Allocated BudgetCodes' ,
            budgetCodes: budgetCodes,
            count: count ,
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

module.exports.getexcel = (req, res) => {
    res.render('excelupload.ejs',
    {
        path:'excelupload' ,
        title:'Upload Excel Sheet' ,
        isAuth : req.user
    });
}

module.exports.postexcel = async (req , res) => {
    try
    {
        if(req.files) 
        {
            // console.log(req.files);
            let file = req.files.filetoupload;
            let fileName = file.name;
            // console.log(fileName);

            await file.mv('./' + fileName);
            let wb = await xlsx.readFile(fileName);

            //update database
            for(sheet of wb.SheetNames) 
            {
                // console.log(sheet);
                let ws = wb.Sheets[sheet];
                let data = await xlsx.utils.sheet_to_json(ws);
                // console.log("sheets", data);

                for(value of data) 
                {
                    // console.log("value", value);
                    let code = value.budgetCode;
                    let obj = { 
                        budgetCode : value.budgetCode,
                        position : value.position,
                        status : value.status,
                    }

                    let budgetCode = await BudgetCode.findOne({budgetCode: code});

                    // console.log(budgetCode, "budgetcode");
                    if(budgetCode) 
                    {
                        budgetCode.position = value.position;
                        budgetCode.status = value.status;
                        await budgetCode.save();
                    }

                    else
                    {
                        let newBudgetCode = new BudgetCode(obj);
                        await newBudgetCode.save();
                    }
                }
            }

            //remove excel file
            await fs.unlinkSync('./' + fileName);

            res.send('file uploaded');
        }
    }
    catch (err) {
        console.log(err) ;
        if(req.files) 
        {
            let file = req.files.filetoupload;
            let fileName = file.name;
            await fs.unlinkSync('./' + fileName);
        }
        res.json({
            error : err
        })
    }
}