
const { validate_token } = require("../controllers/auth.controller");
const { remove, update, getList, create } = require("../controllers/category.controller");

const categoryRoute = (app) => {
    app.get('/api/categories',validate_token, getList);
    app.post('/api/categories',validate_token, create);
    app.put('/api/categories/:id', update);
    app.delete('/api/categories/:id', remove);
}

module.exports = categoryRoute