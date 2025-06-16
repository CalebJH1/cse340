// Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const inventoryValidation = require("../utilities/inventory-validation")

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

// Route to get inventory by classification_id
router.get("/getInventory/:classificationId", utilities.handleErrors(invController.getInventoryJSON))

// Route to modify inventory by inventory_id
router.get("/edit/:invId", utilities.handleErrors(invController.buildEditInventory));

// Process the new classification
router.post(
    '/process-add-classification',
    inventoryValidation.addClassificationRules(),
    inventoryValidation.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Process the new inventory addition
router.post(
    '/process-add-inventory',
    inventoryValidation.addInventoryRules(),
    inventoryValidation.checkVehicleData,
    utilities.handleErrors(invController.addVehicle)
);

// Process the inventory update
router.post(
    "/update/", 
    inventoryValidation.addInventoryRules(),
    inventoryValidation.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

module.exports = router;