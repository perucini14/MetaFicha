import { useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";

export function Login() {
  const { login, erro } = useStore();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(event: FormEvent) {
    event.preventDefault();
    setEnviando(true); setMensagem("");
    try { await login(email, senha); }
    catch (error) {
      const detalhe = error instanceof Error ? error.message : "";
      setMensagem(detalhe.includes("401") ? "E-mail ou senha inválidos." : "Não foi possível acessar a API. Confira se o terminal do dotnet está aberto na porta 5000.");
    }
    finally { setEnviando(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-background p-4">
    <form onSubmit={entrar} className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-bold">MetaFlow</h1>
      <p className="text-sm text-muted-foreground">Entre para acompanhar suas metas e vendas.</p>
      <label className="block text-sm">E-mail<input className="mt-1 w-full rounded-md border bg-background p-2" type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
      <label className="block text-sm">Senha<input className="mt-1 w-full rounded-md border bg-background p-2" type="password" value={senha} onChange={e => setSenha(e.target.value)} required /></label>
      {(mensagem || erro) && <p role="alert" className="text-sm text-red-600">{mensagem || erro}</p>}
      <button disabled={enviando} className="w-full rounded-md bg-primary p-2 text-primary-foreground disabled:opacity-50">{enviando ? "Entrando..." : "Entrar"}</button>
    </form>
  </main>;
}
