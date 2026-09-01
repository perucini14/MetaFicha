import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Target, ShoppingCart, BarChart3, User, LogOut,
  Menu, X, TrendingUp,
} from "lucide-react";
import { useStore } from "@/lib/store";

const menu = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/metas", label: "Minhas Metas", icon: Target },
  { to: "/vendas", label: "Vendas", icon: ShoppingCart },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { usuario } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
          <TrendingUp className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-base font-bold text-sidebar-accent-foreground">Controle de Metas</p>
          <p className="text-xs text-sidebar-foreground/60">Vendas & Faturamento</p>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {menu.map((item) => {
          const ativo = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                ativo
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            {usuario?.nome?.charAt(0) ?? "L"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-sidebar-accent-foreground">{usuario?.nome ?? "..."}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">{usuario?.email ?? ""}</p>
          </div>
          <button
            title="Sair"
            className="rounded-lg p-2 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [mobileAberto, setMobileAberto] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar fixa — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarContent />
      </aside>

      {/* Menu mobile */}
      {mobileAberto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMobileAberto(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw]">
            <SidebarContent onNavigate={() => setMobileAberto(false)} />
          </aside>
          <button
            onClick={() => setMobileAberto(false)}
            className="absolute right-4 top-4 rounded-lg bg-card p-2 text-foreground shadow-card"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Topbar mobile */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setMobileAberto(true)}
            className="rounded-lg p-2 text-foreground hover:bg-accent"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">Controle de Metas</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
