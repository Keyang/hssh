#!/usr/bin/env node
var program = require('commander');
var pkg = require("../package.json");
var m=require("./modules");
program.version(pkg.version);
program.description("A WebSocket based shell client.");
program.arguments("<url>");

for (var key in m){
  m[key].setup(program);
}

program.parse(process.argv);
var obj = {
  url: program.args[0],
  modules:{}
  // tunnel: program.L
}
for (var key in m){
  obj.modules[key]=m[key].result(program);
}

if (obj.url) {
  require("../client/startConnection")(obj);
} else {
  program.help();
}
