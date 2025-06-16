const utilities = require(".")
const {body, validationResult} = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}


/* *******************************************
* Add Classification Data Validation Rules
* ***************************************** */
validate.addClassificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid classification name.")
        .custom(async (classification_name) => {
            const classificationExists = await invModel.checkExistingClassification(classification_name)
            if (classificationExists) {
                throw new Error("Classification exists. Please enter a different classification")
            }
        }),
    ]
}


/* ******************************************************************
* Check data and return error or continue to add new classification
* **************************************************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}


/* *******************************************
* Add Vehicle Data Validation Rules
* ***************************************** */
validate.addInventoryRules = () => {
    return [
        body("classification_id")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .isInt({min: 1})
        .withMessage("Please select a classification"),
        
        body("inv_make")
        .trim()
        .notEmpty()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Please provide a make"),

        body("inv_model")
        .trim()
        .notEmpty()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Please provide a model"),

        body("inv_description")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a description"),

        body("inv_image")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid image path"),

        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid path for the thumbnail"),

        body("inv_price")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .isNumeric()
        .matches(/^\d+(\.\d{2})?$/)
        .withMessage("Please provide a valid price")
        .custom(inv_price => {
            if (inv_price < 0) {
                throw new Error("Price cannot be a negative")
            } else {
                return true
            }
        }),

        body("inv_year")
        .trim()
        .notEmpty()
        .isInt({ min: 1885, max: 2050 })
        .withMessage("Please enter a valid year that is between 1885 and 2050"),

        body("inv_miles")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .isNumeric()
        .isInt({min: 1})
        .withMessage("Please provide a valid number of miles"),

        body("inv_color")
        .trim()
        .notEmpty()
        .escape()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid color with alphabetic characters only"),
    ]
}


/* ******************************************************************
* Check data and return errors or continue to add new vehicle
* **************************************************************** */
validate.checkVehicleData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("./inventory/add-vehicle", {
            errors,
            title: "Add Vehicle",
            nav,
            classificationList,
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
        })
        return
    }
    next()
}

/* ******************************************************************
* Check data and direct errors back to the edit view.
* **************************************************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        const name = `${inv_make} ${inv_model}`
        res.render("./inventory/edit-inventory", {
            errors,
            title: "Edit " + name,
            nav,
            classificationSelect: classificationList,
            inv_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id
        })
        return
    }
    next()
}

module.exports = validate