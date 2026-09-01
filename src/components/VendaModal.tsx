import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { StatusVenda, Venda } from "@/lib/types";
import { BotaoPrimario, BotaoSecundario, Campo, Modal, inputClass } from "./ui";

export function VendaModal({ aberto, onFechar, venda }: { aberto: boolean; onFechar: () => void; venda?: Venda | null }) {
  const { criarVenda, atualizarVenda, metaAtiva } = useStore();
  const editando = !!venda;

  const [cliente, setCliente] = useState("");
  const [produto, setProduto] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [status, setStatus] = useState<StatusVenda>("concluida");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    if (aberto) {
      setCliente(venda?.cliente ?? "");
      setProduto(venda?.produto ?? "");
      setValor(venda ? String(venda.valor) : "");
      setData(venda?.dataVenda ?? new Date().toISOString().slice(0, 10));
      setStatus(venda?.status ?? "concluida");
      setObservacoes(venda?.observacoes ?? "");
    }
  }, [aberto, venda]);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (editando) {
      await atualizarVenda(venda!.id, {
        cliente: cliente.trim(), produto: produto.trim(),
        valor: Number(valor), dataVenda: data, status, observacoes: observacoes.trim() || undefined,
      });
      toast.success("Venda atualizada com sucesso!");
    } else {
      await criarVenda({
        metaId: metaAtiva?.id ?? 1,
        cliente: cliente.trim(), produto: produto.trim(),
        valor: Number(valor), dataVenda: data, status, observacoes: observacoes.trim() || undefined,
      });
      toast.success("Venda adicionada com sucesso!");
    }
    onFechar();
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo={editando ? "Editar Venda" : "Nova Venda"}>
      <form onSubmit={salvar} className="space-y-4">
        <Campo label="Cliente">
          <input required className={inputClass} value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Nome do cliente" />
        </Campo>
        <Campo label="Produto/Serviço">
          <input required className={inputClass} value={produto} onChange={(e) => setProduto(e.target.value)} placeholder="Ex: Plano Premium" />
        </Campo>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Valor (R$)">
            <input required type="number" min="0.01" step="0.01" className={inputClass} value={valor} onChange={(e) => setValor(e.target.value)} placeholder="1500.00" />
          </Campo>
          <Campo label="Data">
            <input required type="date" className={inputClass} value={data} onChange={(e) => setData(e.target.value)} />
          </Campo>
        </div>
        <Campo label="Status">
          <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as StatusVenda)}>
            <option value="concluida">Concluída</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </Campo>
        <Campo label="Observações">
          <textarea className={`${inputClass} min-h-20 resize-none`} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Opcional" />
        </Campo>
        <div className="flex justify-end gap-3 pt-2">
          <BotaoSecundario onClick={onFechar}>Cancelar</BotaoSecundario>
          <BotaoPrimario type="submit">{editando ? "Salvar alterações" : "Adicionar Venda"}</BotaoPrimario>
        </div>
      </form>
    </Modal>
  );
}
