import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { cn } from "@/lib/utils";

/**
 * Visão de métricas — grade de indicadores com minigráfico e feed ao lado.
 *
 * A variação é sempre relativa a um período nomeado ("vs. 30 dias"), nunca um
 * número solto: "+12%" sem base de comparação não informa nada. E a direção
 * aparece em ícone e em texto, porque cor sozinha não é informação para quem
 * não distingue as matizes.
 */
const METRICAS = [
  { rotulo: "Receita", valor: "R$ 412k", variacao: 12.4, serie: [12, 18, 15, 22, 28, 26, 34, 41] },
  { rotulo: "Assinaturas", valor: "1.284", variacao: 4.1, serie: [40, 42, 41, 45, 44, 48, 51, 53] },
  { rotulo: "Cancelamentos", valor: "2,1%", variacao: -0.6, serie: [8, 7, 9, 6, 7, 5, 6, 4] },
  { rotulo: "Tempo até valor", valor: "3d 4h", variacao: -18.2, serie: [30, 28, 26, 27, 22, 20, 18, 15] },
];

const ATIVIDADE = [
  { quem: "Marina", acao: "publicou o tema Aurora", quando: "há 4 min" },
  { quem: "Rafael", acao: "aprovou a revisão do bloco de preços", quando: "há 26 min" },
  { quem: "Ana", acao: "abriu 3 chamados de acessibilidade", quando: "há 1 h" },
  { quem: "Pedro", acao: "conectou o registry ao agente", quando: "há 2 h" },
  { quem: "Júlia", acao: "convidou 2 pessoas para o workspace", quando: "há 5 h" },
];

const SEMANAS = [62, 78, 71, 94, 88, 112, 104, 131];

export default function MetricsOverview() {
  return (
    <div className="min-h-dvh bg-background px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-6xl">
        <MicroRotulo>Painel · últimos 30 dias</MicroRotulo>
        <h1 className="mt-2 font-display text-3xl tracking-tight">Como o produto foi este mês</h1>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {METRICAS.map((metrica) => (
            <CartaoDeMetrica key={metrica.rotulo} {...metrica} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-xl border border-border bg-card p-6">
            <MicroRotulo>Receita por semana</MicroRotulo>
            <Barras />
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <MicroRotulo>Atividade</MicroRotulo>
            <ul className="mt-5 flex flex-col gap-4">
              {ATIVIDADE.map((item) => (
                <li key={item.quem} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground"
                  />
                  <p className="text-sm leading-snug">
                    <span className="font-medium">{item.quem}</span>{" "}
                    <span className="text-muted-foreground">{item.acao}</span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {item.quando}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function CartaoDeMetrica({
  rotulo,
  valor,
  variacao,
  serie,
}: {
  rotulo: string;
  valor: string;
  variacao: number;
  serie: number[];
}) {
  const subiu = variacao >= 0;
  const Seta = subiu ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <MicroRotulo>{rotulo}</MicroRotulo>
      <div className="mt-2.5 font-display text-2xl tabular-nums">{valor}</div>

      <div className="mt-3 flex items-center gap-1.5">
        <Seta
          aria-hidden="true"
          className={cn("size-3.5", subiu ? "text-brand" : "text-muted-foreground")}
        />
        <span
          className={cn(
            "font-mono text-xs tabular-nums",
            subiu ? "text-brand" : "text-muted-foreground",
          )}
        >
          {subiu ? "+" : ""}
          {variacao.toFixed(1)}%
        </span>
        <span className="text-muted-foreground text-xs">
          {subiu ? "acima" : "abaixo"} vs. 30 dias
        </span>
      </div>

      <Minigrafico serie={serie} rotulo={rotulo} />
    </article>
  );
}

function Minigrafico({ serie, rotulo }: { serie: number[]; rotulo: string }) {
  const maximo = Math.max(...serie);
  const minimo = Math.min(...serie);
  const amplitude = maximo - minimo || 1;
  const pontos = serie
    .map((v, i) => `${(i / (serie.length - 1)) * 100},${28 - ((v - minimo) / amplitude) * 24}`)
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      role="img"
      aria-label={`Tendência de ${rotulo} nas últimas oito semanas.`}
      className="mt-4 h-8 w-full"
    >
      <polyline
        points={pontos}
        fill="none"
        stroke="var(--color-chart-1)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Barras() {
  const maximo = Math.max(...SEMANAS);

  return (
    <div className="mt-6">
      <div
        className="flex h-40 items-end gap-2"
        role="img"
        aria-label="Receita por semana, oito semanas, com tendência de alta."
      >
        {SEMANAS.map((valor, i) => (
          <div
            key={i}
            style={{ height: `${(valor / maximo) * 100}%` }}
            className="flex-1 rounded-t-sm bg-chart-1/70"
          />
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        {SEMANAS.map((_, i) => (
          <MicroRotulo key={i} className="flex-1 text-center tabular-nums">
            S{i + 1}
          </MicroRotulo>
        ))}
      </div>
    </div>
  );
}
