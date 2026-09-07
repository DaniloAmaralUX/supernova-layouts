import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * O rótulo em mono maiúsculo com entreletra aberta.
 *
 * É a assinatura tipográfica da família — aparece na biblioteca da Supernova (categoria
 * sob o card), em compounddesign (etiqueta das seções) e aqui, sobre grupos,
 * contagens e estados. Existe como átomo porque repetir a tripla
 * `font-mono uppercase tracking-[0.2em]` à mão é como a entreletra começa a
 * divergir de tela para tela.
 */
export function MicroRotulo({
  children,
  className,
  as: Componente = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Componente
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </Componente>
  );
}
