const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypesSchema = new Schema(
    {
        name: String,
        // items: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'Items',
        // }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Types', TypesSchema);