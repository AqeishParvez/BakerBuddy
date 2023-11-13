//File Name: index.js, Student Name: Aqeish Parvez, Student ID: 301225795, Web App Name: COMP229-MIDTERM-301225795

import { Router } from 'express';

let router = Router();

import {DisplayHomePage} from '../controllers/index.js';

/* Display home page. */
router.get('/', DisplayHomePage);

/* Display home page. */
router.get('/home', DisplayHomePage);

export default router;