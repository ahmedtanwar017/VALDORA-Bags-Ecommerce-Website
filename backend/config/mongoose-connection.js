const mongoose = require("mongoose");
const config = require("config")
const dbugr = require("debug")("development: mongoose")

mongoose
    // .connect("mongodb://127.0.0.1:27017/website")
    .connect(`${config.get("MONGODB_URI")}/website`)
    .then(() => {
        dbugr("MongoDB connected");
        // console.log("MongoDB connected");
    })
    .catch((err) => {
        dbugr(err)
        // console.error(err);
    });

module.exports = mongoose.connection;

// $env:NODE_ENV="development"
// $env:DEBUG="development:*"