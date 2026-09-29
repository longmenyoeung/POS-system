const {getList}  = require('../controllers/product.controller');


exports.routeProduct = (app) => {
    app.get('/api/product', getList);
}