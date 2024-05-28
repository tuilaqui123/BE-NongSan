const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdersSchema = new Schema(
    {
        total: Number,
        intoMoney: Number,
        deliveryFee: Number,
        deliveryStatus: String,
        paymentStatus: String,
        items: [
            {
                item: {
                    type: Schema.Types.ObjectId,
                    ref: 'Items',
                },
                amount: {
                    type: Number,
                    required: true,
                },
                price:{
                    type: Number,
                    required: true
                }
            }
        ],
        customer: {
            name: String,
            phone: String,
            address: String,
            email: String,
            note: String
        },
        // user: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'User',
        // },
        voucher: {
            type: Schema.Types.ObjectId,
            ref: 'Vouchers',
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Orders', OrdersSchema);