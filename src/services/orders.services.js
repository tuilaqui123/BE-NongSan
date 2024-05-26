const Orders = require('../models/orders.model')
const getData = require('../utils/formatRes')

class OrdersServices {
    static addOrder = async ({ total, intoMoney, date }) => {
        try {
            const newOrder = new Orders({
                total, intoMoney, date
            })
            // return await newOrder.save()
            await newOrder.save();
            return getData({ fields: ['_id', 'total', 'intoMoney', 'date', ''], object: newOrder})
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getOrder = async () => {
        try {
            return await Orders.find();
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

}

module.exports = OrdersServices