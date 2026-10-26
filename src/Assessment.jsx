import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, Clock3, GraduationCap, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { supabase, supabaseConfigured } from './lib/supabase';

const questions = [
  { category: 'Atendimento', question: 'Um cliente chega irritado porque está sem conseguir acessar a plataforma. Qual é sua primeira atitude?', options: ['Explicar que o problema provavelmente é do dispositivo dele.', 'Reconhecer a frustração, entender o que ocorreu e conduzir a investigação.', 'Pedir que ele tente novamente mais tarde.', 'Encaminhar imediatamente para outro setor sem investigar.'], correct: 1 },
  { category: 'Comunicação', question: 'Qual resposta demonstra mais empatia e profissionalismo?', options: ['“Você não entendeu o procedimento.”', '“Isso não é responsabilidade do suporte.”', '“Entendo como isso atrapalha seu trabalho. Vou verificar com você.”', '“Como já informei, basta seguir as instruções.”'], correct: 2 },
  { category: 'Resolução de problemas', question: 'Você não sabe responder a uma dúvida técnica. O que deve fazer?', options: ['Dar uma resposta provável para não deixar o cliente esperando.', 'Ignorar a pergunta e responder apenas o que sabe.', 'Informar que vai confirmar a informação, consultar a fonte correta e retornar.', 'Transferir o caso sem explicar o motivo.'], correct: 2 },
  { category: 'Priorização', question: 'Há vários chamados: um cliente não consegue vender, outro tem uma dúvida simples e um terceiro solicita uma melhoria. Como priorizar?', options: ['Atender pela ordem em que chegaram, sem exceção.', 'Priorizar pelo impacto, urgência e quantidade de pessoas afetadas, mantendo os demais informados.', 'Atender primeiro o cliente que escreve mais mensagens.', 'Escolher o chamado mais fácil para reduzir a fila.'], correct: 1 },
  { category: 'Segurança', question: 'Um cliente envia a senha da conta pelo chat para facilitar o atendimento. Qual é a conduta correta?', options: ['Usar a senha e apagá-la depois.', 'Pedir também o código de autenticação para acelerar.', 'Orientar a não compartilhar senhas, evitar utilizá-la e seguir o procedimento seguro da empresa.', 'Encaminhar a senha ao time técnico em um grupo público.'], correct: 2 },
  { category: 'Registro de chamados', question: 'O que deve constar em um bom registro de atendimento?', options: ['Somente “resolvido”.', 'Resumo do problema, contexto, verificações realizadas, evidências relevantes e próximos passos.', 'Opiniões pessoais sobre o cliente.', 'Apenas a conversa final, sem contexto.'], correct: 1 },
  { category: 'Expectativas', question: 'Você depende de outra equipe e não conseguirá resolver o caso no prazo inicialmente previsto. O que fazer?', options: ['Esperar o cliente cobrar para explicar o atraso.', 'Prometer um prazo curto mesmo sem confirmação.', 'Atualizar o cliente antes do prazo vencer, explicar o status e alinhar a próxima atualização.', 'Fechar o chamado até ter novidades.'], correct: 2 },
  { category: 'Customer Success', question: 'Qual é a principal diferença entre suporte e Customer Success?', options: ['Suporte resolve questões; Customer Success também atua proativamente para o cliente alcançar resultados.', 'Customer Success só responde reclamações.', 'Suporte deve vender em todo contato.', 'Não existe diferença entre as funções.'], correct: 0 },
  { category: 'Diagnóstico', question: 'Um cliente relata que “nada funciona”. Qual pergunta ajuda mais a iniciar o diagnóstico?', options: ['“Você tem certeza?”', '“Por que você fez isso?”', '“Pode descrever o que tentou fazer, o que esperava acontecer e qual mensagem apareceu?”', '“Já tentou reiniciar?” sem entender o cenário.'], correct: 2 },
  { category: 'Conflitos', question: 'O cliente está errado sobre uma funcionalidade e insiste na reclamação. Como responder?', options: ['Corrigir o cliente de forma dura para encerrar a discussão.', 'Concordar com tudo, mesmo que seja incorreto.', 'Explicar com respeito o comportamento esperado, demonstrar evidências e oferecer alternativas viáveis.', 'Encerrar o atendimento porque o cliente não concorda.'], correct: 2 },
  { category: 'Organização', question: 'Você está acompanhando vários casos que dependem de retorno. Qual prática é mais confiável?', options: ['Confiar na memória.', 'Manter registros atualizados, responsáveis e lembretes de acompanhamento.', 'Esperar que os clientes enviem novas mensagens.', 'Deixar todos os casos abertos sem anotações.'], correct: 1 },
  { category: 'Métricas', question: 'Qual interpretação de CSAT é a mais adequada?', options: ['Mede diretamente toda a receita do cliente.', 'É uma medida de satisfação com uma interação ou experiência específica, conforme a pesquisa aplicada.', 'Substitui todas as outras métricas de atendimento.', 'É uma medida exclusiva de velocidade de resposta.'], correct: 1 },
  { category: 'Limites e escalonamento', question: 'Quando é mais adequado escalar um chamado?', options: ['Sempre que o cliente fizer uma pergunta difícil.', 'Quando o caso exigir permissão, conhecimento ou atuação de outro nível, com contexto e evidências registrados.', 'Somente depois de vários dias sem resposta.', 'Nunca; o suporte deve resolver tudo sozinho.'], correct: 1 },
  { category: 'Escrita profissional', question: 'Qual mensagem é mais clara para explicar uma próxima ação?', options: ['“Estamos vendo isso.”', '“Aguarde.”', '“Identifiquei o ponto que precisamos validar. Vou encaminhar ao time responsável e retorno com uma atualização até amanhã às 15h.”', '“Não depende de mim.”'], correct: 2 },
  { category: 'Pensamento analítico', question: 'O mesmo problema aparece em vários clientes. O que isso pode indicar?', options: ['Que todos os clientes estão fazendo algo errado.', 'Que vale investigar uma causa comum, registrar exemplos e sinalizar o padrão à equipe responsável.', 'Que os chamados devem ser fechados individualmente sem análise.', 'Que é melhor não reportar para evitar alarme.'], correct: 1 },
  { category: 'Ética', question: 'Você percebe que passou uma informação incorreta a um cliente. Qual é a melhor ação?', options: ['Apagar a mensagem e não comentar.', 'Esperar para ver se alguém percebe.', 'Corrigir prontamente, explicar a informação correta e registrar o necessário.', 'Culpar uma ferramenta ou colega.'], correct: 2 },
  { category: 'Retenção', question: 'Um cliente diz que pretende cancelar porque não percebe valor na solução. O que fazer primeiro?', options: ['Oferecer desconto sem entender o motivo.', 'Ouvir os motivos, entender os resultados esperados e avaliar alternativas realistas.', 'Dificultar o cancelamento.', 'Prometer funcionalidades ainda não confirmadas.'], correct: 1 },
  { category: 'Trabalho em equipe', question: 'Você identifica um erro recorrente causado por um processo interno. Qual atitude é mais produtiva?', options: ['Criticar publicamente quem criou o processo.', 'Contornar em silêncio todas as vezes.', 'Documentar exemplos e impactos e propor uma melhoria ao time responsável.', 'Ignorar porque não faz parte do seu chamado atual.'], correct: 2 },
  { category: 'Gestão de tempo', question: 'Você tem um prazo para responder, mas ainda não tem a solução completa. O que fazer?', options: ['Enviar qualquer solução para cumprir o prazo.', 'Dar uma atualização honesta dentro do prazo, informando o que já foi verificado e quando haverá novo retorno.', 'Não responder até ter a solução final.', 'Marcar o caso como resolvido.'], correct: 1 },
  { category: 'Aprendizado', question: 'Após resolver um caso complexo, qual prática ajuda a equipe no futuro?', options: ['Guardar o conhecimento só para si.', 'Criar ou atualizar a documentação com a solução validada e os sinais para identificar o problema.', 'Apagar as anotações para manter o sistema limpo.', 'Compartilhar apenas informalmente, sem registrar.'], correct: 1 }
];

