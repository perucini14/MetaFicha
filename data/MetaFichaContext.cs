using System;
using System.Collections.Generic;
using MetaFicha.Models;
using Microsoft.EntityFrameworkCore;

namespace MetaFicha.Data;

public partial class MetaFichaContext : DbContext
{
    public MetaFichaContext()
    {
    }

    public MetaFichaContext(DbContextOptions<MetaFichaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Meta> Metas { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<Venda> Vendas { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlite("Data Source=meta_ficha.db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Meta>(entity =>
        {
            entity.ToTable("metas");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Ano).HasColumnName("ano");
            entity.Property(e => e.Mes).HasColumnName("mes");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");
            entity.Property(e => e.ValorMeta).HasColumnName("valor_meta");

            entity.HasOne(d => d.Usuario).WithMany(p => p.Meta).HasForeignKey(d => d.UsuarioId);
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("usuarios");

            entity.HasIndex(e => e.Email, "IX_usuarios_email").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DataCadastro)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("data_cadastro");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Nome).HasColumnName("nome");
            entity.Property(e => e.Senha).HasColumnName("senha");
        });

        modelBuilder.Entity<Venda>(entity =>
        {
            entity.ToTable("vendas");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Comissao)
                .HasDefaultValue(0.0)
                .HasColumnName("comissao");
            entity.Property(e => e.DataVenda)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnName("data_venda");
            entity.Property(e => e.Descricao).HasColumnName("descricao");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");
            entity.Property(e => e.Valor).HasColumnName("valor");

            entity.HasOne(d => d.Usuario).WithMany(p => p.Venda).HasForeignKey(d => d.UsuarioId);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
