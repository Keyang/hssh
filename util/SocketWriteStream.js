var Writable=require("stream").Writable;
var util=require("util");
var uuid=require("uuid");
module.exports=SocketWriteStream;
/**
 * A writable stream wrapping socket.io Socket object
 * This allows readable streams to pipe into one event channel. 
 */
function SocketWriteStream(socket, eventName){
  Writable.call(this);
  this.socket=socket;
  this.eventName=eventName;
}
util.inherits(SocketWriteStream,Writable);

SocketWriteStream.prototype._write=function(data,enc,cb){
  var evt="socket-data-"+this.token;
  this.socket.emit(evt,data);
  this.socket.once(evt,function(){
    cb();
  });
}

SocketWriteStream.prototype.init=function(cb){
  var token=uuid();
  var self=this;
  this.token=token;
  this.socket.emit(eventName,token);
  this.socket.once("socket-ready-"+token,cb);
  this.socket.once("socket-close-"+token,function(){
    self.socket.removeAllListeners("socket-data-"+self.token);
  });
}