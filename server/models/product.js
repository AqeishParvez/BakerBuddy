import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {type: String, required: true, unique: true},
    price: {type: Number, required: true},
    expiry: {type: Date, required: true},
    //Other product-related fields to be added later
}, {
    timestamps: true,
    collection: 'products'
});

export default mongoose.model('Products', ProductsSchema);