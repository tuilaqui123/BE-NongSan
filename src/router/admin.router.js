const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

multer({
    limits: { fieldSize: 25 * 1024 * 1024 }
})

const FarmController = require('../controllers/farms.controller')
const ItemsController = require('../controllers/items.controller')

//items
router.post('/items', upload.single('image'), ItemsController.addItem)
router.get('/items', ItemsController.getItem)
router.get('/items/:id', ItemsController.getItemID)
router.put('/items/:id', ItemsController.updateItem)
router.delete('/items/:id', ItemsController.deleteItem)

//farms
router.post('/farms', upload.single('image'), FarmController.addFarm)
router.get('/farms', FarmController.getFarm)
router.get('/farms/:id', FarmController.getFarmID)
router.put('/farms/:id', FarmController.updateFarm)
router.delete('/farms/:id', FarmController.deleteFarm)

module.exports = router