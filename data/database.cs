using Microsoft.Data.Sqlite;

namespace MetaFicha.Data;

public static class Database
{
    private const string ConnectionString =
        "Data Source=meta_ficha.db";

    public static void CriarBanco()
    {
        using var conexao =
            new SqliteConnection(ConnectionString);

        conexao.Open();

        var comando = conexao.CreateCommand();

        comando.CommandText = @"
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            data_cadastro TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS metas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            valor_meta REAL NOT NULL,
            mes INTEGER NOT NULL,
            ano INTEGER NOT NULL,

            FOREIGN KEY (usuario_id)
                REFERENCES usuarios(id)
                ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            valor REAL NOT NULL,
            comissao REAL DEFAULT 0,
            descricao TEXT,
            data_venda TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (usuario_id)
                REFERENCES usuarios(id)
                ON DELETE CASCADE
        );
        ";

        comando.ExecuteNonQuery();
    }
}