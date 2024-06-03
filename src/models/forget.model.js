const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ForgetSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
        },
        verificationCode: {
            type: String,
            required: true,
        },
        expiredDate: {
            type: Date,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Forget', ForgetSchema);