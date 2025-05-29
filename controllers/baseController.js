const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message.")
  res.render("index", {title: "Home", nav, errors: null})
}

baseController.errorFunction = async function(req, res){
  const nv = await utilities.getNav()
  res.render("index", {title: "Home", nav, errors: null})
}

module.exports = baseController