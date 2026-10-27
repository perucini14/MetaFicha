import type { Meta, Usuario, Venda } from "@/lib/types";

const API_BASE_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:5000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`Erro na API: ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const login = (email: string, senha: string) => request<Usuario>("/login", { method: "POST", body: JSON.stringify({ email, senha }) });
export const logout = () => request<void>("/logout", { method: "POST" });
export const getUsuario = () => request<Usuario>("/usuarios/me");
export const listarMetas = () => request<Meta[]>("/metas");
export const criarMeta = (data: Omit<Meta, "id" | "usuarioId">) => request<Meta>("/metas", { method: "POST", body: JSON.stringify(data) });
export async function atualizarMeta(id: number, data: Partial<Meta>) {
  const atual = await request<Meta>(`/metas/${id}`);
  return request<Meta>(`/metas/${id}`, { method: "PUT", body: JSON.stringify({ ...atual, ...data, id }) });
}
export const excluirMeta = (id: number) => request<void>(`/metas/${id}`, { method: "DELETE" });
export const listarVendas = () => request<Venda[]>("/vendas");
export const criarVenda = (data: Omit<Venda, "id" | "usuarioId" | "dataCriacao">) => request<Venda>("/vendas", { method: "POST", body: JSON.stringify(data) });
export async function atualizarVenda(id: number, data: Partial<Venda>) {
  const atual = await request<Venda>(`/vendas/${id}`);
  return request<Venda>(`/vendas/${id}`, { method: "PUT", body: JSON.stringify({ ...atual, ...data, id }) });
}
export const excluirVenda = (id: number) => request<void>(`/vendas/${id}`, { method: "DELETE" });
