import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ConversionSchema = new Schema({
    unitName: {
        type: String,
        required: true
    },
    conversions: [{
        targetUnitID: {
            type: Schema.Types.ObjectId,
            ref: 'Conversion',
            required: false
        },
        conversionFactor: {
            type: Number,
            required: false
        }
      }]
}, {
    collection: 'conversions',
});

export default mongoose.model('Conversion', ConversionSchema);
