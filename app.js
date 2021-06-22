const express = require('express') ;
const mongoose = require("mongoose");
const bodyParser = require('body-parser') ;
const cors = require('cors') ;
const path = require('path') ;
const session = require("express-session") ;
const User = require('./models/User') ;

const port = process.env.PORT || 5000 ;

const authRouter = require('./routes/auth') ;

const requestRouter = require('./routes/request') ;

const app = express() ;

const MONGO_URI = `mongodb+srv://innovaccer:innovaccer@cluster0.cut4t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const MongodbStore = require("connect-mongodb-session")(session) ;

const store = new MongodbStore({
    uri:MONGO_URI ,
    collection : 'sessions'
})

app.use(cors()) ;

app.use(bodyParser.json()) ;

app.use(bodyParser.urlencoded({extended:false})) ;

app.use(express.static(path.join(__dirname ,'public'))) ;

app.use(session({secret:'Its a secret' , resave:false , saveUninitialized:false , store:store , cookie:{maxAge:3600000}})) ;

app.set("view engine" , "ejs") ;

app.set("views" , "views") ;

app.use(async (req , res , next) => {
  if(req.session.user)
  {
      const id = req.session.user._id ;
      const user = await User.findById(id) ;
      if(user)
      {
          req.user = user ;
      }
  }
  next() ;
})

app.use(authRouter) ;

app.use(requestRouter) ;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.log("connected");
    app.listen(port , ()=> {
        console.log("server is running on port ",port);
    })
  })
  .catch((err) => {
    console.log(err);
  });


