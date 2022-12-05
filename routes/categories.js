const router = require("express").Router();
const Category = require("../models/Category");
const ERROR = require(`../handlers/error-keys`);
const {setErrorResponse, setSuccessResponse} = require("../services/api-handler");
const {isEmptyOrNull} = require(`../helpers/validation`);

router.post('/', async (req, res) => {
    const { body: {
        name
    } } = req;

    if(isEmptyOrNull(name)) {
        setErrorResponse(null, ERROR?.REQUIRED_FIELDS_MISSING, res);
        return;
    }

    const exCategory = await Category.findOne({ name });
    if(exCategory) {
        setErrorResponse(null, ERROR.CATEGORY_ALREADY_PRESENT, res);
    } else {
        const newCategory = new Category(req.body);
        try {
            const saveCategory = await newCategory.save();
            setSuccessResponse({category: saveCategory}, res);
        } catch (err) {
            setErrorResponse(err, ERROR.GETTING_DATA, res);
        }
    }
});

router.get('/', async (req, res) => {
    const newCategory = new Category(req.body);
    try {
        const categories = await Category.find();
        setSuccessResponse({categories: categories}, res);
    } catch (err) {
        setErrorResponse(err, ERROR.GETTING_DATA, res);
    }
});

module.exports = router;