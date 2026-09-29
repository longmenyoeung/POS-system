const { db, logErr }  = require('../utils/helper')

exports.getList = async (req, res) => {
    try {
        let sql = "SELECT * FROM supplier ORDER BY id DESC"
        let [rows] = await db.query(sql)

        if(rows.length === 0){
            return res.send({message:'supplier is empty.'});
        }
        res.status(200).json({ message: "get all suppliers successfully!", list: rows })    
    } catch (error) {
        logErr('get-list supplier', error, res)
    }
}

exports.create = async (req, res) => {
    try {
        const {name, code, tel, email,address, website, note} = req.body

        let sql = `
        INSERT INTO supplier(name, code, tel, email, address, website, note)
        VALUES(?,?,?,?,?,?,?)`

        await db.query(sql, [name, code, tel, email, address, website, note])

        res.status(201).json({message:'created supplier successfully!', list:req.body});

    } catch (error) {
        logErr('create-supplier', error, res)
    }
}

exports.update  = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, code, tel, email,address, website, note} = req.body;
        
        let sql = `UPDATE supplier
        SET name = ?, code = ?, tel=?, email=?, address =?, website=?,note=?
        WHERE id =?`

        let [result] = await db.query(sql, [name, code,tel,email,address,website,note,id]);
        if(result.affectedRows === 0 || result.length === 0){
            return res.status(404).json({message:'Supplier not found!. Please try again.'})
        }

        res.status(200).json({message:'Supplier updated successfully.', list:req.body});

    } catch (error) {
        logErr('update-supplier', error, res)
    }
}


exports.remove  = async (req, res) => {
    try {
        const {id} = req.params
        let sql = "DELETE FROM supplier WHERE id = ?"
        let [result]  = await db.query(sql, [id])

        if(result.affectedRows === 0 || result.length ===0){
            return res.send({message:'Supplier not found!'});
        }

        res.status(200).json({message:'Supplier deleted successfully.', id:id});

    } catch (error) {
        logErr('delete-supplier', error, res)
    }
}