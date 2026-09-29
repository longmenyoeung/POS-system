const {validate_token} = require('../controllers/auth.controller')
const {getList, create, remove, update} = require('../controllers/supplier.controller')

exports.routeSuppier = (app) => {
    app.get("/api/supplier",getList)
    app.post("/api/supplier", create)
    app.put("/api/supplier/:id", update)
    app.delete("/api/supplier/:id", remove)
}