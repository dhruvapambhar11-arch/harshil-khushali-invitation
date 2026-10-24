const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema({
  subdomain: {
    type: String,
    unique: true,
    required: true,
  },
  templateId: String,
  type: {
    type: String,
    enum: ["predefined", "custom"],
  },
  data: Object,

  status: {
    type: String,
    enum: ["pending", "completed", "inactive"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Invitation", invitationSchema);
