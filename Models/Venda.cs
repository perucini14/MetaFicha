using System;
using System.Collections.Generic;

namespace MetaFicha.Models;

public partial class Venda
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }

    public double Valor { get; set; }

    public double? Comissao { get; set; }

    public string? Descricao { get; set; }

    public string? DataVenda { get; set; }

    public virtual Usuario Usuario { get; set; } = null!;
}
