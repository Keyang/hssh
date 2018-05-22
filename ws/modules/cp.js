module.exports = Copy;
var net = require("net");
var log = require("../../log");
function Copy(socket, cfg) {
  if (cfg.modules.cp) {
    var cpCfg = cfg.modules.cp;
    if (cpCfg.isUpload) {
      this.startUpload(socket, cpCfg);
    } else {
      this.startDownload(socket, cpCfg);
    }
  }
}

Copy.prototype.startUpload = function (socket, cfg) {
  this.ws = require("fs").createWriteStream(cfg.remotePath);
  var self = this;
  socket.on("cp-data", function (d) {
    self.ws.write(d);
  });
  socket.on("cp-end", function () {
    self.ws.end(function () {
      socket.emit("cp-ws-closed");
      self.ws = null;
    });
  });
  socket.emit("cp-start");
}
Copy.prototype.startDownload = function (socket, cfg) {
  this.rs = require("fs").createReadStream(cfg.remotePath);
  var self = this;
  this.rs.on("data",function(data){
    socket.emit("cp-data",data);
  });
  this.rs.on("end",function(){
    socket.emit("cp-end");
    self.rs=null;
  })
}

Copy.prototype.terminate = function () {
  if (this.ws) {
    this.ws.end();
    this.ws = null;
  }
  if (this.rs){
    this.rs.removeAllListeners();
    this.rs=null;
  }
}