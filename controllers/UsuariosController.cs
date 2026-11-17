using MetaFicha.Data;
using MetaFicha.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MetaFicha.Controllers;

[ApiController]
[Route("api/usuarios")]
public class UsuariosController : ControllerBase
{
    private readonly MetaFichaContext _context;

    public UsuariosController(MetaFichaContext context)
    {
        _context = context;
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        Usuario? usuario = await _context.Usuarios
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == 1);

        if (usuario == null)
        {
            return NotFound();
        }

        return Ok(new { usuario.Id, usuario.Nome, usuario.Email });
    }
}
