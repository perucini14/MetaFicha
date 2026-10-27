# MetaFlow

Projeto acadêmico de controle de metas e vendas. O front-end é React/TypeScript; a API é ASP.NET Core/C#; os dados ficam no SQLite `meta_ficha.db` (nome do arquivo preservado para manter os dados existentes).

## Executar

No primeiro terminal, nesta pasta, inicie a API:

```sh
dotnet run --project MetaFlow.csproj --urls http://localhost:5000
```

No segundo terminal, também nesta pasta, inicie o site:

```sh
npm install
npm run dev
```

Abra o endereço indicado pelo Vite. Login inicial: `admin@metaflow.local` / `Admin@123`. O administrador é criado no banco na primeira execução; a senha é armazenada como hash PBKDF2. Troque a senha de demonstração antes de usar o sistema fora da apresentação.

## Para a defesa do código

- **POO:** `Usuario`, `Meta` e `Venda` são classes com propriedades; `MetaFlowContext` é uma classe derivada de `DbContext`; `PasswordHelper` concentra a regra de senha.
- **MVC:** `Models/` contém as entidades; `controllers/` contém os controllers da API; `src/` é a camada visual em React.
- **Minimal API:** as rotas `/api/login` e `/api/logout` são definidas diretamente em `Program.cs`.
- **Banco:** `data/MetaFlowContext.cs` mapeia as entidades com Entity Framework; `data/database.cs` prepara o SQLite e o administrador.
- **Sessão:** após login, o servidor envia um cookie HTTP Only. Os controllers exigem autenticação. O botão Sair encerra a sessão e volta à tela de login.

As rotas de metas e vendas permitem listar, obter, criar, atualizar e excluir registros. O front-end chama a API real em `src/services/api.ts`.
