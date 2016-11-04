module.exports=Tunnel;
var net=require("net");
function Tunnel(socket,cfg){
  if (cfg.params.modules.tunnel){
    this.sockets={};
    var tunnel=cfg.params.modules.tunnel;
    this.host=tunnel.split(":")[1];
    this.port=tunnel.split(":")[2];
    this.bindSocket(socket);
  }
}

Tunnel.prototype.initConnection=function(socket,id){
  
  var lsocket=net.connect({
      port:this.port,
      host:this.host
    },function(){
      lsocket.on("data",function(d){
        socket.emit("tunnel-"+id,d);
      })
      socket.on("tunnel-"+id,function(d){
        lsocket.write(d);
      })
      lsocket.on("close",function(){
        socket.removeAllListeners("tunnel");
      })
    }).on("error",function(e){
      log.error(e);
      socket.emit("tunnel-close-"+id);
    });
    this.sockets[id]=lsocket;
    lsocket.on("connect",function(){
      socket.emit("tunnel-connect-"+id);
    });
    lsocket.on("close",function(){
      socket.emit("tunnel-close-"+id);
    });
}

Tunnel.prototype.bindSocket=function(socket){
  var self=this;

  socket.on("tunnel-close",function(id){
    socket.removeAllListeners("tunnel");
    self.disconnect(id);
    log.info("[TUNNEL] disconnect");
  });
  socket.on("tunnel-connect",function(id){
    log.info("[TUNNEL] connect to :",self.host,self.port);
    self.initConnection(socket,id);
  })
}

Tunnel.prototype.disconnect=function(id){
  var lsocket=this.sockets[id];
  if (lsocket){
    lsocket.end();
    delete this.sockets[id];
  }

}
Tunnel.prototype.terminate=function(){
  for (var key in this.sockets){
    this.disconnect(key);
  }
}