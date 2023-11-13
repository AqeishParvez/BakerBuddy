import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    name: {type: String, required: true, unique: true},
    ingredients: [{ type: Schema.Types.ObjectId, ref: 'Products' }],
    //Other recipe-related fields to be added later
}, {
    timestamps: true,
    collection: 'recepies'
});

export default mongoose.model('Recipes', ProductsSchema);