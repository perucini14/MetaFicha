import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function BotaoPrimario({ children, onClick, type = "button", className = "" }: {
  children: ReactNode; onClick?: () => void; type?: "button" | "submit"; className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-opacity hover:opacity-90 ${className}`}
    >
      {children}
    </button>
  );
}

export function BotaoSecundario({ children, onClick, type = "button", danger = false }: {
  children: ReactNode; onClick?: () => void; type?: "button" | "submit"; danger?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors ${
        danger
          ? "bg-destructive text-destructive-foreground hover:opacity-90 border-destructive"
          : "bg-card text-foreground hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone }: { children: ReactNode; tone: "verde" | "roxo" | "cinza" | "vermelho" }) {
  const tones = {
    verde: "bg-success/15 text-success",
    roxo: "bg-primary/10 text-primary",
    cinza: "bg-muted text-muted-foreground",
    vermelho: "bg-destructive/10 text-destructive",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function ProgressBar({ percentual, atingida = false }: { percentual: number; atingida?: boolean }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={`h-full rounded-full transition-all duration-500 ${atingida ? "bg-success" : "bg-gradient-primary"}`}
        style={{ width: `${Math.min(percentual, 100)}%` }}
      />
    </div>
  );
}

export function Modal({ aberto, onFechar, titulo, children, largura = "max-w-lg" }: {
  aberto: boolean; onFechar: () => void; titulo: string; children: ReactNode; largura?: string;
}) {
  if (!aberto) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-foreground/40" onClick={onFechar} />
      <div className={`relative w-full ${largura} rounded-t-2xl bg-card p-6 shadow-card sm:rounded-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">{titulo}</h2>
          <button onClick={onFechar} className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20 placeholder:text-muted-foreground";
