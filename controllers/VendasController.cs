using MetaFicha.Data;
using MetaFicha.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace MetaFicha.Controllers;
[ApiController, Route("api/vendas")]
public class VendasController(MetaFichaContext context) : ControllerBase
{
 [HttpGet] public Task<List<Venda>> Listar() => context.Vendas.OrderByDescending(x=>x.DataVenda).ToListAsync();
 [HttpGet("{id:int}")] public async Task<ActionResult<Venda>> Obter(int id) => await context.Vendas.FindAsync(id) is { } venda ? Ok(venda) : NotFound();
 [HttpPost] public async Task<ActionResult<Venda>> Criar(Venda venda) { venda.Id=0; venda.UsuarioId=venda.UsuarioId==0?1:venda.UsuarioId; venda.DataCriacao=string.IsNullOrWhiteSpace(venda.DataCriacao)?DateTime.UtcNow.ToString("yyyy-MM-dd"):venda.DataCriacao; context.Vendas.Add(venda); await context.SaveChangesAsync(); return CreatedAtAction(nameof(Obter),new {id=venda.Id},venda); }
 [HttpPut("{id:int}")] public async Task<ActionResult<Venda>> Atualizar(int id,Venda venda) { if(id!=venda.Id)return BadRequest(); if(!await context.Vendas.AnyAsync(x=>x.Id==id))return NotFound(); context.Entry(venda).State=EntityState.Modified; await context.SaveChangesAsync(); return Ok(venda); }
 [HttpDelete("{id:int}")] public async Task<IActionResult> Excluir(int id) { var venda=await context.Vendas.FindAsync(id); if(venda is null)return NotFound(); context.Vendas.Remove(venda); await context.SaveChangesAsync(); return NoContent(); }
}
