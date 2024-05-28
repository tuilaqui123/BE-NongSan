const Orders = require('../models/orders.model')
const getData = require('../utils/formatRes')

class OrdersServices {
    static addOrder = async ({ total, intoMoney, date, items }) => {
        try {
            const newOrder = new Orders({
                total, intoMoney, date, items
            })
            // return await newOrder.save()
            await newOrder.save();
            return getData({ fields: ['_id', 'total', 'intoMoney', 'date', ''], object: newOrder})
            return items
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

    static getOrderID = async ({ id }) => {
        try {
            const existOrder = await Orders.findById(id);
            if (!existOrder){
                return {
                    success: false,
                    message: "Don't exist"
                }
            }
            
            return existOrder;
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}

module.exports = OrdersServices