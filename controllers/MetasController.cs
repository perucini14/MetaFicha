using MetaFicha.Data;
using MetaFicha.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace MetaFicha.Controllers;
[ApiController, Route("api/metas")]
public class MetasController(MetaFichaContext context) : ControllerBase
{
 [HttpGet] public Task<List<Meta>> Listar() => context.Metas.OrderByDescending(x => x.DataInicio).ToListAsync();
 [HttpGet("{id:int}")] public async Task<ActionResult<Meta>> Obter(int id) => await context.Metas.FindAsync(id) is { } meta ? Ok(meta) : NotFound();
 [HttpPost] public async Task<ActionResult<Meta>> Criar(Meta meta) { Preparar(meta); meta.Id=0; meta.UsuarioId=meta.UsuarioId==0?1:meta.UsuarioId; context.Metas.Add(meta); await context.SaveChangesAsync(); return CreatedAtAction(nameof(Obter),new {id=meta.Id},meta); }
 [HttpPut("{id:int}")] public async Task<ActionResult<Meta>> Atualizar(int id, Meta meta) { if(id!=meta.Id)return BadRequest(); if(!await context.Metas.AnyAsync(x=>x.Id==id))return NotFound(); Preparar(meta); context.Entry(meta).State=EntityState.Modified; await context.SaveChangesAsync(); return Ok(meta); }
 [HttpDelete("{id:int}")] public async Task<IActionResult> Excluir(int id) { var meta=await context.Metas.FindAsync(id); if(meta is null)return NotFound(); context.Metas.Remove(meta); context.Vendas.RemoveRange(context.Vendas.Where(x=>x.MetaId==id)); await context.SaveChangesAsync(); return NoContent(); }
 private static void Preparar(Meta meta) { if (meta.Mes != 0 && meta.Ano != 0) return; if (DateTime.TryParse(meta.DataInicio, out var inicio)) { meta.Mes = meta.Mes == 0 ? inicio.Month : meta.Mes; meta.Ano = meta.Ano == 0 ? inicio.Year : meta.Ano; } }
}
