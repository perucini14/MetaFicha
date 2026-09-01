using Microsoft.AspNetCore.Mvc;

namespace MetaFicha.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TesteController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            mensagem = "API MetaFicha funcionando!"
        });
    }
}