import conversionModel from '../models/conversion.js';

/* GET All conversion List page. READ */
export function displayConversionList(req, res, next) {
    // find all prodcuts in the collection
    conversionModel.find().populate('conversions.targetUnitID').exec((err, conversionCollection) => {
        if (err) {
            console.error(err);
            res.end(err);
        } else {
            res.render('index', { title: 'conversion', page: 'conversion/list', conversion: conversionCollection });
        }
    });
}