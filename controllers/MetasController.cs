using MetaFicha.Data;
using MetaFicha.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MetaFicha.Controllers;

[ApiController]
[Route("api/metas")]
public class MetasController : ControllerBase
{
    private readonly MetaFichaContext _context;

    public MetasController(MetaFichaContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<List<Meta>> Listar()
    {
        return await _context.Metas.OrderByDescending(meta => meta.DataInicio).ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Meta>> Obter(int id)
    {
        Meta? meta = await _context.Metas.FindAsync(id);
        if (meta == null)
        {
            return NotFound();
        }

        return Ok(meta);
    }

    [HttpPost]
    public async Task<ActionResult<Meta>> Criar(Meta meta)
    {
        Preparar(meta);
        meta.Id = 0;
        if (meta.UsuarioId == 0)
        {
            meta.UsuarioId = 1;
        }

        _context.Metas.Add(meta);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Obter), new { id = meta.Id }, meta);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Meta>> Atualizar(int id, Meta meta)
    {
        if (id != meta.Id)
        {
            return BadRequest();
        }

        bool existe = await _context.Metas.AnyAsync(item => item.Id == id);
        if (!existe)
        {
            return NotFound();
        }

        Preparar(meta);
        _context.Entry(meta).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return Ok(meta);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int id)
    {
        Meta? meta = await _context.Metas.FindAsync(id);
        if (meta == null)
        {
            return NotFound();
        }

        var vendas = await _context.Vendas.Where(venda => venda.MetaId == id).ToListAsync();
        _context.Vendas.RemoveRange(vendas);
        _context.Metas.Remove(meta);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private static void Preparar(Meta meta)
    {
        if (meta.Mes != 0 && meta.Ano != 0)
        {
            return;
        }

        if (!DateTime.TryParse(meta.DataInicio, out DateTime inicio))
        {
            return;
        }

        if (meta.Mes == 0)
        {
            meta.Mes = inicio.Month;
        }

        if (meta.Ano == 0)
        {
            meta.Ano = inicio.Year;
        }
    }
}
