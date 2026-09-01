import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { CircleDollarSign, Percent, ReceiptText, ShoppingCart } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { useStore } from "@/lib/store";
import { calcularIndicadores, vendasConcluidas } from "@/lib/calculos";
import { formatBRL, formatData } from "@/lib/format";
import type { Venda } from "@/lib/types";
import { Card, PageHeader } from "@/components/ui";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — Controle de Metas" },
      { name: "description", content: "Relatórios de vendas: faturamento por dia, semana e mês, meta x realizado." },
      { property: "og:title", content: "Relatórios — Controle de Metas" },
      { property: "og:description", content: "Relatórios e gráficos de desempenho de vendas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RelatoriosPage,
});

const ROXO = "oklch(0.52 0.22 277)";
const VERDE = "oklch(0.66 0.17 155)";
const LILAS = "oklch(0.7 0.15 300)";

function semanaISO(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const dia = d.getDay() || 7;
  d.setDate(d.getDate() - dia + 1);
  return d.toISOString().slice(0, 10);
}

function mesISO(iso: string): string {
  return iso.slice(0, 7);
}

function agregar(vendas: Venda[], chave: (iso: string) => string, rotulo: (k: string) => string) {
  const mapa = new Map<string, { valor: number; quantidade: number }>();
  for (const v of vendasConcluidas(vendas)) {
    const k = chave(v.dataVenda);
    const atual = mapa.get(k) ?? { valor: 0, quantidade: 0 };
    atual.valor += v.valor;
    atual.quantidade += 1;
    mapa.set(k, atual);
  }
  return [...mapa.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, d]) => ({ nome: rotulo(k), valor: d.valor, quantidade: d.quantidade }));
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <h2 className="mb-4 text-base font-bold text-foreground">{title}</h2>
      <div className="h-64">{children}</div>
    </Card>
  );
}

const tooltipStyle = { borderRadius: 12, border: "1px solid oklch(0.91 0.015 277)", fontSize: 13 };
const axisTick = { fontSize: 11, fill: "oklch(0.52 0.03 277)" };

function RelatoriosPage() {
  const { vendas, metaAtiva } = useStore();
  const ind = useMemo(() => calcularIndicadores(vendas, metaAtiva), [vendas, metaAtiva]);

  const porDia = useMemo(() => agregar(vendas, (d) => d, (k) => formatData(k).slice(0, 5)), [vendas]);
  const porSemana = useMemo(() => agregar(vendas, semanaISO, (k) => `Sem. ${formatData(k).slice(0, 5)}`), [vendas]);
  const porMes = useMemo(
    () =>
      agregar(vendas, mesISO, (k) => {
        const [y = "", m = "1"] = k.split("-");
        const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        return `${meses[Number(m) - 1]}/${y.slice(2)}`;
      }),
    [vendas]
  );

  const metaXRealizado = [
    { nome: "Meta", valor: metaAtiva?.valorMeta ?? 0 },
    { nome: "Realizado", valor: ind.totalVendido },
  ];

  const cards = [
    { titulo: "Total Vendido", valor: formatBRL(ind.totalVendido), icon: CircleDollarSign },
    { titulo: "Quantidade de Vendas", valor: String(ind.quantidadeVendas), icon: ShoppingCart },
    { titulo: "Ticket Médio", valor: formatBRL(ind.ticketMedio), icon: ReceiptText },
    { titulo: "Percentual da Meta", valor: `${ind.percentualMeta.toFixed(1)}%`, icon: Percent },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Relatórios" subtitle="Análise detalhada do desempenho das suas vendas." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.titulo}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{c.titulo}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{c.valor}</p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <c.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Vendas por Dia">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={porDia} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.015 277)" vertical={false} />
              <XAxis dataKey="nome" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} width={70} tickFormatter={(v: number) => `R$ ${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [formatBRL(Number(v)), "Vendido"]} contentStyle={tooltipStyle} />
              <Bar dataKey="valor" fill={ROXO} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vendas por Semana">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={porSemana} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.015 277)" vertical={false} />
              <XAxis dataKey="nome" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} width={70} tickFormatter={(v: number) => `R$ ${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [formatBRL(Number(v)), "Vendido"]} contentStyle={tooltipStyle} />
              <Bar dataKey="valor" fill={LILAS} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vendas por Mês">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={porMes} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.015 277)" vertical={false} />
              <XAxis dataKey="nome" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} width={70} tickFormatter={(v: number) => `R$ ${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [formatBRL(Number(v)), "Vendido"]} contentStyle={tooltipStyle} />
              <Bar dataKey="valor" fill={VERDE} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Meta x Realizado">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metaXRealizado} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.015 277)" vertical={false} />
              <XAxis dataKey="nome" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} width={70} tickFormatter={(v: number) => `R$ ${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [formatBRL(Number(v)), "Valor"]} contentStyle={tooltipStyle} />
              <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                <Cell fill={LILAS} />
                <Cell fill={ROXO} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Quantidade de Vendas">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={porDia} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.015 277)" vertical={false} />
              <XAxis dataKey="nome" tick={axisTick} tickLine={false} axisLine={false} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} width={40} />
              <Tooltip formatter={(v) => [`${v} vendas`, "Quantidade"]} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="quantidade" name="Vendas concluídas" stroke={ROXO} strokeWidth={2.5} dot={{ r: 4, fill: ROXO }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
