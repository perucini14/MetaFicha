using MetaFlow.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace MetaFlow.Controllers;
[Microsoft.AspNetCore.Authorization.Authorize, ApiController, Route("api/usuarios")]
public class UsuariosController(MetaFlowContext context) : ControllerBase
{
 [HttpGet("me")] public async Task<IActionResult> Me() => await context.Usuarios.AsNoTracking().FirstOrDefaultAsync(x=>x.Id==int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value)) is { } u ? Ok(new {u.Id,u.Nome,u.Email}) : NotFound();
}

