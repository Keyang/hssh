
#Http(S) SHell for Node.JS Web Server

## Introduction

### What it is

hssh is a SSH like shell using WebSocket based on Http(s) to connect remote node.js web server. Features include remote terminal / port forwarding / file transfer etc.

### Why

Couple reasons:

* SSH is not supported by server
* Only port 80(443) being exposed
* Need access internal servers like MYSQL / MongoDB through port 80(443)
* Need transfer file between server and local
* Need access backend services withing VPN or firewall.
* etc etc


### What it can do

A lot of things:

* It is a comprehensive shell. You can log onto remote server through your local terminal.
* Tunnel (port forward)
* SOCKS5 proxy (TBD)
* File transfer (TBD)
* more

### How does it work

hssh uses WebSockets as underlying communication channel. Client forwards CLI keypress to Server which further streams it to a bash process. Based on this idea, tunnel works similarly (by forwarding TCP pakcets). See simple diagram below:

![hssh-diagram](https://github.com/Keyang/hssh/raw/assets/howitworks.png)

###Is it secure

WebSocket is using underlying Http(s) protocol. The data transportation will be encrypted with ssl if web server is under https.

For user authentication, see User Authentication section below.

##Quick Start

To use `hssh` you will need have:

* Install `hssh` client
* Enable node.js webserver with hssh support

###Install `hssh` Client

Install hssh through npm:

```
npm install -g hssh
```

The command will install hssh globally which includes cli command `hssh` and `hssh-serve`

`hssh` is the main cli which connects remote web server. `hssh-serve` is a testing web server enabled with hssh support.

### Enable Node.JS webserver with hssh support

Use `hssh` as a module in node.js web application and attach hssh to node.js http.Server instance.

First install `hssh` as a module

```
npm i hssh --save
```

Use with http.Server:

```js
var server=require("http").createServer(function handler(){});
require("hssh")(server);
server.listen(8080);
```

That's it! now the server is ready to be connected through hssh through:

```
hssh http://<server_host>:8080
```

#### Express

If express (>3.x) is used, simply do following:

```js
var app=require("express")();
var server=require("http").Server(app);
require("hssh")(server);

//Define app routes

server.listen(8080);

```

### Connect

Once you have **both** hssh client installed and node.js web-server enabled, you are ready to connect. Simply:

```
hssh <server_url>
```

For more usage, see `hssh --help` or Modules section below.

## Modules

hssh is module based. All functionalities are plugable modules. This section gives the detailed usage of each module. Each module has 3 parts:

* CLI parser: accept user input and convert into configuration
* Client: manage local resource
* Server: manage remote reosource

### Shell

Shell module is base module of hssh. The module will be started automatically once connection succeed. This grants local shell access on remote server.

Command:

```
hssh <url>
```

Below graph shows how shell module works under the hood:


![](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgSFNTSCBzaGVsbApVc2VyLT5DbGllbnQ6IFN0YXJ0IENvbm5lY3Rpb24KABMGLT5TZXJ2ZXI6AA8MAA0GLT5UZXJtaW5hbDogQ3JlYXRlIG5ldyBQc2V1ZG8gABQIACQJAGAJb2NrZXQgUmVhZHkAXAkAfghCaW5kIHN0ZGluL3N0ZG91dC9zdGRlcnIAgR4PS2V5cHJlc3MAgRQRABAJAIEREgArCQCBLggAgVEKAGUGAIEaEAAPBw&s=earth)

#### Change Bash 

By default, hssh uses `bash` as remote bash in terminal. However, this can be changed to any type of bash. Set environment variable `HSSH_SH` to the bash wanted.

e.g. use `sh` 

```
HSSH_SH=sh node ./my_hssh_server
```

### Tunnel

You can forward port from remote to local:

```
hash -L <local_port>:<host>:<port> <server_url>
```

This will forward \<host\>:\<port\> from remote to local port \<local_port\> (same as how SSH -L works)


### File Copy

You can copy file from / to remote using `hcp` command:

```
# copy from local to remote
hcp ./localfile http://<server_url>:/tmp/remotefile
```

```
# copy from remote to local
hcp http://<server_url>:/tmp/remotefile ./localfile
```

## HSSH Configuration

hssh has a bunch of configurations:

* User authentication
* Welcome banner information

Just pass the parameter object as the second parameter when attaching to http.Server:

```js
require("hssh")(server,params);
```

### User Authentication

User authentication is customised. By default, there is not user authentication and any connection can run the bash. To add user authentication, simply add `auth` field to hssh parameters.

```js
require("hssh")(server,{
	auth:function(auth,cb){
		//check auth.username and auth.password
		// once validated, call cb(true) or cb(false)
		// async auth is supported
	}
});
```

Once hssh server is configured with auth, `hssh` client will promt for username and password.

```
$ hssh http://127.0.0.1:8010
Connecting to  http://127.0.0.1:8010
Connection made
Waiting for welcome message...
Remote server requires login
Username: test
Password:

Welcome to HssH server
HssH Server version:  1.0.2
Server available modules:  shell,tunnel
bash-3.2$
```

If you want non-interactive, simply use `--auth` parameter:

```
$ hssh --auth test:test http://127.0.0.1:8010
Connecting to  http://127.0.0.1:8010
Connection made
Waiting for welcome message...
Remote server requires login
Login using --auth parameter
Welcome to HssH server
HssH Server version:  1.0.2
Server available modules:  shell,tunnel
bash-3.2$
```

### Welcome banner text

Welcome banner text will be displayed in the welcome information

```js
require("hssh")(server,{
	banner:"Welcome to my server"
});
```
