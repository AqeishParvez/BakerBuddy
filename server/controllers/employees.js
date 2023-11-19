import employeesModel from '../models/employee.js';
import { UserDisplayName } from '../utils/index.js';

/* GET Employee List page. READ */
export function displayEmployeeList(req, res, next) {
    // find all employees in the employee collection
    employeesModel.find((err, employeeCollection) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index', { title: 'Employee List', page: 'employees/list', employees: employeeCollection, displayName: UserDisplayName(req) });
    });
}

// GET the Employee Details page in order to add a new Employee
export function displayAddPage(req, res, next) {
    res.render('index', { title: 'Add Employee', page: 'employees/edit', employee: {}, displayName: UserDisplayName(req) });
}

// POST process the Employee Details page and create a new Employee - CREATE
export function processAddPage(req, res, next) {
    let newEmployee = employeesModel({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
        // Add other employee-related fields as needed
    });

    employeesModel.create(newEmployee, function(error) {
        if (error) {
            console.error(error);
            res.end(error);
        }

        res.redirect('/employees');
    });
}

// GET the Employee Details page in order to edit an existing Employee
export function displayEditPage(req, res, next) {
    let id = req.params.id;

    employeesModel.findById(id, function(error, employee) {
        if (error) {
            console.error(error);
            res.end(error);
        }

        res.render('index', { title: 'Edit Employee', page: 'employees/edit', employee, displayName: UserDisplayName(req) });
    });
}

// POST - process the information passed from the details form and update the document
export function processEditPage(req, res, next) {
    let id = req.params.id;

    let newEmployee = employeesModel({
        "_id": req.body.id,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
    });

    employeesModel.updateOne({_id: id}, newEmployee, function(error){
        if(error){
            console.error(error);
            res.end(error);
        }

        res.redirect('/employees');

    })
}

// GET - process the delete by user id
export function processDelete(req, res, next) {
    let id = req.params.id;

    employeesModel.remove({ _id: id }, function(error) {
        if (error) {
            console.error(error);
            res.end(error);
        }

        res.redirect('/employees/list');
    });
}
