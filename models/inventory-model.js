const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get the details by inventory id
 * ************************** */
async function getDetailsByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getinventorybyid error " + error)
  }
}

/* *************************************
* Check for existing classification
* *********************************** */
async function checkExistingClassification(classification_name) {
    try {
        const sql = "SELECT classification_name FROM public.classification WHERE classification_name = $1"
        const classification = await pool.query(sql, [classification_name.toLowerCase()])
        return classification.rowCount
    } catch (error) {
        return error.message
    }
}


/* *****************************
* Add classification
* *************************** */
async function addClassification(classification_name) {
    try {
        const sql = 'INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *'
        return await pool.query(sql, [classification_name.toLowerCase()])
    } catch (error) {
        return error.message
    }
}


/* *****************************
* Add vehicle
* *************************** */
async function addVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
    try {
        const sql = 'INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *'
        return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
    } catch (error) {
        return error.message
    }
}

/* ****************************
* Update inventory
* ***************************** */
async function updateInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) {
    try {
        const sql = 'UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *'
        return await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id]).rows[0]
    } catch (error) {
        return error.message
    }
  }

module.exports = {getClassifications, getInventoryByClassificationId, getDetailsByInvId, checkExistingClassification, addClassification, addVehicle, updateInventory};