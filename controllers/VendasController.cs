using MetaFicha.Data;
using MetaFicha.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MetaFicha.Controllers;

[ApiController]
[Route("api/vendas")]
public class VendasController : ControllerBase
{
    private readonly MetaFichaContext _context;

    public VendasController(MetaFichaContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<List<Venda>> Listar()
    {
        return await _context.Vendas.OrderByDescending(venda => venda.DataVenda).ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Venda>> Obter(int id)
    {
        Venda? venda = await _context.Vendas.FindAsync(id);
        if (venda == null)
        {
            return NotFound();
        }

        return Ok(venda);
    }

    [HttpPost]
    public async Task<ActionResult<Venda>> Criar(Venda venda)
    {
        venda.Id = 0;
        if (venda.UsuarioId == 0)
        {
            venda.UsuarioId = 1;
        }

        if (string.IsNullOrWhiteSpace(venda.DataCriacao))
        {
            venda.DataCriacao = DateTime.UtcNow.ToString("yyyy-MM-dd");
        }

        _context.Vendas.Add(venda);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(Obter), new { id = venda.Id }, venda);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<Venda>> Atualizar(int id, Venda venda)
    {
        if (id != venda.Id)
        {
            return BadRequest();
        }

        bool existe = await _context.Vendas.AnyAsync(item => item.Id == id);
        if (!existe)
        {
            return NotFound();
        }

        _context.Entry(venda).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return Ok(venda);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int id)
    {
        Venda? venda = await _context.Vendas.FindAsync(id);
        if (venda == null)
        {
            return NotFound();
        }

        _context.Vendas.Remove(venda);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
