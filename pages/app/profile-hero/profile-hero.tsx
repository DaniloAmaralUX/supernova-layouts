import { Globe, MapPin, MessageSquare, FolderGit2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { SeparadorComRotulo } from "@/components/supernova/separador-com-rotulo";

/**
 * Capa de perfil — identidade, contexto e o que a pessoa fez.
 *
 * A ordem responde a três perguntas, nesta sequência: quem é, como falo com
 * ela, e o que ela entregou. Números de vaidade (seguidores) ficam de fora; o
 * que aparece é trabalho — projetos, temas publicados, revisões.
 *
 * A faixa superior é um gradiente de tokens, sem imagem: uma capa que depende
 * de foto quebra quando a foto não existe, e ela quase nunca existe.
 */
const NUMEROS = [
  { rotulo: "Projetos", valor: "24" },
  { rotulo: "Temas publicados", valor: "7" },
  { rotulo: "Revisões", valor: "182" },
  { rotulo: "No time desde", valor: "2024" },
];

const HABILIDADES = ["Design systems", "Acessibilidade", "Motion", "React", "Tokens"];

export default function ProfileHero() {
  return (
    <div className="min-h-dvh bg-background">
      <div
        aria-hidden="true"
        className="h-44 bg-[linear-gradient(120deg,var(--color-accent),var(--color-muted)_55%,var(--color-card))] md:h-56"
      />

      <div className="mx-auto max-w-4xl px-6 pb-20">
        <div className="-mt-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-5">
            <Avatar className="size-28 rounded-2xl border-4 border-background">
              <AvatarFallback className="rounded-2xl text-xl">DA</AvatarFallback>
            </Avatar>
            <div className="pb-1">
              <h1 className="font-display text-2xl tracking-tight">Danilo do Amaral</h1>
              <p className="mt-0.5 text-muted-foreground text-sm">Design Engineer · Órbita</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
    >
      <MessageSquare aria-hidden="true" className="size-4" />
      Mensagem
    </Button>
            <Button>Seguir trabalho</Button>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed">
          Trabalho na fronteira entre o Figma e o main. Cuido do design system da Órbita: tokens,
          catálogo de blocos e a régua de acessibilidade que o time usa antes de publicar.
        </p>

        <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <li className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <MapPin aria-hidden="true" className="size-3.5" />
            Recife, Brasil
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-1.5 rounded text-muted-foreground text-sm underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            >
              <Globe aria-hidden="true" className="size-3.5" />
              danilo.design
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-1.5 rounded text-muted-foreground text-sm underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            >
              <FolderGit2 aria-hidden="true" className="size-3.5" />
              danilo
            </a>
          </li>
        </ul>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {HABILIDADES.map((habilidade) => (
            <li key={habilidade}>
              <Badge color="gray">{habilidade}</Badge>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <SeparadorComRotulo>
            <MicroRotulo>Trabalho</MicroRotulo>
          </SeparadorComRotulo>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
          {NUMEROS.map((numero) => (
            <div key={numero.rotulo} className="bg-card px-5 py-5">
              <dd className="font-display text-2xl tabular-nums">{numero.valor}</dd>
              <dt className="mt-1">
                <MicroRotulo>{numero.rotulo}</MicroRotulo>
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
