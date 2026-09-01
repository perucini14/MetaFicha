// Entidades — espelham a estrutura do futuro banco SQL (seção 20 do escopo)

export type StatusVenda = "concluida" | "cancelada";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export interface Meta {
  id: number;
  usuarioId: number;
  nome: string;
  valorMeta: number;
  quantidadeVendasMeta: number;
  dataInicio: string; // ISO yyyy-mm-dd
  dataFim: string;
}

export interface Venda {
  id: number;
  usuarioId: number;
  metaId: number;
  cliente: string;
  produto: string;
  valor: number;
  dataVenda: string; // ISO yyyy-mm-dd
  status: StatusVenda;
  observacoes?: string | undefined;
  dataCriacao: string;
}

export type Periodo = "hoje" | "semana" | "mes" | "ano" | "todas";
