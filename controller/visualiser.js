module.exports.getGraph = async(req, res, next) => {
    try
    {
        res.render('greenhouseAnalysis', 
        {
            path: 'greenhouseAnalysis',
            title: 'Graph Analysis',
            isAuth: req.user
        })
    }
    catch(err) 
    {
        console.log(err);
        res.send(err);
    }
}

module.exports.getGreenhouse = async(req, res, next) => {
    try
    {
        res.render('greenhouseLanding', 
        {
            path: 'greenhouseLanding',
            title: 'Greenhouse Landing',
            isAuth: req.user
        })
    }
    catch(err) 
    {
        console.log(err);
        res.send(err);
    }
}

module.exports.getGreenhouseTable = async(req, res, next) => {
    try
    {
        res.render('greenhouseTable', 
        {
            path: 'greenhouseTable',
            title: 'Greenhouse Table',
            isAuth: req.user
        })
    }
    catch(err) 
    {
        console.log(err);
        res.send(err);
    }
}