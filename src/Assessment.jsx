import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, Clock3, GraduationCap, HeartHandshake, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { supabase, supabaseConfigured } from './lib/supabase';

const questions = [
  { category: 'Atendimento', question: 'Um cliente está com um problema. O que você faz primeiro?', options: ['Ouço com atenção para entender o que aconteceu.', 'Digo para tentar outro dia.', 'Culpo outro setor.', 'Encerro o atendimento.'], correct: 0 },
  { category: 'Educação', question: 'Qual resposta é mais educada?', options: ['“Isso não é comigo.”', '“Entendo. Vou tentar ajudar você.”', '“Você deveria saber isso.”', '“Leia direito.”'], correct: 1 },
  { category: 'Dúvidas', question: 'Se você não souber responder a uma pergunta, o que faz?', options: ['Invento uma resposta.', 'Ignoro a pergunta.', 'Procuro a informação ou peço ajuda.', 'Digo que o cliente está errado.'], correct: 2 },
  { category: 'Organização', question: 'Você tem várias tarefas. Como decide por onde começar?', options: ['Faço só a mais fácil.', 'Vejo o que é mais urgente e importante.', 'Espero alguém reclamar.', 'Escolho aleatoriamente.'], correct: 1 },
  { category: 'Responsabilidade', question: 'Você percebe que cometeu um erro no trabalho. O que faz?', options: ['Escondo o erro.', 'Culpo um colega.', 'Finjo que nada aconteceu.', 'Aviso o responsável e ajudo a corrigir.'], correct: 3 },
  { category: 'Pontualidade', question: 'Você percebe que vai se atrasar. O que faz?', options: ['Aviso assim que possível.', 'Não aviso ninguém.', 'Invento uma desculpa depois.', 'Espero perguntarem.'], correct: 0 },
  { category: 'Equipe', question: 'Um colega pede ajuda e você terminou sua tarefa. O que faz?', options: ['Digo que não é comigo.', 'Ajudo se puder, sem abandonar minhas responsabilidades.', 'Ignoro a mensagem.', 'Reclamo com os outros.'], correct: 1 },
  { category: 'Atenção', question: 'Antes de enviar uma mensagem importante, o que é bom fazer?', options: ['Enviar sem ler.', 'Usar o que lembrar.', 'Conferir se está clara e correta.', 'Escrever tudo em letras maiúsculas.'], correct: 2 },
  { category: 'Problemas', question: 'Um cliente diz que algo não funciona. O que você pergunta?', options: ['“Por que fez isso?”', '“O que aconteceu e o que apareceu na tela?”', '“Tem certeza?”', '“Você não sabe usar?”'], correct: 1 },
  { category: 'Paciência', question: 'Um cliente faz a mesma pergunta de novo. Como reage?', options: ['Explico com paciência de outra forma.', 'Digo que já expliquei e encerro.', 'Faço piada com ele.', 'Paro de responder.'], correct: 0 },
  { category: 'Compromisso', question: 'Você prometeu retornar, mas ainda não tem a solução. O que faz?', options: ['Não retorno.', 'Digo que está resolvido.', 'Espero o cliente cobrar.', 'Atualizo a pessoa com honestidade e explico o próximo passo.'], correct: 3 },
  { category: 'Segurança', question: 'Alguém pede sua senha de trabalho pelo chat. O que faz?', options: ['Envio se parecer confiável.', 'Mando no grupo.', 'Não compartilho a senha.', 'Tiro uma foto e envio.'], correct: 2 },
  { category: 'Aprendizado', question: 'Você recebe uma orientação para melhorar seu trabalho. O que faz?', options: ['Tento aprender e aplicar.', 'Ignoro tudo.', 'Não deixo a pessoa terminar.', 'Desisto da tarefa.'], correct: 0 },
  { category: 'Comunicação', question: 'Qual mensagem é mais útil para um cliente?', options: ['“Aguarde.”', '“Estamos verificando e aviso quando houver novidades.”', '“Não sei.”', '“Veja isso aí.”'], correct: 1 },
  { category: 'Colaboração', question: 'Você percebe que colegas têm a mesma dificuldade. O que faz?', options: ['Não comento.', 'Digo que cada um se vire.', 'Compartilho o que descobri e aviso a equipe.', 'Espalho boatos.'], correct: 2 },
  { category: 'Honestidade', question: 'Você não tem certeza de uma informação. O que deve fazer?', options: ['Falar com certeza mesmo assim.', 'Escolher qualquer resposta.', 'Mudar de assunto.', 'Confirmar antes de responder.'], correct: 3 },
  { category: 'Respeito', question: 'Um cliente está nervoso. Como você deve agir?', options: ['Manter a calma e conversar com respeito.', 'Responder com grosseria.', 'Ofender o cliente.', 'Encerrar sem explicar.'], correct: 0 },
  { category: 'Prioridades', question: 'Um problema impede um cliente de trabalhar e outro tem uma dúvida simples. O que considera?', options: ['Quem insiste mais.', 'A urgência e o impacto de cada situação.', 'Ignoro o problema mais sério.', 'Escolho sem pensar.'], correct: 1 },
  { category: 'Registro', question: 'Depois de resolver um problema, por que registrar o que foi feito?', options: ['Nunca é útil.', 'Só para preencher espaço.', 'Para que a equipe entenda o caso se ele voltar.', 'Para culpar o cliente.'], correct: 2 },
  { category: 'Iniciativa', question: 'Você terminou suas tarefas e tem tempo disponível. O que faz?', options: ['Fico sem fazer nada.', 'Saio sem avisar.', 'Apago tarefas antigas.', 'Pergunto se posso ajudar em algo prioritário.'], correct: 3 }
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
  const [showProfileStep, setShowProfileStep] = useState(false);

  useEffect(() => {
    document.title = 'Etapa 2 — Avaliação de perfil | Carreiras Greenn';
  }, []);

  useEffect(() => {
    if (result) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [result]);

  const question = questions[current];
  const answeredCount = Object.keys(answers).length;
  const score = questions.reduce((total, item, index) => total + (answers[index] === item.correct ? 1 : 0), 0);
  const percent = Math.round((score / questions.length) * 100);

  function setAnswer(index, option) {
    setAnswers(old => ({ ...old, [index]: option }));
  }

  async function finishAssessment() {
    setError('');
    if (!supabaseConfigured) {
      setError('Não foi possível enviar sua avaliação neste momento. Tente novamente mais tarde ou entre em contato com a equipe responsável.');
      return;
    }
    if (!profile.full_name.trim() || !profile.email.trim() || !profile.consent) {
      setError('Preencha seu nome completo, e-mail e marque a caixa de consentimento para continuar.');
      window.setTimeout(() => document.getElementById('assessment-profile')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
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
        <div className="question-navigation"><button className="assessment-secondary" disabled={current === 0} onClick={() => setCurrent(value => value - 1)}><ChevronLeft size={17}/> Anterior</button><span>{current + 1} de {questions.length}</span>{current < questions.length - 1 ? <button className="assessment-primary" disabled={answers[current] === undefined} onClick={() => setCurrent(value => value + 1)}>Próxima <ChevronRight size={17}/></button> : <button className="assessment-primary" onClick={() => { setShowProfileStep(true); setError(''); window.setTimeout(() => document.getElementById('assessment-profile')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80); }}>Preencher meus dados <ArrowRight size={17}/></button>}</div>
      </div>
      {current === questions.length - 1 && showProfileStep && <div className="assessment-profile" id="assessment-profile">
        <div><h3>Último passo: seus dados</h3><p>Você chegou ao fim das perguntas! Preencha seu nome completo e e-mail abaixo para identificar sua avaliação e concluir esta etapa.</p></div>
        <div className="assessment-profile-grid"><label>Nome completo<input value={profile.full_name} onChange={e => setProfile(old => ({ ...old, full_name: e.target.value }))} autoComplete="name" placeholder="Seu nome completo"/></label><label>E-mail usado na candidatura<input type="email" value={profile.email} onChange={e => setProfile(old => ({ ...old, email: e.target.value }))} autoComplete="email" placeholder="voce@email.com"/></label></div>
        <label className="assessment-consent"><input type="checkbox" checked={profile.consent} onChange={e => setProfile(old => ({ ...old, consent: e.target.checked }))}/><span>Concordo com o uso das minhas respostas e do resultado para avaliação desta candidatura, conforme o aviso de privacidade do processo seletivo.</span></label>
        <div className="assessment-profile-actions"><button className="assessment-primary" onClick={finishAssessment} disabled={saving}>{saving ? 'Concluindo...' : 'Próximo: concluir avaliação'} <ArrowRight size={17}/></button></div>
      </div>}
      {error && <p className="assessment-error" role="alert">{error}</p>}
      <button className="assessment-back-link" onClick={() => { window.location.href = '/'; }}><ArrowLeft size={15}/> Voltar à página de carreiras</button>
    </main>}

    {result && <main className="assessment-result completion-screen">
      <div className="completion-celebration" aria-hidden="true">
        <span className="celebration-orbit orbit-a" />
        <span className="celebration-orbit orbit-b" />
        <span className="celebration-spark spark-a"><Sparkles size={19}/></span>
        <span className="celebration-spark spark-b"><Sparkles size={14}/></span>
        <span className="celebration-spark spark-c"><Sparkles size={17}/></span>
        <div className="completion-check"><CheckCircle2 size={42}/></div>
      </div>
      <div className="assessment-eyebrow"><span/> ETAPA 2 FINALIZADA</div>
      <h1>Pronto! Você concluiu<br/><em>mais uma etapa.</em></h1>
      <p className="completion-lede">Suas respostas e seus dados foram enviados com sucesso.</p>
      <div className="result-score completion-score"><strong>{result.score}<small>/20</small></strong><div><b>{result.percent}% de aproveitamento</b><span>Resultado da avaliação de conhecimentos</span></div></div>
      <div className="completion-next-step">
        <div className="completion-next-icon"><Clock3 size={20}/></div>
        <div><strong>E agora, o que acontece?</strong><p>Basta aguardar o retorno da empresa. A equipe responsável analisará sua candidatura e entrará em contato pelo e-mail informado caso haja novidades sobre as próximas etapas.</p></div>
      </div>
      <div className="completion-thanks"><HeartHandshake size={18}/><span>Obrigado por dedicar seu tempo e participar do processo seletivo. Desejamos sucesso!</span></div>
      <button className="assessment-secondary" onClick={() => { window.location.href = '/'; }}><ArrowLeft size={16}/> Voltar à página de carreiras</button>
    </main>}

    <footer className="assessment-footer"><span>GREENN · CARREIRAS</span><span>Seus dados são utilizados para conduzir este processo seletivo.</span></footer>
  </div>;
}
