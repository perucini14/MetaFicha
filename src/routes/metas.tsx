import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Pencil, Plus, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { calcularIndicadores, statusMeta } from "@/lib/calculos";
import { formatBRL, formatData } from "@/lib/format";
import type { Meta } from "@/lib/types";
import { Badge, BotaoPrimario, Card, PageHeader, ProgressBar } from "@/components/ui";
import { MetaModal } from "@/components/MetaModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export const Route = createFileRoute("/metas")({
  head: () => ({
    meta: [
      { title: "Minhas Metas — MetaFlow" },
      { name: "description", content: "Gerencie suas metas financeiras e acompanhe seus resultados de vendas." },
      { property: "og:title", content: "Minhas Metas — MetaFlow" },
      { property: "og:description", content: "Gerencie suas metas financeiras e acompanhe seus resultados." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MinhasMetas,
});

const statusConfig = {
  ativa: { label: "Ativa", tone: "roxo" as const },
  atingida: { label: "Atingida", tone: "verde" as const },
  encerrada: { label: "Encerrada", tone: "cinza" as const },
};

function MinhasMetas() {
  const { metas, vendas, excluirMeta } = useStore();
  const [modalAberto, setModalAberto] = useState(false);
  const [metaEdicao, setMetaEdicao] = useState<Meta | null>(null);
  const [metaExcluir, setMetaExcluir] = useState<Meta | null>(null);

  return (
    <div>
      <PageHeader
        title="Minhas Metas"
        subtitle="Gerencie suas metas financeiras e acompanhe seus resultados."
        action={
          <BotaoPrimario onClick={() => { setMetaEdicao(null); setModalAberto(true); }}>
            <Plus className="h-4 w-4" /> Nova Meta
          </BotaoPrimario>
        }
      />

      {metas.length === 0 && (
        <Card className="py-16 text-center">
          <p className="text-muted-foreground">Nenhuma meta cadastrada. Crie sua primeira meta de vendas!</p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {metas.map((meta) => {
          const vendasMeta = vendas.filter((v) => v.metaId === meta.id);
          const ind = calcularIndicadores(vendasMeta, meta);
          const status = statusMeta(meta, vendas);
          const cfg = statusConfig[status];

          return (
            <Card key={meta.id} className={status === "atingida" ? "border-success/40" : ""}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-foreground">{meta.nome}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatData(meta.dataInicio)} — {formatData(meta.dataFim)}
                  </p>
                </div>
                <Badge tone={cfg.tone}>{cfg.label}</Badge>
              </div>

              {status === "atingida" && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-xs font-semibold text-success">
                  <Trophy className="h-4 w-4" /> Parabéns! Você atingiu sua meta! 🎉
                </div>
              )}

              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Meta</p>
                  <p className="mt-0.5 font-bold text-foreground">{formatBRL(meta.valorMeta)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vendido</p>
                  <p className="mt-0.5 font-bold text-primary">{formatBRL(ind.totalVendido)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Falta</p>
                  <p className="mt-0.5 font-bold text-foreground">{formatBRL(ind.valorRestante)}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Vendas: <strong className="text-foreground">{ind.quantidadeVendas} / {meta.quantidadeVendasMeta}</strong>
                  </span>
                  <span className={`font-bold ${ind.atingida ? "text-success" : "text-primary"}`}>
                    {ind.percentualMeta.toFixed(0)}%{ind.percentualMeta > 100 ? " da meta atingida" : ""}
                  </span>
                </div>
                <ProgressBar percentual={ind.percentualMeta} atingida={ind.atingida} />
              </div>

              <div className="mt-5 flex gap-2 border-t border-border pt-4">
                <button
                  onClick={() => { setMetaEdicao(meta); setModalAberto(true); }}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  <Pencil className="h-3.5 w-3.5" /> Editar
                </button>
                <button
                  onClick={() => setMetaExcluir(meta)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Excluir
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <MetaModal aberto={modalAberto} onFechar={() => setModalAberto(false)} meta={metaEdicao} />
      <ConfirmDialog
        aberto={!!metaExcluir}
        onFechar={() => setMetaExcluir(null)}
        onConfirmar={async () => {
          await excluirMeta(metaExcluir!.id);
          toast.success("Meta excluída com sucesso!");
        }}
        titulo="Excluir meta"
        mensagem="Tem certeza que deseja excluir esta meta? As vendas vinculadas a ela também serão removidas."
      />
    </div>
  );
}
