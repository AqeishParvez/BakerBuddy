//File Name: app.js, Student Name: Aqeish Parvez, Student ID: 301225795, Web App Name: COMP229-MIDTERM-301225795

import createError from 'http-errors';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';

// Fix for __dirname using ESM
import path,{dirname} from 'path';
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

//Auth step 1 - import passport modules
import passport from 'passport';
import passportLocal from 'passport-local';
import flash from 'connect-flash';

// Auth step 2 - define auth strategy
let localStrategy = passportLocal.Strategy;

import cors from 'cors';
import passportJWT from 'passport-jwt';

let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt; 

// Auth Step 3 - import the user model
import User from '../models/user.js';

// import db package
import mongoose from 'mongoose';

// import the router data
import indexRouter from '../routes/index.js';
import employeesRouter from '../routes/employees.js';
import productRouter from '../routes/product.js';
import authRouter from '../routes/auth.js';

const app = new express();

// Complete the DB Configuration
import {MongoURI, Secret} from '../config/config.js';

mongoose.connect(MongoURI);
const db = mongoose.connection;

// Listen for Connections or Errors
db.on('open', () => console.log(`Connected to MongoDB at Localhost`));
db.on('error', () => console.error('Connection Error'));

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../client')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// Auth Step 4 - setup the express-session
app.use(session({
    secret: Secret,
    saveUninitialized: false,
    resave: false
}));

//setup body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Auth Step 5 - initialize the flash module
app.use(flash());

// Auth Step 6 - initialize and configure passport
app.use(passport.initialize());
app.use(passport.session());

//Auth Step 7 - implementing authorization strategy
passport.use(User.createStrategy());

//Auth Step 8 - serialize and deserialize user data
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Auth step 9 - Enable JWT
let jwtOption = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: Secret
};

//JWT Passport strategy
let strategy = new JWTStrategy(jwtOption, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
        .then(user => {
            return done(null, user);
        })
        .catch(err => {
            return done(err, false);
        });
});

//use the JWT strategy
passport.use(strategy);

//Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/auth/login');
};

//Making user available globally
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// use routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/employees', isAuthenticated, employeesRouter);
app.use('/product', isAuthenticated, productRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    console.log('Request received for path:'+req.path);
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {

     // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;