import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { Meta } from "@/lib/types";
import { BotaoPrimario, BotaoSecundario, Campo, Modal, inputClass } from "./ui";

export function MetaModal({ aberto, onFechar, meta }: { aberto: boolean; onFechar: () => void; meta?: Meta | null }) {
  const { criarMeta, atualizarMeta } = useStore();
  const editando = !!meta;

  const [nome, setNome] = useState("");
  const [valorMeta, setValorMeta] = useState("");
  const [qtdVendas, setQtdVendas] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    if (aberto) {
      setNome(meta?.nome ?? "");
      setValorMeta(meta ? String(meta.valorMeta) : "");
      setQtdVendas(meta ? String(meta.quantidadeVendasMeta) : "");
      setDataInicio(meta?.dataInicio ?? "");
      setDataFim(meta?.dataFim ?? "");
    }
  }, [aberto, meta]);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    const dados = {
      nome: nome.trim(),
      valorMeta: Number(valorMeta),
      quantidadeVendasMeta: Number(qtdVendas),
      dataInicio,
      dataFim,
    };
    if (editando) {
      await atualizarMeta(meta!.id, dados);
      toast.success("Meta atualizada com sucesso!");
    } else {
      await criarMeta(dados);
      toast.success("Meta criada com sucesso!");
    }
    onFechar();
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo={editando ? "Editar Meta" : "Nova Meta"}>
      <form onSubmit={salvar} className="space-y-4">
        <Campo label="Nome da meta">
          <input required className={inputClass} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Meta de Vendas — Setembro 2026" />
        </Campo>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Valor da meta (R$)">
            <input required type="number" min="1" step="0.01" className={inputClass} value={valorMeta} onChange={(e) => setValorMeta(e.target.value)} placeholder="50000" />
          </Campo>
          <Campo label="Quantidade de vendas desejadas">
            <input required type="number" min="1" className={inputClass} value={qtdVendas} onChange={(e) => setQtdVendas(e.target.value)} placeholder="50" />
          </Campo>
          <Campo label="Data inicial">
            <input required type="date" className={inputClass} value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
          </Campo>
          <Campo label="Data final">
            <input required type="date" className={inputClass} value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
          </Campo>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <BotaoSecundario onClick={onFechar}>Cancelar</BotaoSecundario>
          <BotaoPrimario type="submit">{editando ? "Salvar alterações" : "Criar Meta"}</BotaoPrimario>
        </div>
      </form>
    </Modal>
  );
}
