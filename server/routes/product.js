// modules required for routing
import { Router } from "express";

import { displayAddPage, displayProductList, displayEditPage, processAddPage, processEditPage } from "../controllers/product.js";

const router = Router();

/* GET product List page. READ */
router.get('/list', displayProductList);
router.get('/', displayProductList);

// GET the Product Details page in order to add a new Product
router.get('/add', displayAddPage);

// POST process the Product Details page and create a new Product - CREATE
router.post('/add', processAddPage);

// GET the Product Details page in order to edit an existing Product
router.get('/edit/:id', displayEditPage);

// POST - process the information passed from the details form and update the document
router.post('/edit/:id', processEditPage);

export default router;
