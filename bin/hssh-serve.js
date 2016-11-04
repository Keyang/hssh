#!/usr/bin/env node 
var program = require('commander');
program.version(require("../package.json").version);
program.description("A simple http server enabled for hssh.");
program.arguments("<port>");
program.parse(process.argv);

var port=parseInt(program.args[0]);
if (!port){
  program.help();
  process.exit(1);
}
var server=require("http").createServer();
require("../")(server);
console.log("Server listen on: ",port);
server.listen(port);
