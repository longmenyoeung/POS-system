const fs = require('fs/promises');
const path = require('path');
const moment = require('moment');

const logError = async (controller, message_error, res) => {
    try {
        const timestamp = moment().format("DD/MM/YYYY HH:mm:ss");

        // Absolute path to logs folder
        const logDir = path.join(__dirname, "../../logs");

        // Create logs folder if it doesn't exist
        await fs.mkdir(logDir, { recursive: true });

        const filePath = path.join(logDir, controller + ".txt");

        const logMessage = `[${timestamp}] ${message_error}\n`;

        await fs.appendFile(filePath, logMessage);

    } catch (error) {
        console.log('Error writing to log file', error);
    }

    res.status(500).json({ message: "Internal server error" });
}

module.exports = logError;