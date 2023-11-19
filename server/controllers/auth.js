import express from 'express';

import passport from 'passport';

//User Model Information
import User from '../models/user.js';

//Import Display Name Utility for Authentication
import {UserDisplayName} from '../utils/index.js';


//Display Functions

//Login
export function DisplayLoginPage(req, res, next){
    if(!req.user){
        return res.render('index', {title: 'Login',
                                    page: 'auth/login',
                                    messages: req.flash('loginMessage'),
                                    displayName : UserDisplayName(req)
                                });
    }

    return res.redirect('/employees/list');
}


//Registration
export function DisplayRegistrationPage(req, res, next){
    if(!req.user){
        return res.render('index', {title: 'Register',
                                    page: 'auth/register',
                                    messages: req.flash('registerMessage'),
                                    displayName : UserDisplayName(req)
                                });
    }

    return res.redirect('/employees/list');
}


//Pocessing Functions
export function ProcessRegisterPage(req, res, next){
    let newUser = new User({
        username: req.body.username,
        emailAddress: req.body.emailAddress,
        displayName: req.body.firstName + " " + req.body.lastName
    });

    User.register(newUser, req.body.password, function(err){
        if(err){
            if(err.name == "UserExistsError"){
                console.error('ERROR: User Already Exists!');
                req.flash('registerMessage', err.name);

            } else {
                console.error(err.name);
                req.flash('registerMessage', 'Server Error')
            }

            return res.redirect('/auth/register');
        }

        return passport.authenticate('local')(req, res, function(){
            return res.redirect('/');
        });

    })
}
export function ProcessLoginPage(req, res, next){
    passport.authenticate('local', function (err, user){
        if(err){
            console.error(err);
            res.end(err);
        }

        if(!user){
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/auth/login');
        }


        req.logIn(user, function(err){
            if(err){
                console.error(err);
                res.end(err);
            }

            return res.redirect('/')

        })

    })(req, res, next);
}

export function ProcessLogoutPage(req, res, next){
    req.logOut(function(err){
        if(err){
            console.error(err);
            res.end(err);
            return;
        }

        console.log('user successfully logged out');
    })

    res.redirect('/auth/login')
}