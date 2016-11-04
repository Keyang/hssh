module.exports=function(connObj){
  var socket = require('socket.io-client')(connObj.url);
  socket.on("connect",require("./initSocket")(socket,connObj));
  socket.on("disconnect",function(){
    console.log("Connection lost.");
    process.exit(1);
  });
}