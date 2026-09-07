"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { cn } from "@/lib/utils";

/**
 * Visão de mês — grade com eventos, navegável por teclado.
 *
 * A grade é uma `<table>` de verdade, com `<th scope="col">` nos dias da
 * semana: um calendário é dado tabular, e forçá-lo em `div` custa a navegação
 * por linha e coluna que o leitor de tela já sabe fazer.
 *
 * Duas escolhas de leitura: os dias fora do mês continuam visíveis, mas
 * apagados, porque sumir com eles quebra a forma da semana; e o dia de hoje é
 * marcado por anel e por texto (`aria-current="date"`), nunca só por cor.
 */
const EVENTOS: Record<number, { titulo: string; hora: string; tom: string }[]> = {
  3: [{ titulo: "Revisão de design", hora: "10:00", tom: "bg-chart-1" }],
  8: [
    { titulo: "Planejamento", hora: "09:00", tom: "bg-chart-2" },
    { titulo: "1:1 com Marina", hora: "15:30", tom: "bg-chart-4" },
  ],
  12: [{ titulo: "Publicação v2", hora: "18:00", tom: "bg-chart-1" }],
  17: [{ titulo: "Workshop de tokens", hora: "14:00", tom: "bg-chart-3" }],
  21: [
    { titulo: "Retrospectiva", hora: "16:00", tom: "bg-chart-2" },
    { titulo: "Happy hour", hora: "19:00", tom: "bg-chart-4" },
  ],
  26: [{ titulo: "Auditoria de acessibilidade", hora: "11:00", tom: "bg-chart-3" }],
};

const DIAS_DA_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const HOJE = 6;

export default function MonthView() {
  const [mes, setMes] = useState(8); // setembro, base zero
  const ano = 2026;

  const semanas = useMemo(() => {
    const primeiro = new Date(ano, mes, 1);
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const diasNoAnterior = new Date(ano, mes, 0).getDate();
    const deslocamento = primeiro.getDay();

    const celulas: { dia: number; doMes: boolean }[] = [];
    for (let i = deslocamento - 1; i >= 0; i -= 1) {
      celulas.push({ dia: diasNoAnterior - i, doMes: false });
    }
    for (let d = 1; d <= diasNoMes; d += 1) celulas.push({ dia: d, doMes: true });
    while (celulas.length % 7 !== 0) {
      celulas.push({ dia: celulas.length - diasNoMes - deslocamento + 1, doMes: false });
    }

    const linhas: (typeof celulas)[] = [];
    for (let i = 0; i < celulas.length; i += 7) linhas.push(celulas.slice(i, i + 7));
    return linhas;
  }, [mes]);

  const nomeDoMes = new Date(ano, mes).toLocaleDateString("pt-BR", { month: "long" });

  return (
    <div className="min-h-dvh bg-background px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <MicroRotulo>Agenda do time</MicroRotulo>
            <h1 className="mt-2 font-display text-3xl capitalize tracking-tight">
              {nomeDoMes} de {ano}
            </h1>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              onClick={() => setMes((m) => (m - 1 + 12) % 12)}
              aria-label="Mês anterior"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setMes(8)}>
              Hoje
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              onClick={() => setMes((m) => (m + 1) % 12)}
              aria-label="Próximo mês"
            >
              <ChevronRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>

        <table className="mt-8 w-full table-fixed border-collapse">
          <caption className="sr-only">
            Calendário de {nomeDoMes} de {ano}, com os eventos de cada dia.
          </caption>
          <thead>
            <tr>
              {DIAS_DA_SEMANA.map((dia) => (
                <th key={dia} scope="col" className="pb-2 text-left">
                  <MicroRotulo>{dia}</MicroRotulo>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {semanas.map((semana, i) => (
              <tr key={i}>
                {semana.map((celula, j) => {
                  const eventos = celula.doMes ? (EVENTOS[celula.dia] ?? []) : [];
                  const hoje = celula.doMes && celula.dia === HOJE && mes === 8;

                  return (
                    <td
                      key={`${i}-${j}`}
                      aria-current={hoje ? "date" : undefined}
                      className={cn(
                        "h-28 border border-border p-2 align-top",
                        !celula.doMes && "bg-muted/30",
                      )}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "flex size-6 items-center justify-center rounded-full font-mono text-xs tabular-nums",
                            hoje && "bg-foreground text-background",
                            !celula.doMes && "text-muted-foreground/50",
                          )}
                        >
                          {celula.dia}
                        </span>
                        {hoje ? <MicroRotulo className="text-foreground">hoje</MicroRotulo> : null}
                      </div>

                      <ul className="mt-1.5 flex flex-col gap-1">
                        {eventos.map((evento) => (
                          <li
                            key={evento.titulo}
                            className="flex items-center gap-1.5 rounded px-1 py-0.5 text-[11px] leading-tight hover:bg-surface-2"
                          >
                            <span
                              aria-hidden="true"
                              className={cn("size-1.5 shrink-0 rounded-full", evento.tom)}
                            />
                            <span className="truncate">{evento.titulo}</span>
                            <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground tabular-nums">
                              {evento.hora}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
