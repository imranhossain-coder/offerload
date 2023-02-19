const mongoose = require("mongoose");

const OrderlockSchema = new mongoose.Schema({
  lockstatus: {
    type: String,
  },
  locknote: {
    type: String,
  },
});

const Orderlock = mongoose.model("Orderlock", OrderlockSchema);

module.exports = Orderlock;
