namespace MetaFicha.Models;

public class Venda
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public int MetaId { get; set; }
    public string Cliente { get; set; } = string.Empty;
    public string Produto { get; set; } = string.Empty;
    public double Valor { get; set; }
    public string DataVenda { get; set; } = string.Empty;
    public string Status { get; set; } = "concluida";
    public string? Observacoes { get; set; }
    public string DataCriacao { get; set; } = string.Empty;
}
