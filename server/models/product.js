import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {type: String, required: true, unique: true},
    price: {type: Number, required: true},
    expiry: {type: Date, required: true},
    quantity: { type: Number, required: true },
    unitOfMeasurement: {
        type: Schema.Types.ObjectId,
        ref: 'Conversion',
        required: true
    }
}, {
    timestamps: true,
    collection: 'products'
});

export default mongoose.model('Products', ProductSchema);