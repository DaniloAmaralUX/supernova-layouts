"use client";

import { Check, CornerDownLeft, Smile } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * Thread embutida — comentário ancorado num trecho, com reações e resolução.
 *
 * O que faz uma thread funcionar dentro do conteúdo é a âncora: o trecho
 * comentado fica visível acima da conversa, com marcação própria. Sem isso, a
 * pessoa lê a discussão sem saber sobre o quê.
 *
 * Resolver não apaga: a thread encolhe para uma linha com quem resolveu e
 * quando, e reabre num clique. Conversa apagada é contexto perdido — e alguém
 * vai perguntar de novo daqui a três meses.
 */
type Comentario = {
  id: string;
  autor: string;
  iniciais: string;
  quando: string;
  texto: string;
  reacoes: { emoji: string; contagem: number; minha: boolean }[];
};

const COMENTARIOS: Comentario[] = [
  {
    id: "c1",
    autor: "Marina Alves",
    iniciais: "MA",
    quando: "14:32",
    texto:
      "Esse trecho promete comparação entre temas, mas o núcleo hoje só troca um preset por vez. Ou o texto muda, ou a função entra no escopo.",
    reacoes: [{ emoji: "👀", contagem: 2, minha: false }],
  },
  {
    id: "c2",
    autor: "Rafael Souza",
    iniciais: "RS",
    quando: "14:51",
    texto: "Concordo. Proponho tirar a promessa agora e abrir uma história para a comparação.",
    reacoes: [
      { emoji: "👍", contagem: 3, minha: true },
      { emoji: "🎯", contagem: 1, minha: false },
    ],
  },
];

export default function InlineThread() {
  const [resolvida, setResolvida] = useState(false);
  const [rascunho, setRascunho] = useState("");
  const [comentarios, setComentarios] = useState(COMENTARIOS);

  function responder() {
    const texto = rascunho.trim();
    if (!texto) return;
    setComentarios((atual) => [
      ...atual,
      {
        id: `c${atual.length + 1}`,
        autor: "Você",
        iniciais: "DA",
        quando: "agora",
        texto,
        reacoes: [],
      },
    ]);
    setRascunho("");
  }

  return (
    <div className="min-h-dvh bg-background px-6 py-16 md:py-20">
      <div className="mx-auto max-w-2xl">
        <MicroRotulo>Revisão do documento</MicroRotulo>
        <h1 className="mt-2 font-display text-3xl tracking-tight">Contrato de produto</h1>

        <div className="mt-10 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            O produto reúne catálogo, temas e efeitos numa casca só. A navegação preserva busca e
            categoria entre as ferramentas, e o estado da URL reproduz o que está na tela.
          </p>
          <p className="mt-4">
            {/*
              A âncora: o trecho comentado fica marcado no texto, e a thread
              logo abaixo. Sem isso, a conversa flutua sem assunto.
            */}
            <mark className="bg-accent px-0.5 text-foreground decoration-foreground/40 underline decoration-dashed underline-offset-4">
              A pessoa compara dois temas lado a lado e escolhe o que fica.
            </mark>{" "}
            <span className="text-muted-foreground">
              O plano de instalação é gerado a partir do que estiver selecionado.
            </span>
          </p>
        </div>

        {resolvida ? (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <Check aria-hidden="true" className="size-4 shrink-0 text-brand" />
            <p className="min-w-0 flex-1 text-muted-foreground text-sm">
              Resolvida por <span className="text-foreground">Rafael Souza</span> · 2 comentários
            </p>
            <Button variant="ghost" size="sm" onClick={() => setResolvida(false)}>
              Reabrir
            </Button>
          </div>
        ) : (
          <section
            aria-label="Conversa sobre o trecho selecionado"
            className="mt-6 overflow-hidden rounded-xl border border-border bg-card"
          >
            <header className="flex items-center justify-between gap-3 border-border border-b px-4 py-2.5">
              <MicroRotulo className="tabular-nums">{comentarios.length} comentários</MicroRotulo>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResolvida(true)}
    >
      <Check aria-hidden="true" className="size-3.5" />
      Resolver
    </Button>
            </header>

            <ol className="flex flex-col divide-y divide-border-soft">
              {comentarios.map((comentario) => (
                <li key={comentario.id} className="flex gap-3 px-4 py-4">
                  <Avatar className="size-7 shrink-0">
                    <AvatarFallback className="text-[10px]">{comentario.iniciais}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline gap-2">
                      <span className="font-medium text-sm">{comentario.autor}</span>
                      <MicroRotulo className="tabular-nums">{comentario.quando}</MicroRotulo>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">{comentario.texto}</p>

                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {comentario.reacoes.map((reacao) => (
                        <li key={reacao.emoji}>
                          <button
                            type="button"
                            aria-pressed={reacao.minha}
                            className={cn(
                              "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors",
                              "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
                              reacao.minha
                                ? "border-foreground/40 bg-accent"
                                : "border-border hover:border-foreground/30",
                            )}
                          >
                            <span aria-hidden="true">{reacao.emoji}</span>
                            <span className="font-mono tabular-nums">{reacao.contagem}</span>
                            <span className="sr-only">
                              {reacao.minha ? "Remover sua reação" : "Reagir"} {reacao.emoji}
                            </span>
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          type="button"
                          aria-label="Adicionar reação"
                          className="flex items-center rounded-full border border-border px-2 py-1 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                        >
                          <Smile aria-hidden="true" className="size-3" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            <div className="border-border border-t p-3">
              <Textarea
                value={rascunho}
                onChange={(e) => setRascunho(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    responder();
                  }
                }}
                placeholder="Responder na thread"
                aria-label="Responder na thread"
                rows={2}
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5">
                  <Kbd>⌘</Kbd>
                  <Kbd>
                    <CornerDownLeft aria-hidden="true" className="size-3" />
                  </Kbd>
                  <MicroRotulo>enviar</MicroRotulo>
                </span>
                <Button size="sm" disabled={!rascunho.trim()} onClick={responder}>
                  Responder
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
