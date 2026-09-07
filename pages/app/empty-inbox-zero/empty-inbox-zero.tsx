import { ArrowRight, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";

/**
 * Caixa de entrada zerada — o vazio como conquista, não como falha.
 *
 * Estado vazio tem três variedades, e confundi-las é o erro clássico: nada
 * ainda (primeiro uso), nada agora (você deu conta) e nada encontrado (o filtro
 * é estreito demais). Esta é a do meio, e por isso comemora em vez de instruir:
 * quem chegou aqui já sabe usar o produto.
 *
 * O que ela ainda faz: dá o número do que foi feito, para que a conquista seja
 * concreta, e oferece uma saída adiante em vez de deixar a pessoa parada numa
 * tela vazia.
 */
export default function InboxZero() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6 py-20">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-border bg-card">
          <Inbox aria-hidden="true" className="size-6 text-muted-foreground" />
        </div>

        <h1 className="mt-6 font-display text-2xl tracking-tight">Caixa de entrada zerada</h1>
        <p className="mt-2.5 text-muted-foreground text-sm leading-relaxed">
          Você fechou os 14 itens desta semana. Nada aqui precisa de você agora — o próximo lote
          chega na segunda.
        </p>

        <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
          {[
            { rotulo: "Fechados", valor: "14" },
            { rotulo: "Tempo médio", valor: "4h" },
            { rotulo: "Reabertos", valor: "0" },
          ].map((item) => (
            <div key={item.rotulo} className="bg-card px-3 py-4">
              <dd className="font-display text-xl tabular-nums">{item.valor}</dd>
              <dt className="mt-1">
                <MicroRotulo>{item.rotulo}</MicroRotulo>
              </dt>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Button
            size="lg"
    >
      Ver a fila do time
      <ArrowRight aria-hidden="true" className="size-4" />
    </Button>
          <a
            href="#"
            className="rounded font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
          >
            Rever os itens fechados
          </a>
        </div>
      </div>
    </div>
  );
}
