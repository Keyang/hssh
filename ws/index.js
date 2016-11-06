var socketIO=require("socket.io");

module.exports=function(server,params){
  var defParams={
    auth:undefined,
    banner:"Welcome to HssH server",
    log:"error"
  };
  var args={};
  for (var key in defParams){
    args[key]=defParams[key];
    if (params[key]!=undefined){
      args[key]=params[key];
    }
  }
  var io=socketIO(server);
  require("../log").transports.console.level=args.log;
  io.on("connection",require("./onNewConnection")(io,args));
}