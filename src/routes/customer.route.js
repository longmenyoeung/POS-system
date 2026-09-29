const { getList } = require("../controllers/customer.controller")


const routeCustomer  = (app) => {
    app.get('/api/customer', getList)
    // app.post('/api/customer')
    // app.put('/api/customer')
    // app.delete('/api/customer')
}

module.exports = routeCustomer