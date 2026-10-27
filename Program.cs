using Microsoft.EntityFrameworkCore;
using MetaFlow.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

Database.CriarBanco(builder.Configuration.GetConnectionString("DefaultConnection")!);

builder.Services.AddControllers();

builder.Services.AddDbContext<MetaFlowContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);


builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
{
    options.Cookie.Name = "MetaFlow.Session";
    options.Events.OnRedirectToLogin = context => { context.Response.StatusCode = 401; return Task.CompletedTask; };
});
builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .SetIsOriginAllowed(origin => Uri.TryCreate(origin, UriKind.Absolute, out var uri)
                && uri.Scheme == "http" && (uri.Host == "localhost" || uri.Host == "127.0.0.1"))
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

// Minimal API para login e logout; os controllers cuidam dos dados.
app.MapPost("/api/login", async (LoginRequest dados, MetaFlowContext db, HttpContext http) =>
{
    var usuario = await db.Usuarios.SingleOrDefaultAsync(u => u.Email == dados.Email);
    if (usuario is null || !PasswordHelper.Verificar(dados.Senha, usuario.Senha)) return Results.Unauthorized();
    var claims = new[] { new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()), new Claim(ClaimTypes.Name, usuario.Nome) };
    await http.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme)));
    return Results.Ok(new { usuario.Id, usuario.Nome, usuario.Email });
});
app.MapPost("/api/logout", async (HttpContext http) =>
{
    await http.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.NoContent();
}).RequireAuthorization();

app.MapControllers();

app.Run();

record LoginRequest(string Email, string Senha);
