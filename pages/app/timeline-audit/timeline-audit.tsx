import {
  GitBranch,
  KeyRound,
  LogIn,
  Settings2,
  ShieldAlert,
  Trash2,
  UserPlus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { cn } from "@/lib/utils";

/**
 * Trilha de auditoria — quem fez o quê, quando, e de onde.
 *
 * Auditoria é o lugar onde detalhe vago custa caro. Três exigências que o
 * desenho atende: o horário é absoluto e legível ("14:32", com a data no
 * cabeçalho do dia) e não "há 3 horas", porque relativo não serve de prova; o
 * IP e o agente aparecem sem clique, porque é o que se procura primeiro num
 * incidente; e eventos sensíveis ficam marcados, não misturados no fluxo.
 *
 * A lista é uma `<ol>` de verdade — ordem importa aqui, e leitor de tela
 * anuncia a posição.
 */
type Severidade = "comum" | "sensivel";

type Evento = {
  hora: string;
  quem: string;
  acao: string;
  alvo: string;
  ip: string;
  icone: typeof LogIn;
  severidade: Severidade;
};

const DIAS: { data: string; eventos: Evento[] }[] = [
  {
    data: "Hoje, 6 de setembro",
    eventos: [
      { hora: "14:32", quem: "Marina Alves", acao: "revogou a chave de API", alvo: "producao-web", ip: "189.4.22.71", icone: KeyRound, severidade: "sensivel" },
      { hora: "13:58", quem: "Rafael Souza", acao: "publicou o tema", alvo: "aurora-v2", ip: "177.92.14.8", icone: GitBranch, severidade: "comum" },
      { hora: "11:07", quem: "Ana Prado", acao: "alterou as permissões de", alvo: "Time de design", ip: "201.17.3.44", icone: Settings2, severidade: "sensivel" },
      { hora: "09:12", quem: "Pedro Lima", acao: "entrou no workspace", alvo: "via Google", ip: "189.4.22.71", icone: LogIn, severidade: "comum" },
    ],
  },
  {
    data: "Ontem, 5 de setembro",
    eventos: [
      { hora: "17:44", quem: "Marina Alves", acao: "convidou", alvo: "julia@orbita.app", ip: "189.4.22.71", icone: UserPlus, severidade: "comum" },
      { hora: "16:20", quem: "Sistema", acao: "bloqueou 4 tentativas de acesso a", alvo: "conta de Ana Prado", ip: "45.132.8.19", icone: ShieldAlert, severidade: "sensivel" },
      { hora: "10:03", quem: "Rafael Souza", acao: "excluiu o projeto", alvo: "protótipo-descartado", ip: "177.92.14.8", icone: Trash2, severidade: "sensivel" },
    ],
  },
];

export default function AuditTrail() {
  return (
    <div className="min-h-dvh bg-background px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <MicroRotulo>Segurança</MicroRotulo>
        <h1 className="mt-2 font-display text-3xl tracking-tight">Trilha de auditoria</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Todos os eventos do workspace, na ordem em que aconteceram. Retenção de 90 dias.
        </p>

        <div className="mt-12 flex flex-col gap-10">
          {DIAS.map((dia) => (
            <section key={dia.data}>
              <h2>
                <MicroRotulo className="text-foreground">{dia.data}</MicroRotulo>
              </h2>

              <ol className="mt-4">
                {dia.eventos.map((evento, i) => (
                  <li key={`${evento.hora}-${evento.quem}`} className="relative flex gap-4 pb-6 last:pb-0">
                    {/*
                      A linha para no último item: um traço que continua depois
                      do fim sugere que há mais coisa, e não há.
                    */}
                    {i < dia.eventos.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="absolute top-9 bottom-0 left-[15px] w-px bg-border"
                      />
                    ) : null}

                    <span
                      className={cn(
                        "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-card",
                        evento.severidade === "sensivel"
                          ? "border-destructive/50 text-destructive"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      <evento.icone aria-hidden="true" className="size-3.5" />
                    </span>

                    <div className="min-w-0 flex-1 pt-1">
                      <p className="text-sm leading-snug">
                        <span className="font-medium">{evento.quem}</span>{" "}
                        <span className="text-muted-foreground">{evento.acao}</span>{" "}
                        <span className="font-mono text-xs">{evento.alvo}</span>
                      </p>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <MicroRotulo className="tabular-nums">{evento.hora}</MicroRotulo>
                        <MicroRotulo className="normal-case tracking-[0.06em] tabular-nums">
                          {evento.ip}
                        </MicroRotulo>
                        {evento.severidade === "sensivel" ? (
                          <Badge color="amber">sensível</Badge>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
