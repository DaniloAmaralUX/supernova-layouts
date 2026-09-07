"use client";

import {
  BarChart3,
  Bell,
  FileText,
  Folder,
  LifeBuoy,
  PanelLeft,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { cn } from "@/lib/utils";

/**
 * Casca de aplicação — trilho lateral recolhível, topo fixo, conteúdo.
 *
 * A estrutura que quase todo produto interno repete. Duas decisões que valem
 * ser lidas: o trilho recolhe para ícones em vez de sumir, porque perder a
 * navegação inteira desorienta mais do que perder os rótulos; e o topo carrega
 * a busca, que é o atalho que as pessoas usam quando a navegação falha.
 */
export default function AppShell() {
  const [recolhido, setRecolhido] = useState(false);

  return (
    <div className="flex min-h-dvh bg-background">
      <TrilhoLateral recolhido={recolhido} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topo recolhido={recolhido} aoAlternar={() => setRecolhido((r) => !r)} />
        <Conteudo />
      </div>
    </div>
  );
}

const NAVEGACAO = [
  { icone: BarChart3, rotulo: "Visão geral", ativo: true },
  { icone: Folder, rotulo: "Projetos", contagem: 12 },
  { icone: FileText, rotulo: "Documentos" },
  { icone: Users, rotulo: "Pessoas", contagem: 4 },
  { icone: Settings, rotulo: "Configurações" },
];

function TrilhoLateral({ recolhido }: { recolhido: boolean }) {
  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-border-soft border-r bg-surface-1 md:flex",
        "transition-[width] duration-200 ease-out motion-reduce:transition-none",
        recolhido ? "w-16" : "w-60",
      )}
    >
      <div className="flex h-14 items-center gap-2.5 border-border border-b px-5">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-foreground" />
        {recolhido ? null : <MicroRotulo className="text-foreground">Órbita</MicroRotulo>}
      </div>

      <nav aria-label="Principal" className="flex flex-1 flex-col gap-0.5 p-3">
        {NAVEGACAO.map((item) => (
          <a
            key={item.rotulo}
            href="#"
            aria-current={item.ativo ? "page" : undefined}
            title={recolhido ? item.rotulo : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
              item.ativo
                ? "bg-surface-3 text-foreground"
                : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
              recolhido && "justify-center px-0",
            )}
          >
            <item.icone aria-hidden="true" className="size-4 shrink-0" />
            {recolhido ? (
              <span className="sr-only">{item.rotulo}</span>
            ) : (
              <>
                <span className="flex-1 truncate">{item.rotulo}</span>
                {item.contagem ? (
                  <Badge color="gray" className="tabular-nums">
                    {item.contagem}
                  </Badge>
                ) : null}
              </>
            )}
          </a>
        ))}
      </nav>

      <div className="border-border border-t p-3">
        <a
          href="#"
          title={recolhido ? "Ajuda" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-surface-2 hover:text-foreground",
            recolhido && "justify-center px-0",
          )}
        >
          <LifeBuoy aria-hidden="true" className="size-4 shrink-0" />
          {recolhido ? <span className="sr-only">Ajuda</span> : "Ajuda"}
        </a>
      </div>
    </aside>
  );
}

function Topo({ recolhido, aoAlternar }: { recolhido: boolean; aoAlternar: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-border border-b px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={aoAlternar}
        aria-expanded={!recolhido}
        aria-label={recolhido ? "Expandir a navegação" : "Recolher a navegação"}
        className="hidden size-9 md:inline-flex"
      >
        <PanelLeft aria-hidden="true" className="size-4" />
      </Button>

      <div className="relative max-w-md flex-1">
        <Search
          aria-hidden="true"
          className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground"
        />
        <Input type="search" placeholder="Buscar em tudo" aria-label="Buscar" className="pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Notificações" className="relative size-9">
          <Bell aria-hidden="true" className="size-4" />
          <span
            aria-hidden="true"
            className="absolute top-2 right-2 size-1.5 rounded-full bg-brand"
          />
        </Button>
        <span className="ml-1 flex size-8 items-center justify-center rounded-full bg-accent font-medium text-accent-foreground text-xs">
          DA
        </span>
      </div>
    </header>
  );
}

function Conteudo() {
  return (
    <main className="min-w-0 flex-1 overflow-auto p-6 md:p-8">
      <MicroRotulo>Visão geral</MicroRotulo>
      <h1 className="mt-2 font-display text-2xl tracking-tight">Bom dia, Danilo</h1>
      <p className="mt-1.5 text-muted-foreground text-sm">
        Três projetos avançaram desde ontem. Nada precisa de você agora.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {["Em andamento", "Aguardando revisão", "Publicados"].map((titulo, i) => (
          <section key={titulo} className="rounded-xl border border-border bg-card p-5">
            <MicroRotulo>{titulo}</MicroRotulo>
            <div className="mt-3 font-display text-3xl tabular-nums">{[7, 3, 41][i]}</div>
            <p className="mt-1 text-muted-foreground text-xs">
              {["2 a mais que na semana passada", "nenhum há mais de 3 dias", "12 neste trimestre"][i]}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border border-dashed p-10 text-center">
        <p className="text-muted-foreground text-sm">A área de trabalho do produto entra aqui.</p>
      </div>
    </main>
  );
}
