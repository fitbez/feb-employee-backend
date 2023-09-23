//We will define the structure of our data
const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    callMobile: {
      type: String,
      required: true,
    },
    callOffice: {
      type: String,
    },
    sms: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

//creating our model and export it
module.exports = mongoose.model("Employee", EmployeeSchema);
