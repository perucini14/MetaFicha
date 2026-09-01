import type { Meta, Periodo, Venda } from "./types";

// Regra de negócio: somente vendas "concluida" entram no faturamento.
export function vendasConcluidas(vendas: Venda[]): Venda[] {
  return vendas.filter((v) => v.status === "concluida");
}

export function filtrarPorPeriodo(vendas: Venda[], periodo: Periodo): Venda[] {
  if (periodo === "todas") return vendas;
  const hoje = new Date();
  const hojeStr = hoje.toISOString().slice(0, 10);

  return vendas.filter((v) => {
    const d = new Date(v.dataVenda + "T00:00:00");
    if (periodo === "hoje") return v.dataVenda === hojeStr;
    if (periodo === "semana") {
      const inicio = new Date(hoje);
      inicio.setDate(hoje.getDate() - 6);
      return d >= new Date(inicio.toISOString().slice(0, 10)) && d <= hoje;
    }
    if (periodo === "mes") {
      return d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear();
    }
    // ano
    return d.getFullYear() === hoje.getFullYear();
  });
}

export interface Indicadores {
  totalVendido: number;
  quantidadeVendas: number;
  ticketMedio: number;
  percentualMeta: number; // pode passar de 100
  valorRestante: number; // nunca negativo
  percentualQuantidade: number;
  atingida: boolean;
}

export function calcularIndicadores(vendas: Venda[], meta: Meta | null): Indicadores {
  const concluidas = vendasConcluidas(vendas);
  const totalVendido = concluidas.reduce((s, v) => s + v.valor, 0);
  const quantidadeVendas = concluidas.length;
  const valorMeta = meta?.valorMeta ?? 0;
  const qtdMeta = meta?.quantidadeVendasMeta ?? 0;

  return {
    totalVendido,
    quantidadeVendas,
    ticketMedio: quantidadeVendas > 0 ? totalVendido / quantidadeVendas : 0,
    percentualMeta: valorMeta > 0 ? (totalVendido / valorMeta) * 100 : 0,
    valorRestante: Math.max(valorMeta - totalVendido, 0),
    percentualQuantidade: qtdMeta > 0 ? (quantidadeVendas / qtdMeta) * 100 : 0,
    atingida: valorMeta > 0 && totalVendido >= valorMeta,
  };
}

export type StatusMeta = "ativa" | "atingida" | "encerrada";

export function statusMeta(meta: Meta, vendas: Venda[]): StatusMeta {
  const ind = calcularIndicadores(vendas.filter((v) => v.metaId === meta.id), meta);
  if (ind.atingida) return "atingida";
  const hoje = new Date().toISOString().slice(0, 10);
  if (meta.dataFim < hoje) return "encerrada";
  return "ativa";
}
