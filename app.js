var WebSocketServer = require('ws').Server;
var url = require('url');
var path = require('path');
const express = require('express');
var Socketeer = require('./Socketeer');

const app = express();
var port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Hello Helen'));
var m_server = app.listen(port, () => console.log('Server is running on port ' + port));

var m_webSocketServer = new WebSocketServer( { server: m_server, autoAcceptConnections: true} );

var socketeer = new Socketeer(m_server, 20000);

m_webSocketServer.on('connection', function (ws)
                                            {
                                                ws.send("Server connection accepted. Client ID = ALEPH NULL " +  socketeer.Test());
                                            }
);
