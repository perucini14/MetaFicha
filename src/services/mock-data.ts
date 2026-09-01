// ============================================================
// DADOS DE DEMONSTRAÇÃO (MOCK)
// Estes dados são temporários e existem apenas para demonstrar
// a interface. Serão substituídos pelas respostas da API REST
// em ASP.NET Core. Nada aqui deve ser importado diretamente
// pelos componentes — use sempre src/services/api.ts.
// ============================================================

import type { Meta, Usuario, Venda } from "@/lib/types";

export const mockUsuario: Usuario = {
  id: 1,
  nome: "Lucas Minosso",
  email: "lucas.minosso@email.com",
};

export const mockMetas: Meta[] = [
  {
    id: 1,
    usuarioId: 1,
    nome: "Meta de Vendas — Agosto 2026",
    valorMeta: 50000,
    quantidadeVendasMeta: 50,
    dataInicio: "2026-08-01",
    dataFim: "2026-08-31",
  },
  {
    id: 2,
    usuarioId: 1,
    nome: "Meta de Vendas — Julho 2026",
    valorMeta: 40000,
    quantidadeVendasMeta: 40,
    dataInicio: "2026-07-01",
    dataFim: "2026-07-31",
  },
];

// Vendas concluídas da meta 1 somam R$ 32.500 (65% da meta de R$ 50.000)
export const mockVendas: Venda[] = [
  { id: 1, usuarioId: 1, metaId: 1, cliente: "João Silva", produto: "Plano Premium", valor: 1500, dataVenda: "2026-08-25", status: "concluida", observacoes: "Renovação anual", dataCriacao: "2026-08-25" },
  { id: 2, usuarioId: 1, metaId: 1, cliente: "Maria Souza", produto: "Plano Básico", valor: 800, dataVenda: "2026-08-25", status: "concluida", dataCriacao: "2026-08-25" },
  { id: 3, usuarioId: 1, metaId: 1, cliente: "Carlos Lima", produto: "Plano Premium", valor: 2200, dataVenda: "2026-08-24", status: "concluida", observacoes: "Indicação de cliente", dataCriacao: "2026-08-24" },
  { id: 4, usuarioId: 1, metaId: 1, cliente: "Ana Pereira", produto: "Consultoria", valor: 3500, dataVenda: "2026-08-22", status: "concluida", dataCriacao: "2026-08-22" },
  { id: 5, usuarioId: 1, metaId: 1, cliente: "Pedro Santos", produto: "Plano Básico", valor: 950, dataVenda: "2026-08-21", status: "cancelada", observacoes: "Cliente desistiu", dataCriacao: "2026-08-21" },
  { id: 6, usuarioId: 1, metaId: 1, cliente: "Fernanda Costa", produto: "Plano Empresarial", valor: 6800, dataVenda: "2026-08-19", status: "concluida", dataCriacao: "2026-08-19" },
  { id: 7, usuarioId: 1, metaId: 1, cliente: "Rafael Almeida", produto: "Plano Premium", valor: 1800, dataVenda: "2026-08-15", status: "concluida", dataCriacao: "2026-08-15" },
  { id: 8, usuarioId: 1, metaId: 1, cliente: "Juliana Rocha", produto: "Consultoria", valor: 4200, dataVenda: "2026-08-12", status: "concluida", dataCriacao: "2026-08-12" },
  { id: 9, usuarioId: 1, metaId: 1, cliente: "Bruno Ferreira", produto: "Plano Empresarial", valor: 7500, dataVenda: "2026-08-08", status: "concluida", observacoes: "Contrato de 12 meses", dataCriacao: "2026-08-08" },
  { id: 10, usuarioId: 1, metaId: 1, cliente: "Camila Dias", produto: "Plano Premium", valor: 2400, dataVenda: "2026-08-05", status: "concluida", dataCriacao: "2026-08-05" },
  { id: 11, usuarioId: 1, metaId: 1, cliente: "Diego Martins", produto: "Plano Básico", valor: 1100, dataVenda: "2026-08-03", status: "concluida", dataCriacao: "2026-08-03" },
  { id: 12, usuarioId: 1, metaId: 1, cliente: "Larissa Nunes", produto: "Plano Premium", valor: 700, dataVenda: "2026-08-01", status: "concluida", dataCriacao: "2026-08-01" },
  { id: 13, usuarioId: 1, metaId: 2, cliente: "João Silva", produto: "Plano Premium", valor: 1500, dataVenda: "2026-07-28", status: "concluida", dataCriacao: "2026-07-28" },
  { id: 14, usuarioId: 1, metaId: 2, cliente: "Empresa XYZ", produto: "Plano Empresarial", valor: 9800, dataVenda: "2026-07-15", status: "concluida", dataCriacao: "2026-07-15" },
];
