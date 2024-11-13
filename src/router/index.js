const express = require('express')
const router = express.Router()

// user
router.use('/v1/api/user', require('./user/user.router'))

// admin
// router.use('/v1/api/admin', require('./admin/admin.route'))

module.exports = router