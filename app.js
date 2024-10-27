require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("express-async-errors");
const cookieParser = require("cookie-parser");

const { initializeDatabase } = require("./server/config/database");
const mainRoutes = require("./server/routes/routes-main");
const adminRoutes = require("./server/routes/routes-admin");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("public"));
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", mainRoutes);
app.use("/", adminRoutes);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send("Something went wrong");
});

try {
  initializeDatabase();
  app.listen(process.env.PORT, () =>
    console.log("App is running [port " + process.env.PORT + "]")
  );
} catch (err) {
  console.error("Failed to initialize the database\n" + err);
}
