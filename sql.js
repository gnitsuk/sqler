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

    const pool = new mssql.ConnectionPool(config);
    const poolConnect = pool.connect();

    /*router.get('/', async function (req, res) {

        await poolConnect;
        try {
            const request = pool.request();
            const result = await request.query('SELECT * from dbo.Persons');

        } catch (err) {
            var t = 8;
        }
    });*/

    //const request = pool.request(); 

    //await poolConnect;

    //mssql.connect(config, this.MyFunc);

    this.m_szText = "Azure Toddler Joker";
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