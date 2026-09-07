import { MicroRotulo } from "@/components/supernova/micro-rotulo";

/**
 * Receita em área — SVG puro, sem biblioteca de gráfico.
 *
 * Recharts custaria mais de 100 KB no pacote de quem instalar isto. Para uma
 * série única com eixo de tempo, o SVG escrito à mão resolve, escala em
 * qualquer largura e não traz dependência nenhuma. A regra que separa os dois
 * casos: se o gráfico precisa de interação rica (zoom, seleção, pincel),
 * pegue a biblioteca; se ele precisa mostrar uma forma, desenhe a forma.
 *
 * Acessibilidade: o SVG é `role="img"` com um resumo em texto, e a tabela de
 * dados vem logo abaixo, visível. Um gráfico que só existe como pixel exclui
 * quem lê por leitor de tela.
 */
const SERIE = [
  { mes: "Jan", valor: 182 },
  { mes: "Fev", valor: 201 },
  { mes: "Mar", valor: 194 },
  { mes: "Abr", valor: 238 },
  { mes: "Mai", valor: 259 },
  { mes: "Jun", valor: 247 },
  { mes: "Jul", valor: 288 },
  { mes: "Ago", valor: 312 },
  { mes: "Set", valor: 305 },
  { mes: "Out", valor: 341 },
  { mes: "Nov", valor: 368 },
  { mes: "Dez", valor: 402 },
];

const LARGURA = 720;
const ALTURA = 260;
const MARGEM = { topo: 16, direita: 8, baixo: 28, esquerda: 44 };

export default function RevenueArea() {
  const maximo = Math.max(...SERIE.map((p) => p.valor));
  const teto = Math.ceil(maximo / 100) * 100;

  const areaUtil = {
    largura: LARGURA - MARGEM.esquerda - MARGEM.direita,
    altura: ALTURA - MARGEM.topo - MARGEM.baixo,
  };

  const x = (i: number) => MARGEM.esquerda + (i / (SERIE.length - 1)) * areaUtil.largura;
  const y = (v: number) => MARGEM.topo + areaUtil.altura - (v / teto) * areaUtil.altura;

  const linha = SERIE.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.valor)}`).join(" ");
  const area = `${linha} L ${x(SERIE.length - 1)} ${MARGEM.topo + areaUtil.altura} L ${x(0)} ${MARGEM.topo + areaUtil.altura} Z`;

  const marcas = [0, teto / 4, teto / 2, (teto * 3) / 4, teto];
  const total = SERIE.reduce((s, p) => s + p.valor, 0);
  const crescimento = Math.round(((SERIE.at(-1)!.valor - SERIE[0].valor) / SERIE[0].valor) * 100);

  return (
    <div className="mx-auto flex min-h-dvh max-w-4xl flex-col justify-center px-6 py-20">
      <section className="rounded-xl border border-border bg-card p-6 md:p-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <MicroRotulo>Receita reconhecida</MicroRotulo>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-3xl tabular-nums">
                R$ {total.toLocaleString("pt-BR")}k
              </span>
              <span className="font-mono text-brand text-xs tabular-nums">+{crescimento}%</span>
            </div>
            <p className="mt-1 text-muted-foreground text-sm">Doze meses, fechamento de dezembro.</p>
          </div>
          <MicroRotulo>2026</MicroRotulo>
        </header>

        <svg
          viewBox={`0 0 ${LARGURA} ${ALTURA}`}
          role="img"
          aria-label={`Receita mensal de janeiro a dezembro de 2026, subindo de ${SERIE[0].valor} mil a ${SERIE.at(-1)!.valor} mil reais, um crescimento de ${crescimento} por cento.`}
          className="mt-8 w-full"
        >
          <defs>
            <linearGradient id="gradiente-receita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {marcas.map((marca) => (
            <g key={marca}>
              <line
                x1={MARGEM.esquerda}
                x2={LARGURA - MARGEM.direita}
                y1={y(marca)}
                y2={y(marca)}
                stroke="var(--color-border)"
                strokeWidth="1"
              />
              <text
                x={MARGEM.esquerda - 10}
                y={y(marca)}
                dy="0.32em"
                textAnchor="end"
                className="fill-muted-foreground font-mono text-[10px] tabular-nums"
              >
                {marca}
              </text>
            </g>
          ))}

          <path d={area} fill="url(#gradiente-receita)" />
          <path
            d={linha}
            fill="none"
            stroke="var(--color-chart-1)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {SERIE.map((p, i) => (
            <circle
              key={p.mes}
              cx={x(i)}
              cy={y(p.valor)}
              r={i === SERIE.length - 1 ? 4 : 2.5}
              fill="var(--color-card)"
              stroke="var(--color-chart-1)"
              strokeWidth="2"
            />
          ))}

          {SERIE.map((p, i) => (
            <text
              key={p.mes}
              x={x(i)}
              y={ALTURA - 8}
              textAnchor="middle"
              className="fill-muted-foreground font-mono text-[10px]"
            >
              {p.mes}
            </text>
          ))}
        </svg>
      </section>

      <details className="mt-4 rounded-xl border border-border bg-card px-5 py-4">
        <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Ver os números
        </summary>
        <table className="mt-4 w-full text-sm">
          <caption className="sr-only">Receita por mês em 2026, em milhares de reais</caption>
          <thead>
            <tr className="border-border border-b text-left">
              <th scope="col" className="pb-2 font-medium text-muted-foreground">Mês</th>
              <th scope="col" className="pb-2 text-right font-medium text-muted-foreground">Receita</th>
            </tr>
          </thead>
          <tbody>
            {SERIE.map((p) => (
              <tr key={p.mes} className="border-border-soft border-b last:border-0">
                <th scope="row" className="py-1.5 text-left font-normal">{p.mes}</th>
                <td className="py-1.5 text-right font-mono tabular-nums">R$ {p.valor}k</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
