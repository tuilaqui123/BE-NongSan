const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdersSchema = new Schema(
    {
        total: Number,
        intoMoney: Number,
        date: Date,
        deliveryStatus: String,
        paymentStatus: String,
        items: {
            type: Schema.Types.ObjectId,
            ref: 'Items',
        },
        customer: {
            name: String,
            phone: String,
            address: String
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Orders', OrdersSchema);