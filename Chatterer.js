var OP_CODES = { "NUM_OTHER_CLIENTS": 1 };
var CHATTERER_ASCII_MESSAGE = { "ACTIVE_CLIENTS": 0 };

function Chatterer()
{
    this.m_clients = {};
    this.m_numClients = 0;

    this.m_arrASCIIMessages = ["ActiveClients"];

    this.m_arrASCIIMessageDescriptions = [
                                            "Returns the number of clients in the group session."
                                         ];
}

Chatterer.prototype.GetHelpStrings = function ()
{
    return [this.m_arrASCIIMessages, this.m_arrASCIIMessageDescriptions];
}

Chatterer.prototype.HandleASCIIMessage = function (szMessage, ws, clients)
{
    var szLowerCaseMessage = szMessage.toLowerCase();

    if (szLowerCaseMessage == this.m_arrASCIIMessages[CHATTERER_ASCII_MESSAGE.ACTIVE_CLIENTS].toLowerCase())
    {
        ws.send(this.m_numClients.toString());
    }
    else if(szLowerCaseMessage.indexOf("name = ") >= 0)
    {
        var szName = szMessage.substring(7, szMessage.length);

        this.m_clients[ws.m_nUniqueID].m_szName = szName;

        ws.send("From Server : " + szName + ", you have been included in the conversation.");
	}
    else
    {
        for (nClient = 0; nClient < clients.length; nClient++)
        {
            if (clients[nClient].m_ws.m_nUniqueID != ws.m_nUniqueID)
            {
                //clients[nClient].m_ws.send(this.m_text, { binary: false });
            }
        }
    }
}

Chatterer.prototype.HandleNewClientConnect = function (ws)
{
    this.m_clients[ws.m_nUniqueID] = {};
    this.m_clients[ws.m_nUniqueID].ws = ws;

    this.m_numClients++;
}

Chatterer.prototype.HandleClientDisconnect = function (ws)
{
    delete this.m_clients[ws.m_nUniqueID];

    this.m_clients[ws.m_nUniqueID] = null;

    this.m_numClients--;
}

Chatterer.prototype.HandleBinaryMessage = function (message, ws, clients)
{
    /*var buffer = new ArrayBuffer(8);
    var dataview = new DataView(buffer);

    dataview.setInt32(0, OP_CODES.NUM_OTHER_CLIENTS, true);
    dataview.setInt32(4, clients.length - 1, true);

    ws.send(buffer, { binary: true });*/

    var code = message.readUInt32LE(0);

    if (code == OP_CODES.NUM_OTHER_CLIENTS)
    {
        var nNumOtherClients = clients.length - 1;

        var szResponse = nNumOtherClients.toString() + ":";

        for (var nClient = 0; nClient < clients.length; nClient++)
        {
            var nUniqueID = clients[nClient].m_ws.m_nUniqueID;

            if (nUniqueID != ws.m_nUniqueID)
            {
                szResponse += nUniqueID.toString() + ":" + this.m_clients[nUniqueID].m_szName + ":";

                clients[nClient].m_ws.send("New client joined : " + ws.m_nUniqueID.toString() + ":" + this.m_clients[ws.m_nUniqueID].m_szName);
            }
        }

        szResponse = szResponse.substring(0, szResponse.length - 1);

        ws.send(szResponse);
    }
}

module.exports = Chatterer;