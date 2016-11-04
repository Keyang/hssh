var socketIO=require("socket.io");

module.exports=function(server){
  var io=socketIO(server);
  io.on("connection",require("./onNewConnection")(io));
}