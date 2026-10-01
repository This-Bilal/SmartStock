const express = require('express')
const { registerOwner, loginOwner, logoutOwner, getOwnerProfile, updateOwnerProfile, changeOwnerEmail, changeOwnerPassword } = require('../controller/ownerController')
const { authorize, protect } = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/registerOwner', registerOwner)
router.post('/loginOwner', loginOwner)
router.post('/logoutOwner', logoutOwner)
router.get('/getOwnerProfile', protect, authorize("owner"), getOwnerProfile)
router.patch('/updateOwnerProfile', protect, authorize("owner"), updateOwnerProfile)
router.patch('/changeEmail', protect, authorize("owner"), changeOwnerEmail)
router.patch('/changePassword', protect, authorize("owner"), changeOwnerPassword)

module.exports = router