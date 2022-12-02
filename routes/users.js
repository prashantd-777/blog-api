const router = require("express").Router();
const User = require("../models/User");
const {isEmptyOrNull} = require(`../helpers/validation`);
const {setErrorResponse, setSuccessResponse} = require("../services/api-handler");
const ERROR = require(`../handlers/error-keys`);
const bcrypt = require("bcrypt");

/**
 * API to update user details in app.
 * @param req {objects}
 * @param res {objects}
 */
router.put('/:id', async (req, res) => {
    const {params: {id}} = req;
    if (isEmptyOrNull(id)) {
        setErrorResponse(null, ERROR?.REQUIRED_FIELDS_MISSING, res);
        return;
    }

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            $set: req.body
        }, {new: true})
        setSuccessResponse({user: updateUser}, res);
    } catch (err) {
        setErrorResponse(err, ERROR.GETTING_DATA, res);
    }
});

module.exports = router;