var modules = require("./modules");
module.exports = function (socket, connObj) {
  return function () {
    console.log("Connection made");
    console.log("Waiting for welcome message...");
    socket.on("welcome", onWelcome(socket, connObj));
    socket.on("auth", onAuth(socket, connObj));
  }

}

function onWelcome(socket, connObj) {
  return function (svr) {
    console.log(svr.banner);
    console.log("HssH Server version: ", svr.version);
    console.log("Server available modules: ", svr.modules.join(","));
    for (var key in modules) {
      modules[key](socket, connObj);
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

function onAuth(socket, connObj) {
  return function (auth) {
    var readline = require("readline");
    console.log("Remote server requires login");
    if (auth.info) {
      console.log(auth.info);
    }
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    if (connObj.modules.auth) {
      console.log("Login using --auth parameter");
      var auth = connObj.modules.auth;
      socket.emit("auth",auth);
    } else {
      rl.question("Username: ", function (u) {
        rl.close();
        process.openStdin().setRawMode(true);
        process.stdout.write("Password: ");
        var pwd = "";
        process.stdin.on("data", function (d) {
          if (d[0] === 127) {
            if (pwd.length > 0) {
              pwd = pwd.substr(0, pwd.length - 1);
            }
          } else if (d[0] === 13) {
            process.stdin.setRawMode(false);
            process.stdin.removeAllListeners("data");
            socket.emit("auth", {
              username: u,
              password: pwd
            });
            console.log(require("os").EOL);
          } else {
            pwd += d.toString("utf8");
          }
        })
      });
    }
  }
}