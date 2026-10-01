const express = require('express')
const { protect, authorize } = require('../middleware/authMiddleware')
const { createEmployee, loginEmployee, getAllEmployees, getSingleEmployee, updateEmployee, toggleEmployeeStatus, logoutEmployee } = require('../controller/employeeController')
const router = express.Router()

router.post('/createEmployee', protect, authorize("owner"), createEmployee)
router.post('/loginEmployee', loginEmployee)
router.post('/logOutEmployee', logoutEmployee)
router.get('/getAllEmployees', protect, authorize("owner"), getAllEmployees)
router.get('/getAnEmployee/:id', protect, getSingleEmployee)
router.patch('/updateEmployee/:id', protect, authorize("owner"), updateEmployee)
router.patch('/toggleEmployeeStatus/:id', protect, authorize("owner"), toggleEmployeeStatus)

module.exports = router