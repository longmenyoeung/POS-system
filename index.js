const express = require('express');
const authRoute = require('./src/routes/auth.route');
const cors = require('cors');
const categoryRoute = require('./src/routes/category.route');
const roleRoute = require('./src/routes/role.route');
const routeCustomer = require('./src/routes/customer.route');
const { routeSuppier } = require('./src/routes/supplier.route');
const { routeConfig } = require('./src/routes/config.route');
const { routeProduct } = require('./src/routes/product.route');


//app
const app = express();

//middleware
app.use(express.json());
app.use(cors({origin:"*"}));
app.use(express.urlencoded({ extended: true }));


//Route
authRoute(app)
categoryRoute(app)
roleRoute(app)
routeCustomer(app)
routeSuppier(app)
routeConfig(app)
routeProduct(app)

//PORT
const PORT = 8081

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})