function sql()
{
    this.m_szText = "Azure Service";
}

sql.prototype.GetText = function ()
{
    return this.m_szText;
}

module.exports = sql;