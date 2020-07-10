const mssql = require('mssql');

function sql()
{
    this.m_szText = "Azure Teen";
}

sql.prototype.GetText = function ()
{
    return this.m_szText;
}

module.exports = sql;