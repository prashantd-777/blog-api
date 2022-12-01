const express = require("express");
const app = express();
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const cors = require("cors");

dotEnv.config();
app.use(express.json());
app.use(cors())

mongoose
    ?.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

app.use("/api/auth", authRoute);

app.listen("5000", () => {
    console.log("App is running on 5000 port")
});