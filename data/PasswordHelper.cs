using System.Security.Cryptography;

namespace MetaFlow.Data;

public static class PasswordHelper
{
    public static string CriarHash(string senha)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = Rfc2898DeriveBytes.Pbkdf2(senha, salt, 100_000, HashAlgorithmName.SHA256, 32);
        return $"{Convert.ToBase64String(salt)}:{Convert.ToBase64String(hash)}";
    }

    public static bool Verificar(string senha, string armazenado)
    {
        var partes = armazenado.Split(':');
        if (partes.Length != 2) return false;
        try
        {
            var salt = Convert.FromBase64String(partes[0]);
            var hash = Convert.FromBase64String(partes[1]);
            var recebido = Rfc2898DeriveBytes.Pbkdf2(senha, salt, 100_000, HashAlgorithmName.SHA256, 32);
            return CryptographicOperations.FixedTimeEquals(hash, recebido);
        }
        catch (FormatException) { return false; }
    }
}
