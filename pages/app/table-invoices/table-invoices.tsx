"use client";

import { ArrowDown, ArrowUp, Download, MoreHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { cn } from "@/lib/utils";

/**
 * Faturas — ordenação, seleção e ação em lote.
 *
 * Três decisões que uma tabela de verdade precisa tomar e que os exemplos
 * costumam pular:
 *
 * 1. A ordenação é anunciada. O cabeçalho carrega `aria-sort`, e não só uma
 *    setinha — sem isso, quem usa leitor de tela não sabe por onde a lista
 *    está ordenada.
 * 2. A barra de ação em lote ocupa o lugar do cabeçalho e diz quantos itens
 *    vai afetar. "Baixar" sem contagem é como ação em lote vira acidente.
 * 3. Valores e datas em `tabular-nums`, alinhados à direita. Números que
 *    dançam de linha para linha não se comparam a olho.
 */
type Situacao = "paga" | "aberta" | "vencida";

type Fatura = {
  numero: string;
  cliente: string;
  emissao: string;
  valor: number;
  situacao: Situacao;
};

const FATURAS: Fatura[] = [
  { numero: "FT-2841", cliente: "Aurora Tecnologia", emissao: "2026-08-02", valor: 12480, situacao: "paga" },
  { numero: "FT-2840", cliente: "Meridiano Saúde", emissao: "2026-08-01", valor: 4200, situacao: "aberta" },
  { numero: "FT-2839", cliente: "Coral Logística", emissao: "2026-07-28", valor: 31900, situacao: "vencida" },
  { numero: "FT-2838", cliente: "Vega Educação", emissao: "2026-07-24", valor: 7650, situacao: "paga" },
  { numero: "FT-2837", cliente: "Íris Comércio", emissao: "2026-07-19", valor: 2180, situacao: "aberta" },
  { numero: "FT-2836", cliente: "Bruma Consultoria", emissao: "2026-07-15", valor: 18300, situacao: "paga" },
  { numero: "FT-2835", cliente: "Lume Energia", emissao: "2026-07-11", valor: 54120, situacao: "vencida" },
];

const CORES: Record<Situacao, "green" | "amber" | "red"> = {
  paga: "green",
  aberta: "amber",
  vencida: "red",
};

type Coluna = "cliente" | "emissao" | "valor";

export default function Invoices() {
  const [ordem, setOrdem] = useState<{ coluna: Coluna; crescente: boolean }>({
    coluna: "emissao",
    crescente: false,
  });
  const [selecionadas, setSelecionadas] = useState<string[]>([]);

  const ordenadas = useMemo(() => {
    const copia = [...FATURAS];
    copia.sort((a, b) => {
      const x = a[ordem.coluna];
      const y = b[ordem.coluna];
      const comparacao =
        typeof x === "number" && typeof y === "number"
          ? x - y
          : String(x).localeCompare(String(y), "pt-BR");
      return ordem.crescente ? comparacao : -comparacao;
    });
    return copia;
  }, [ordem]);

  function alternarOrdem(coluna: Coluna) {
    setOrdem((atual) =>
      atual.coluna === coluna
        ? { coluna, crescente: !atual.crescente }
        : { coluna, crescente: true },
    );
  }

  const todasSelecionadas = selecionadas.length === FATURAS.length;

  return (
    <div className="min-h-dvh bg-background px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <MicroRotulo>Financeiro</MicroRotulo>
        <h1 className="mt-2 font-display text-3xl tracking-tight">Faturas</h1>

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex min-h-14 items-center justify-between gap-4 border-border border-b px-4">
            {selecionadas.length > 0 ? (
              <>
                <MicroRotulo className="text-foreground tabular-nums">
                  {selecionadas.length}{" "}
                  {selecionadas.length === 1 ? "fatura selecionada" : "faturas selecionadas"}
                </MicroRotulo>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
    >
      <Download aria-hidden="true" className="size-3.5" />
      Baixar {selecionadas.length}
    </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelecionadas([])}>
                    Limpar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <MicroRotulo className="tabular-nums">{FATURAS.length} faturas</MicroRotulo>
                <Button
                  variant="outline"
                  size="sm"
    >
      <Download aria-hidden="true" className="size-3.5" />
      Exportar
    </Button>
              </>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Faturas emitidas, com cliente, data de emissão, valor e situação de pagamento.
              </caption>
              <thead>
                <tr className="border-border border-b">
                  <th scope="col" className="w-10 px-4 py-3">
                    <Checkbox
                      checked={todasSelecionadas}
                      onCheckedChange={(marcado) =>
                        setSelecionadas(marcado ? FATURAS.map((f) => f.numero) : [])
                      }
                      aria-label="Selecionar todas as faturas"
                    />
                  </th>
                  <th scope="col" className="px-3 py-3 text-left">
                    <MicroRotulo>Número</MicroRotulo>
                  </th>
                  <CabecalhoOrdenavel
                    coluna="cliente"
                    rotulo="Cliente"
                    ordem={ordem}
                    aoOrdenar={alternarOrdem}
                  />
                  <CabecalhoOrdenavel
                    coluna="emissao"
                    rotulo="Emissão"
                    ordem={ordem}
                    aoOrdenar={alternarOrdem}
                  />
                  <CabecalhoOrdenavel
                    coluna="valor"
                    rotulo="Valor"
                    ordem={ordem}
                    aoOrdenar={alternarOrdem}
                    alinharDireita
                  />
                  <th scope="col" className="px-3 py-3 text-left">
                    <MicroRotulo>Situação</MicroRotulo>
                  </th>
                  <th scope="col" className="w-10 px-4 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordenadas.map((fatura) => {
                  const marcada = selecionadas.includes(fatura.numero);
                  return (
                    <tr
                      key={fatura.numero}
                      className={cn(
                        "border-border-soft border-b transition-colors last:border-0",
                        marcada ? "bg-surface-3" : "hover:bg-surface-2",
                      )}
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={marcada}
                          onCheckedChange={(valor) =>
                            setSelecionadas((atual) =>
                              valor
                                ? [...atual, fatura.numero]
                                : atual.filter((n) => n !== fatura.numero),
                            )
                          }
                          aria-label={`Selecionar a fatura ${fatura.numero}`}
                        />
                      </td>
                      <th
                        scope="row"
                        className="px-3 py-3 text-left font-mono font-normal text-muted-foreground text-xs"
                      >
                        {fatura.numero}
                      </th>
                      <td className="px-3 py-3 font-medium">{fatura.cliente}</td>
                      <td className="px-3 py-3 text-muted-foreground tabular-nums">
                        {new Date(fatura.emissao).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-3 py-3 text-right font-mono tabular-nums">
                        {fatura.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="px-3 py-3">
                        <Badge color={CORES[fatura.situacao]}>{fatura.situacao}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          aria-label={`Ações da fatura ${fatura.numero}`}
                        >
                          <MoreHorizontal aria-hidden="true" className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function CabecalhoOrdenavel({
  coluna,
  rotulo,
  ordem,
  aoOrdenar,
  alinharDireita = false,
}: {
  coluna: Coluna;
  rotulo: string;
  ordem: { coluna: Coluna; crescente: boolean };
  aoOrdenar: (coluna: Coluna) => void;
  alinharDireita?: boolean;
}) {
  const ativa = ordem.coluna === coluna;
  const Seta = ordem.crescente ? ArrowUp : ArrowDown;

  return (
    <th
      scope="col"
      aria-sort={ativa ? (ordem.crescente ? "ascending" : "descending") : "none"}
      className={cn("px-3 py-3", alinharDireita ? "text-right" : "text-left")}
    >
      <button
        type="button"
        onClick={() => aoOrdenar(coluna)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded transition-colors hover:text-foreground",
          "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
          alinharDireita && "flex-row-reverse",
        )}
      >
        <MicroRotulo className={ativa ? "text-foreground" : undefined}>{rotulo}</MicroRotulo>
        {ativa ? <Seta aria-hidden="true" className="size-3" /> : null}
      </button>
    </th>
  );
}
