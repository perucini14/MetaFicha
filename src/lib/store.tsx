import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Meta, Usuario, Venda } from "./types";
import * as api from "@/services/api";

interface StoreState {
  usuario: Usuario | null;
  metas: Meta[];
  vendas: Venda[];
  metaAtiva: Meta | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
  erro: string | null;
  criarMeta: (data: Omit<Meta, "id" | "usuarioId">) => Promise<void>;
  atualizarMeta: (id: number, data: Partial<Meta>) => Promise<void>;
  excluirMeta: (id: number) => Promise<void>;
  criarVenda: (data: Omit<Venda, "id" | "usuarioId" | "dataCriacao">) => Promise<void>;
  atualizarVenda: (id: number, data: Partial<Venda>) => Promise<void>;
  excluirVenda: (id: number) => Promise<void>;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [metas, setMetas] = useState<Meta[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api.getUsuario().then(async (u) => {
      const [m, v] = await Promise.all([api.listarMetas(), api.listarVendas()]);
      setUsuario(u); setMetas(m); setVendas(v);
    }).catch((e) => { if (!String(e).includes("401")) setErro("Não foi possível conectar à API. Inicie o backend."); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const u = await api.login(email, senha);
    const [m, v] = await Promise.all([api.listarMetas(), api.listarVendas()]);
    setUsuario(u); setMetas(m); setVendas(v); setErro(null);
  }, []);

  const sair = useCallback(async () => {
    await api.logout();
    setUsuario(null); setMetas([]); setVendas([]);
  }, []);

  const criarMeta = useCallback(async (data: Omit<Meta, "id" | "usuarioId">) => {
    const meta = await api.criarMeta(data);
    setMetas((prev) => [...prev, meta]);
  }, []);

  const atualizarMeta = useCallback(async (id: number, data: Partial<Meta>) => {
    const meta = await api.atualizarMeta(id, data);
    setMetas((prev) => prev.map((m) => (m.id === id ? meta : m)));
  }, []);

  const excluirMeta = useCallback(async (id: number) => {
    await api.excluirMeta(id);
    setMetas((prev) => prev.filter((m) => m.id !== id));
    setVendas((prev) => prev.filter((v) => v.metaId !== id));
  }, []);

  const criarVenda = useCallback(async (data: Omit<Venda, "id" | "usuarioId" | "dataCriacao">) => {
    const venda = await api.criarVenda(data);
    setVendas((prev) => [venda, ...prev]);
  }, []);

  const atualizarVenda = useCallback(async (id: number, data: Partial<Venda>) => {
    const venda = await api.atualizarVenda(id, data);
    setVendas((prev) => prev.map((v) => (v.id === id ? venda : v)));
  }, []);

  const excluirVenda = useCallback(async (id: number) => {
    await api.excluirVenda(id);
    setVendas((prev) => prev.filter((v) => v.id !== id));
  }, []);

  // Meta ativa: a mais recente cujo período ainda está vigente (ou a última criada)
  const metaAtiva = useMemo(() => {
    const hoje = new Date().toISOString().slice(0, 10);
    const vigente = metas.find((m) => m.dataInicio <= hoje && m.dataFim >= hoje);
    return vigente ?? metas[metas.length - 1] ?? null;
  }, [metas]);

  const value: StoreState = {
    usuario, metas, vendas, metaAtiva, loading, login, sair, erro,
    criarMeta, atualizarMeta, excluirMeta, criarVenda, atualizarVenda, excluirVenda,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve ser usado dentro de <StoreProvider>");
  return ctx;
}
