"use client";

import {
  ArrowRight,
  CornerDownLeft,
  FileText,
  Folder,
  Palette,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Kbd } from "@/components/ui/kbd";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { cn } from "@/lib/utils";

/**
 * Paleta de comandos — busca única sobre navegação, ações e conteúdo.
 *
 * O que separa uma paleta boa de uma caixa de busca com estilo é o teclado
 * inteiro funcionando: ↑↓ percorre sem tirar o foco do campo, ↵ executa, esc
 * fecha, e a lista rola sozinha atrás da seleção. Sem isso, quem abriu com
 * ⌘K acaba usando o mouse — e aí a paleta não serviu para nada.
 *
 * O campo mantém o foco o tempo todo; a seleção viaja por `aria-activedescendant`,
 * que é como um combobox anuncia o item corrente sem mover o cursor de teclado.
 */
type Comando = {
  id: string;
  rotulo: string;
  grupo: string;
  atalho?: string;
  icone: typeof Search;
};

const COMANDOS: Comando[] = [
  { id: "ir-projetos", rotulo: "Ir para Projetos", grupo: "Navegar", atalho: "G P", icone: Folder },
  { id: "ir-pessoas", rotulo: "Ir para Pessoas", grupo: "Navegar", atalho: "G E", icone: Users },
  { id: "ir-config", rotulo: "Ir para Configurações", grupo: "Navegar", atalho: "G C", icone: Settings },
  { id: "novo-projeto", rotulo: "Criar projeto", grupo: "Ações", atalho: "N", icone: Folder },
  { id: "novo-doc", rotulo: "Criar documento", grupo: "Ações", atalho: "D", icone: FileText },
  { id: "tema", rotulo: "Alternar tema", grupo: "Ações", atalho: "T", icone: Palette },
  { id: "doc-registry", rotulo: "Registry e instalação", grupo: "Documentos", icone: FileText },
  { id: "doc-tokens", rotulo: "Tokens e temas", grupo: "Documentos", icone: FileText },
];

export default function CommandPalette() {
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState(0);
  const campo = useRef<HTMLInputElement>(null);
  const lista = useRef<HTMLDivElement>(null);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return COMANDOS;
    return COMANDOS.filter((c) => `${c.rotulo} ${c.grupo}`.toLowerCase().includes(termo));
  }, [busca]);

  // Um filtro novo invalida a posição antiga: sem isto, a seleção fica além do
  // fim da lista e ↵ não executa nada.
  useEffect(() => setSelecionado(0), [busca]);

  useEffect(() => {
    lista.current
      ?.querySelector(`[data-indice="${selecionado}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selecionado]);

  const grupos = useMemo(() => {
    const mapa = new Map<string, { comando: Comando; indice: number }[]>();
    filtrados.forEach((comando, indice) => {
      mapa.set(comando.grupo, [...(mapa.get(comando.grupo) ?? []), { comando, indice }]);
    });
    return [...mapa.entries()];
  }, [filtrados]);

  function aoPressionar(evento: React.KeyboardEvent<HTMLInputElement>) {
    if (evento.key === "ArrowDown") {
      evento.preventDefault();
      setSelecionado((i) => (i + 1) % Math.max(filtrados.length, 1));
    } else if (evento.key === "ArrowUp") {
      evento.preventDefault();
      setSelecionado((i) => (i - 1 + filtrados.length) % Math.max(filtrados.length, 1));
    } else if (evento.key === "Enter") {
      evento.preventDefault();
      // Num produto, aqui o comando é executado.
    }
  }

  return (
    <div className="flex min-h-dvh items-start justify-center bg-background px-6 pt-[18vh] pb-20">
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-border border-b px-4">
          <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={campo}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="lista-de-comandos"
            aria-activedescendant={filtrados[selecionado] ? `comando-${filtrados[selecionado].id}` : undefined}
            aria-label="Buscar comandos"
            autoComplete="off"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={aoPressionar}
            placeholder="Buscar comandos, projetos e documentos"
            className="min-h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <Kbd>esc</Kbd>
        </div>

        <div
          ref={lista}
          id="lista-de-comandos"
          role="listbox"
          aria-label="Comandos"
          className="max-h-80 overflow-y-auto p-1.5"
        >
          {filtrados.length === 0 ? (
            <p className="px-3 py-8 text-center text-muted-foreground text-sm">
              Nada encontrado para <span className="text-foreground">{busca}</span>.
            </p>
          ) : (
            grupos.map(([grupo, itens]) => (
              <div key={grupo} className="mb-1 last:mb-0">
                <MicroRotulo as="div" className="px-2.5 py-2">
                  {grupo}
                </MicroRotulo>
                {itens.map(({ comando, indice }) => (
                  <div
                    key={comando.id}
                    id={`comando-${comando.id}`}
                    data-indice={indice}
                    role="option"
                    aria-selected={indice === selecionado}
                    onMouseMove={() => setSelecionado(indice)}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-sm",
                      indice === selecionado ? "bg-surface-3 text-foreground" : "text-foreground",
                    )}
                  >
                    <comando.icone aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate">{comando.rotulo}</span>
                    {comando.atalho ? (
                      <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
                        {comando.atalho}
                      </span>
                    ) : null}
                    {indice === selecionado ? (
                      <ArrowRight aria-hidden="true" className="size-3.5 text-muted-foreground" />
                    ) : null}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        <footer className="flex items-center gap-4 border-border border-t px-4 py-2.5">
          <span className="flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <MicroRotulo>navegar</MicroRotulo>
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd>
              <CornerDownLeft aria-hidden="true" className="size-3" />
            </Kbd>
            <MicroRotulo>abrir</MicroRotulo>
          </span>
          <MicroRotulo className="ml-auto tabular-nums">
            {filtrados.length} de {COMANDOS.length}
          </MicroRotulo>
        </footer>
      </div>
    </div>
  );
}
