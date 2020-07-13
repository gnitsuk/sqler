const mssql = require('mssql');

function sql()
{
    this.m_szText = "";
}

sql.prototype.GetRecordSet = function ()
{
    var sRecordSet = "";

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

            sRecordSet = "Server:\n";
            sRecordSet += "Content of dbo.Perosns:\n";
            sRecordSet += "Fields = " + Object.getOwnPropertyNames(result['recordset'][0]) + "\n";
            sRecordSet += "Num. Records = " + nNumRecords + "\n";

            for (var nRecord = 0; nRecord < nNumRecords; nRecord++) {
                //var nNumCells = table.rows[nRecord].cells.length;

                sRecordSet += table.rows[nRecord];

                sRecordSet += "\n";
            }

            sRecordSet += "\n\n\n\n";

            //+ Object.getOwnPropertyNames(result['recordset']) + "\n" + result['recordset'].length + "\n" + result['recordset'].toTable().columns.length + "\n" + Object.getOwnPropertyNames(result['recordset'][0]) + "\n" + result['recordset'][0].FirstName;



        }
        catch (err) {
            sRecordSet = "Error Querying Database\n\n\n\n";
        }
    })();

    return sRecordSet;
}

module.exports = sql;