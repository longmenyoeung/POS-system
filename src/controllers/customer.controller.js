const {db, logErr} = require('../utils/helper')

const getList = async (req, res) => {
    try {
        let sql = "SELECT * FROM customer ORDER BY id DESC"
        let [rows] = await db.query(sql)
        res.status(200).jsson({message:'get data customer successfully', list: rows})
    } catch (error) {
        logErr('get-list-customer', error, res)
    }
}

module.exports = {getList}
