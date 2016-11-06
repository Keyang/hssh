#!/usr/bin/env node
var program = require('commander');
program.version(require("../package.json").version);
program.description("A simple http server enabled for hssh.");
program.arguments("<port>");
program.parse(process.argv);
var u="test";
var p="test";
var port = parseInt(program.args[0]) || process.env.PORT || 8010;
var server = require("http").createServer();
require("../")(server, {
  auth: function (auth, cb) {
    if (auth.username === u && auth.password === p) {
      cb(true);
    } else {
      cb(false);
    }
  },
  log:"debug"
});
console.log("hssh-serve is only used for testing hssh. For production usage for http servers, please see https://github.com/Keyang/hssh");
console.log("Server listen on: ", port);

console.log("");
console.log("Username: "+u+", password: "+p+"");
server.listen(port);
