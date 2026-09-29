const { validate_token } = require("../controllers/auth.controller")
const { getList } = require("../controllers/config.controller")

exports.routeConfig  = (app) => {
    app.get('/api/config', getList)
}