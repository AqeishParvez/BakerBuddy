import express from 'express';

import passport from 'passport';

//import employees model
import Employees from '../models/employee.js';

//User Model Information
import User from '../models/user.js';

//Import Display Name Utility for Authentication
import {UserDisplayName} from '../utils/index.js';

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
export async function ProcessRegisterPage(req, res, next) {
    // Extract information from the registration form
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.emailAddress;
    const registrationCode = req.body.registrationCode;
    const role = req.body.role;

    // Check if there is an employee with matching information
    const matchingEmployee = await Employees.findOne({
        firstName: firstName,
        lastName: lastName,
        email: email,
        registrationCode: registrationCode
    });

    // Check if a user with the same email address already exists
    const existingUser = await User.findOne({ emailAddress: email });

    if (existingUser) {
        // If a user with the same email already exists, display an error message
        req.flash('registerMessage', 'A user is already registered with this email address.');
        return res.redirect('/auth/register');
    }

    if (!matchingEmployee) {
        // If no matching employee found, display an error message
        req.flash('registerMessage', 'Mismatch in information. Please check your details.');
        return res.redirect('/auth/register');
    }

    // If a matching employee is found and no existing user, proceed with user registration
    const newUser = new User({
        username: req.body.username,
        emailAddress: email,
        displayName: `${firstName} ${lastName}`,
        role: role,
    });

    User.register(newUser, req.body.password, async function (err) {
        if (err) {
            if (err.name == "UserExistsError") {
                console.error('ERROR: User Already Exists!');
                req.flash('registerMessage', err.name);
            } else {
                console.error(err.name);
                req.flash('registerMessage', 'Server Error')
            }

            return res.redirect('/auth/register');
        }

        // Update the registered field in the Employees collection
        await Employees.updateOne(
            { _id: matchingEmployee._id },
            { $set: { registered: true } }
        );

        return passport.authenticate('local')(req, res, function () {
            return res.redirect('/');
        });
    });
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