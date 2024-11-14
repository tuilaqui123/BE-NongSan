const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

var userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique:true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        validate: {
            validator: function(value) {
                return /^\+?[1-9]\d{1,14}$/.test(value);
            },
            message: (props) => `${props.value} is not a valid phone number!`
        }
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minLength: 6
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, userSchema);