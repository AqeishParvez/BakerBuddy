import productsModel from '../models/product.js';
import conversionModel from '../models/conversion.js';

/* GET All Products List page. READ */
export function displayProductList(req, res, next) {
    // find all prodcuts in the product collection
    productsModel.find().populate('unitOfMeasurement', 'unitName').exec((err, productCollection) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index', { title: 'Inventory', page: 'product/list', product: productCollection });
    });
}

// GET the Product Details page in order to add a new Product
export function displayAddPage(req, res, next) {
    conversionModel.find((err, conversionCollection) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index', { title: 'Add Product', page: 'product/add', conversion: conversionCollection });
    })
}

// POST process the Product Details page and create a new Product - CREATE
export function processAddPage(req, res, next) {
    
    let newProduct = productsModel({
        name: req.body.name,
        price: req.body.price,
        expiry: req.body.expiry,
        quantity: req.body.quantity,
        unitOfMeasurement: req.body.uom,
        // Add other product-related fields as needed
    });
    productsModel.create(newProduct, function(error) {
        if (error) {
            console.error(error);
            res.end(error);
        }

        res.redirect('/product/list');
    });
    
}

// GET the Product Details page in order to edit an existing Product
export function displayEditPage(req, res, next) {
    let id = req.params.id;

    productsModel.findById(id, function(error, product) {
        if (error) {
            console.error(error);
            res.end(error);
        }

        res.render('index', { title: 'Edit Product', page: 'product/edit', product });
    });
}

// POST - process the information passed from the details form and update the document
export function processEditPage(req, res, next) {
    let id = req.params.id;

    let newProduct = productsModel({
        "_id": req.body.id,
        name: req.body.name,
        price: req.body.price,
        expiry: req.body.expiry,
        quantity: req.body.quantity,
    });

    productsModel.updateOne({_id: id}, newProduct, function(error){
        if(error){
            console.error(error);
            res.end(error);
        }

        res.redirect('/product/list');

    })
}

// // GET - process the delete by user id
// export function processDelete(req, res, next) {
//     let id = req.params.id;

//     productsModel.remove({ _id: id }, function(error) {
//         if (error) {
//             console.error(error);
//             res.end(error);
//         }

//         res.redirect('/product/list');
//     });
// }
