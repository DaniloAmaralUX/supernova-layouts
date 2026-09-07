"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * Configurações do workspace — formulário longo, salvo por seção.
 *
 * Formulários de configuração erram quase sempre da mesma forma: um botão
 * "salvar" no fim de uma página de dois metros, que a pessoa não vê e não sabe
 * se já apertou. Aqui cada seção salva por conta própria, e o botão só acorda
 * quando aquela seção mudou — o estado do botão é a resposta para "eu já
 * salvei isso?".
 *
 * A zona perigosa fica por último, separada por borda destrutiva, e exige
 * digitar o nome do workspace. Confirmação com consequência explícita, não um
 * "tem certeza?" que todo mundo aceita no automático.
 */
export default function WorkspaceSettings() {
  return (
    <div className="min-h-dvh bg-background px-6 py-16 md:py-20">
      <div className="mx-auto max-w-2xl">
        <MicroRotulo>Workspace</MicroRotulo>
        <h1 className="mt-2 font-display text-3xl tracking-tight">Configurações</h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Vale para todas as pessoas do workspace Órbita.
        </p>

        <div className="mt-12 flex flex-col gap-10">
          <Identidade />
          <Preferencias />
          <ZonaPerigosa />
        </div>
      </div>
    </div>
  );
}

function Secao({
  titulo,
  descricao,
  children,
  destrutiva = false,
}: {
  titulo: string;
  descricao: string;
  children: React.ReactNode;
  destrutiva?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border bg-card p-6",
        destrutiva ? "border-destructive/40" : "border-border",
      )}
    >
      <h2 className={cn("font-display text-lg", destrutiva && "text-destructive")}>{titulo}</h2>
      <p className="mt-1 text-muted-foreground text-sm leading-relaxed">{descricao}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Identidade() {
  const [nome, setNome] = useState("Órbita");
  const [descricao, setDescricao] = useState(
    "Time de produto e design engineering. Fuso de Recife.",
  );
  const [salvo, setSalvo] = useState({ nome: "Órbita", descricao: "Time de produto e design engineering. Fuso de Recife." });

  const mudou = nome !== salvo.nome || descricao !== salvo.descricao;

  return (
    <Secao titulo="Identidade" descricao="Como o workspace aparece para quem participa dele.">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="nome-do-workspace">Nome</Label>
          <Input
            id="nome-do-workspace"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            maxLength={40}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="descricao-do-workspace">Descrição</Label>
          <Textarea
            id="descricao-do-workspace"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            maxLength={160}
            aria-describedby="contagem-descricao"
          />
          <p
            id="contagem-descricao"
            className="text-right font-mono text-[10px] text-muted-foreground tabular-nums"
          >
            {descricao.length}/160
          </p>
        </div>
      </div>

      <BarraDeSalvar
        mudou={mudou}
        aoSalvar={() => setSalvo({ nome, descricao })}
        aoDescartar={() => {
          setNome(salvo.nome);
          setDescricao(salvo.descricao);
        }}
      />
    </Secao>
  );
}

const OPCOES = [
  {
    id: "convites",
    titulo: "Qualquer pessoa pode convidar",
    descricao: "Sem esta opção, só administradores convidam.",
    inicial: true,
  },
  {
    id: "publico",
    titulo: "Projetos nascem públicos",
    descricao: "Todo mundo do workspace vê projetos novos por padrão.",
    inicial: false,
  },
  {
    id: "resumo",
    titulo: "Resumo semanal por e-mail",
    descricao: "Toda segunda, o que mudou na semana anterior.",
    inicial: true,
  },
];

function Preferencias() {
  const [valores, setValores] = useState<Record<string, boolean>>(
    Object.fromEntries(OPCOES.map((o) => [o.id, o.inicial])),
  );
  const [salvos, setSalvos] = useState(valores);

  const mudou = OPCOES.some((o) => valores[o.id] !== salvos[o.id]);

  return (
    <Secao titulo="Preferências" descricao="Regras que valem para todo o workspace.">
      <ul className="flex flex-col divide-y divide-border-soft">
        {OPCOES.map((opcao) => (
          <li key={opcao.id} className="flex items-start justify-between gap-6 py-4 first:pt-0">
            <div className="min-w-0">
              <Label htmlFor={opcao.id} className="cursor-pointer">
                {opcao.titulo}
              </Label>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                {opcao.descricao}
              </p>
            </div>
            <Switch
              id={opcao.id}
              checked={valores[opcao.id]}
              onCheckedChange={(v) => setValores((atual) => ({ ...atual, [opcao.id]: v }))}
            />
          </li>
        ))}
      </ul>

      <BarraDeSalvar
        mudou={mudou}
        aoSalvar={() => setSalvos(valores)}
        aoDescartar={() => setValores(salvos)}
      />
    </Secao>
  );
}

function ZonaPerigosa() {
  const [confirmacao, setConfirmacao] = useState("");
  const podeExcluir = confirmacao === "Órbita";

  return (
    <Secao
      destrutiva
      titulo="Excluir o workspace"
      descricao="Remove os 41 projetos, os 12 temas e o histórico de todas as 8 pessoas. Não há como desfazer."
    >
      <div className="flex flex-col gap-3">
        <Label htmlFor="confirmar-exclusao">
          Digite <span className="font-mono">Órbita</span> para liberar o botão
        </Label>
        <Input
          id="confirmar-exclusao"
          value={confirmacao}
          onChange={(e) => setConfirmacao(e.target.value)}
          placeholder="Órbita"
          autoComplete="off"
        />
        <Button variant="destructive" disabled={!podeExcluir} className="mt-1 self-start">
          Excluir o workspace e tudo que há nele
        </Button>
      </div>
    </Secao>
  );
}

function BarraDeSalvar({
  mudou,
  aoSalvar,
  aoDescartar,
}: {
  mudou: boolean;
  aoSalvar: () => void;
  aoDescartar: () => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-end gap-2 border-border border-t pt-5">
      {/*
        O aviso é a resposta para "eu já salvei?". Ele aparece só quando há o
        que salvar, e o botão desabilitado no resto do tempo diz o mesmo.
      */}
      <p aria-live="polite" className="mr-auto font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {mudou ? "alterações não salvas" : ""}
      </p>
      <Button variant="ghost" size="sm" disabled={!mudou} onClick={aoDescartar}>
        Descartar
      </Button>
      <Button size="sm" disabled={!mudou} onClick={aoSalvar}>
        Salvar seção
      </Button>
    </div>
  );
}
