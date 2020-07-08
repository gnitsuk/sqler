function sql()
{
    this.m_szText = "Azure Server";
}

sql.prototype.GetText = function ()
{
    return this.m_szText;
}

module.exports = sql;