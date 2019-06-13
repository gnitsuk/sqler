//var WebSocketServer = require('ws').Server;
var url = require('url');
var path = require('path');
var request = require('request');
const express = require('express');
var Socketeer = require('./Socketeer');
var GroupDrawer = require('./GroupDrawer');

const app = express();
var port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Hello DOG'));
var m_server = app.listen(port, () => console.log('Server is running on port ' + port));

//var m_webSocketServer = new WebSocketServer( { server: m_server, autoAcceptConnections: true} );

var groupDrawer = new GroupDrawer();

var socketeer = new Socketeer(m_server, 20000);

socketeer.AddASCIIMessageCallback(groupDrawer.HandleASCIIMessage, groupDrawer);
socketeer.AddBinaryMessageCallback(groupDrawer.HandleBinaryMessage, groupDrawer);
socketeer.AddAdditionalHelpStringsCallback(groupDrawer.GetHelpStrings, groupDrawer);
socketeer.AddNewClientConnectCallback(groupDrawer.HandleNewClientConnect, groupDrawer);
socketeer.AddClientDisconnectCallback(groupDrawer.HandleClientDisconnect, groupDrawer);

socketeer.StartServer();

//m_webSocketServer.on('connection', function (ws)
 //                                           {
  //                                              ws.send("Server connection accepted. Client ID = KJH");
   //                                             }
//);
