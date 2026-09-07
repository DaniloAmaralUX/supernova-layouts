import { Activity, CreditCard, TrendingUp, Users } from "lucide-react";
import type { ReactNode } from "react";

import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { cn } from "@/lib/utils";

/**
 * Bloco de métrica — as quatro formas que o mesmo dado assume.
 *
 * Um catálogo costuma mostrar quatro variações bonitas e deixar a escolha ao
 * acaso. Aqui cada uma vem com a pergunta que responde, porque essa é a
 * decisão real de quem monta um painel: não qual é mais bonita, e sim o que a
 * pessoa precisa saber ao bater o olho.
 */
export default function StatTile() {
  return (
    <div className="min-h-dvh bg-background px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <MicroRotulo>Cards</MicroRotulo>
        <h1 className="mt-2 font-display text-3xl tracking-tight">Bloco de métrica</h1>
        <p className="mt-2 max-w-xl text-muted-foreground text-sm leading-relaxed">
          A mesma métrica em quatro formas. A escolha não é de estilo: é de qual pergunta o painel
          precisa responder num relance.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Variacao forma="Número seco" quando="Quando o valor absoluto é a resposta.">
            <Seco />
          </Variacao>
          <Variacao
            forma="Com comparação"
            quando="Quando o valor só significa algo contra um período."
          >
            <ComComparacao />
          </Variacao>
          <Variacao forma="Com meta" quando="Quando existe um alvo e a distância até ele importa.">
            <ComMeta />
          </Variacao>
          <Variacao forma="Com recorte" quando="Quando o total esconde a composição.">
            <ComRecorte />
          </Variacao>
        </div>
      </div>
    </div>
  );
}

function Variacao({
  forma,
  quando,
  children,
}: {
  forma: string;
  quando: string;
  children: ReactNode;
}) {
  return (
    <section>
      {children}
      <div className="mt-3 pl-1">
        <MicroRotulo>{forma}</MicroRotulo>
        <p className="mt-1 text-muted-foreground text-xs leading-relaxed">{quando}</p>
      </div>
    </section>
  );
}

function Moldura({ children }: { children: ReactNode }) {
  return <article className="rounded-xl border border-border bg-card p-5">{children}</article>;
}

function Seco() {
  return (
    <Moldura>
      <div className="flex items-start justify-between">
        <MicroRotulo>Pessoas ativas</MicroRotulo>
        <Users aria-hidden="true" className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-4 font-display text-4xl tabular-nums">8.412</div>
    </Moldura>
  );
}

function ComComparacao() {
  return (
    <Moldura>
      <div className="flex items-start justify-between">
        <MicroRotulo>Receita</MicroRotulo>
        <CreditCard aria-hidden="true" className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-4 font-display text-4xl tabular-nums">R$ 412k</div>
      <div className="mt-3 flex items-center gap-1.5 text-xs">
        <TrendingUp aria-hidden="true" className="size-3.5 text-brand" />
        <span className="font-mono text-brand tabular-nums">+12,4%</span>
        <span className="text-muted-foreground">acima dos 30 dias anteriores</span>
      </div>
    </Moldura>
  );
}

function ComMeta() {
  const atual = 412;
  const meta = 500;
  const percentual = Math.round((atual / meta) * 100);

  return (
    <Moldura>
      <div className="flex items-start justify-between">
        <MicroRotulo>Meta do trimestre</MicroRotulo>
        <Activity aria-hidden="true" className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-4xl tabular-nums">R$ {atual}k</span>
        <span className="text-muted-foreground text-sm tabular-nums">de R$ {meta}k</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percentual}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso da meta do trimestre"
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div style={{ width: `${percentual}%` }} className="h-full rounded-full bg-chart-1" />
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground tabular-nums">
        {percentual}% · faltam R$ {meta - atual}k
      </p>
    </Moldura>
  );
}

const RECORTE = [
  { rotulo: "Anual", valor: 248, cor: "bg-chart-1" },
  { rotulo: "Mensal", valor: 121, cor: "bg-chart-2" },
  { rotulo: "Uso", valor: 43, cor: "bg-chart-4" },
];

function ComRecorte() {
  const total = RECORTE.reduce((soma, r) => soma + r.valor, 0);

  return (
    <Moldura>
      <MicroRotulo>Receita por plano</MicroRotulo>
      <div className="mt-4 font-display text-4xl tabular-nums">R$ {total}k</div>

      <div className="mt-4 flex h-1.5 overflow-hidden rounded-full">
        {RECORTE.map((r) => (
          <div
            key={r.rotulo}
            style={{ width: `${(r.valor / total) * 100}%` }}
            className={cn("h-full", r.cor)}
          />
        ))}
      </div>

      <ul className="mt-3 flex flex-col gap-1.5">
        {RECORTE.map((r) => (
          <li key={r.rotulo} className="flex items-center gap-2 text-xs">
            <span aria-hidden="true" className={cn("size-2 rounded-full", r.cor)} />
            <span className="flex-1 text-muted-foreground">{r.rotulo}</span>
            <span className="font-mono tabular-nums">R$ {r.valor}k</span>
          </li>
        ))}
      </ul>
    </Moldura>
  );
}
