const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {isEmptyOrNull, isNotEmail} = require(`../helpers/validation`);
const {setErrorResponse, setSuccessResponse} = require("../services/api-handler");
const ERROR = require(`../handlers/error-keys`);

//REGISTER
router.post('/register', async (req, res) => {
    const {
        body: {
            username,
            email,
            password
        }
    } = req;
    if (isEmptyOrNull(username) || isEmptyOrNull(email) || isEmptyOrNull(password)) {
        setErrorResponse(null, ERROR?.REQUIRED_FIELDS_MISSING, res);
        return;
    }

    if (isNotEmail(email)) {
        setErrorResponse(null, ERROR?.INVALID_EMAIL_ADDRESS, res);
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashPassword,
        });
        const user = await newUser.save();
        setSuccessResponse({user}, res);
    } catch (err) {
        setErrorResponse(err, err?.code === 11000 ? ERROR.FIELD_ALREADY_EXIST : ERROR.GETTING_DATA, res);
    }
})

//LOGIN
router.post('/login', async (req, res) => {
    const {
        body: {
            email,
            password
        }
    } = req;
    try {
        const user = await User.findOne({email});
        !user && setErrorResponse(null, ERROR.LOGIN_FAILED, res);
        const validated = await bcrypt.compare(password, user.password);
        !validated && setErrorResponse(null, ERROR.LOGIN_FAILED, res);
        setSuccessResponse({ user }, res);
    }catch (err) {
        setErrorResponse(err, ERROR.GETTING_DATA, res);
    }
})

module.exports = router;