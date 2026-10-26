# Greenn — Recrutamento (Fase 1)

> **PRÉVIA INTERNA · NÃO PUBLICADA · CONTEÚDO SUJEITO À APROVAÇÃO**

Landing page responsiva para a vaga **Suporte ao Cliente e Customer Success (CS) para E-commerce/SaaS**, remoto, nível pleno.

## Incluído
- Página de apresentação da vaga, cultura, etapas e dúvidas frequentes.
- Formulário de candidatura com validação básica.
- Integração preparada para Supabase.
- SQL inicial com Row Level Security (RLS): candidatos podem enviar, mas não consultar candidaturas.
- Avisos para não enviar dados reais enquanto o Supabase não estiver configurado.

## Rodar localmente
1. Instale Node.js LTS.
2. Execute `npm install`.
3. Copie `.env.example` para `.env.local`.
4. Para testar sem banco, deixe as variáveis sem valores: o formulário permanece em modo de prévia.
5. Execute `npm run dev`.

## Configurar Supabase
1. Crie um projeto Supabase.
2. No SQL Editor, execute `supabase/schema.sql`.
3. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env.local`.
4. Nunca coloque a chave `service_role` no frontend.
5. Antes de receber candidaturas reais, configure aviso de privacidade aprovado, canal de contato para direitos dos titulares e política de retenção.

## Vaga
- **Cargo:** Suporte ao Cliente e Customer Success (CS) para E-commerce/SaaS
- **Modelo:** remoto
- **Senioridade:** pleno
- **Etapa de formação:** durante a entrevista, será apresentado um curso de 12 horas com certificação. A pessoa candidata deverá concluir o curso e enviar o certificado à equipe para que a avaliação de contratação possa ser finalizada.

A equipe deve confirmar antes da publicação se o curso tem custo, prazo, conteúdo, entidade certificadora e procedimento de validação. Não presumir que o curso é gratuito.

## Antes de publicar
- Validar autorização, marca, conteúdo e identidade visual.
- Confirmar faixa salarial, vínculo, horário, benefícios e requisitos finais da vaga.
- Esclarecer os detalhes do curso de 12 horas e da certificação.
- Aprovar aviso de privacidade/LGPD.
- Configurar e testar o Supabase e o fluxo administrativo com acesso restrito.
- Revisar acessibilidade, segurança e experiência mobile.

**Este repositório não foi publicado nem implantado por esta alteração.**
