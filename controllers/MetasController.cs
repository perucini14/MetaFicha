using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MetaFicha.Data;
using MetaFicha.Models;

namespace MetaFicha.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MetasController : ControllerBase
{
    private readonly MetaFichaContext _context;

    public MetasController(MetaFichaContext context)
    {
        _context = context;
    }


    // GET: api/metas
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Meta>>> GetMetas()
    {
        return await _context.Metas.ToListAsync();
    }


    // GET: api/metas/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Meta>> GetMeta(int id)
    {
        var meta = await _context.Metas.FindAsync(id);

        if (meta == null)
        {
            return NotFound();
        }

        return meta;
    }


    // POST: api/metas
    [HttpPost]
    public async Task<ActionResult<Meta>> CriarMeta(Meta meta)
    {
        _context.Metas.Add(meta);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetMeta),
            new { id = meta.Id },
            meta
        );
    }


    // PUT: api/metas/1
    [HttpPut("{id}")]
    public async Task<IActionResult> AtualizarMeta(
        int id,
        Meta meta
    )
    {
        if (id != meta.Id)
        {
            return BadRequest();
        }

        _context.Entry(meta).State =
            EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MetaExiste(id))
            {
                return NotFound();
            }

            throw;
        }

        return NoContent();
    }


    // DELETE: api/metas/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> ExcluirMeta(int id)
    {
        var meta =
            await _context.Metas.FindAsync(id);

        if (meta == null)
        {
            return NotFound();
        }

        _context.Metas.Remove(meta);

        await _context.SaveChangesAsync();

        return NoContent();
    }


    private bool MetaExiste(int id)
    {
        return _context.Metas.Any(
            e => e.Id == id
        );
    }
}