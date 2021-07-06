require('dotenv').config();
const express = require('express') ;
const mongoose = require("mongoose");
const bodyParser = require('body-parser') ;
const cors = require('cors') ;
const path = require('path') ;
const session = require("express-session") ;
const upload = require('express-fileupload');
const Str = require('@supercharge/strings')
const User = require('./models/User') ;

const port = process.env.PORT || 5000 ;

const authRouter = require('./routes/auth') ;

const requestRouter = require('./routes/request') ;

const budgetRouter = require('./routes/budgetCode') ;

const openingRouter = require('./routes/opening') ;

const hiredEmpRouter = require('./routes/hiredEmp') ;

const visualizeRouter = require('./routes/visualize') ;

const app = express() ;

const MONGO_URI = `mongodb+srv://innovaccer:innovaccer@cluster0.cut4t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const MongodbStore = require("connect-mongodb-session")(session) ;

const store = new MongodbStore({
    uri:MONGO_URI ,
    collection : 'sessions'
})

app.use(cors()) ;

app.use(upload());

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

//................GOOGLE AUTH
const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', async (req, res) => {
  let email = userProfile.emails[0].value;
  console.log('email', email);
  let user = await User.findOne({email: email});

  if(user)
  {
    console.log("here", user);
    if(user.type === undefined || user.type === null) {
      return res.redirect('usertype');
    }
    
    return res.redirect('/');
  }
  else
  {
    user = new User ({
      email: email,
      name: userProfile.displayName,
      password: Str.random(50),
    });

    await user.save() ;

    return res.redirect('usertype');
  }
});

app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://c7568673ceb4.ngrok.io/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.

    let email = userProfile.emails[0].value;
    // if(email.search('@innovaccer.com') == -1) {
    //   req.session = null;
    //   req.logout();

    //   return res.redirect('/error');
    // }

    res.redirect('/success');
  });

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
//..........................end-GOOGLEAUTH

app.use(authRouter) ;

app.use(requestRouter) ;

app.use(budgetRouter) ;

app.use(openingRouter) ;

app.use(hiredEmpRouter) ;

app.use(visualizeRouter)

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


