"use client";

import { Check, Minus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * Três planos — com alternância entre mensal e anual.
 *
 * Duas honestidades que tabelas de preço costumam pular. A primeira: o desconto
 * anual é mostrado como valor por mês E como total cobrado, porque "R$ 79/mês
 * na anual" cobra R$ 948 de uma vez, e a pessoa merece ver isso antes do
 * cartão. A segunda: o que o plano não tem aparece com traço, e não some da
 * lista — comparação com listas de tamanhos diferentes esconde a diferença.
 *
 * O plano recomendado é destacado por borda e selo, nunca só por cor de fundo.
 */
type Plano = {
  nome: string;
  publico: string;
  mensal: number;
  anual: number;
  destaque?: boolean;
  recursos: { texto: string; incluido: boolean }[];
};

const PLANOS: Plano[] = [
  {
    nome: "Início",
    publico: "Para quem está experimentando.",
    mensal: 0,
    anual: 0,
    recursos: [
      { texto: "3 projetos", incluido: true },
      { texto: "1 pessoa", incluido: true },
      { texto: "Catálogo completo", incluido: true },
      { texto: "Temas personalizados", incluido: false },
      { texto: "Registry privado", incluido: false },
      { texto: "Suporte prioritário", incluido: false },
    ],
  },
  {
    nome: "Time",
    publico: "Para times que entregam junto.",
    mensal: 99,
    anual: 79,
    destaque: true,
    recursos: [
      { texto: "Projetos ilimitados", incluido: true },
      { texto: "Até 20 pessoas", incluido: true },
      { texto: "Catálogo completo", incluido: true },
      { texto: "Temas personalizados", incluido: true },
      { texto: "Registry privado", incluido: true },
      { texto: "Suporte prioritário", incluido: false },
    ],
  },
  {
    nome: "Empresa",
    publico: "Para quem precisa de contrato e SLA.",
    mensal: 349,
    anual: 279,
    recursos: [
      { texto: "Projetos ilimitados", incluido: true },
      { texto: "Pessoas ilimitadas", incluido: true },
      { texto: "Catálogo completo", incluido: true },
      { texto: "Temas personalizados", incluido: true },
      { texto: "Registry privado", incluido: true },
      { texto: "Suporte prioritário", incluido: true },
    ],
  },
];

export default function ThreeTier() {
  const [anual, setAnual] = useState(true);

  return (
    <div className="min-h-dvh bg-background px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <MicroRotulo>Planos</MicroRotulo>
          <h1 className="mt-3 font-display text-4xl tracking-tight">Escolha pelo tamanho do time</h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground leading-relaxed">
            Troque de plano quando quiser. A cobrança é proporcional ao que restar do período.
          </p>

          <div className="mt-8 inline-flex items-center gap-3">
            <label htmlFor="cobranca-anual" className="cursor-pointer text-sm">
              Mensal
            </label>
            <Switch id="cobranca-anual" checked={anual} onCheckedChange={setAnual} />
            <label htmlFor="cobranca-anual" className="cursor-pointer text-sm">
              Anual
              <span className="ml-1.5 rounded-full border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                −20%
              </span>
            </label>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {PLANOS.map((plano) => (
            <CartaoDePlano key={plano.nome} plano={plano} anual={anual} />
          ))}
        </div>

        <p className="mt-10 text-center text-muted-foreground text-xs">
          Valores em reais, impostos inclusos. Cancele quando quiser, sem multa.
        </p>
      </div>
    </div>
  );
}

function CartaoDePlano({ plano, anual }: { plano: Plano; anual: boolean }) {
  const valor = anual ? plano.anual : plano.mensal;
  const gratuito = valor === 0;

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6",
        plano.destaque ? "border-foreground/50" : "border-border",
      )}
    >
      {plano.destaque ? (
        <span className="-top-2.5 absolute left-6 rounded-full bg-foreground px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-background">
          Recomendado
        </span>
      ) : null}

      <h2 className="font-display text-xl">{plano.nome}</h2>
      <p className="mt-1 text-muted-foreground text-sm">{plano.publico}</p>

      <div className="mt-6">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-4xl tabular-nums">
            {gratuito ? "Grátis" : `R$ ${valor}`}
          </span>
          {gratuito ? null : <span className="text-muted-foreground text-sm">/mês</span>}
        </div>
        {/*
          O total anual fica visível antes do cartão. "R$ 79/mês na anual"
          cobra R$ 948 de uma vez — esconder isso é o truque que a tabela de
          preço não deveria usar.
        */}
        <p className="mt-1.5 min-h-4 font-mono text-[11px] text-muted-foreground tabular-nums">
          {gratuito ? "para sempre" : anual ? `R$ ${valor * 12} cobrados uma vez por ano` : "cobrado todo mês"}
        </p>
      </div>

      <Button
        variant={plano.destaque ? "default" : "outline"}
        size="lg"
        className="mt-6 w-full"
      >
        {gratuito ? "Começar agora" : `Assinar o ${plano.nome}`}
      </Button>

      <ul className="mt-7 flex flex-col gap-3 border-border border-t pt-6">
        {plano.recursos.map((recurso) => (
          <li
            key={recurso.texto}
            className={cn(
              "flex items-center gap-2.5 text-sm",
              recurso.incluido ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {recurso.incluido ? (
              <Check aria-hidden="true" className="size-4 shrink-0 text-brand" />
            ) : (
              <Minus aria-hidden="true" className="size-4 shrink-0 text-muted-foreground/60" />
            )}
            <span className={cn(!recurso.incluido && "line-through decoration-1")}>
              {recurso.texto}
            </span>
            <span className="sr-only">{recurso.incluido ? "incluído" : "não incluído"}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
