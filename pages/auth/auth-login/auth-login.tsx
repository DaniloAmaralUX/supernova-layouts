"use client";

import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { SeparadorComRotulo } from "@/components/supernova/separador-com-rotulo";

/**
 * Entrar — acesso por link mágico, com painel editorial à esquerda.
 *
 * Duas colunas: à esquerda o contexto do produto, à direita uma única coluna
 * de formulário. A divisão existe para que a decisão ("é aqui que eu entro?")
 * e a ação ("entrar") não disputem o mesmo espaço.
 *
 * O painel esquerdo é desenhado só com tokens e um gradiente que respira — sem
 * imagem, sem WebGL, sem canvas. Um bloco de acesso é a primeira tela que
 * carrega num produto: não é lugar de motor gráfico. Em `prefers-reduced-motion`
 * o movimento simplesmente não acontece.
 */
export default function Login() {
  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      <PainelEditorial />
      <section className="flex items-center justify-center px-6 py-16 sm:px-12">
        <Formulario />
      </section>
    </div>
  );
}

const PILARES = [
  { numero: "01", titulo: "Catálogo", texto: "Blocos prontos, com o código à vista." },
  { numero: "02", titulo: "Tokens", texto: "Um tema, e o produto inteiro acompanha." },
  { numero: "03", titulo: "Registry", texto: "Instalação por CLI, sem copiar e colar." },
];

function PainelEditorial() {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden border-border-soft border-r bg-surface-1 px-12 py-14 lg:flex">
      {/*
        O brilho que respira. `animate-pulse` seria batida cardíaca; isto é uma
        maré de 18 segundos, lenta o bastante para não competir com o formulário.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-[respirar_18s_ease-in-out_infinite] bg-[radial-gradient(ellipse_at_20%_15%,var(--color-accent),transparent_62%)] opacity-70 motion-reduce:animate-none"
      />

      <div className="relative flex items-center gap-2.5">
        <span aria-hidden="true" className="size-2 rounded-full bg-foreground" />
        <MicroRotulo className="text-foreground">Órbita</MicroRotulo>
      </div>

      <div className="relative max-w-md">
        <h2 className="font-display text-3xl leading-[1.1] tracking-tight">
          O trabalho continua
          <br />
          exatamente onde parou.
        </h2>
        <ul className="mt-10 flex flex-col gap-6">
          {PILARES.map((pilar) => (
            <li key={pilar.numero} className="flex gap-4">
              <MicroRotulo className="pt-1 tabular-nums">{pilar.numero}</MicroRotulo>
              <div>
                <div className="font-medium text-foreground text-sm">{pilar.titulo}</div>
                <p className="mt-0.5 text-muted-foreground text-sm">{pilar.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <MicroRotulo className="relative">Ambiente de demonstração</MicroRotulo>
    </aside>
  );
}

function Formulario() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviadoPara, setEnviadoPara] = useState<string | null>(null);

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const limpo = email.trim().toLowerCase();
    if (!limpo) return;

    setEnviando(true);
    // Demonstração: o atraso existe para que o estado de envio seja visível.
    // Num produto real, aqui entra a chamada que dispara o e-mail.
    window.setTimeout(() => {
      setEnviadoPara(limpo);
      setEnviando(false);
    }, 600);
  }

  return (
    <div className="w-full max-w-sm">
      <MicroRotulo>Bem-vindo de volta</MicroRotulo>
      <h1 className="mt-3 font-display text-3xl leading-tight tracking-tight">Entrar na Órbita</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Mandamos um link para o seu e-mail. Sem senha para lembrar.
      </p>

      <form onSubmit={enviar} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email-de-acesso">E-mail</Label>
          <Input
            id="email-de-acesso"
            type="email"
            required
            autoComplete="email"
            placeholder="voce@empresa.com.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button type="submit" size="lg" disabled={enviando} className="mt-1">
          {enviando ? "Enviando…" : "Enviar link de acesso"}
        </Button>

        {enviadoPara ? null : (
          <p className="text-center text-muted-foreground text-xs">
            <Kbd>⌘</Kbd> <Kbd>↵</Kbd> para enviar
          </p>
        )}
      </form>

      {/*
        A confirmação substitui a dica de atalho em vez de empilhar sob ela: a
        pessoa acabou de agir, e o que importa agora é para onde o link foi.
      */}
      <p aria-live="polite" className="min-h-5 text-sm">
        {enviadoPara ? (
          <span className="mt-4 block rounded-lg border border-border bg-card px-3 py-2.5 text-muted-foreground">
            Link enviado para <span className="text-foreground">{enviadoPara}</span>. Abra a caixa de
            entrada para continuar.
          </span>
        ) : null}
      </p>

      <div className="my-7">
        <SeparadorComRotulo>
          <MicroRotulo>ou</MicroRotulo>
        </SeparadorComRotulo>
      </div>

      <div className="flex flex-col gap-2">
        <Button variant="outline" size="lg" type="button"
    >
      <IconeGoogle />
      Continuar com Google
    </Button>
        <Button variant="outline" size="lg" type="button"
    >
      <IconeApple />
      Continuar com Apple
    </Button>
      </div>

      <p className="mt-8 text-center text-muted-foreground text-xs leading-relaxed">
        Ao entrar, você concorda com os termos de uso e a política de privacidade.
      </p>
    </div>
  );
}

function IconeGoogle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="currentColor"
        d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.64 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.95s2.63-5.95 5.85-5.95c1.84 0 3.07.78 3.77 1.45l2.57-2.5C16.71 3.8 14.59 2.9 12 2.9 6.97 2.9 2.9 6.97 2.9 12s4.07 9.1 9.1 9.1c5.26 0 8.74-3.69 8.74-8.89 0-.6-.06-1.05-.14-1.51Z"
      />
    </svg>
  );
}

function IconeApple() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="currentColor"
        d="M16.37 1.43c.06 1.2-.39 2.37-1.17 3.2-.8.85-2.08 1.5-3.28 1.41-.09-1.19.5-2.37 1.21-3.13.8-.88 2.16-1.52 3.24-1.48ZM20.5 17.33c-.55 1.27-.82 1.84-1.53 2.96-.99 1.57-2.39 3.53-4.12 3.54-1.54.02-1.94-1-4.03-.99-2.1.01-2.54 1-4.08.98-1.73-.02-3.06-1.78-4.05-3.35-2.77-4.4-3.06-9.56-1.35-12.31 1.21-1.95 3.12-3.1 4.91-3.1 1.82 0 2.97.99 4.47.99 1.46 0 2.35-1 4.45-1 1.59 0 3.27.86 4.47 2.36-3.93 2.15-3.29 7.76 1.06 9.92Z"
      />
    </svg>
  );
}
