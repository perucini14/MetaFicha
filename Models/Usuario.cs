using System;
using System.Collections.Generic;

namespace MetaFlow.Models;

public partial class Usuario
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Senha { get; set; } = null!;

    public DateTime? DataCadastro { get; set; }

    public virtual ICollection<Meta> Meta { get; set; } = new List<Meta>();

    public virtual ICollection<Venda> Venda { get; set; } = new List<Venda>();
}
