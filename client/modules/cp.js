
module.exports = function (socket, cfg) {
  if (!cfg.modules.cp) {
    return;
  }
  var cpCfg = cfg.modules.cp;
  if (cpCfg.isUpload) {
    initUpload(socket, cpCfg.localPath);
  } else {
    initDownload(socket, cpCfg.localPath);
  }
}

var fs = require("fs");
function initUpload(socket, path) {
  if (fs.existsSync(path)) {
    var rs = fs.createReadStream(path);
    rs.pause();
    socket.emit("cp-ready");
    var byte = 0;
    console.log("Upload File:");
    console.log("   From Local: ", path);
    socket.on("cp-start", function () {
      rs.on("data", function (d) {
        process.stdout.write("\rSent: " + byte + " Bytes");
        socket.emit("cp-data", d);
        byte += d.length;
      });
      rs.on("end", function () {
        process.stdout.write("\rSent: " + byte + " Bytes\n\n");
        console.log("Waiting Server processing file.")
        socket.emit("cp-end");
      });
      rs.resume();
    });
    socket.on("cp-ws-closed", function () {
      console.log("File copied successfully.");
      socket.close();
    })
  } else {
    throw (new Error("File " + path + " not exists."));
  }
}

function initDownload(socket, path) {
  var ws = fs.createWriteStream(path);
  console.log("Download File:");
  console.log("   To Local: ", path);
  var byte=0;
  socket.on("cp-data",function(d){
    process.stdout.write("\rReceived: " + byte + " Bytes");
    ws.write(d);
    byte+=d.length;
  });
  socket.on("cp-end",function(){
    process.stdout.write("\rReceived: " + byte + " Bytes\n\n");
    console.log("Waiting file writing finishing.");
    ws.end();
    socket.close();
  })
}