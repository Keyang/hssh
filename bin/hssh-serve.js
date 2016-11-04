#!/usr/bin/env node 
var program = require('commander');
program.version(require("../package.json").version);
program.description("A simple http server enabled for hssh.");
program.arguments("<port>");
program.parse(process.argv);

var port=parseInt(program.args[0]) || process.env.PORT || 8010;
var server=require("http").createServer();
require("../")(server);
console.log("hssh-serve is only used for testing hssh. For production usage for http servers, please see https://github.com/Keyang/hssh");
console.log("Server listen on: ",port);
server.listen(port);
