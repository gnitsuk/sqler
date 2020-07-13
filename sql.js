const mssql = require('mssql');

function sql()
{
    this.m_szText = "Azure Toddler 77";

    const config = {

        user: "gnits",
        password: "ott456SENT",
        server: "gnits.database.windows.net",
        port: 1433,
        database: "gnitsDB",
        connectionTimeout: 3000,
        parseJSON: true,
        options: {
            encrypt: true,
            enableArithAbort: true
        },
        pool: {
            min: 0,
            idleTimeoutMillis: 3000
        }
    };

    (async () => {
        try {
            
            await mssql.connect(config);
            var request = new mssql.Request();
            const result = await mssql.query(`SELECT * from dbo.Persons`);

            var nNumRecords = result['recordset'].length;
            var table = result['recordset'].toTable();

            this.m_szText = "Server:\n";
            this.m_szText += "Content of dbo.Perosns:\n";
            this.m_szText += "Fields = " + Object.getOwnPropertyNames(result['recordset'][0]) + "\n";
            this.m_szText += "Num. Records = " + nNumRecords + "\n";

            this.m_szText += "\n\n\n\n";

            //+ Object.getOwnPropertyNames(result['recordset']) + "\n" + result['recordset'].length + "\n" + result['recordset'].toTable().columns.length + "\n" + Object.getOwnPropertyNames(result['recordset'][0]) + "\n" + result['recordset'][0].FirstName;



        } catch (err) {
            this.m_szText = "kkkk";
        }
    })();

}

sql.prototype.MyFunc = function (err)
{
    //this.m_m.m_szText = "pop";

    return "KOP";
}

sql.prototype.GetText = function ()
{
    return this.m_szText;
}

module.exports = sql;