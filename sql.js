const mssql = require('mssql');

function sql()
{
    this.m_szText = this.GetDatabaseContent();

    
}

sql.prototype.GetDatabaseContent = function (err)
{
    var szResult = "Z";

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

            szResult = "Server:\n";
            szResult += "Content of dbo.Perosns:\n";
            szResult += "Fields = " + Object.getOwnPropertyNames(result['recordset'][0]) + "\n";
            szResult += "Number ov Records = " + nNumRecords + "\n";

            for (var nRecord = 0; nRecord < nNumRecords; nRecord++) {
                //var nNumCells = table.rows[nRecord].cells.length;

                szResult += table.rows[nRecord];

                szResult += "\n";
            }

            szResult += "\n\n\n\n";

            //+ Object.getOwnPropertyNames(result['recordset']) + "\n" + result['recordset'].length + "\n" + result['recordset'].toTable().columns.length + "\n" + Object.getOwnPropertyNames(result['recordset'][0]) + "\n" + result['recordset'][0].FirstName;



        }
        catch (err) {
            szResult = "Error Querying Database\n\n\n\n";
        }
    })();

    return szResult;
}

sql.prototype.GetText = function ()
{
    return this.m_szText;
}

module.exports = sql;