var Readable=require("stream").Readable;
var util=require("util");
var uuid=require("uuid");
module.exports=SocketWriteStream;
/**
 * A Readable stream wrapping socket.io Socket object
 */
function SocketReadStream(socket, eventName){
  Readable.call(this);
  this.socket=socket;
  this.eventName=eventName;
  var self=this;
  this.socket.once(eventName,function(token){
    self.token=token;
    self.socket.emit("socket-ready-"+token);
    self.socket.on("socket-data-"+token,function(d){

    });
    self.socket.on("")
  });
}
util.inherits(SocketReadStream,Readable);

SocketReadStream.prototype._read=function(data,enc,cb){
  var evt="socket-data-"+this.token;
  this.socket.emit(evt,data);
  this.socket.once(evt,function(){
    cb();
  });
}

SocketReadStream.prototype.init=function(cb){
  var token=uuid();
  var self=this;
  this.token=token;
  this.socket.emit(eventName,token);
  this.socket.once("socket-ready-"+token,cb);
  this.socket.once("socket-close-"+token,function(){
    self.socket.removeAllListeners("socket-data-"+self.token);
  });
}