using MetaFlow.Models;
using Microsoft.EntityFrameworkCore;

namespace MetaFlow.Data;

public class MetaFlowContext(DbContextOptions<MetaFlowContext> options) : DbContext(options)
{
    public DbSet<Meta> Metas => Set<Meta>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Venda> Vendas => Set<Venda>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>(e => { e.ToTable("usuarios"); e.HasKey(x => x.Id); e.Property(x => x.Id).HasColumnName("id"); e.Property(x => x.Nome).HasColumnName("nome"); e.Property(x => x.Email).HasColumnName("email"); e.Property(x => x.Senha).HasColumnName("senha"); e.Property(x => x.DataCadastro).HasColumnName("data_cadastro"); });
        modelBuilder.Entity<Meta>(e => { e.ToTable("metas"); e.HasKey(x => x.Id); e.Property(x => x.Id).HasColumnName("id"); e.Property(x => x.UsuarioId).HasColumnName("usuario_id"); e.Property(x => x.Nome).HasColumnName("nome"); e.Property(x => x.ValorMeta).HasColumnName("valor_meta"); e.Property(x => x.Mes).HasColumnName("mes"); e.Property(x => x.Ano).HasColumnName("ano"); e.Property(x => x.QuantidadeVendasMeta).HasColumnName("quantidade_vendas_meta"); e.Property(x => x.DataInicio).HasColumnName("data_inicio"); e.Property(x => x.DataFim).HasColumnName("data_fim"); });
        modelBuilder.Entity<Venda>(e => { e.ToTable("vendas"); e.HasKey(x => x.Id); e.Property(x => x.Id).HasColumnName("id"); e.Property(x => x.UsuarioId).HasColumnName("usuario_id"); e.Property(x => x.MetaId).HasColumnName("meta_id"); e.Property(x => x.Cliente).HasColumnName("cliente"); e.Property(x => x.Produto).HasColumnName("produto"); e.Property(x => x.Valor).HasColumnName("valor"); e.Property(x => x.DataVenda).HasColumnName("data_venda"); e.Property(x => x.Status).HasColumnName("status"); e.Property(x => x.Observacoes).HasColumnName("observacoes"); e.Property(x => x.DataCriacao).HasColumnName("data_criacao"); });
    }
}
