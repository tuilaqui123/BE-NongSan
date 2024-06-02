const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Province'
const COLLECTION_NAME = 'Provinces'

var provinceSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    distance: {
        type: Number,
        required: true,
        trim: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, provinceSchema);