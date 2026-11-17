using Microsoft.EntityFrameworkCore;
using MetaFicha.Data;

var builder = WebApplication.CreateBuilder(args);

Database.CriarBanco(builder.Configuration.GetConnectionString("DefaultConnection")!);

builder.Services.AddControllers();

builder.Services.AddDbContext<MetaFichaContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);


builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("Frontend");

app.MapControllers();

app.Run();
