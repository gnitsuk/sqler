//var mysql = require('mysql');

function sql()
{
    this.m_szText = "Az Server";
}

sql.prototype.GetText = function ()
{
    return this.m_szText;
}

module.exports = sql;