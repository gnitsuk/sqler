function sql()
{
    this.m_szText = "Hello";
}

sql.prototype.GetText = function ()
{
    return this.m_szText;
}

module.exports = sql;