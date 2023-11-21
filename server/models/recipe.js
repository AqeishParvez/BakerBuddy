import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    outputQuantity: { 
        type: Number, 
        required: true 
    },
    unitOfMeasurement: {
        type: Schema.Types.ObjectId,
        ref: 'Conversion',
        required: true
    },
    ingredients: [{
        ingredientID: {
            type: Schema.Types.ObjectId,
            ref: 'Products',
            required: false
        },
        ingredientQuantity: {
            type: Number,
            required: false
        },
        ingredientUOM: {
            type: Schema.Types.ObjectId,
            ref: 'Conversion',
            required: true
        }
      }]
    //Other recipe-related fields to be added later
}, {
    timestamps: true,
    collection: 'recepies'
});

export default mongoose.model('Recipes', RecipeSchema);