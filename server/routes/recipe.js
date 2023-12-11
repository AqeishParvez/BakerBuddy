// modules required for routing
import { Router } from "express";

import { displayAddPage, displayRecipeList, displayDetailPage, displayEditPage, processAddPage, processDelete, processEditPage } from "../controllers/recipe.js";

const router = Router();

/* GET recipe List page. READ */
router.get('/list', displayRecipeList);
router.get('/', displayRecipeList);

// GET the recipe Details page in order to add a new recipe
router.get('/add', displayAddPage);

// POST process the recipe Details page and create a new recipe - CREATE
router.post('/add', processAddPage);

// GET the recipe Details page in order to edit an existing recipe
router.get('/edit/:id', displayEditPage);

// POST - process the information passed from the details form and update the document
router.post('/edit/:id', processEditPage);

router.get('/detail/:id', displayDetailPage);
// GET - process the delete by user id
router.get('/delete/:id', processDelete);

export default router;
