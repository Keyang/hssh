var winston=require("winston");
var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      timestamp: true,
      "level":"silly"
    })
  ]
});
module.exports=logger;
