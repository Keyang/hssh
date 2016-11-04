var modules=require("./modules");
module.exports=function(io){
  return function(socket){
    log.info("New connection made.");
    var mInsts=[];
    socket.on("init",function(d){
      for (var key in modules){
        mInsts.push(new modules[key](socket,d));
      }
      socket.on("disconnect",function(){
        log.info("Client disconnected");
        mInsts.forEach(function(m){
          m.terminate();
        });
      });
    })
    
  }
}


