const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'

var userSchema = new Schema({
    name: {
        type: String,
        require: true,
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
            validator: (value) => {
                return /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(value);
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