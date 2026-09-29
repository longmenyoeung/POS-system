const { db, logErr } = require("../utils/helper");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const config = require("../utils/config");

const update = async (req, res) => {
    const {id} = req.params;
    const {role_id, name, username, is_active} = req.body;

    let sql = `
    UPDATE user
    SET role_id = ? ,name = ?, username =?, is_active =?
    WHERE id = ?`
    let [result] = await db.query(sql, [role_id, name, username, is_active, id])

    if(result.affectedRows === 0){
        return res.status(404).json({message:'User not found.'});
    }

    res.status(200).json({message:'User updated successfully.',list:req.body});

}

const getList = async (req, res) => {
    try {
        let sql = 
        "SELECT "+
        "u.id, "+
        "u.name, "+
        "u.username, "+
        "u.is_active, "+
        "r.name AS role_name "+
        "FROM user u " +
        "INNER JOIN role r ON role_id = r.id;"
        // let sql = "SELECT * FROM user ORDER BY id DESC"
        let [result] = await db.query(sql)
        res.status(200).json({ message: 'get user successfully!', list: result });
    } catch (error) {
        logErr('get-list-user', error, res, list);
    }
}

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        let sql = "DELETE FROM user WHERE id =?"
        let [rows] = await db.query(sql, [id])
        if (rows.affectedRows === 0) {
            return res.status(404).send({ message: "user not found" });
        }
        res.status(200).json({ message: 'user deleted successfully!', id: id })
    } catch (error) {
        logErr('Remove-User', error, res)
    }
}

const register = async (req, res) => {
    try {
        // 1. Extract data
        const { role_id, name, username, password, is_active, create_by } = req.body;

        //2. check account already exists
        let checkSql = "SELECT * FROM user WHERE username = ?"
        let [rows] = await db.query(checkSql, [username])
        if (rows && rows.length > 0) {
            return res.status(400).json({ message: 'Account already exists.' });
        }

        //3. hash password 
        const saltRounds = 10;
        const hashpassword = bcrypt.hashSync(password, saltRounds)

        //4. wrtie sql to register
        let sql = `
        INSERT INTO user(role_id, name, username, password, is_active, create_by)
        VALUES(?,?,?,?,?,?)`

        await db.query(sql, [role_id, name, username, hashpassword, is_active, create_by])

        //5. success respone 
        res.status(201).json({ message: 'user created successfully!', data: { role_id, username, is_active } });

    } catch (error) {
        logErr('Auth.register', error, res)
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Validation
        if (!username || !password) {
            return res.status(400).json({ message: 'username or password are required!' });
        }

        // 2. Find user
        // let sql = "SELECT * FROM user WHERE username = ?";
        let sql =
            "SELECT " +
            "u.*, " +
            "r.name as role_name " +
            "FROM user u " +
            "INNER JOIN role r ON u.role_id = r.id " +
            "WHERE username = ?";

        let [rows] = await db.query(sql, [username]);

        // If no user found, return 401 (Unauthorized)
        if (rows.length === 0) {
            // return res.status(401).json({ message: 'Username not found, please create an account.' });
            return res.send({ message: 'Username not found, please create an account.' })
        }

        const user = rows[0];

        // 3. Verify password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // return res.status(401).json({ message: 'Incorrect password.'});
            return res.send({ message: 'Incorrect password' })
        }

        // 4. Remove the password hash before sending user data back
        delete user.password;

        // 5. Success Response
        let obj = {
            profile: user,
            permission: ['view_all', 'edit', 'delete']
        }
        res.status(200).json({
            message: 'User login successfully!.',
            ...obj,
            token: await generate_token(obj)
        });

    } catch (error) {
        // Ensure this matches your error logger name (logError vs logErr)
        logErr('Auth.login', error, res);
    }
}

const profile = async (req, res) => {
    const { id } = req.params;
    try {
        // let sql = "SELECT * FROM user WHERE id = ?"
        // let [data] = await db.query(sql,[id]);
        // res.status(200).json({
        //     message:'Get profile successfully!', 
        //     profile: data.length > 0 ? data[0] : null    
        // });
        res.status(200).json({
            current_id: req.current_id,
            permission: req.permission,
            profile: req.profile
        })
    } catch (error) {
        logErr('Profile', error, res)
    }
}

const change_password = async (req, res) => {

}

const generate_token = async (paramData) => {
    // const secretKey = "ldlanamdkd93!33kns"
    // Correct syntax: sign(payload, secret, options)
    return jwt.sign({ data: paramData }, config.token.access_token_key, { expiresIn: '1h' });
}

const validate_token = (req, res, next) => {
    let authorization = req.headers.authorization; //token from client
    let token_from_client = null;
    if (authorization != null && authorization != "") {
        token_from_client = authorization.split(" "); //authorization bearer
        token_from_client = token_from_client[1] //get only one access
    }
    if (token_from_client == null) {
        return res.status(401).json({ message: 'Unauthorized' });
    } else {
        // const secretKey = "ldlanamdkd93!33kns"
        jwt.verify(token_from_client, config.token.access_token_key, (error, result) => {
            if (error) {
                return res.status(401).json({ message: 'Unauthorized', error: error })
            } else {
                req.current_id = result.data.profile.id; //write user property;
                req.profile = result.data.profile; //write user property;
                req.permission = result.data.permission; //write user property;
                next(); //continhue to controlller
            }
        })
    }
}


module.exports = {
    register,
    login,
    profile,
    change_password,
    generate_token,
    validate_token,
    getList,
    remove,
    update
}