import mongoose from 'mongoose';
import Employees from '../models/employee.js';
import User from '../models/user.js';
import { UserDisplayName } from '../utils/index.js';

let originalEmployee;

// Helper function to generate a unique pin code
function generateUniquePinCode() {
    // For simplicity, we'll use a basic example here
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// Middleware to autogenerate a unique username
function generateUniqueUsername(user, next) {
    const usernameBase = `${user.firstName.charAt(0).toLowerCase()}${user.lastName.toLowerCase()}`;

    // Check if the generated username already exists
    mongoose.model('Employees').findOne({ username: { $regex: new RegExp(`^${usernameBase}`, 'i') } }, (err, existingUser) => {
        if (existingUser) {
            // If the username exists, append a number to make it unique
            let count = 1;
            let newUsername = `${usernameBase}${count}`;
            while (existingUser && existingUser.username === newUsername) {
                count++;
                newUsername = `${usernameBase}${count}`;
            }
            user.username = newUsername;
        } else {
            user.username = usernameBase;
        }
        next();
    });
}

// GET Employee List page. READ
export function displayEmployeeList(req, res, next) {
    // find all employees in the employee collection
    Employees.find((err, employeeCollection) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index', { title: 'Employee List', page: 'employees/list', employees: employeeCollection, displayName: UserDisplayName(req) });
    });
}

// GET the Employee Details page in order to add a new Employee
export function displayAddPage(req, res, next) {
    res.render('index', { title: 'Add Employee', page: 'employees/add', employee: {}, displayName: UserDisplayName(req) });
}

// POST process the Employee Details page and create a new Employee - CREATE
export function processAddPage(req, res, next) {
    const newEmployee = new Employees({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role,
        registrationCode: generateUniquePinCode(),
        registered: req.body.registered,
        // Add other employee-related fields as needed
    });

    // Generate a unique username before saving
    generateUniqueUsername(newEmployee, () => {
        newEmployee.save()
            .then(() => res.redirect('/employees'))
            .catch((error) => {
                console.error(error);
                res.end(error);
            });
    });
}

// GET the Employee Details page in order to edit an existing Employee
export function displayEditPage(req, res, next) {
    const id = req.params.id;

    Employees.findById(id, (error, employee) => {
        if (error) {
            console.error(error);
            res.end(error);
        }

        // Store the original employee information
        originalEmployee = { ...employee.toObject() };

        res.render('index', { title: 'Edit Employee', page: 'employees/edit', employee, displayName: UserDisplayName(req)});
    });
}

// POST - process the information passed from the details form and update the document
// POST - process the information passed from the details form and update the document
export function processEditPage(req, res, next) {
    const id = req.params.id;

    const updatedEmployee = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        registered: req.body.registered,
        registrationCode: req.body.registrationCode,
        role: req.body.role,
    };

    // Check if firstName or lastName has changed
    const firstNameChanged = updatedEmployee.firstName !== originalEmployee.firstName;
    const lastNameChanged = updatedEmployee.lastName !== originalEmployee.lastName;

    if (firstNameChanged || lastNameChanged) {
        // Generate a unique username if either firstName or lastName has changed
        generateUniqueUsername(updatedEmployee, () => {
            // Update the document with the new information
            Employees.updateOne({ _id: id }, updatedEmployee, async (error) => {
                if (error) {
                    console.error(error);
                    res.end(error);
                }

                // Update the corresponding user's role in the Users collection based on the email address
                try {
                    const email = updatedEmployee.email;
                    await User.updateOne({ emailAddress: email }, { $set: { role: updatedEmployee.role } });

                    // Redirect to the employee list page
                    res.redirect('/employees');
                } catch (updateError) {
                    console.error(updateError);
                    res.end(updateError);
                }
            });
        });
    } else {
        // If neither firstName nor lastName has changed, proceed without changing the username
        Employees.updateOne({ _id: id }, updatedEmployee, async (error) => {
            if (error) {
                console.error(error);
                res.end(error);
            }

            // Update the corresponding user's role in the Users collection based on the email address
            try {
                const email = updatedEmployee.email;
                await User.updateOne({ emailAddress: email }, { $set: { role: updatedEmployee.role } });

                // Redirect to the employee list page
                res.redirect('/employees');
            } catch (updateError) {
                console.error(updateError);
                res.end(updateError);
            }
        });
    }
}

// GET - process the delete by user id
export function processDelete(req, res, next) {
    const id = req.params.id;

    // Retrieve the email address of the employee being deleted
    Employees.findById(id, (error, employee) => {
        if (error) {
            console.error(error);
            res.end(error);
        }

        const email = employee.email;

        // Remove the employee from the Employees collection
        Employees.remove({ _id: id }, async (error) => {
            if (error) {
                console.error(error);
                res.end(error);
            }

            // Remove the corresponding user from the Users collection based on the email address
            try {
                await User.deleteOne({ emailAddress: email });
                res.redirect('/employees/list');
            } catch (deleteError) {
                console.error(deleteError);
                res.end(deleteError);
            }
        });
    });
}
