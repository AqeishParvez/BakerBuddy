// modules required for routing
import { Router } from "express";

import { displayAddPage, displayEmployeeList, displayEditPage, processAddPage, processDelete, processEditPage } from "../controllers/employees.js";

const router = Router();

/* GET employees List page. READ */
router.get('/list', displayEmployeeList);
router.get('/', displayEmployeeList);

// GET the Employee Details page in order to add a new Employee
router.get('/add', displayAddPage);

// POST process the Employee Details page and create a new Employee - CREATE
router.post('/add', processAddPage);

// GET the Employee Details page in order to edit an existing Employee
router.get('/edit/:id', displayEditPage);

// POST - process the information passed from the details form and update the document
router.post('/edit/:id', processEditPage);

// GET - process the delete by user id
router.get('/delete/:id', processDelete);

export default router;
