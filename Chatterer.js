var GROUP_DRAWER_ASCII_MESSAGE = { "ACTIVE_CLIENTS": 0 };
var DRAWING_CODES = { "DRAW_SEGMENT": 0, "END_DRAW_SEGMENT": 1, "DRAWING_COLOUR": 2, "DRAWING_WIDTH": 3, "DRAWING_STYLE": 4 };

function GroupDrawer()
{
    this.m_clients = {};
    this.m_numClients = 0;

    this.m_arrASCIIMessages = ["ActiveClients"];

    this.m_arrASCIIMessageDescriptions = [
                                            "Returns the number of drawers in the group session."
                                         ];
}

GroupDrawer.prototype.GetHelpStrings = function ()
{
    return [this.m_arrASCIIMessages, this.m_arrASCIIMessageDescriptions];
}

GroupDrawer.prototype.HandleASCIIMessage = function (szMessage, ws, clients)
{
    var szLowerCaseMessage = szMessage.toLowerCase();

    if (szLowerCaseMessage == this.m_arrASCIIMessages[GROUP_DRAWER_ASCII_MESSAGE.ACTIVE_CLIENTS].toLowerCase())
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

GroupDrawer.prototype.HandleNewClientConnect = function (ws)
{
    this.m_clients[ws.m_nUniqueID] = {};
    this.m_clients[ws.m_nUniqueID].m_contactedClients = [];

    this.m_numClients++;
}

GroupDrawer.prototype.HandleClientDisconnect = function (ws)
{
    delete this.m_clients[ws.m_nUniqueID].m_contactedClients;

    if (typeof this.m_clients[ws.m_nUniqueID].m_colourMessage !== 'undefined')
    {
        delete this.m_clients[ws.m_nUniqueID].m_colourMessage;
    }

    if (typeof this.m_clients[ws.m_nUniqueID].m_widthMessage !== 'undefined')
    {
        delete this.m_clients[ws.m_nUniqueID].m_widthMessage;
    }

    if (typeof this.m_clients[ws.m_nUniqueID].m_styleMessage !== 'undefined')
    {
        delete this.m_clients[ws.m_nUniqueID].m_styleMessage;
    }

    delete this.m_clients[ws.m_nUniqueID];

    this.m_clients[ws.m_nUniqueID] = null;

    this.m_numClients--;
}

GroupDrawer.prototype.HandleEndDrawSegmentMessage = function (message, client)
{
    client.m_ws.send(message, { binary: true });
}

GroupDrawer.prototype.HandleDrawStyleMessage = function (drawCode, contactedClient, bHaveNotContactedClientBefore)
{
    if (bHaveNotContactedClientBefore)
    {
        contactedClient = { m_bInfomredWidth: false, m_bInfomredColour: false, m_bInfomredStyle: false };
    }
    else
    {
        if (drawCode == DRAWING_CODES.DRAWING_COLOUR)
        {
            contactedClient.m_bInfomredColour = false;
        }
        else if (drawCode == DRAWING_CODES.DRAWING_WIDTH)
        {
            contactedClient.m_bInfomredWidth = false;
        }
        else if (drawCode == DRAWING_CODES.DRAWING_STYLE)
        {
            contactedClient.m_bInfomredStyle = false;
        }
    }
}

GroupDrawer.prototype.HandleDrawSegmentMessage = function (buf, client, bHaveNotContactedClientBefore, callingClientID)
{
    if (bHaveNotContactedClientBefore)
    {
        client.m_ws.send(this.m_clients[callingClientID].m_widthMessage, { binary: true });
        client.m_ws.send(this.m_clients[callingClientID].m_colourMessage, { binary: true });
        client.m_ws.send(this.m_clients[callingClientID].m_styleMessage, { binary: true });

        this.m_clients[callingClientID].m_contactedClients[client.m_ws.m_nUniqueID] = { m_bInfomredWidth: false, m_bInfomredColour: false, m_bInfomredStyle: false};
    }
    else
    {
        if (this.m_clients[callingClientID].m_contactedClients[client.m_ws.m_nUniqueID].m_bInfomredColour == false)
        {
            client.m_ws.send(this.m_clients[callingClientID].m_colourMessage, { binary: true });
            this.m_clients[callingClientID].m_contactedClients[client.m_ws.m_nUniqueID].m_bInfomredColour = true;
        }

        if (this.m_clients[callingClientID].m_contactedClients[client.m_ws.m_nUniqueID].m_bInfomredWidth == false)
        {
            client.m_ws.send(this.m_clients[callingClientID].m_widthMessage, { binary: true });
            this.m_clients[callingClientID].m_contactedClients[client.m_ws.m_nUniqueID].m_bInfomredWidth = true;
        }

        if (this.m_clients[callingClientID].m_contactedClients[client.m_ws.m_nUniqueID].m_bInfomredStyle == false)
        {
            client.m_ws.send(this.m_clients[callingClientID].m_styleMessage, { binary: true });
            this.m_clients[callingClientID].m_contactedClients[client.m_ws.m_nUniqueID].m_bInfomredStyle = true;
        }
    }

    client.m_ws.send(buf, { binary: true });
}

GroupDrawer.prototype.PrependUniqueIDToMessage = function (message, ws)
{
    var prependedMessage = Buffer.alloc(message.length + 4);

    prependedMessage.writeUInt32LE(ws.m_nUniqueID, 0);

    message.copy(prependedMessage, 4, 0, message.length);

    return prependedMessage;
}

GroupDrawer.prototype.MaintainClientProperties = function (code, nUniqueID, message)
{
    if (code == DRAWING_CODES.DRAWING_COLOUR)
    {
        this.m_clients[nUniqueID].m_colourMessage = message;
    }
    else if (code == DRAWING_CODES.DRAWING_WIDTH)
    {
        this.m_clients[nUniqueID].m_widthMessage = message;
    }
    else if (code == DRAWING_CODES.DRAWING_STYLE)
    {
        this.m_clients[nUniqueID].m_styleMessage = message;
    }
}

GroupDrawer.prototype.HandleBinaryMessage = function (message, ws, clients)
{
    //var buf = this.PrependUniqueIDToMessage(message, ws);

    //var code = message.readUInt32LE(0);

    var buffer = new ArrayBuffer(4);
    var dataview = new DataView(buffer);

    dataview.setInt32(0, 3, true); // 1 = Return Client Names

    ws.send(buffer, { binary: true });

    //this.MaintainClientProperties(code, ws.m_nUniqueID, buf);

    /*for (nClient = 0; nClient < clients.length; nClient++)
    {
        if (clients[nClient].m_ws.m_nUniqueID != ws.m_nUniqueID)
        {
            var bHaveNotContactedClientBefore = typeof this.m_clients[ws.m_nUniqueID].m_contactedClients[clients[nClient].m_ws.m_nUniqueID] === 'undefined';

            if (code == DRAWING_CODES.END_DRAW_SEGMENT)
            {
                this.HandleEndDrawSegmentMessage(buf, clients[nClient]);
            }
            else if (code == DRAWING_CODES.DRAW_SEGMENT)
            {
                this.HandleDrawSegmentMessage(buf, clients[nClient], bHaveNotContactedClientBefore, ws.m_nUniqueID);
            }
            else
            {
                this.HandleDrawStyleMessage(code, this.m_clients[ws.m_nUniqueID].m_contactedClients[clients[nClient].m_ws.m_nUniqueID], bHaveNotContactedClientBefore);
            }
        }
    }*/
}

module.exports = GroupDrawer;