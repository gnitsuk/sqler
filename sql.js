function sql()
{
    this.m_szText = "Azure Servicer";
}

sql.prototype.GetText = function ()
{
    return this.m_szText;
}

module.exports = sql;