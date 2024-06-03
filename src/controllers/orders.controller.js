const OrdersServices = require('../services/orders.services')

class OrdersController {

    addOrder = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.addOrder(req.body))
        } catch (error) {
            next(error)
        }
    }

    getOrder = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.getOrder())
        } catch (error) {
            next(error)
        }
    }

    getOrderID = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.getOrderID(req.params))
        } catch (error) {
            next(error)
        }
    }

    updateOrder = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.updateOrder(req.params))
        } catch (error) {
            next(error)
        }
    }

    deleteOrder = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.deleteOrder(req.params))
        } catch (error) {
            next(error)
        }
    }

    paymentOrder = async (req, res, next) => {
        try {
            return res.status(201).json(await OrdersServices.paymentOrder(req.body))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new OrdersController()