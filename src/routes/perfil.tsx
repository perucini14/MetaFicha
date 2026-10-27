import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { CircleDollarSign, GraduationCap, Mail, Percent, ShoppingCart, Trophy, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { calcularIndicadores, statusMeta } from "@/lib/calculos";
import { formatBRL } from "@/lib/format";
import { Card, PageHeader } from "@/components/ui";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — MetaFlow" },
      { name: "description", content: "Perfil do usuário e informações sobre o projeto acadêmico MetaFlow." },
      { property: "og:title", content: "Perfil — MetaFlow" },
      { property: "og:description", content: "Perfil do usuário e resumo de desempenho em vendas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PerfilPage,
});

const equipe = [
  { nome: "Lucas Minosso", papel: "Scrum Master / Back-end" },
  { nome: "Gabriel", papel: "Front-end" },
  { nome: "Bernardo", papel: "Banco de Dados" },
  { nome: "Felipe Mello", papel: "Back-end" },
];

function PerfilPage() {
  const { usuario, metas, vendas, metaAtiva } = useStore();

  const resumo = useMemo(() => {
    const ind = calcularIndicadores(vendas, metaAtiva);
    const metasAtingidas = metas.filter((m) => statusMeta(m, vendas) === "atingida").length;
    const atingimentoMedio =
      metas.length > 0
        ? metas.reduce((s, m) => {
            const vm = vendas.filter((v) => v.metaId === m.id);
            return s + calcularIndicadores(vm, m).percentualMeta;
          }, 0) / metas.length
        : 0;
    return { ...ind, metasAtingidas, atingimentoMedio };
  }, [vendas, metas, metaAtiva]);

  const stats = [
    { label: "Total de vendas", valor: String(resumo.quantidadeVendas), icon: ShoppingCart },
    { label: "Valor vendido", valor: formatBRL(resumo.totalVendido), icon: CircleDollarSign },
    { label: "Metas atingidas", valor: String(resumo.metasAtingidas), icon: Trophy },
    { label: "Atingimento médio", valor: `${resumo.atingimentoMedio.toFixed(0)}%`, icon: Percent },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Perfil" subtitle="Suas informações e resumo de desempenho." />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-primary text-3xl font-bold text-primary-foreground">
              {usuario?.nome?.charAt(0) ?? "L"}
            </div>
            <h2 className="mt-4 text-xl font-bold text-foreground">{usuario?.nome ?? "..."}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" /> {usuario?.email ?? ""}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-muted p-3 text-center">
                <s.icon className="mx-auto h-4 w-4 text-primary" />
                <p className="mt-1.5 text-lg font-bold text-foreground">{s.valor}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">Sobre o Projeto</h2>
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-muted p-4">
              <dt className="text-xs font-medium text-muted-foreground">Disciplina</dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">Desenvolvimento de Software Visual</dd>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <dt className="text-xs font-medium text-muted-foreground">Sistema</dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">MetaFlow</dd>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <dt className="text-xs font-medium text-muted-foreground">Objetivo</dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">Controle de metas financeiras relacionadas a vendas</dd>
            </div>
            <div className="rounded-xl bg-muted p-4">
              <dt className="text-xs font-medium text-muted-foreground">Metodologia</dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">Scrum</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Equipe</h3>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {equipe.map((m) => (
              <div key={m.nome} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {m.nome.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{m.nome}</p>
                  <p className="text-xs text-muted-foreground">{m.papel}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
