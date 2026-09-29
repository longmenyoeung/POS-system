const { logErr, db } = require("../utils/helper")

exports.getList = async (req, res) => {
    try {

        const [category] = await db.query("SELECT id, name, description FROM category");
        const [role] = await db.query("SELECT id, name, code FROM role");
        const [supplier] = await db.query("SELECT id, name, tel, email, address FROM supplier");

        const purchase_status = [
            {
                label: 'Peding',
                value: 'Peding'
            },
            {
                label: 'Approved',
                value: 'Approved'
            },
            {
                label: 'Shiped',
                value: 'Shiped'
            },
            {
                label: 'Received',
                value: 'Receiced'
            },
            {
                label: 'Issuze',
                value: 'Issuze'
            },
        ]

        res.status(200).json({
            list: {
                category,
                role,
                supplier,
                purchase_status
            }
        })
    } catch (error) {
        logErr('config.getList', error, res)
    }
}