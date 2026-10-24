const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/invitations", require("./routes/invitation.routes"));

app.get("/", (_req, res) => res.send("Harshil & Khushali invitation API"));

module.exports = app;
