var url = require('url');
var path = require('path');
var request = require('request');
const express = require('express');
var Socketeer = require('./Socketeer');
var Chatterer = require('./Chatterer');
const router = express.Router();

const app = express();
var port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Chatterer HTML Server Active.'));
var m_server = app.listen(port, () => console.log('Server is running on port ' + port));

var chatterer = new Chatterer(router);

var socketeer = new Socketeer(m_server, 20000);

socketeer.AddASCIIMessageCallback(chatterer.HandleASCIIMessage, chatterer);
socketeer.AddBinaryMessageCallback(chatterer.HandleBinaryMessage, chatterer);
socketeer.AddAdditionalHelpStringsCallback(chatterer.GetHelpStrings, chatterer);
socketeer.AddNewClientConnectCallback(chatterer.HandleNewClientConnect, chatterer);
socketeer.AddClientDisconnectCallback(chatterer.HandleClientDisconnect, chatterer);

socketeer.StartServer();
