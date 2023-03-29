var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var proxy = require("http-proxy-middleware");
var approveToken = require("./api/approveToken");
var transferToken = require("./api/transferToken");
var transferERC = require("./api/transferERC");
var queryNft = require("./api/queryNft");
var random = require("./api/getRandom");
var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == "options") res.send(200);
  else next();
});
app.use("/api/v1/approveToken", approveToken);
app.use("/api/v1/transferToken", transferToken);
app.use("/api/v1/transferERC", transferERC);
app.use("/api/v1/queryNft", queryNft);
app.use("/api/v1/random", random);
// app.use(
//   "/",
//   proxy.createProxyMiddleware({
//     target: "",
//     changeOrigin: true,
//     onProxyRes: function (proxyRes, req, res) {
//       res.header("Access-Control-Allow-Origin", "*");
//     },
//     //  cookieDomainRewrite: ''  
//   })
// );
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
