var WebSocketServer = require('ws').Server;
var ASCII_MESSAGE = { "ENUMERATE_CLIENTS": 0, "HELP": 1, "ID": 2, "IDENTIFY": 3 };

function Socketeer(server, nKeepAliveCheckInterval)
{
    this.m_server = server;
    this.m_clients = new Array(); 
    this.m_webSocketServer = null;
    this.m_nNextUniqueClientID = 1;
    this.m_ASCIICallbacks = new Array();
    this.m_binaryCallbacks = new Array();
    this.m_aliveCheckIntervalTimerID = null;
    this.m_newClientConnectCallbacks = new Array();
    this.m_clientDisconnectCallbacks = new Array();
    this.m_additionalHelpStringsCallbacks = new Array();
    this.m_arrASCIIMessages = ["EnumerateClients", "Help", "ID", "Identify"];
    this.m_nKeepAliveCheckInterval = Math.max(100, nKeepAliveCheckInterval);
    this.m_arrASCIIMessageDescriptions = [ "Returns the number of clients connected to the server.",
                                           "Supplies a list of ASCII commands and their decriptions.",
                                           "Returns the calling client's position in the server's list of clients.",
                                           "Returns the calling client's unique ID on the server." ];
}

Socketeer.prototype.StartServer = function()
{
    this.m_webSocketServer = new WebSocketServer( { server: this.m_server, autoAcceptConnections: true} );

    this.m_webSocketServer.m_socketeer = this;

    this.m_webSocketServer.on('connection', function (ws)
                                            {
                                                this.m_socketeer.AddClient.call(this.m_socketeer, ws);
                                            }
                             );
}

Socketeer.prototype.KeepAliveCheck = function()
{
    for(var nClient = 0; nClient < this.m_clients.length; nClient++)
    {
        this.m_clients[nClient].m_ws.ping('', false, true);
    }
}

Socketeer.prototype.AddClient = function(ws)
{
    ws.m_socketeer = this;

    ws.m_nID = this.m_clients.length;
    ws.m_nUniqueID = this.m_nNextUniqueClientID;

    this.m_nNextUniqueClientID++;

    ws.on('pong', function KeepAlive() { } );

    ws.on('message', function (message)
                     {
                         if(typeof(message) == "string")
                         {
                            this.m_socketeer.ProcessASCIIMessage.call(this.m_socketeer, this, message);
                         }
                         else
                         {
                            this.m_socketeer.ProcessBinaryMessage.call(this.m_socketeer, this, message);
                         }     
                     }
         );

    ws.on('close', function close()
    {
        this.m_socketeer.ProcessClientCloseMessage.call(this.m_socketeer, this);
    });

    this.m_clients[this.m_clients.length] = { m_ws: ws };

    ws.send("Server connection accepted. Client ID = " + ws.m_nUniqueID.toString())

    for (var nCallback = 0; nCallback < this.m_newClientConnectCallbacks.length; nCallback++)
    {
        this.m_newClientConnectCallbacks[nCallback].m_NewClientConnectCallback.call(this.m_newClientConnectCallbacks[nCallback].m_context, ws);
    }

    if(this.m_aliveCheckIntervalTimerID == null)
    {
        this.m_aliveCheckIntervalTimerID = setInterval(this.KeepAliveCheck.bind(this), this.m_nKeepAliveCheckInterval);
    }
}

Socketeer.prototype.AddNewClientConnectCallback = function (NewClientConnectCallback, handlingObject)
{
    this.m_newClientConnectCallbacks[this.m_newClientConnectCallbacks.length] = { m_NewClientConnectCallback: NewClientConnectCallback, m_context: handlingObject };
}

Socketeer.prototype.AddClientDisconnectCallback = function (ClientDisconnectCallback, handlingObject)
{
    this.m_clientDisconnectCallbacks[this.m_clientDisconnectCallbacks.length] = { m_ClientDisconnectCallback: ClientDisconnectCallback, m_context: handlingObject };
}

Socketeer.prototype.AddASCIIMessageCallback = function(ASCIICallbackFunction, handlingObject)
{
    this.m_ASCIICallbacks[this.m_ASCIICallbacks.length] = { m_ASCIICallback: ASCIICallbackFunction, m_context: handlingObject};
}

Socketeer.prototype.AddBinaryMessageCallback = function(binaryCallbackFunction, handlingObject)
{
    this.m_binaryCallbacks[this.m_binaryCallbacks.length] = { m_binaryCallback: binaryCallbackFunction, m_context: handlingObject};
}

Socketeer.prototype.AddAdditionalHelpStringsCallback = function (helpStringsCallbackFunction, handlingObject)
{
    this.m_additionalHelpStringsCallbacks[this.m_additionalHelpStringsCallbacks.length] = { m_helpStringsCallback: helpStringsCallbackFunction, m_context: handlingObject };
}

