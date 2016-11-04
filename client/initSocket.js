var modules=require("./modules");
module.exports = function (socket, connObj) {
  return function () {
    console.log("Connection made");
    for (var key in modules){
      modules[key](socket,connObj);
    }
    socket.emit("init", {
      params: connObj,
      size: {
        rows: process.stdout.rows,
        cols: process.stdout.columns
      }
    })
  }

}