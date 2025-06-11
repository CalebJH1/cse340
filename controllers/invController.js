const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build details by vehicle view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getDetailsByInvId(inv_id)
  const details = await utilities.buildDetailsPage(data)
  let nav = await utilities.getNav()
  const vehicleName = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/details", {
    title: vehicleName,
    nav,
    details,
    errors: null,
  })
}

/* **********************************************
* Deliver vehicle management view
********************************************** */
invCont.buildInventoryManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
    })
}

/* ***************************************
* Deliver add classification View
* ************************************* */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
}


/* **************************************
* Process add classification
* ************************************ */
invCont.addClassification = async function (req, res) {
    const { classification_name } = req.body
    const addedClassification = await invModel.addClassification(classification_name)
    let nav = await utilities.getNav()
    if (addedClassification) {
        req.flash ("notice", "Successfully added classification!")
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null
        })
    } else {
        req.flash ("notice", "Oops, failed to add classification.")
        res.status(501).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null
        })
    }
}


/* ***************************************
* Deliver add inventory View
* ************************************* */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-vehicle", {
        title: "Add Vehicle",
        nav,
        classificationList,
        errors: null,
    })
}

/* **************************************
* Process Add Vehicle
* ************************************ */
invCont.addVehicle = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    const addedVehicle = await invModel.addVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
    if (addedVehicle) {
        req.flash ("notice", "Successfully added vehicle!")
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null
        })
    } else {
        let classificationList = await utilities.buildClassificationList(classification_id)
        req.flash ("notice", "Oops, failed to add vehicle.")
        res.status(501).render("./inventory/add-vehicle", {
            title: "Add Vehicle",
            nav,
            classificationList,
            errors: null,
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
    }
}

module.exports = invCont