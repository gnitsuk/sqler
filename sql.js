const router = express.Router();
const mssql = require('mssql');

function sql()
{
    this.m_szText = "Azure Toddler 999";

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

    mssql.connect(config, this.MyFunc);

    //this.m_szText = "Azure Toddler4";
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