var WebSocketServer = require('ws').Server;
var url = require('url');
var path = require('path');
const express = require('express');
const app = express();
var port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Hello Katey2'));
var m_server = app.listen(port, () => console.log('Server is running on port ' + port));

var m_webSocketServer = new WebSocketServer( { server: m_server, autoAcceptConnections: true} );

m_webSocketServer.on('connection', function (ws)
                                            {
                                                ws.send("Server connection accepted. Client ID = ALEPH NULL");
                                            }
);
