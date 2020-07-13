const mssql = require('mssql');

function sql()
{
    this.m_call = 1;
    this.m_szLastDBQueryResult = "";
}

sql.prototype.GetDBRecords = function ()
{
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
        var err;
        try {

            await mssql.connect(config);
            var request = new mssql.Request();
            const result = await mssql.query(`SELECT * from dbo.Persons`);

            var table = result['recordset'].toTable();

            var nNumRecords = table.rows.length;

            this.m_szLastDBQueryResult = "Server:\n";
            this.m_szLastDBQueryResult += "Call : " + this.m_call + "\n";
            this.m_szLastDBQueryResult += "Content of dbo.Persons:\n";
            this.m_szLastDBQueryResult += "Fields = " + Object.getOwnPropertyNames(result['recordset'][0]) + "\n";
            this.m_szLastDBQueryResult += "Num. Records = " + nNumRecords + "\n";

            for (var nRecord = 0; nRecord < nNumRecords; nRecord++) {

                this.m_szLastDBQueryResult += table.rows[nRecord];

                this.m_szLastDBQueryResult += "\n";
            }

            this.m_szLastDBQueryResult += "\n\n\n\n";

            //Object.getOwnPropertyNames(result['recordset']) + "\n" + result['recordset'].length + "\n" + result['recordset'].toTable().columns.length + "\n" + Object.getOwnPropertyNames(result['recordset'][0]) + "\n" + result['recordset'][0].FirstName;

            this.m_call++;

        }
        catch (err)
        {
            this.m_szLastDBQueryResult = "Error Querying Database\n\n\n\n";
        }
    })();

    return this.m_szLastDBQueryResult;
}

sql.prototype.ccc = function ()
{
    this.SetDatabaseContent();

    return this.m_szLastDBQueryResult;
}

module.exports = sql;