const mongoose = require("mongoose");
const config = require("./env.js");

const connectToDB = async () => {
    try {
        const connection = await mongoose.connect(config.MONGO_URI);
        console.log(`Database connected successfully. DB Host: ${connection.connection.host}`);
    } catch (error){
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectToDB;
