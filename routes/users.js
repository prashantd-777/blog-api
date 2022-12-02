const router = require("express").Router();
const User = require("../models/User");
const POST = require("../models/Post");
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

/**
 * API to delete user details in app.
 * @param req {objects}
 * @param res {objects}
 */
router.delete('/:id', async (req, res) => {
    const {
        params: {id},
    } = req;
    if (isEmptyOrNull(id)) {
        setErrorResponse(null, ERROR?.REQUIRED_FIELDS_MISSING, res);
        return;
    }

    try {
        const user = await User.findById(id);
        if(!user) {
            setErrorResponse(null, ERROR.INVALID_USER, res);
            return;
        }

        if (user && user.username) {
            try {
                await POST.deleteMany({username: user.username});
                await User.findByIdAndDelete(id);
                setSuccessResponse({user: user}, res);
            } catch (err) {
                setErrorResponse(err, ERROR.GETTING_DATA, res);
            }
        }
    } catch (err) {
        setErrorResponse(err, ERROR.GETTING_DATA, res);
    }
});

/**
 * API to update user status details in app.
 * @param req {objects}
 * @param res {objects}
 */
router.patch('/:id', async (req, res) => {
    const {
        params: {
            id
        },
        body: {
            isActive
        }
    } = req;
    if (isEmptyOrNull(id)) {
        setErrorResponse(null, ERROR?.REQUIRED_FIELDS_MISSING, res);
        return;
    }
    try {
        const user = await User.findById(id);
        if(!user) {
            setErrorResponse(null, ERROR.INVALID_USER, res);
            return;
        }

        const updateUser = await User.findOneAndUpdate(id, {
            isActive
        }, {new: true})
        setSuccessResponse({user: updateUser}, res);
    } catch (err) {
        setErrorResponse(err, ERROR.GETTING_DATA, res);
    }
});

module.exports = router;