"use client";

import { Check, ListFilter, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Barra de filtros — facetas em popover, chips do que está ativo.
 *
 * O erro comum é esconder o filtro dentro do popover e não mostrar em lugar
 * nenhum o que está valendo. A pessoa filtra, sai da tela, volta e não entende
 * por que a lista está curta. Os chips resolvem isso: o que está ativo fica à
 * vista, e cada um se remove sozinho.
 *
 * A contagem ao lado de cada opção é o que evita o filtro que zera a lista —
 * dá para ver o resultado antes de escolher.
 */
type Faceta = {
  id: string;
  rotulo: string;
  opcoes: { valor: string; rotulo: string; contagem: number }[];
};

const FACETAS: Faceta[] = [
  {
    id: "situacao",
    rotulo: "Situação",
    opcoes: [
      { valor: "aberto", rotulo: "Aberto", contagem: 24 },
      { valor: "andamento", rotulo: "Em andamento", contagem: 11 },
      { valor: "revisao", rotulo: "Em revisão", contagem: 6 },
      { valor: "fechado", rotulo: "Fechado", contagem: 189 },
    ],
  },
  {
    id: "prioridade",
    rotulo: "Prioridade",
    opcoes: [
      { valor: "p0", rotulo: "P0 · crítica", contagem: 2 },
      { valor: "p1", rotulo: "P1 · alta", contagem: 9 },
      { valor: "p2", rotulo: "P2 · média", contagem: 31 },
      { valor: "p3", rotulo: "P3 · baixa", contagem: 47 },
    ],
  },
  {
    id: "responsavel",
    rotulo: "Responsável",
    opcoes: [
      { valor: "marina", rotulo: "Marina", contagem: 14 },
      { valor: "rafael", rotulo: "Rafael", contagem: 8 },
      { valor: "ana", rotulo: "Ana", contagem: 19 },
      { valor: "ninguem", rotulo: "Sem responsável", contagem: 5 },
    ],
  },
];

export default function FilterToolbar() {
  const [busca, setBusca] = useState("");
  const [ativos, setAtivos] = useState<Record<string, string[]>>({ prioridade: ["p0", "p1"] });

  const chips = useMemo(
    () =>
      FACETAS.flatMap((faceta) =>
        (ativos[faceta.id] ?? []).map((valor) => ({
          faceta: faceta.id,
          facetaRotulo: faceta.rotulo,
          valor,
          rotulo: faceta.opcoes.find((o) => o.valor === valor)?.rotulo ?? valor,
        })),
      ),
    [ativos],
  );

  function alternar(facetaId: string, valor: string) {
    setAtivos((atual) => {
      const lista = atual[facetaId] ?? [];
      const proxima = lista.includes(valor)
        ? lista.filter((v) => v !== valor)
        : [...lista, valor];
      return { ...atual, [facetaId]: proxima };
    });
  }

  return (
    <div className="min-h-dvh bg-background px-6 py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <MicroRotulo>Chamados</MicroRotulo>
        <h1 className="mt-2 font-display text-3xl tracking-tight">Fila do time</h1>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <div className="relative min-w-56 flex-1">
            <Search
              aria-hidden="true"
              className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground"
            />
            <Input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por título ou número"
              aria-label="Buscar chamados"
              className="pl-9"
            />
          </div>

          {FACETAS.map((faceta) => (
            <PopoverDeFaceta
              key={faceta.id}
              faceta={faceta}
              selecionados={ativos[faceta.id] ?? []}
              aoAlternar={(valor) => alternar(faceta.id, valor)}
            />
          ))}
        </div>

        {chips.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <MicroRotulo>Filtrando por</MicroRotulo>
            <ul className="flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <li key={`${chip.faceta}-${chip.valor}`}>
                  <button
                    type="button"
                    onClick={() => alternar(chip.faceta, chip.valor)}
                    className="group flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pr-1.5 pl-2.5 text-xs transition-colors hover:border-foreground/40 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                  >
                    <span className="text-muted-foreground">{chip.facetaRotulo}:</span>
                    <span>{chip.rotulo}</span>
                    <X
                      aria-hidden="true"
                      className="size-3 text-muted-foreground transition-colors group-hover:text-foreground"
                    />
                    <span className="sr-only">Remover este filtro</span>
                  </button>
                </li>
              ))}
            </ul>
            <Button variant="ghost" size="sm" onClick={() => setAtivos({})}>
              Limpar tudo
            </Button>
          </div>
        ) : null}

        <p aria-live="polite" className="mt-8 text-muted-foreground text-sm">
          {chips.length === 0
            ? "230 chamados, sem filtro."
            : `11 chamados com ${chips.length} ${chips.length === 1 ? "filtro" : "filtros"}.`}
        </p>

        <div className="mt-4 rounded-xl border border-border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">A lista de resultados entra aqui.</p>
        </div>
      </div>
    </div>
  );
}

function PopoverDeFaceta({
  faceta,
  selecionados,
  aoAlternar,
}: {
  faceta: Faceta;
  selecionados: string[];
  aoAlternar: (valor: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
    >
      <ListFilter aria-hidden="true" className="size-3.5" />
      {faceta.rotulo}
          {selecionados.length > 0 ? (
            <span className="ml-1 rounded-full bg-accent px-1.5 font-mono text-[10px] tabular-nums">
              {selecionados.length}
            </span>
          ) : null}
    </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-1.5">
        <ul role="group" aria-label={faceta.rotulo}>
          {faceta.opcoes.map((opcao) => {
            const marcada = selecionados.includes(opcao.valor);
            return (
              <li key={opcao.valor}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={marcada}
                  onClick={() => aoAlternar(opcao.valor)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                    "hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded border",
                      marcada ? "border-foreground bg-foreground" : "border-border",
                    )}
                  >
                    {marcada ? <Check className="size-3 text-background" /> : null}
                  </span>
                  <span className="flex-1 truncate">{opcao.rotulo}</span>
                  <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                    {opcao.contagem}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
