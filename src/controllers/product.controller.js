const { db, logErr } =  require ("../utils/helper");

exports.getList  =  async (req,res) => {
    try {
        let sql = "SELECT * FROM product ORDER BY id DESC";
        let [rows]  = await db.query(sql);

        if(rows.length === 0){
            return res.send({
                message:'product is empty.'
            });
        }
        res.status(200).json({
            message:'get data successfully',
            list: rows
        })
    } catch (error) {
        logErr('product-list', error, res);
    }
}

