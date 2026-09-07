import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/**
 * Um separador com rótulo no meio — o "ou" entre formas de entrar.
 *
 * O `Separator` do shadcn é só a linha. Compor o rótulo aqui, e não repetir a
 * mesma flexbox em cada tela que precisa dele, é o que mantém o espaçamento e
 * o timbre do rótulo iguais em todo o catálogo.
 *
 * O separador fica `decorative`: o significado está no texto do rótulo, e
 * anunciar duas vezes a mesma divisão só atrapalha quem ouve a página.
 */
export function SeparadorComRotulo({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Separator className="flex-1" decorative />
      {children}
      <Separator className="flex-1" decorative />
    </div>
  );
}
