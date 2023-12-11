// modules required for routing
import { Router } from "express";

import { displayConversionList } from "../controllers/conversion.js";

const router = Router();

/* GET conversion List page. READ */
router.get('/list', displayConversionList);
router.get('/', displayConversionList);

export default router;
