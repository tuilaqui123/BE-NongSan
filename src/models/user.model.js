const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

var userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true
    },
    password:{
        type:String,
        required:true,
        trim: true,
        minLength: 6
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, userSchema);