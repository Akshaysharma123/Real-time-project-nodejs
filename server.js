require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3300
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')




// DataBase Connection
const url = 'mongodb://localhost/burger';
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify: true});
const connection = mongoose.connection;
try {
    connection.once('open', () => {
         console.log('database Connected');
    })}
    catch (err) { 
         console.log('Connection Failed..')
    }

// session store
let mongoStores = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'session'
})

// session config
try {
    app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStores,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24} //24 hours
    }))
} catch (e) {
     console.log(e)
    }



// passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())



app.use(flash())


// Use global Middelware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// set Templates engine
app.use(expressLayout);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');



// Routes
require('./routes/web')(app)


// assets 
app.use(express.static('public'));


app.listen(PORT, () => {
    console.log('listing on port 3000')
})