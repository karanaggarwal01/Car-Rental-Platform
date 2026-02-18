const mongoose = require("mongoose");

const officeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true }
});

module.exports = mongoose.model("Office", officeSchema);
