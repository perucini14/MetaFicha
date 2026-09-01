using System;
using System.Collections.Generic;

namespace MetaFicha.Models;

public partial class Meta
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }

    public double ValorMeta { get; set; }

    public int Mes { get; set; }

    public int Ano { get; set; }

    public virtual Usuario Usuario { get; set; } = null!;
}