const emptyProfile = { full_name: '', email: '', consent: false };
const getOutcome = score => score >= 16 ? 'apta' : score >= 13 ? 'revisao' : 'nao_apta';

export default function Assessment() {
  const [intro, setIntro] = useState(true);
  const [profile, setProfile] = useState(emptyProfile);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = 'Etapa 2 — Avaliação de perfil | Prévia interna';
  }, []);

  const question = questions[current];
  const answeredCount = Object.keys(answers).length;
  const score = questions.reduce((total, item, index) => total + (answers[index] === item.correct ? 1 : 0), 0);
  const percent = Math.round((score / questions.length) * 100);

  function setAnswer(index, option) {
    setAnswers(old => ({ ...old, [index]: option }));
  }

  async function finishAssessment() {
    setError('');
    if (!profile.full_name.trim() || !profile.email.trim() || !profile.consent) {
      setError('Preencha seu nome, e-mail e aceite o aviso de privacidade para concluir.');
      return;
    }
    if (answeredCount !== questions.length) {
      setError('Responda às 20 questões antes de concluir.');
      return;
    }
    const outcome = getOutcome(score);
    setSaving(true);
    if (supabaseConfigured) {
      const { error: dbError } = await supabase.from('job_assessments').insert({
        full_name: profile.full_name.trim(),
        email: profile.email.trim().toLowerCase(),
        answers,
        score,
        total_questions: questions.length,
        score_percent: percent,
        outcome,
        privacy_consent: profile.consent,
        privacy_consent_at: new Date().toISOString()
      });
      if (dbError) {
        setSaving(false);
        setError('Não foi possível registrar sua avaliação. Confira os dados e tente novamente.');
        return;
      }
      setSaved(true);
    }
    setSaving(false);
    setResult({ score, percent, outcome });
  }

  return <div className="assessment-shell">
    <div className="preview-banner"><span className="preview-dot" /> PRÉVIA INTERNA · NÃO PUBLICADA · CONTEÚDO SUJEITO À APROVAÇÃO</div>
    <header className="assessment-topbar">
      <a className="brand" href="/" aria-label="Página inicial"><img className="brand-mark" src="https://greenn.com.br/assets/97b45970-d36b-4d47-a32a-16f596a50425.png" alt="" /><span>greenn<span className="brand-period">.</span></span></a>
      <span className="assessment-stage"><ShieldCheck size={15}/> PROCESSO SELETIVO · ETAPA 2</span>
    </header>

    {intro && !result && <section className="assessment-welcome">
      <div className="welcome-glow welcome-glow-one"/><div className="welcome-glow welcome-glow-two"/>
      <div className="welcome-content">
        <div className="congrats-icon"><Sparkles size={29}/><span><CheckCircle2 size={19}/></span></div>
        <div className="assessment-eyebrow"><span/> PRÓXIMA FASE LIBERADA</div>
        <h1>Parabéns! Você avançou<br/><em>para a segunda etapa.</em></h1>
        <p>Seu perfil foi selecionado para continuar no processo. Agora, queremos conhecer sua forma de pensar, priorizar e resolver situações reais de atendimento ao cliente.</p>
        <div className="welcome-stats"><div><Clock3/><strong>15–20 min</strong><small>Tempo estimado</small></div><div><Target/><strong>20 questões</strong><small>Múltipla escolha</small></div><div><GraduationCap/><strong>Perfil prático</strong><small>Suporte e CS</small></div></div>
        <div className="welcome-note"><ShieldCheck size={17}/><span>Responda com atenção e escolha a alternativa que representa a conduta mais profissional. A avaliação considera conhecimentos de atendimento, comunicação, segurança e resolução de problemas.</span></div>
        <button className="assessment-primary" onClick={() => setIntro(false)}>Iniciar avaliação <ArrowRight size={18}/></button>
        <span className="welcome-footnote">Esta é uma prévia interna do processo seletivo e ainda não representa uma comunicação oficial de contratação.</span>
      </div>
    </section>}

    {!intro && !result && <main className="assessment-main">
      <div className="assessment-heading"><div className="assessment-eyebrow"><span/> AVALIAÇÃO DE COMPETÊNCIAS</div><h1>Vamos começar.</h1><p>Leia cada cenário e selecione a alternativa mais adequada. Todas as questões são obrigatórias.</p></div>
      <div className="assessment-progress"><div className="progress-label"><span>Questão {current + 1} <span className="progress-muted">de {questions.length}</span></span><strong>{answeredCount}/{questions.length} respondidas</strong></div><div className="progress-track"><span style={{ width: `${(answeredCount / questions.length) * 100}%` }}/></div></div>
      <div className="assessment-card">
        <div className="question-meta"><span>QUESTÃO {String(current + 1).padStart(2, '0')}</span><span>{question.category}</span></div>
        <h2>{question.question}</h2>
        <div className="answer-list">
          {question.options.map((option, index) => <button type="button" key={option} className={answers[current] === index ? 'answer-option answer-selected' : 'answer-option'} onClick={() => setAnswer(current, index)}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span><span className="answer-radio">{answers[current] === index && <i/>}</span></button>)}
        </div>
        <div className="question-navigation"><button className="assessment-secondary" disabled={current === 0} onClick={() => setCurrent(value => value - 1)}><ChevronLeft size={17}/> Anterior</button><span>{current + 1} de {questions.length}</span>{current < questions.length - 1 ? <button className="assessment-primary" disabled={answers[current] === undefined} onClick={() => setCurrent(value => value + 1)}>Próxima <ChevronRight size={17}/></button> : <button className="assessment-primary" onClick={finishAssessment} disabled={saving}>{saving ? 'Registrando...' : 'Concluir avaliação'} <CheckCircle2 size={17}/></button>}</div>
      </div>
      {current === questions.length - 1 && <div className="assessment-profile">
        <div><h3>Último passo: seus dados</h3><p>Você chegou ao fim das perguntas! Preencha seu nome completo e e-mail abaixo para identificar sua avaliação e concluir esta etapa.</p></div>
        <div className="assessment-profile-grid"><label>Nome completo<input value={profile.full_name} onChange={e => setProfile(old => ({ ...old, full_name: e.target.value }))} autoComplete="name" placeholder="Seu nome completo"/></label><label>E-mail usado na candidatura<input type="email" value={profile.email} onChange={e => setProfile(old => ({ ...old, email: e.target.value }))} autoComplete="email" placeholder="voce@email.com"/></label></div>
        <label className="assessment-consent"><input type="checkbox" checked={profile.consent} onChange={e => setProfile(old => ({ ...old, consent: e.target.checked }))}/><span>Concordo com o uso das minhas respostas e do resultado para avaliação desta candidatura, conforme o aviso de privacidade do processo seletivo.</span></label>
      </div>}
      {error && <p className="assessment-error" role="alert">{error}</p>}
      {!supabaseConfigured && <p className="assessment-preview-note"><CircleHelp size={16}/> Modo de prévia: o resultado será calculado nesta página, mas não será salvo no banco enquanto o Supabase não estiver configurado.</p>}
      <button className="assessment-back-link" onClick={() => { window.location.href = '/'; }}><ArrowLeft size={15}/> Voltar à página de carreiras</button>
    </main>}

    {result && <main className="assessment-result">
      <div className="result-icon">{result.outcome === 'apta' ? <CheckCircle2 size={34}/> : result.outcome === 'revisao' ? <Target size={34}/> : <GraduationCap size={34}/>}</div>
      <div className="assessment-eyebrow"><span/> AVALIAÇÃO CONCLUÍDA</div>
      <h1>{result.outcome === 'apta' ? 'Excelente trabalho!' : result.outcome === 'revisao' ? 'Avaliação concluída.' : 'Obrigado pela participação.'}</h1>
      <p>{result.outcome === 'apta' ? 'Seu desempenho atingiu a pontuação esperada nesta etapa. A equipe responsável poderá revisar seu resultado e orientar sobre os próximos passos.' : result.outcome === 'revisao' ? 'Seu resultado será encaminhado para revisão da equipe responsável, que avaliará o conjunto da candidatura.' : 'Esta avaliação indica pontos que podem ser desenvolvidos. A equipe responsável fará a análise do resultado conforme os critérios do processo.'}</p>
      <div className="result-score"><strong>{result.score}<small>/20</small></strong><div><b>{result.percent}% de aproveitamento</b><span>Resultado da avaliação de conhecimentos</span></div></div>
      <div className="result-disclaimer"><ShieldCheck size={17}/><span>Este resultado é uma etapa de avaliação e não representa, isoladamente, uma decisão final de contratação.</span></div>
      {saved && <p className="result-saved"><CheckCircle2 size={16}/> Suas respostas foram registradas.</p>}
      {!supabaseConfigured && <p className="assessment-preview-note"><CircleHelp size={16}/> Prévia interna: resultado não salvo no banco.</p>}
      <button className="assessment-secondary" onClick={() => { window.location.href = '/'; }}><ArrowLeft size={16}/> Voltar à página de carreiras</button>
    </main>}

    <footer className="assessment-footer"><span>GREENN · PRÉVIA INTERNA</span><span>Seus dados devem ser tratados conforme o aviso de privacidade aprovado.</span></footer>
  </div>;
}
