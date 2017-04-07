
module.exports=function(socket,cfg){
  if (!cfg.modules.cp){
    return;
  }
  var cpCfg=cfg.modules.cp;
  if (cpCfg.isUpload){
    initUpload(socket,cpCfg.localPath);
  }else{
    initDownload(socket,cpCfg.localPath);
  }
}

var fs=require("fs");
function initUpload(socket,path){
  if (fs.existsSync(path)){
    var rs=fs.createReadStream(path);
    rs.pause();
    socket.emit("cp-ready");
    socket.on("cp-start",function(){
      rs.on("data",function(d){
        socket.emit("cp-data",d);
      });
      rs.on("end",function(){
        socket.emit("cp-end");
      });
      rs.resume();
    })
  }else{
    throw(new Error("File "+path+" not exists."));
  }
}