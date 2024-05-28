const ItemsService = require('../services/items.services')

class ItemsController {

    addItem = async (req, res, next) => {
        try {
            return res.status(201).json(await ItemsService.addItem(req.file.path, req.body))
        } catch (error) {
            next(error)
        }
    }

    getItem = async (req, res, next) => {
        try {
            return res.status(201).json(await ItemsService.getItem())
        } catch (error) {
            next(error)
        }
    }

    getItemID = async (req, res, next) => {
        try {
            return res.status(201).json(await ItemsService.getItemID(req.params))
        } catch (error) {
            next(error)
        }
    }

    updateItem = async (req, res, next) => {
        try {
            return res.status(201).json(await ItemsService.updateItem(req.params, req.body))
        } catch (error) {
            next(error)
        }
    }

    deleteItem = async (req, res, next) => {
        try {
            return res.status(201).json(await ItemsService.deleteItem(req.params))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ItemsController()