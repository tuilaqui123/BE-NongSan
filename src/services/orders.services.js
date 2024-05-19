const Orders = require('../models/orders.model')
const getData = require('../utils/formatRes')

class OrdersServices {
    static addOrder = async ({ total, intoMoney, date }) => {
        try {
            // const isExist = await Orders.findOne({ id }).lean();
            // if (isExist) {
            //     return {
            //         success: false,
            //         message: "Already exist"
            //     }
            // }

            const newOrder = new Orders({
                total, intoMoney, date
            })
            // return await newOrder.save()
            return getData({ fields: ['_id', 'total', 'intoMoney', 'date', ''] })
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

}

module.exports = OrdersServices