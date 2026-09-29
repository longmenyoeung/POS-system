const { logErr, db } = require("../utils/helper");

const getList = async (req, res) => {
    try {
        let sql = "SELECT * FROM role ORDER BY id DESC";
        let [rows] = await db.query(sql);
        res.status(200).json({ message: 'get role successfully!', list: rows });
    } catch (error) {
        logErr('get-list', error, res)
    }
}

const create = async (req, res) => {
    try {
        const { name, code } = req.body;

        //check name if exists
        let checkName = "SELECT * FROM role WHERE name =?";
        let [nameExists] = await db.query(checkName, [name]);

        if (nameExists.length > 0) {
            return res.status(400).json({ message: 'role name already exists.' })
        }

        let sql = `INSERT INTO role(name, code)
            VALUES(?,?)`;
        let [result] = await db.query(sql, [name, code]);
        res.status(201).json({ message: 'Role added successfully!', list: req.body });
    } catch (error) {
        logErr('create role', error, res)
    }
}

const Update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code } = req.body;

        // 1. Check if the name exists, BUT ignore the current role's ID
        let findName = "SELECT id FROM role WHERE name = ? AND id != ?";
        
       //[nameExists] brackets! Pass in both name and id.
        let [nameExists] = await db.query(findName, [name, id]); 

        if (nameExists.length > 0) {
            return res.status(400).json({ message: 'Role name already exists.' });
        }

        // 2. Perform the update
        let sql = `UPDATE role SET name = ?, code = ? WHERE id = ?`;
        let [result] = await db.query(sql, [name, code, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Role not found" });
        }

        res.status(200).json({ message: 'Role updated successfully!', list: req.body });

    } catch (error) {
        console.error("Update Role Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const remove = async (req, res) => {
    try {
        const {id} = req.params;

        let sql = "DELETE FROM role WHERE id = ?";
        let [rows] = await db.query(sql, [id]);

        if(rows.affectedRows == 0){
            return res.status(404).json({message:'Role not found!'})
        }

        res.status(200).json({message:'Role deleted successfully!',id:id});

    } catch (error) {
        logErr('delete-role', error, res)
    }
}

module.exports = {
    getList,
    create,
    Update,
    remove
}