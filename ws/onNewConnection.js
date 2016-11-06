var modules=require("./modules");
var log=require("../log");
module.exports=function(io,params){
  return function(socket){
    log.info("New connection made.",socket.id);
    var mInsts=[];
    if (params.auth){
      emitAuth(socket,params);
    }else{
      emitWelcome(socket,params);
    }
    socket.once("disconnect",function(){
      log.info("Client disconnected",socket.id);
    });
  }
}

function emitAuth(socket,params){
  var auth=params.auth;
  var onAuth=null;
  if (typeof auth === "function"){
    onAuth=auth;
  }else if (typeof auth ==="object" && auth.onAuth && typeof auth.onAuth ==="function"){
    onAuth=auth.onAuth;
  }
  if (onAuth!=null){
    socket.emit("auth",auth);
    socket.once("auth",function(obj){
      onAuth(obj,function(isLogin){
        if (isLogin ===true){
           emitWelcome(socket,params); 
        }else{
           socket.disconnect();      
        }
      });
    });
  }else{
    log.error("Wrong auth parameter. Auth is disabled.")
    emitWelcome(socket,params);
  }
}

function getModuleName(){
  var names=[];
  for (var key in modules){
    names.push(key);
  }
  return names;
}

function onInit(socket,params){
  return function(d){
    var mInsts=[];
    for (var key in modules){
      mInsts.push(new modules[key](socket,d));
    }
    socket.once("disconnect",function(){
      mInsts.forEach(function(m){
        m.terminate();
      });
    });
  }
}
function emitWelcome(socket,params){
    socket.emit("welcome",{
      version:require("../package.json").version,
      modules:getModuleName(),
      banner:params.banner
    });
    socket.once("init",onInit(socket,params));
}

