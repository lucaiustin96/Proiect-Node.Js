const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    description: String,
    imageName: String,
    price: {
        type: Number,
        min: [6, 'Too small'],
        required: [true, 'Is required']
    },

    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
});
  
module.exports = mongoose.model('Product', productSchema);