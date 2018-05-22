var uuid = require("uuid");
module.exports = function (socket, connObj) {
  var t = connObj.modules.tunnel;
  if (t && t.split(":").length === 3) {
    var port = parseInt(t.split(":")[0]);
    var server = require("net").createServer({
      allowHalfOpen: false,
      pauseOnConnect: true
    }, function (lsocket) {
      var id = uuid();
      lsocket.on("data", function (d) {
        socket.emit("tunnel-" + id, d);
      });
      socket.on("tunnel-" + id, function (d) {
        lsocket.write(d);
      });

      socket.emit("tunnel-connect", id);
      socket.on("tunnel-connect-" + id, function () {
        lsocket.resume();
      });
      socket.once("tunnel-close-" + id, function () {
        socket.removeAllListeners("tunnel-" + id);
        socket.removeAllListeners("tunnel-connect-" + id);
        lsocket.end();
      })
      lsocket.on("close", function () {
        socket.removeAllListeners("tunnel");
        socket.emit("tunnel-close", id);
      });
      lsocket.on('error',function(e){
        console.log(e);
      })

    })
      .on("error", function (e) {
        throw (e);
      });
    server.listen(port);
  }
}