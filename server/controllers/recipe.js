import recepiesModel from '../models/recipe.js';
import productsModel from '../models/product.js';
import conversionModel from '../models/conversion.js';

/* GET All Products List page. READ */
export function displayRecipeList(req, res, next) {
    // find all prodcuts in the product collection
    recepiesModel.find().populate('product', 'name').populate('unitOfMeasurement', 'unitName').exec((err, recepieCollection) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.render('index', { title: 'Recipe', page: 'recipe/list', recipe: recepieCollection });
    });}

// GET the Product Details page in order to add a new Product
export function displayAddPage(req, res, next) {
    conversionModel.find((err, conversionCollection) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        productsModel.find((err, productCollection) => {
            if (err) {
                console.error(err);
                res.end(err);
            }
            res.render('index', { title: 'Add Recipe', page: 'recipe/add', conversion: conversionCollection, product: productCollection });
        })
    })
}

// POST process the Product Details page and create a new Product - CREATE
export function processAddPage(req, res, next) {
    let ingredients = []
    //hard coded 2 in for now for my own sanity
    /*req.body.amount*/
    for (let i = 1; i <= 2; i++){
        ingredients.push({
            ingredientID: req.body[`Ingredient${i}`],
            ingredientQuantity: req.body[`Ingredient${i}Quantity`],
            ingredientUOM: req.body[`Ingredient${i}Uom`],
        })
    }
    let newRecipe = recepiesModel({
        product: req.body.product,
        outputQuantity: req.body.quantity,
        unitOfMeasurement: req.body.uom,
        ingredients: ingredients
    });

    recepiesModel.create(newRecipe, function(error) {
        if (error) {
            console.error(error);
            res.end(error);
        }

        res.redirect('/recipe/list');
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

export function displayDetailPage(req, res, next) {
    let id = req.params.id;
    recepiesModel.findById(id)
    .populate('product', 'name')
    .populate('unitOfMeasurement', 'unitName')
    .populate({path: 'ingredients.ingredientID',model: 'Products'})
    .populate({path: 'ingredients.ingredientUOM',model: 'Conversion'})
    .exec((error, recipe) => {
        if (error) {
            console.error(error);
            res.end(error);
        }
        console.log(recipe)
        res.render('index', { title: 'Recipe Detail', page: 'recipe/detail', recipe });
    });
}

// GET - process the delete by user id
export function processDelete(req, res, next) {
    let id = req.params.id;

    recepiesModel.remove({ _id: id }, function(error) {
        if (error) {
            console.error(error);
            res.end(error);
        }

        res.redirect('/recipe/list');
    });
}
