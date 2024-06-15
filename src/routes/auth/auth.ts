import {refreshToken, registerUser, signInUser} from "./auth.controllers";
const express = require('express');
const router = express.Router();



router.post('/sign-up', registerUser);


router.post('/sign-in', signInUser);


router.post('/refresh-token', refreshToken);


export default router;
