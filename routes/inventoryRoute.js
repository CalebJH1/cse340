// Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const managementValidation = require("../utilities/management-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build the detail page for a specific vehicle
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to inventory management
router.get("/", 
    utilities.handleErrors(invController.buildInventoryManagement)
);

// Route to add new classification
router.get("/add-classification",
    utilities.handleErrors(invController.buildAddClassification)
);

// Route to add to inventory
router.get("/add-inventory", 
    utilities.handleErrors(invController.buildAddInventory)
);

router.post(
    '/process-add-classification',
    managementValidation.addClassificationRules(),
    managementValidation.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

router.post(
    '/process-add-inventory',
    managementValidation.addInventoryRules(),
    managementValidation.checkVehicleData,
    utilities.handleErrors(invController.addVehicle)
);

module.exports = router;