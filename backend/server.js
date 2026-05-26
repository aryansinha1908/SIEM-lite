require("dotenv").config();

const express = require("express");
const app = express();

const Port = process.env.PORT || 3000;

app.listen(3000, () => {
    console.log(`The server is running on port: ${Port}`);
})
