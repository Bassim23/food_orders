"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const sass        = require("node-sass-middleware");
const app         = express();
const dataHelper = require('./public/scripts/data-helper');
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);

// Seperated Routes for each Resource
const loginRoutes    = require("./routes/_login");
const logoutRoutes   = require("./routes/_logout");
const menuRoutes     = require("./routes/_menu");
const checkoutRoutes = require("./routes/_checkout");
const twilioRouter = require('./routes/twilio-router')(dataHelper);
const orderRoutes    = require("./routes/_orders");


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
const morgan = require('morgan');
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
const knexLogger = require('knex-logger');
app.use(knexLogger(knex));

//Cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Load files from public
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Mount all resource routes
app.use("/api/login", loginRoutes(knex));
app.use("/api/logout", logoutRoutes());
app.use("/api/menu", menuRoutes(knex));
app.use("/api/checkout", checkoutRoutes(knex));

app.use('/twilio', twilioRouter);

app.use("/api/orders", orderRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});


// temporary - will be use the index page for this
app.get('/menu', (req, res) => {
  res.render("menu");
});

// Login page
app.get('/login', (req, res) => {
  res.render("login");
});

// Checkout page
app.get('/checkout', (req, res) => {
  res.render("checkout");
});

// Admin panel
app.get('/orders', (req, res) => {
  res.render("orders");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
