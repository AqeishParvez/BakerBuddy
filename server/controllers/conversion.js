import conversionModel from '../models/conversion.js';

/* GET All conversion List page. READ */
export function displayConversionList(req, res, next) {
    // find all prodcuts in the collection
    conversionModel.find((err, conversionCollection) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index', { title: 'conversion', page: 'conversion/list', conversion: conversionCollection });
    });
}
