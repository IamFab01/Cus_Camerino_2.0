module.exports = app => {

    const product = require('../controllers/product_controller');

    var router = require('express').Router();

    //Init delle route
    router.post("/create", product.create);

    router.post("/delete/:id", product.delete);

    router.post("/deleteAll", product.deleteAll);

    router.get("/find/:id", product.find);

    router.get("/findAll", product.findAll);

    router.post("/update/:id", product.update);

    
    //Route for this module : 
    app.use('/api/product', router);

}
