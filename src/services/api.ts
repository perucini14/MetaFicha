// ============================================================
// CAMADA DE SERVIÇOS / API
// ------------------------------------------------------------
// Hoje: usa dados mockados em memória (mock-data.ts).
// Futuro: basta trocar USE_MOCK para false e apontar API_BASE_URL
// para a API REST em ASP.NET Core. Os endpoints já seguem o
// contrato previsto:
//
//   GET    /api/metas          -> listarMetas()
//   POST   /api/metas          -> criarMeta()
//   PUT    /api/metas/{id}     -> atualizarMeta()
//   DELETE /api/metas/{id}     -> excluirMeta()
//   GET    /api/vendas         -> listarVendas()
//   POST   /api/vendas         -> criarVenda()
//   PUT    /api/vendas/{id}    -> atualizarVenda()
//   DELETE /api/vendas/{id}    -> excluirVenda()
//   GET    /api/dashboard      -> indicadores calculados no backend
//   GET    /api/relatorios     -> agregações para gráficos
//
// Os componentes nunca acessam o mock diretamente.
// ============================================================

import type { Meta, Usuario, Venda } from "@/lib/types";
import { mockMetas, mockUsuario, mockVendas } from "./mock-data";

const USE_MOCK = false;
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

// Estado em memória (apenas modo mock)
let metasDb: Meta[] = [...mockMetas];
let vendasDb: Venda[] = [...mockVendas];
let nextMetaId = metasDb.length + 1;
let nextVendaId = vendasDb.length + 1;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`Erro na API: ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---------- Usuário ----------

export async function getUsuario(): Promise<Usuario> {
  if (USE_MOCK) return mockUsuario;
  return request<Usuario>("/usuarios/me");
}

// ---------- Metas ----------

export async function listarMetas(): Promise<Meta[]> {
  if (USE_MOCK) return [...metasDb];
  return request<Meta[]>("/metas");
}

export async function criarMeta(data: Omit<Meta, "id" | "usuarioId">): Promise<Meta> {
  if (USE_MOCK) {
    const meta: Meta = { ...data, id: nextMetaId++, usuarioId: mockUsuario.id };
    metasDb = [...metasDb, meta];
    return meta;
  }
  return request<Meta>("/metas", { method: "POST", body: JSON.stringify(data) });
}

export async function atualizarMeta(id: number, data: Partial<Meta>): Promise<Meta> {
  if (USE_MOCK) {
    metasDb = metasDb.map((m) => (m.id === id ? { ...m, ...data, id } : m));
    return metasDb.find((m) => m.id === id)!;
  }
  const atual = await request<Meta>(`/metas/${id}`);
  return request<Meta>(`/metas/${id}`, { method: "PUT", body: JSON.stringify({ ...atual, ...data, id }) });
}

export async function excluirMeta(id: number): Promise<void> {
  if (USE_MOCK) {
    metasDb = metasDb.filter((m) => m.id !== id);
    vendasDb = vendasDb.filter((v) => v.metaId !== id);
    return;
  }
  await request<void>(`/metas/${id}`, { method: "DELETE" });
}

// ---------- Vendas ----------

export async function listarVendas(): Promise<Venda[]> {
  if (USE_MOCK) return [...vendasDb];
  return request<Venda[]>("/vendas");
}

export async function criarVenda(data: Omit<Venda, "id" | "usuarioId" | "dataCriacao">): Promise<Venda> {
  if (USE_MOCK) {
    const venda: Venda = {
      ...data,
      id: nextVendaId++,
      usuarioId: mockUsuario.id,
      dataCriacao: new Date().toISOString().slice(0, 10),
    };
    vendasDb = [venda, ...vendasDb];
    return venda;
  }
  return request<Venda>("/vendas", { method: "POST", body: JSON.stringify(data) });
}

export async function atualizarVenda(id: number, data: Partial<Venda>): Promise<Venda> {
  if (USE_MOCK) {
    vendasDb = vendasDb.map((v) => (v.id === id ? { ...v, ...data, id } : v));
    return vendasDb.find((v) => v.id === id)!;
  }
  const atual = await request<Venda>(`/vendas/${id}`);
  return request<Venda>(`/vendas/${id}`, { method: "PUT", body: JSON.stringify({ ...atual, ...data, id }) });
}

export async function excluirVenda(id: number): Promise<void> {
  if (USE_MOCK) {
    vendasDb = vendasDb.filter((v) => v.id !== id);
    return;
  }
  await request<void>(`/vendas/${id}`, { method: "DELETE" });
}
