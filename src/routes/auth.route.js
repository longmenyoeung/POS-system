const { login, 
    profile, 
    register, 
    change_password, 
    validate_token,
    getList, 
    remove,
    update
} = require("../controllers/auth.controller")

const authRoute = (app) => {
    app.get('/api/auth/user', getList)
    app.put('/api/auth/user/:id', update)
    app.delete('/api/auth/user/:id', remove)
    app.post('/api/auth/register', register)
    app.post('/api/auth/login', login)
    app.post('/api/auth/profile',validate_token,profile)
    app.delete('/api/auth/change_password', change_password)
}

module.exports = authRoute