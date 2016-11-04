module.exports = function (socket, connObj) {
  process.stdin.resume();
  var stdin = process.openStdin();
  stdin.setRawMode(true);
  stdin.on("data", function (d) {
    socket.emit("keypress", d);
  });

  socket.on("stdout", function (d) {
    process.stdout.write(d);
  })
  socket.on("stderr", function (d) {
    process.stderr.write(d);
  });
}