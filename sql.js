const mssql = require('mssql');

function sql()
{
    this.m_szText = "Azure Toddler7";

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

    mssql.connect(config);

    await this.MyFunc();

    this.m_szText = "Azure Toddler55";
}

sql.prototype.MyFunc = async function ()
{
    return "KOP";
}

sql.prototype.GetText = function ()
{
    return this.m_szText;
}

module.exports = sql;