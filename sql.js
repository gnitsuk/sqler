const mssql = require('mssql');

function sql()
{
    this.m_szLastDBQueryResult = "";
}

sql.prototype.SetDatabaseContent = function (err)
{
    this.m_szLastDBQueryResult = "";

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

            var table = result['recordset'].toTable();

            var nNumRecords = table.rows.length;

            this.m_szLastDBQueryResult = "Server:\n";
            this.m_szLastDBQueryResult += "Content of dbo.Persons:\n";
            this.m_szLastDBQueryResult += "Fields = " + Object.getOwnPropertyNames(result['recordset'][0]) + "\n";
            this.m_szLastDBQueryResult += "Num. Records = " + nNumRecords + "\n";

            for (var nRecord = 0; nRecord < nNumRecords; nRecord++) {
                //var nNumCells = table.rows[nRecord].cells.length;

                this.m_szLastDBQueryResult += table.rows[nRecord];

                this.m_szLastDBQueryResult += "\n";
            }

            this.m_szLastDBQueryResult += "\n\n\n\n";

            //+ Object.getOwnPropertyNames(result['recordset']) + "\n" + result['recordset'].length + "\n" + result['recordset'].toTable().columns.length + "\n" + Object.getOwnPropertyNames(result['recordset'][0]) + "\n" + result['recordset'][0].FirstName;



        }
        catch (err)
        {
            this.m_szLastDBQueryResult = "Error Querying Database\n\n\n\n";
        }
    })();
}

sql.prototype.GetDBRecords = function ()
{
    this.SetDatabaseContent();

    return this.m_szLastDBQueryResult;
}

module.exports = sql;