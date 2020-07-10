function sql()
{
    this.m_szText = "Azure Serve";
}

sql.prototype.GetText = function ()
{
    return this.m_szText;
}

module.exports = sql;