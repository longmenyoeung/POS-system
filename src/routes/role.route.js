const {
    create,
    getList, 
    remove,
    Update,
} = require("../controllers/role.controller")
const roleRoute  = (app) => { 
    app.get('/api/role', getList)
    app.post('/api/role', create)
    app.put('/api/role/:id', Update)
    app.delete('/api/role/:id', remove)
}


module.exports = roleRoute