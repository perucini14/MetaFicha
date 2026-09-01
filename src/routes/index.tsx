import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, CircleDollarSign, Percent, ShoppingCart, Target, Trophy } from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useStore } from "@/lib/store";
import { calcularIndicadores, filtrarPorPeriodo, vendasConcluidas } from "@/lib/calculos";
import { formatBRL, formatData } from "@/lib/format";
import type { Periodo } from "@/lib/types";
import { Badge, Card, PageHeader, ProgressBar } from "@/components/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Controle de Metas" },
      { name: "description", content: "Acompanhe suas vendas, faturamento e veja quanto falta para atingir sua meta financeira." },
      { property: "og:title", content: "Dashboard — Controle de Metas" },
      { property: "og:description", content: "Acompanhe suas vendas e veja quanto falta para atingir sua meta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const periodosDashboard: { valor: Periodo; label: string }[] = [
  { valor: "hoje", label: "Hoje" },
  { valor: "semana", label: "Esta semana" },
  { valor: "mes", label: "Este mês" },
  { valor: "ano", label: "Este ano" },
];

function FiltroPeriodo({ periodo, setPeriodo, opcoes }: {
  periodo: Periodo; setPeriodo: (p: Periodo) => void; opcoes: { valor: Periodo; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
      {opcoes.map((o) => (
        <button
          key={o.valor}
          onClick={() => setPeriodo(o.valor)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
            periodo === o.valor ? "bg-card text-primary shadow-card" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function StatCard({ titulo, valor, descricao, icon: Icon }: {
  titulo: string; valor: string; descricao: string; icon: typeof Target;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{titulo}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{valor}</p>
          <p className="mt-1 text-xs text-muted-foreground">{descricao}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </Card>
  );
}

function Dashboard() {
  const { usuario, vendas, metaAtiva } = useStore();
  const [periodo, setPeriodo] = useState<Periodo>("mes");
  const [periodoGrafico, setPeriodoGrafico] = useState<Periodo>("mes");
  const [metrica, setMetrica] = useState<"valor" | "quantidade">("valor");

  const vendasMeta = useMemo(
    () => (metaAtiva ? vendas.filter((v) => v.metaId === metaAtiva.id) : vendas),
    [vendas, metaAtiva]
  );

  const vendasPeriodo = useMemo(() => filtrarPorPeriodo(vendasMeta, periodo), [vendasMeta, periodo]);
  const ind = useMemo(() => calcularIndicadores(vendasPeriodo, metaAtiva), [vendasPeriodo, metaAtiva]);
  // Indicadores gerais da meta (sem filtro de período) para o card de progresso
  const indMeta = useMemo(() => calcularIndicadores(vendasMeta, metaAtiva), [vendasMeta, metaAtiva]);

  const dadosGrafico = useMemo(() => {
    const filtradas = vendasConcluidas(filtrarPorPeriodo(vendasMeta, periodoGrafico));
    const porDia = new Map<string, { valor: number; quantidade: number }>();
    for (const v of filtradas) {
      const atual = porDia.get(v.dataVenda) ?? { valor: 0, quantidade: 0 };
      atual.valor += v.valor;
      atual.quantidade += 1;
      porDia.set(v.dataVenda, atual);
    }
    return [...porDia.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([data, d]) => ({ data: formatData(data).slice(0, 5), valor: d.valor, quantidade: d.quantidade }));
  }, [vendasMeta, periodoGrafico]);

  const recentes = useMemo(
    () => [...vendasMeta].sort((a, b) => b.dataVenda.localeCompare(a.dataVenda)).slice(0, 5),
    [vendasMeta]
  );

  const primeiroNome = usuario?.nome.split(" ")[0] ?? "Lucas";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Olá, ${primeiroNome} 👋`}
        subtitle="Acompanhe suas vendas e veja quanto falta para atingir sua meta."
        action={<FiltroPeriodo periodo={periodo} setPeriodo={setPeriodo} opcoes={periodosDashboard} />}
      />

      {indMeta.atingida && (
        <div className="flex items-center gap-3 rounded-2xl border border-success/30 bg-success/10 p-4 text-success">
          <Trophy className="h-6 w-6 shrink-0" />
          <p className="text-sm font-semibold sm:text-base">Parabéns! Você atingiu sua meta! 🎉</p>
        </div>
      )}

      {/* Cards de indicadores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard titulo="Meta de Vendas" valor={formatBRL(metaAtiva?.valorMeta ?? 0)} descricao="Meta do período" icon={Target} />
        <StatCard titulo="Total Vendido" valor={formatBRL(ind.totalVendido)} descricao="Valor vendido" icon={CircleDollarSign} />
        <StatCard titulo="Vendas Realizadas" valor={String(ind.quantidadeVendas)} descricao="Vendas concluídas" icon={ShoppingCart} />
        <StatCard titulo="Atingimento" valor={`${ind.percentualMeta.toFixed(0)}%`} descricao="Da meta alcançada" icon={Percent} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Progresso da meta */}
        <Card className="xl:col-span-2">
          <h2 className="text-base font-bold text-foreground">Progresso da Meta</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{metaAtiva?.nome ?? "Nenhuma meta ativa"}</p>

          <div className="mt-6 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Vendido</span>
              <span className="text-2xl font-bold text-primary">{formatBRL(indMeta.totalVendido)}</span>
            </div>
            <ProgressBar percentual={indMeta.percentualMeta} atingida={indMeta.atingida} />
            <div className="flex items-center justify-between text-sm">
              <span className={`font-bold ${indMeta.atingida ? "text-success" : "text-foreground"}`}>
                {indMeta.percentualMeta.toFixed(0)}% {indMeta.percentualMeta > 100 && "da meta atingida"}
              </span>
              <span className="text-muted-foreground">Meta: {formatBRL(metaAtiva?.valorMeta ?? 0)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Falta</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">{formatBRL(indMeta.valorRestante)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ticket médio</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">{formatBRL(indMeta.ticketMedio)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vendas</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">
                  {indMeta.quantidadeVendas} <span className="text-sm font-normal text-muted-foreground">/ {metaAtiva?.quantidadeVendasMeta ?? 0}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Qtd. atingida</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">{indMeta.percentualQuantidade.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Desempenho de vendas */}
        <Card className="xl:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-foreground">Desempenho de Vendas</h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-1 rounded-xl bg-muted p-1">
                {([["valor", "Valor vendido"], ["quantidade", "Quantidade"]] as const).map(([m, label]) => (
                  <button
                    key={m}
                    onClick={() => setMetrica(m)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                      metrica === m ? "bg-card text-primary shadow-card" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <FiltroPeriodo
                periodo={periodoGrafico}
                setPeriodo={setPeriodoGrafico}
                opcoes={[
                  { valor: "hoje", label: "Hoje" },
                  { valor: "semana", label: "7 dias" },
                  { valor: "mes", label: "30 dias" },
                  { valor: "ano", label: "Este ano" },
                  { valor: "todas", label: "Tudo" },
                ]}
              />
            </div>
          </div>
          <div className="mt-4 h-64 sm:h-72">
            {dadosGrafico.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Nenhuma venda concluída no período selecionado.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dadosGrafico} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.52 0.22 277)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="oklch(0.52 0.22 277)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.015 277)" vertical={false} />
                  <XAxis dataKey="data" tick={{ fontSize: 11, fill: "oklch(0.52 0.03 277)" }} tickLine={false} axisLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "oklch(0.52 0.03 277)" }} tickLine={false} axisLine={false} width={70}
                    tickFormatter={(v: number) => (metrica === "valor" ? `R$ ${(v / 1000).toFixed(0)}k` : String(v))}
                  />
                  <Tooltip
                    formatter={(v) => [metrica === "valor" ? formatBRL(Number(v)) : `${v} vendas`, metrica === "valor" ? "Valor" : "Quantidade"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.91 0.015 277)", fontSize: 13 }}
                  />
                  <Area type="monotone" dataKey={metrica} stroke="oklch(0.52 0.22 277)" strokeWidth={2.5} fill="url(#gradVendas)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Vendas recentes */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Vendas Recentes</h2>
          <Link to="/vendas" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 pr-4 font-semibold">Cliente</th>
                <th className="pb-3 pr-4 font-semibold">Produto/Serviço</th>
                <th className="pb-3 pr-4 font-semibold">Data</th>
                <th className="pb-3 pr-4 font-semibold">Valor</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentes.map((v) => (
                <tr key={v.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-foreground">{v.cliente}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{v.produto}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{formatData(v.dataVenda)}</td>
                  <td className="py-3 pr-4 font-semibold text-foreground">{formatBRL(v.valor)}</td>
                  <td className="py-3">
                    <Badge tone={v.status === "concluida" ? "verde" : "vermelho"}>
                      {v.status === "concluida" ? "Concluída" : "Cancelada"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
