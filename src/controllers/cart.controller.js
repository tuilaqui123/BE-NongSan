const CartService = require('../services/cart.service')

class CartController {
    addCart = async (req, res, next) => {
        try {
            return res.status(201).json(await CartService.addCart(req.body))
        } catch (error) {
            next(error)
        }
    }

    getCart = async (req, res, next) => {
        try {
            return res.status(201).json(await CartService.getCart(req.body))
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CartController()