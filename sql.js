const mssql = require('mssql');

function sql(router)
{
    this.m_szText = "Azure Toddler 9955549";

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
            // make sure that any items are correctly URL encoded in the connection string
            //await sql.connect(config);
            //const result = await sql.query`SELECT * from dbo.Persons`;
            this.m_szText = config.toString();
        } catch (err) {
            this.m_szText = "k";
        }
    })();

    /*mssql.connect(config, function (err) {

        if (err) this.m_szText = "1";

        // create Request object
        var request = new mssql.Request();

        // query to the database and get the records
        request.query('SELECT * from dbo.Persons', function (err, recordset) {

            if (err) {
                this.m_szText = "2";
            }
            else {
                // send records as a response
                this.m_szText = "3";
            }

        });
    });*/

    //this.m_szText = "Azure Toddler Bat";
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