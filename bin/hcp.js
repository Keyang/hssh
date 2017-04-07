#!/usr/bin/env node
var program = require('commander');
var pkg = require("../package.json");
program.version(pkg.version);
program.description("Copy files between local and hssh server.");
program.arguments("<LOCAL_PATH|REMOTE_PATH> <REMOTE_PATH|LOCAL_PATH>")
.parse(process.argv);

if (program.args.length !=2){
  program.help();
}else{
  var url1=program.args[0];
  var url2=program.args[1];
  var args={
    isUpload:true,
    remotePath:"",
    localPath:""
  }
  if (isRemoteUrl(url1)){
    args.isUpload=false;
    var t=url2;
    url2=url1;
    url1=t;
  }
  var rObj=splitRemoteUrl(url2);
  args.localPath=url1;
  args.remotePath=rObj.path;
  var params={
    url:rObj.url,
    modules:{
      cp:args
    }
  };
  require("../client/startConnection")(params); 
}

function isRemoteUrl(url){
  return url.indexOf("http")===0;
}
function splitRemoteUrl(url){
  var arr=url.split(":");
  return {
    path:arr.pop(),
    url:arr.join(":")
  };
}