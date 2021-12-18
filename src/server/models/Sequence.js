const mongoose = require("mongoose");

const sequence = mongoose.Schema(
  {
    bases: String,
    createdAt: Date,
    creator: {
      handle: String,
      id: String,
      name: String,
    },
    id: String,
    name: String,
  },
  {
    timestamps: {
      createdAt: "timestamps.createdAt",
      updatedAt: "timestamps.updatedAt",
    },
    id: false,
  }
);

export default mongoose.model("Sequence", sequence);
