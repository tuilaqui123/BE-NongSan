const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema(
    {
        comment: String,
        images: [String],
        date: Date,
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Comments', CommentsSchema);