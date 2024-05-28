const Orders = require('../models/orders.model')
const getData = require('../utils/formatRes')
const _ = require('lodash');
class OrdersServices {
    static addOrder = async ({ total, intoMoney, date, deliveryStatus, paymentStatus }) => {
        try {
            const newOrder = new Orders({
                total, intoMoney, date, deliveryStatus, paymentStatus
            })
            return getData({ fields: ['_id', 'total', 'intoMoney', 'date', 'deliveryStatus', 'paymentStatus', 'items'], object: await newOrder.save() })
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getOrder = async () => {
        try {
            // const Orders = await Orders.find().populate({
            //     path: "items"
            // }).lean()

            // return _.map(Order, obj => getData({
            //     fields: ['_id', 'total', 'intoMoney', 'date', 'deliveryStatus', 'paymentStatus', 'items'], object: obj
            // }))

            return await Orders.find()

        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getOrderID = async ({ id }) => {
        try {
            return await Orders.findById(id)
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static updateOrder = async ({ id }) => {
        try {
            return await Orders.findByIdAndUpdate({ id }, { total, intoMoney, date, deliveryStatus, paymentStatus })
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deleteOrder = async ({ id }) => {
        try {
            return await Orders.findByIdAndDelete(id)
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

}

module.exports = OrdersServices