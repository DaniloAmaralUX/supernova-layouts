"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { cn } from "@/lib/utils";

/**
 * Lista de onboarding — o caminho até o primeiro resultado.
 *
 * Checklists de produto costumam listar tarefas do produto ("conecte sua
 * conta"), e não do trabalho de quem chegou. Aqui cada passo é escrito pelo
 * resultado que entrega, e traz o tempo estimado — a pessoa decide se começa
 * agora ou depois do café.
 *
 * O passo concluído não some: continua na lista, marcado. Sumir com o que foi
 * feito apaga a sensação de avanço, que é a única coisa que sustenta uma lista
 * de cinco itens.
 */
type Passo = {
  id: string;
  titulo: string;
  descricao: string;
  minutos: number;
  inicial: boolean;
};

const PASSOS: Passo[] = [
  {
    id: "workspace",
    titulo: "Dê nome ao workspace",
    descricao: "É o que aparece para todo mundo que você convidar.",
    minutos: 1,
    inicial: true,
  },
  {
    id: "tema",
    titulo: "Escolha o tema da marca",
    descricao: "As cores e a tipografia valem para o catálogo inteiro de uma vez.",
    minutos: 3,
    inicial: true,
  },
  {
    id: "bloco",
    titulo: "Instale o primeiro bloco",
    descricao: "Um comando no terminal, e o código está no seu projeto.",
    minutos: 2,
    inicial: false,
  },
  {
    id: "time",
    titulo: "Convide quem trabalha com você",
    descricao: "Sem ninguém junto, o histórico do workspace fica só seu.",
    minutos: 2,
    inicial: false,
  },
  {
    id: "agente",
    titulo: "Conecte o seu agente ao registry",
    descricao: "O MCP deixa o agente instalar blocos sem você copiar nada.",
    minutos: 5,
    inicial: false,
  },
];

export default function OnboardingChecklist() {
  const [feitos, setFeitos] = useState<string[]>(
    PASSOS.filter((p) => p.inicial).map((p) => p.id),
  );

  const concluidos = feitos.length;
  const total = PASSOS.length;
  const percentual = Math.round((concluidos / total) * 100);
  const proximo = PASSOS.find((p) => !feitos.includes(p.id));
  const restam = PASSOS.filter((p) => !feitos.includes(p.id)).reduce((s, p) => s + p.minutos, 0);

  function alternar(id: string) {
    setFeitos((atual) => (atual.includes(id) ? atual.filter((f) => f !== id) : [...atual, id]));
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6 py-20">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-7">
        <MicroRotulo>Primeiros passos</MicroRotulo>
        <h1 className="mt-2 font-display text-2xl tracking-tight">
          {percentual === 100 ? "Tudo pronto" : "Faltam alguns minutos"}
        </h1>
        <p className="mt-1.5 text-muted-foreground text-sm">
          {percentual === 100
            ? "O workspace está configurado. Bom trabalho."
            : `${restam} minutos de trabalho até o workspace estar pronto.`}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <div
            role="progressbar"
            aria-valuenow={concluidos}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label="Passos concluídos"
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
          >
            <div
              style={{ width: `${percentual}%` }}
              className="h-full rounded-full bg-foreground transition-[width] duration-300 ease-out motion-reduce:transition-none"
            />
          </div>
          <MicroRotulo className="tabular-nums">
            {concluidos}/{total}
          </MicroRotulo>
        </div>

        <ul className="mt-7 flex flex-col">
          {PASSOS.map((passo) => {
            const feito = feitos.includes(passo.id);
            return (
              <li key={passo.id} className="border-border-soft border-b last:border-0">
                <button
                  type="button"
                  onClick={() => alternar(passo.id)}
                  aria-pressed={feito}
                  className="flex w-full items-start gap-3.5 py-4 text-left transition-opacity focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                      feito ? "border-foreground bg-foreground" : "border-border",
                    )}
                  >
                    {feito ? <Check className="size-3 text-background" /> : null}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block font-medium text-sm",
                        feito && "text-muted-foreground line-through decoration-1",
                      )}
                    >
                      {passo.titulo}
                    </span>
                    <span className="mt-0.5 block text-muted-foreground text-xs leading-relaxed">
                      {passo.descricao}
                    </span>
                  </span>

                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground tabular-nums">
                    {passo.minutos} min
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {proximo ? (
          <Button
            size="lg"
            className="mt-7 w-full"
    >
      {proximo.titulo}
      <ArrowRight aria-hidden="true" className="size-4" />
    </Button>
        ) : (
          <Button size="lg" variant="outline" className="mt-7 w-full">
            Ir para o workspace
          </Button>
        )}
      </div>
    </div>
  );
}
