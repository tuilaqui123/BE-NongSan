const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        avatar: [String],
        email: String,
        phone: {
            type: String,
            required: true,
        },
        address: [{
            type: String,
            isDefault: Boolean,
        }],
        orders: {
            type: Schema.Types.ObjectId,
            ref: 'Orders',
        },
        vouchers: {
            type: Schema.Types.ObjectId,
            ref: 'Vouchers',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Customer', CustomerSchema);