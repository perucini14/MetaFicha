import { BotaoSecundario, Modal } from "./ui";

export function ConfirmDialog({ aberto, onFechar, onConfirmar, titulo, mensagem }: {
  aberto: boolean; onFechar: () => void; onConfirmar: () => void; titulo: string; mensagem: string;
}) {
  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo={titulo} largura="max-w-md">
      <p className="text-sm text-muted-foreground">{mensagem}</p>
      <div className="mt-6 flex justify-end gap-3">
        <BotaoSecundario onClick={onFechar}>Cancelar</BotaoSecundario>
        <BotaoSecundario danger onClick={() => { onConfirmar(); onFechar(); }}>Excluir</BotaoSecundario>
      </div>
    </Modal>
  );
}
