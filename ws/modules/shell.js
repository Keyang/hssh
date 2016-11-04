module.exports=Shell;
var pty = require('pty.js');
function Shell(socket,cfg){
  var cmd=env.get("SH");
  var self=this;
  self.term=pty.spawn(cmd,[],{
      name: 'xterm-color',
      cols: cfg.size.cols,
      rows: cfg.size.rows,
      cwd: process.env.HOME,
      env: process.env
  });
  self.bindSocket(socket);
  self.term.on("exit",function(){
    socket.disconnect()
  })

}
Shell.prototype.bindSocket=function(socket){
  var cp=this.cp;
  var term=this.term;
  socket.on("keypress",function(d){ 
    term.write(d);
  });
  term.on("data",function(d){
    socket.emit("stdout",d);
  })
}

Shell.prototype.terminate=function(){
  if (this.term){
    this.term.destroy();
    this.term=null;
  }
}