Socketeer.prototype.ProcessBinaryMessage = function(ws, message)
{
    for(var nCallback = 0; nCallback < this.m_binaryCallbacks.length; nCallback++)
    {
        this.m_binaryCallbacks[nCallback].m_binaryCallback.call(this.m_binaryCallbacks[nCallback].m_context, message, ws, this.m_clients);
    }
}

Socketeer.prototype.ProcessClientCloseMessage = function (ws)
{
    for (var nCallback = 0; nCallback < this.m_clientDisconnectCallbacks.length; nCallback++)
    {
        this.m_clientDisconnectCallbacks[nCallback].m_ClientDisconnectCallback.call(this.m_clientDisconnectCallbacks[nCallback].m_context, ws);
    }

    this.Terminate(ws);
}

Socketeer.prototype.ProcessASCIIMessage = function(ws, szMessage)
{
    var szLowerCaseMessage = szMessage.toLowerCase();

    if(szLowerCaseMessage == this.m_arrASCIIMessages[ASCII_MESSAGE.ENUMERATE_CLIENTS].toLowerCase())
    {
        this.EnumerateClients(ws, false);
    }
    else if(szLowerCaseMessage == this.m_arrASCIIMessages[ASCII_MESSAGE.HELP].toLowerCase())
    {
        this.ListASCIICommands(ws);
    }
    else if (szLowerCaseMessage == this.m_arrASCIIMessages[ASCII_MESSAGE.ID].toLowerCase())
    {
        this.IDClient(ws, false);
    }
    else if(szLowerCaseMessage == this.m_arrASCIIMessages[ASCII_MESSAGE.IDENTIFY].toLowerCase())
    {
        this.IdentifyClient(ws, false);
    }

    for(var nCallback = 0; nCallback < this.m_ASCIICallbacks.length; nCallback++)
    {
        this.m_ASCIICallbacks[nCallback].m_ASCIICallback.call(this.m_ASCIICallbacks[nCallback].m_context, szMessage, ws, this.m_clients);
    }
}

Socketeer.prototype.Terminate = function(ws)
{
    this.m_clients.splice(ws.m_nID, 1);

    for(var nClient = 0; nClient < this.m_clients.length; nClient++)
    {
        if(this.m_clients[nClient].m_ws.m_nID > ws.m_nID)
        {
            this.m_clients[nClient].m_ws.m_nID--;
        }
    }
    
    ws.terminate();
}

Socketeer.prototype.ListASCIICommands = function(ws)
{
    var szHelp = "";

    var nIndex = 1;

    for(var nASCIICommand = 0; nASCIICommand < this.m_arrASCIIMessages.length; nASCIICommand++)
    {
        szHelp += nIndex.toString() + ") " + this.m_arrASCIIMessages[nASCIICommand] + " - " + this.m_arrASCIIMessageDescriptions[nASCIICommand];

        if(nASCIICommand < this.m_arrASCIIMessages.length - 1)
        {
            szHelp += "\r\n";
        }

        nIndex++;
    }

    for (var nAdditionalHelpList = 0; nAdditionalHelpList < this.m_additionalHelpStringsCallbacks.length; nAdditionalHelpList++)
    {
        var helpObject = this.m_additionalHelpStringsCallbacks[nAdditionalHelpList].m_helpStringsCallback.call(this.m_additionalHelpStringsCallbacks[nAdditionalHelpList].m_context);

        for (var nHelpString = 0; nHelpString < helpObject[0].length; nHelpString++)
        {
            szHelp += "\r\n";

            szHelp += nIndex.toString() + ") " + helpObject[0][nHelpString] + " - " + helpObject[1][nHelpString];
        }
    }

    ws.send(szHelp, { binary: false });
}

Socketeer.prototype.EnumerateClients = function(ws, bBinary)
{
    if(bBinary)
    {
        var buf = Buffer.alloc(4);
                                                                    
        buf.writeUInt32LE(this.m_clients.length, 0);

        ws.send(buf, { binary: true });
    }
    else
    {
        ws.send(this.m_clients.length.toString(), { binary: false });
    }
}

Socketeer.prototype.IdentifyClient = function(ws, bBinary)
{
    if(bBinary)
    {
        var buf = Buffer.alloc(4);
                                                                    
        buf.writeUInt32LE(ws.m_nID, 0);

        ws.send(buf, { binary: true });
    }
    else
    {
        ws.send(ws.m_nID.toString(), { binary: false });
    }
}

Socketeer.prototype.IDClient = function (ws, bBinary)
{
    if (bBinary)
    {
        var buf = Buffer.alloc(4);

        buf.writeUInt32LE(ws.m_nUniqueID, 0);

        ws.send(buf, { binary: true });
    }
    else
    {
        ws.send(ws.m_nUniqueID.toString(), { binary: false });
    }
}

module.exports = Socketeer;
