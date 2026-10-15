using MetaFicha.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace MetaFicha.Controllers;
[ApiController, Route("api/usuarios")]
public class UsuariosController(MetaFichaContext context) : ControllerBase
{
 [HttpGet("me")] public async Task<IActionResult> Me() => await context.Usuarios.AsNoTracking().FirstOrDefaultAsync(x=>x.Id==1) is { } u ? Ok(new {u.Id,u.Nome,u.Email}) : NotFound();
}
