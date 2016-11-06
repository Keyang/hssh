#<span style="color:#336699">H</span>ttp(<span style="color:#336699">S</span>) <span style="color:#336699">SH</span>ell for Node.JS Web Server

##Introduction

###What it is

It is a SSH like shell using WebSocket based on Http(s) to connect remote node.js web server.

###Why

Couple reasons:

* SSH is not supported by server
* Only port 80(443) being exposed
* Need access internal servers like MYSQL / MongoDB through port 80(443)
* Need transfer file between server and local
* etc etc


###What it can do

A lot of things:

* It is a comprehensive shell. You can log onto remote server through your local terminal.
* Tunnel (port forward)
* SOCKS5 proxy (TBD)
* File transfer (TBD)
* more

###How does it work

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

###Enable Node.JS webserver with hssh support

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

####Express

If express (>3.x) is used, simply do following:

```js
var app=require("express")();
var server=require("http").Server(app);
require("hssh")(server);

//Define app routes

server.listen(8080);

```

###Connect

Once you have **both** hssh client installed and node.js web-server enabled, you are ready to connect. Simply:

```
hssh <server_url>
```

For more usage, see `hssh --help` or Modules section below.

##Modules

hssh is module based. All functionalities are plugable modules. This section gives the detailed usage of each module. Each module has 3 parts:

* CLI parser: accept user input and convert into configuration
* Client: manage local resource
* Server: manage remote reosource

###Shell

Shell module is base module of hssh. The module will be started automatically once connection succeed. This grants local shell access on remote server.

Command:

```
hssh <url>
```

Below graph shows how shell module works under the hood:


![](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgSFNTSCBzaGVsbApVc2VyLT5DbGllbnQ6IFN0YXJ0IENvbm5lY3Rpb24KABMGLT5TZXJ2ZXI6AA8MAA0GLT5UZXJtaW5hbDogQ3JlYXRlIG5ldyBQc2V1ZG8gABQIACQJAGAJb2NrZXQgUmVhZHkAXAkAfghCaW5kIHN0ZGluL3N0ZG91dC9zdGRlcnIAgR4PS2V5cHJlc3MAgRQRABAJAIEREgArCQCBLggAgVEKAGUGAIEaEAAPBw&s=earth)

####Change Bash 


###Tunnel

You can forward port from remote to local:

```
hash -L <local_port>:<host>:<port> <server_url>
```

This will forward \<host\>:\<port\> from remote to local port \<local_port\> (same as how SSH -L works)



##User Authentication
TBD

##

