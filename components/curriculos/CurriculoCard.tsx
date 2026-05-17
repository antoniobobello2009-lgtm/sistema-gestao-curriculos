/**
 * CurriculoCard.tsx
 * Componente de Card para exibição resumida de um Currículo na listagem
 * 
 * Exibe um resumo do currículo com:
 * - Foto/avatar do candidato
 * - Nome e cargo desejado
 * - Resumo profissional (truncado)
 * - Habilidades principais (primeiras 4)
 * - Botão para ver detalhes completos
 * 
 * É um Client Component para suportar o hover state animado e
 * futuramente possíveis interações diretas (como deletar da lista)
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Curriculo } from "@/lib/types";
import { truncateText, formatarData } from "@/lib/utils";
import { FaEye, FaEnvelope, FaPhone, FaBriefcase } from "react-icons/fa";

/**
 * Props do CurriculoCard
 */
interface CurriculoCardProps {
  /** Dados completos do currículo a ser exibido */
  curriculo: Curriculo;
}

/**
 * Componente CurriculoCard
 * Card responsivo com informações resumidas do candidato
 */
export function CurriculoCard({ curriculo }: CurriculoCardProps) {
  return (
    <Card className="card-hover flex flex-col h-full group">
      <CardHeader className="pb-3">
        {/* === CABEÇALHO DO CARD: FOTO + NOME + CARGO === */}
        <div className="flex items-start gap-4">
          {/* Foto de perfil do candidato */}
          <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
            <Image
              src={curriculo.foto}
              alt={`Foto de ${curriculo.nome}`}
              fill
              className="object-cover"
              // Fallback: se a imagem não carregar, tenta o avatar alternativo
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                // Usa UI Avatars como fallback (gera avatar com iniciais do nome)
                img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(curriculo.nome)}&background=1e3a5f&color=fff&size=56`;
              }}
            />
          </div>

          {/* Nome e cargo */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight truncate">
              {curriculo.nome}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <FaBriefcase className="h-3 w-3 text-primary flex-shrink-0" aria-hidden="true" />
              <p className="text-sm text-muted-foreground truncate">
                {curriculo.cargoDesejado}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        {/* === RESUMO PROFISSIONAL === */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {/* Trunca o resumo para não sobrecarregar o card */}
          {truncateText(curriculo.resumoProfissional, 120)}
        </p>

        {/* === INFORMAÇÕES DE CONTATO === */}
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FaEnvelope className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{curriculo.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FaPhone className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
            <span>{curriculo.telefone}</span>
          </div>
        </div>

        {/* === HABILIDADES (primeiras 4 para não sobrecarregar o card) === */}
        {curriculo.habilidades.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {curriculo.habilidades.slice(0, 4).map((habilidade) => (
              <Badge key={habilidade} variant="info" className="text-xs">
                {habilidade}
              </Badge>
            ))}
            {/* Indica se há mais habilidades além das 4 exibidas */}
            {curriculo.habilidades.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{curriculo.habilidades.length - 4}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t flex items-center justify-between">
        {/* Data de cadastro */}
        <span className="text-xs text-muted-foreground">
          Cadastrado em {formatarData(curriculo.dataCadastro)}
        </span>

        {/* Botão para ver detalhes completos */}
        <Button asChild size="sm" variant="default">
          <Link href={`/sistema/paginas/curriculos/${curriculo.id}`}>
            <FaEye className="h-3.5 w-3.5" aria-hidden="true" />
            Ver Detalhes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
