import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { filtrarPorPeriodo } from "@/lib/calculos";
import { formatBRL, formatData } from "@/lib/format";
import type { Periodo, StatusVenda, Venda } from "@/lib/types";
import { Badge, BotaoPrimario, Card, PageHeader, inputClass } from "@/components/ui";
import { VendaModal } from "@/components/VendaModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export const Route = createFileRoute("/vendas")({
  head: () => ({
    meta: [
      { title: "Vendas — MetaFlow" },
      { name: "description", content: "Registre e acompanhe suas vendas, valores e status." },
      { property: "og:title", content: "Vendas — MetaFlow" },
      { property: "og:description", content: "Registre e acompanhe suas vendas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VendasPage,
});

const filtrosPeriodo: { valor: Periodo; label: string }[] = [
  { valor: "todas", label: "Todas" },
  { valor: "hoje", label: "Hoje" },
  { valor: "semana", label: "Esta semana" },
  { valor: "mes", label: "Este mês" },
  { valor: "ano", label: "Este ano" },
];

function VendasPage() {
  const { vendas, excluirVenda } = useStore();
  const [busca, setBusca] = useState("");
  const [periodo, setPeriodo] = useState<Periodo>("todas");
  const [status, setStatus] = useState<"todos" | StatusVenda>("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [vendaEdicao, setVendaEdicao] = useState<Venda | null>(null);
  const [vendaExcluir, setVendaExcluir] = useState<Venda | null>(null);

  const filtradas = useMemo(() => {
    let lista = filtrarPorPeriodo(vendas, periodo);
    if (status !== "todos") lista = lista.filter((v) => v.status === status);
    if (busca.trim()) {
      const q = busca.trim().toLowerCase();
      lista = lista.filter(
        (v) =>
          v.cliente.toLowerCase().includes(q) ||
          v.produto.toLowerCase().includes(q) ||
          String(v.id).includes(q)
      );
    }
    return [...lista].sort((a, b) => b.dataVenda.localeCompare(a.dataVenda));
  }, [vendas, periodo, status, busca]);

  return (
    <div>
      <PageHeader
        title="Vendas"
        subtitle="Registre e acompanhe suas vendas."
        action={
          <BotaoPrimario onClick={() => { setVendaEdicao(null); setModalAberto(true); }}>
            <Plus className="h-4 w-4" /> Nova Venda
          </BotaoPrimario>
        }
      />

      <Card>
        {/* Filtros */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className={`${inputClass} pl-9`}
              placeholder="Buscar cliente ou venda..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
              {filtrosPeriodo.map((f) => (
                <button
                  key={f.valor}
                  onClick={() => setPeriodo(f.valor)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    periodo === f.valor ? "bg-card text-primary shadow-card" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <select
              className="rounded-xl border border-input bg-card px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
            >
              <option value="todos">Todos os status</option>
              <option value="concluida">Concluídas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>
        </div>

        {/* Tabela */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 pr-4 font-semibold">ID</th>
                <th className="pb-3 pr-4 font-semibold">Cliente</th>
                <th className="pb-3 pr-4 font-semibold">Produto/Serviço</th>
                <th className="pb-3 pr-4 font-semibold">Data</th>
                <th className="pb-3 pr-4 font-semibold">Valor</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((v) => (
                <tr key={v.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-4 text-muted-foreground">{String(v.id).padStart(3, "0")}</td>
                  <td className="py-3 pr-4 font-medium text-foreground">{v.cliente}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{v.produto}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{formatData(v.dataVenda)}</td>
                  <td className="py-3 pr-4 font-semibold text-foreground">{formatBRL(v.valor)}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={v.status === "concluida" ? "verde" : "vermelho"}>
                      {v.status === "concluida" ? "Concluída" : "Cancelada"}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => { setVendaEdicao(v); setModalAberto(true); }}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                        title="Editar venda"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setVendaExcluir(v)}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        title="Excluir venda"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    Nenhuma venda encontrada com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <VendaModal aberto={modalAberto} onFechar={() => setModalAberto(false)} venda={vendaEdicao} />
      <ConfirmDialog
        aberto={!!vendaExcluir}
        onFechar={() => setVendaExcluir(null)}
        onConfirmar={async () => {
          await excluirVenda(vendaExcluir!.id);
          toast.success("Venda excluída com sucesso!");
        }}
        titulo="Excluir venda"
        mensagem="Tem certeza que deseja excluir esta venda? Todos os indicadores serão recalculados."
      />
    </div>
  );
}
