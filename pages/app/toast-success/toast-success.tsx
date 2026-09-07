"use client";

import { CheckCircle2, Undo2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { cn } from "@/lib/utils";

/**
 * Aviso de sucesso — com desfazer, e com o tempo à vista.
 *
 * Um aviso que some sozinho é uma corrida contra o relógio que a pessoa não
 * sabe que começou. Três correções: a barra mostra quanto tempo resta; passar
 * o mouse ou levar o foco para dentro pausa a contagem; e o desfazer, quando
 * existe, é a razão de o aviso durar — some junto com ele.
 *
 * A região é `aria-live="polite"` com `role="status"`: a mudança é anunciada
 * sem interromper o que a pessoa está lendo. Alerta assertivo se reserva a
 * erro, não a confirmação.
 */
const DURACAO = 6000;

export default function SuccessToast() {
  const [visivel, setVisivel] = useState(true);
  const [pausado, setPausado] = useState(false);
  const [restante, setRestante] = useState(DURACAO);
  const ultimoTique = useRef<number>(0);

  useEffect(() => {
    if (!visivel || pausado) return;

    ultimoTique.current = performance.now();
    let quadro = 0;

    const passo = (agora: number) => {
      const decorrido = agora - ultimoTique.current;
      ultimoTique.current = agora;
      setRestante((r) => {
        const proximo = r - decorrido;
        if (proximo <= 0) {
          setVisivel(false);
          return 0;
        }
        return proximo;
      });
      quadro = requestAnimationFrame(passo);
    };

    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [visivel, pausado]);

  const percentual = Math.max(0, (restante / DURACAO) * 100);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-background px-6 py-20">
      <div className="text-center">
        <MicroRotulo>Avisos</MicroRotulo>
        <h1 className="mt-2 font-display text-3xl tracking-tight">Aviso de sucesso</h1>
        <p className="mt-2 max-w-md text-muted-foreground text-sm leading-relaxed">
          Passe o mouse por cima ou leve o foco para dentro: a contagem pausa. Um aviso com
          desfazer não pode expirar enquanto a pessoa ainda está decidindo.
        </p>
      </div>

      <div className="flex min-h-32 items-start">
        {visivel ? (
          <div
            role="status"
            aria-live="polite"
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
            onFocusCapture={() => setPausado(true)}
            onBlurCapture={() => setPausado(false)}
            className={cn(
              "relative w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-lg",
              "animate-[entrar-de-baixo_240ms_cubic-bezier(0.23,1,0.32,1)] motion-reduce:animate-none",
            )}
          >
            <div className="flex gap-3 p-4">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />

              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">Tema publicado</p>
                <p className="mt-0.5 text-muted-foreground text-sm leading-snug">
                  Aurora v2 está no ar para as 8 pessoas do workspace.
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
       onClick={() => setVisivel(false)}
    >
      <Undo2 aria-hidden="true" className="size-3.5" />
      Desfazer
    </Button>
                  <MicroRotulo className="tabular-nums">
                    {pausado ? "pausado" : `${Math.ceil(restante / 1000)}s`}
                  </MicroRotulo>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setVisivel(false)}
                aria-label="Dispensar o aviso"
                className="-m-1 h-fit rounded p-1 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
              >
                <X aria-hidden="true" className="size-3.5" />
              </button>
            </div>

            {/*
              O tempo restante como barra: informação, não decoração. Sem ela,
              o aviso é uma janela que fecha sem avisar.
            */}
            <div
              aria-hidden="true"
              style={{ transform: `scaleX(${percentual / 100})` }}
              className="h-0.5 origin-left bg-brand/60"
            />
          </div>
        ) : (
          <Button variant="outline" onClick={() => { setRestante(DURACAO); setVisivel(true); }}>
            Mostrar o aviso de novo
          </Button>
        )}
      </div>
    </div>
  );
}
