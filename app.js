require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("express-async-errors");

const { initializeDatabase } = require("./server/config/database");
const routes = require("./server/routes/routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", routes);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send("Something went wrong");
});

initializeDatabase()
  .then(() => {
    console.log("Database initialized");
    app.listen(process.env.PORT, () =>
      console.log("App is running on port " + process.env.PORT)
    );
  })
  .catch((err) => console.error("Failed to initialize the database\n" + err));
