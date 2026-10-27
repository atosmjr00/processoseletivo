# Greenn — Processo seletivo

Aplicação web para apresentar a oportunidade de **Suporte ao Cliente e Customer Success (CS) para E-commerce/SaaS**, receber candidaturas e registrar a avaliação da segunda etapa.

## Funcionalidades
- Página de carreiras responsiva com apresentação da vaga, cultura, etapas e dúvidas frequentes.
- Formulário de candidatura com validação de campos e consentimento.
- Avaliação de segunda etapa com 20 questões, pontuação e aproveitamento.
- Persistência das candidaturas e avaliações no Supabase.
- Row Level Security (RLS), permitindo envio público sem liberar consulta pública dos registros.

## Desenvolvimento
1. Instale Node.js LTS.
2. Execute `npm install`.
3. Copie `.env.example` para `.env.local`.
4. Configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com as credenciais públicas do projeto.
5. Execute `npm run dev` para iniciar o servidor de desenvolvimento.
6. Execute `npm run build` para gerar a versão de produção.

## Supabase
1. No SQL Editor do projeto Supabase, execute `supabase/schema.sql`.
2. Configure as variáveis de ambiente necessárias para o ambiente em que a aplicação será publicada.
3. Nunca coloque a chave `service_role` no frontend.
4. Não conceda permissões públicas de leitura, alteração ou exclusão das candidaturas.

## Informações da oportunidade
- **Cargo:** Suporte ao Cliente e Customer Success (CS) para E-commerce/SaaS
- **Modelo:** remoto
- **Senioridade:** pleno
- **Formação:** durante a etapa de entrevista, será apresentado um curso de 8 horas com certificação. A pessoa candidata deverá concluir o curso e enviar o certificado à equipe para que a avaliação de contratação possa ser finalizada.

Antes de receber candidaturas reais, confirme os detalhes do curso (incluindo custo, prazo e entidade certificadora), as condições da vaga e publique um aviso de privacidade completo com contato para solicitações relativas aos dados pessoais e prazo de retenção.
