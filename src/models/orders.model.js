const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdersSchema = new Schema(
    {
        total: Number,
        intoMoney: Number,
        date: Date,
        items: {
            type: Schema.Types.ObjectId,
            ref: 'Items',
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            required: false,
        },
        voucher: {
            type: Schema.Types.ObjectId,
            ref: 'Vouchers',
        },
        deliveryStatus: {
            type: String
        },
        paymentStatus: {
            type: String
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Orders', OrdersSchema);