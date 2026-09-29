const { db } = require("../utils/helper");
const logErr = require("../utils/logError");

const getList = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM category ORDER BY id DESC")
        res.status(200).json({
            success: true,
            message: 'get all data successfully!',
            list:rows
        });
    } catch (error) {
        logErr('get list', error, res)
    }
}

const create = async (req, res) => {
    try {
        const { name,description, parent_id, status } = req.body;

        //1. The "Existence" Check (Required Fields)
        if (!name) {
            return res.status(400).json({
                message: 'Name is required.'
            });
        }

        //2. The "Duplicate" Guard (Pre-emptive Check)
        let checkDuplicate = "SELECT * FROM category WHERE name = ?"
        let [existing] = await db.query(checkDuplicate, [name]);

        if (existing && existing.length > 0) {
            return res.status(409).json({
                message: 'A category with this name already exists.'
            });
        }

        //3. Execution 
        const insertSql = `
        INSERT INTO category (name, description, parent_id, status)
        VALUES(?,?,?, ?)`

        await db.query(insertSql, [name, description, parent_id, status])

        return res.status(201).json({ message: 'Role created successfully!', data: req.body });
    } catch (error) {
        logErr('create.cate', error, res)
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, parent_id, status } = req.body;

        // const checkSql = 'SELECT * FROM category WHERE name = ?';
        // const [rows] = await db.query(checkSql, [name]);
        // if (rows.length > 0) {
        //     return res.status(409).json({ message: 'Name already exists' });
        // }

        const updateSql = `
            UPDATE category
            SET name = ?, description = ?, parent_id = ?, status = ?
            WHERE id = ?
        `;
        const [result] = await db.query(updateSql, [name, description, parent_id, status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({ message: 'Category updated successfully', data: req.body });

    } catch (error) {
        // ❗ Ensure logErr does NOT send a response
        logErr('update cate', error, res);   // should only log, not use 'res'
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const remove = async (req, res) => {
    try {
        const {id} = req.params;
        let sql = "DELETE FROM category WHERE id = ?"
        const [result] = await db.query(sql,[id]);
        if(result.affectedRows === 0){
            return res.status(404).json({
                message: 'category not found!'
            });
        }
        res.status(200).json({
            message: 'category deleted successfully!',
            id:id
        })
    } catch (error) {
        logErr('remove cate', error, res)
    }
}

module.exports = {
    getList,
    create,
    update,
    remove
}