using Microsoft.Data.Sqlite;

namespace MetaFlow.Data;

public static class Database
{
    public static void CriarBanco(string connectionString)
    {
        using var conexao = new SqliteConnection(connectionString);
        conexao.Open();
        using var comando = conexao.CreateCommand();
        comando.CommandText = """
            CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, email TEXT NOT NULL UNIQUE, senha TEXT NOT NULL, data_cadastro TEXT DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS metas (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER NOT NULL, valor_meta REAL NOT NULL, mes INTEGER, ano INTEGER, nome TEXT NOT NULL DEFAULT '', quantidade_vendas_meta INTEGER NOT NULL DEFAULT 0, data_inicio TEXT NOT NULL DEFAULT '', data_fim TEXT NOT NULL DEFAULT '');
            CREATE TABLE IF NOT EXISTS vendas (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER NOT NULL, valor REAL NOT NULL, comissao REAL DEFAULT 0, descricao TEXT, data_venda TEXT DEFAULT CURRENT_TIMESTAMP, meta_id INTEGER NOT NULL DEFAULT 0, cliente TEXT NOT NULL DEFAULT '', produto TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'concluida', observacoes TEXT, data_criacao TEXT NOT NULL DEFAULT '');
            """;
        comando.ExecuteNonQuery();
        foreach (var sql in new[] { "ALTER TABLE metas ADD COLUMN nome TEXT NOT NULL DEFAULT ''", "ALTER TABLE metas ADD COLUMN quantidade_vendas_meta INTEGER NOT NULL DEFAULT 0", "ALTER TABLE metas ADD COLUMN data_inicio TEXT NOT NULL DEFAULT ''", "ALTER TABLE metas ADD COLUMN data_fim TEXT NOT NULL DEFAULT ''", "ALTER TABLE vendas ADD COLUMN meta_id INTEGER NOT NULL DEFAULT 0", "ALTER TABLE vendas ADD COLUMN cliente TEXT NOT NULL DEFAULT ''", "ALTER TABLE vendas ADD COLUMN produto TEXT NOT NULL DEFAULT ''", "ALTER TABLE vendas ADD COLUMN status TEXT NOT NULL DEFAULT 'concluida'", "ALTER TABLE vendas ADD COLUMN observacoes TEXT", "ALTER TABLE vendas ADD COLUMN data_criacao TEXT NOT NULL DEFAULT ''" })
            try { comando.CommandText = sql; comando.ExecuteNonQuery(); } catch (SqliteException) { }
        comando.CommandText = "SELECT COUNT(*) FROM usuarios WHERE id = 1";
        var existe = (long)comando.ExecuteScalar()! > 0;
        comando.CommandText = existe
            ? "UPDATE usuarios SET nome=$nome, email=$email, senha=$senha WHERE id=1 AND (senha='' OR senha IS NULL)"
            : "INSERT INTO usuarios (id,nome,email,senha) VALUES (1,$nome,$email,$senha)";
        comando.Parameters.AddWithValue("$nome", "Administrador");
        comando.Parameters.AddWithValue("$email", "admin@metaflow.local");
        comando.Parameters.AddWithValue("$senha", PasswordHelper.CriarHash("Admin@123"));
        comando.ExecuteNonQuery();
    }
}
