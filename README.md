#Http(S) SHell for Node.JS Web Server

##What it is

It is a SSH like shell using WebSocket based on Http(s) to connect remote node.js web server.

##Why

Couple reasons:

* SSH is not supported by server
* Only port 80(443) being exposed
* Need access internal servers like MYSQL / MongoDB through port 80(443)
* Need transfer file between server and local
* etc etc


##What it can do

A lot of things:

* It is a comprehensive shell. You can log onto remote server through your local terminal.
* Tunnel (port forward)
* SOCKS5 proxy (TBD)
* File transfer (TBD)
* more

##How does it work

hssh uses WebSockets as underlying communication channel. The clien