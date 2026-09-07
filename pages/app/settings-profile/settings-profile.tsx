"use client";

import { Camera } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MicroRotulo } from "@/components/supernova/micro-rotulo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Perfil — abas de configuração com o formulário da pessoa.
 *
 * As abas ficam no cabeçalho da página, e não flutuando sobre o conteúdo,
 * porque configuração é lugar onde as pessoas chegam por link direto: a aba
 * ativa precisa ser parte do endereço mental da tela.
 *
 * O campo de nome de usuário mostra o endereço completo enquanto se digita.
 * Um campo que só aceita a metade do que a pessoa está construindo esconde o
 * resultado até depois do erro.
 */
export default function Profile() {
  return (
    <div className="min-h-dvh bg-background px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <MicroRotulo>Conta</MicroRotulo>
        <h1 className="mt-2 font-display text-3xl tracking-tight">Seu perfil</h1>

        <Tabs defaultValue="perfil" className="mt-10">
          <TabsList>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="conta">Conta</TabsTrigger>
            <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil" className="pt-8">
            <FormularioDePerfil />
          </TabsContent>
          <TabsContent value="conta" className="pt-8">
            <PainelVazio texto="Endereço de e-mail, senha e sessões abertas." />
          </TabsContent>
          <TabsContent value="notificacoes" className="pt-8">
            <PainelVazio texto="O que chega por e-mail e o que fica só no produto." />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function FormularioDePerfil() {
  const [usuario, setUsuario] = useState("danilo");
  const [bio, setBio] = useState("Design engineer. Trabalho na fronteira entre o Figma e o main.");

  return (
    <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
      <section className="flex items-center gap-5">
        <Avatar className="size-16">
          <AvatarFallback className="text-lg">DA</AvatarFallback>
        </Avatar>
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
    >
      <Camera aria-hidden="true" className="size-3.5" />
      Trocar a foto
    </Button>
          <p className="mt-2 text-muted-foreground text-xs">JPG ou PNG, até 2 MB.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="nome-completo">Nome</Label>
          <Input id="nome-completo" defaultValue="Danilo do Amaral" autoComplete="name" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="nome-de-usuario">Nome de usuário</Label>
          <Input
            id="nome-de-usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value.replace(/[^a-z0-9-]/gi, "").toLowerCase())}
            aria-describedby="dica-usuario"
          />
          {/*
            O endereço final aparece enquanto se digita: a pessoa vê o que está
            construindo, em vez de descobrir o formato depois de errar.
          */}
          <p id="dica-usuario" className="font-mono text-[11px] text-muted-foreground">
            orbita.app/{usuario || "…"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={200}
          aria-describedby="contagem-bio"
        />
        <p
          id="contagem-bio"
          className="text-right font-mono text-[10px] text-muted-foreground tabular-nums"
        >
          {bio.length}/200
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fuso">Fuso horário</Label>
          <Select defaultValue="recife">
            <SelectTrigger id="fuso">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recife">Recife (GMT−3)</SelectItem>
              <SelectItem value="sao-paulo">São Paulo (GMT−3)</SelectItem>
              <SelectItem value="lisboa">Lisboa (GMT+1)</SelectItem>
              <SelectItem value="berlim">Berlim (GMT+2)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="funcao">Função</Label>
          <Input id="funcao" defaultValue="Design Engineer" />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-border border-t pt-6">
        <Button type="button" variant="ghost">
          Descartar
        </Button>
        <Button type="submit">Salvar perfil</Button>
      </div>
    </form>
  );
}

function PainelVazio({ texto }: { texto: string }) {
  return (
    <div className="rounded-xl border border-border border-dashed p-12 text-center">
      <p className="text-muted-foreground text-sm">{texto}</p>
    </div>
  );
}
