const mssql = require('mssql');

function sql(router)
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
            // make sure that any items are correctly URL encoded in the connection string
            await mssql.connect(config);
            var request = new mssql.Request();
            const result = await mssql.query(`SELECT * from dbo.Persons`);

            /*const result = await request.query('SELECT * from dbo.Persons', function (err, recordset) {

                if (err) {
                    this.m_szText = "5";
                }
                else {
                    this.m_szText = "7";
                }

            });*/


            //this.m_szText = "222: " + Object.getOwnPropertyNames(result).toString();

            this.m_szText = "IS NOW: " + Object.getOwnPropertyNames(result['recordset']) + "\n" + result['recordset'].length + "\n" + Object.getOwnPropertyNames(result['recordset'].toTable()) + "\n" + Object.getOwnPropertyNames(result['recordset'][0]) + "\n" + result['recordset'][0].FirstName;



        } catch (err) {
            this.m_szText = "kkkk";
        }
    })();




    /*const pool = new mssql.ConnectionPool(config);
    const poolConnect = pool.connect();

    (async () => {
        router.get('/', async function (req, res) {

            await poolConnect;
            try {
                const request = pool.request();
                const result = await request.query('SELECT * from dbo.Persons');
                this.m_szText = "One";

            } catch (err) {
                this.m_szText = "Two";
            }
        });
    })();*/




    //this.m_szText = "Azure Toddler Battery";
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