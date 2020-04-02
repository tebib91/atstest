const mongoose = require('mongoose');
const {Schema} = mongoose;

const productScheme = new Schema({

    color: {"type": "String"},
    category: {"type": "String"},
    productName: {"type": "String"},
    price: {"type": "String"},
    description: {"type": "String"},
    tag: {"type": "String"},
    productMaterial: {"type": "String"},
    imageUrl: {"type": "String"},
    createdAt: {"type": "Date"},
    reviews: {
        "type": [
            "Mixed"
        ]
    }

});

module.exports = mongoose.model('products', productScheme);