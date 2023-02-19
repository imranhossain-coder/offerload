const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  offertitle: {
    type: String,
    required: true,
  },
  offervalidity: {
    type: String,
    required: true,
  },

  offerprice: {
    type: String,
    required: true,
  },
  regularprice: {
    type: String,
    required: true,
  },
  discountprice: {
    type: String,
    requird: true,
  },
  offernote: {
    type: String,
  },
  packagecompany: {
    type: String,
    requird: true,
  },
});

const Allpackage = mongoose.model("allpackage", PackageSchema);

module.exports = Allpackage;
