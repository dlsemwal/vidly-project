const mongoose = require("mongoose");

exports.InvalidToken = mongoose.model(
  "Invalid_token",
  new mongoose.Schema(
    {
      token: {
        type: String,
        required: true,
        trim: true
      }
    },
    {
      capped: {
        size: 10000,
        max: 10
      }
    }
  )
);
