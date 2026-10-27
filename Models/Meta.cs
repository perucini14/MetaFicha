namespace MetaFlow.Models;

public class Meta
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public double ValorMeta { get; set; }
    public int Mes { get; set; }
    public int Ano { get; set; }
    public int QuantidadeVendasMeta { get; set; }
    public string DataInicio { get; set; } = string.Empty;
    public string DataFim { get; set; } = string.Empty;
}
