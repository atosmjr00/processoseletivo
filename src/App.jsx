import { useState } from 'react';
import { ArrowDownRight, ArrowRight, CheckCircle2, ChevronDown, HeartHandshake, Lightbulb, Menu, ShieldCheck, Sparkles, Users, X } from 'lucide-react';
import { supabase, supabaseConfigured } from './lib/supabase';

const initialForm = { full_name: '', email: '', phone: '', city: '', linkedin_url: '', experience: '', motivation: '', salary_expectation: '', privacy_consent: false };
const jobTitle = 'Suporte ao Cliente e Customer Success (CS) para E-commerce/SaaS';

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function update(e) {
    const { name, value, type, checked } = e.target;
    setForm(old => ({ ...old, [name]: type === 'checkbox' ? checked : value }));
  }
  function startApplication() {
    setShowForm(true);
    window.setTimeout(() => document.getElementById('candidatura')?.scrollIntoView({ behavior: 'smooth' }), 50);
  }
  async function submitApplication(e) {
    e.preventDefault(); setError('');
    if (!form.privacy_consent) return setError('Você precisa concordar com o aviso de privacidade para continuar.');
    if (!supabaseConfigured) return setError('Modo de prévia: configure o Supabase antes de testar o envio. Nenhum dado foi enviado.');
    setSending(true);
    const { error: dbError } = await supabase.from('job_applications').insert({
      ...form, role: jobTitle, privacy_consent_at: new Date().toISOString(), status: 'recebida'
    });
    setSending(false);
    if (dbError) return setError('Não foi possível enviar agora. Confira a configuração do banco e tente novamente.');
    setSubmitted(true); setForm(initialForm);
  }

  return <div className="site-shell">
    <div className="preview-banner"><span className="preview-dot" /> PRÉVIA INTERNA · NÃO PUBLICADA · CONTEÚDO SUJEITO À APROVAÇÃO</div>
    <header className="topbar">
      <a className="brand" href="#inicio" aria-label="Início"><span className="brand-mark">g</span><span>greenn<span className="brand-period">.</span></span></a>
      <button className="mobile-menu" aria-label="Abrir menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
        <a href="#cultura" onClick={() => setMenuOpen(false)}>Nossa cultura</a><a href="#etapas" onClick={() => setMenuOpen(false)}>Etapas</a><a href="#duvidas" onClick={() => setMenuOpen(false)}>Dúvidas</a>
        <button className="nav-cta" onClick={startApplication}>Quero me candidatar <ArrowRight size={16}/></button>
      </nav>
    </header>
    <main id="inicio">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15}/> CARREIRAS · PRÉVIA DE RECRUTAMENTO</div>
          <h1>O próximo capítulo<br/>pode começar <span>com você.</span></h1>
          <p className="hero-lede">Buscamos uma pessoa para atuar com suporte ao cliente e Customer Success, apoiando operações de e-commerce e SaaS. Se você gosta de resolver problemas, cuidar da experiência do cliente e construir relações de confiança, queremos conhecer sua história.</p>
          <div className="hero-actions"><button className="primary-button" onClick={startApplication}>Começar candidatura <ArrowRight size={18}/></button><a className="text-link" href="#cultura">Conheça a proposta <ArrowDownRight size={17}/></a></div>
          <div className="hero-proof"><div className="avatar-stack"><span>G</span><span>+</span><span>↗</span></div><p>Talento, atitude e colaboração<br/><strong>fazem a diferença.</strong></p></div>
        </div>
        <div className="hero-art" aria-label="Ilustração abstrata"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-core"><span className="core-spark">✳</span><span className="core-word">g<span>.</span></span><small>FEITO EM CONJUNTO</small></div><div className="art-card card-top"><span className="tiny-icon"><Lightbulb size={17}/></span><div><strong>Ideias que viram ação</strong><small>Autonomia para construir</small></div></div><div className="art-card card-bottom"><span className="tiny-icon green"><Users size={17}/></span><div><strong>Pessoas em primeiro lugar</strong><small>Impacto compartilhado</small></div></div><span className="floating-dot dot-a"/><span className="floating-dot dot-b"/></div>
        <div className="hero-foot"><span>01 — OPORTUNIDADE</span><span>GENTE QUE FAZ ACONTECER <i className="foot-line"/></span></div>
      </section>
      <section className="values-section" id="cultura">
        <div className="section-kicker">NOSSO JEITO DE CONSTRUIR</div><div className="values-heading"><h2>Mais do que preencher<br/>uma vaga. <span>Fazer parte.</span></h2><p>Queremos pessoas que tragam repertório, façam boas perguntas e transformem desafios em oportunidades de evolução.</p></div>
        <div className="value-grid"><article className="value-card"><div className="value-icon lilac"><Lightbulb/></div><span className="value-number">01</span><h3>Curiosidade em movimento</h3><p>Aprender rápido, questionar o óbvio e buscar caminhos melhores faz parte do trabalho.</p></article><article className="value-card"><div className="value-icon mint"><HeartHandshake/></div><span className="value-number">02</span><h3>Jogo coletivo</h3><p>Compartilhamos contexto, ouvimos perspectivas diferentes e construímos soluções em equipe.</p></article><article className="value-card"><div className="value-icon peach"><ArrowDownRight/></div><span className="value-number">03</span><h3>Atitude com propósito</h3><p>Transformamos intenção em execução e assumimos responsabilidade pelo que entregamos.</p></article></div>
      </section>
      <section className="process-section" id="etapas"><div className="process-intro"><div className="section-kicker">SIMPLES E TRANSPARENTE</div><h2>Seu caminho<br/>começa aqui<span>.</span></h2><p>Queremos que você saiba o que esperar em cada etapa. Sem mistério, com respeito ao seu tempo.</p></div>
        <div className="steps"><div className="step"><div className="step-num">01</div><div><h3>Conte sua história</h3><p>Envie seus dados, experiências com atendimento e exemplos de como já ajudou clientes a resolver problemas.</p></div><span className="step-tag">CANDIDATURA</span></div><div className="step"><div className="step-num">02</div><div><h3>Conversa com a equipe</h3><p>Se o perfil estiver alinhado, a equipe explica a função, as expectativas e as próximas etapas do processo.</p></div><span className="step-tag">ENTREVISTA</span></div><div className="step"><div className="step-num">03</div><div><h3>Curso de preparação · 12 horas</h3><p>Durante a etapa de entrevista, será apresentado um curso de 12 horas com certificação. A pessoa candidata deverá concluir o curso e enviar o certificado à equipe para que a avaliação de contratação possa ser finalizada.</p></div><span className="step-tag">FORMAÇÃO</span></div><div className="step"><div className="step-num">04</div><div><h3>Conclusão do processo</h3><p>Após a validação do certificado e a conclusão das demais etapas, a equipe responsável comunica a decisão e orienta sobre os próximos passos.</p></div><span className="step-tag">RETORNO</span></div></div>
      </section>
      <section className="apply-section" id="candidatura"><div className="apply-heading"><div><div className="section-kicker">VAMOS NOS CONHECER?</div><h2>Temos espaço para<br/><span>boas histórias.</span></h2></div><p>Oportunidade remota, nível pleno, com foco em suporte consultivo, acompanhamento de clientes e sucesso em plataformas de e-commerce e SaaS.</p></div>
        {!showForm && !submitted && <div className="apply-start-card"><div className="start-symbol"><ArrowRight/></div><div><h3>{jobTitle}</h3><p>Remoto · Pleno · E-commerce / SaaS<br/>Compartilhe sua experiência e conte como você transforma dúvidas em boas experiências.</p></div><button className="primary-button" onClick={() => setShowForm(true)}>Iniciar candidatura <ArrowRight size={17}/></button></div>}
        {showForm && !submitted && <form className="application-form" onSubmit={submitApplication}><div className="form-title"><div><span className="form-step">CANDIDATURA · FASE 1</span><h3>Vamos começar pelo básico.</h3></div><span className="required-note">* Campos obrigatórios</span></div>
          <div className="form-grid"><label>Nome completo *<input name="full_name" value={form.full_name} onChange={update} required minLength="3" autoComplete="name" placeholder="Como podemos te chamar?"/></label><label>E-mail *<input name="email" value={form.email} onChange={update} required type="email" autoComplete="email" placeholder="voce@email.com"/></label><label>Telefone / WhatsApp *<input name="phone" value={form.phone} onChange={update} required type="tel" autoComplete="tel" placeholder="(00) 00000-0000"/></label><label>Cidade e estado *<input name="city" value={form.city} onChange={update} required autoComplete="address-level2" placeholder="Ex.: Itapema, SC"/></label><label className="full-field">LinkedIn ou portfólio<input name="linkedin_url" value={form.linkedin_url} onChange={update} type="url" placeholder="https://..."/></label><label className="full-field">Conte um pouco da sua experiência *<textarea name="experience" value={form.experience} onChange={update} required minLength="20" rows="4" placeholder="Projetos, resultados, habilidades ou experiências relacionadas à oportunidade."/></label><label className="full-field">Por que essa oportunidade faz sentido para você? *<textarea name="motivation" value={form.motivation} onChange={update} required minLength="20" rows="4" placeholder="Queremos conhecer sua motivação, não uma resposta decorada."/></label><label className="full-field">Pretensão salarial (opcional)<input name="salary_expectation" value={form.salary_expectation} onChange={update} placeholder="Pode informar uma faixa ou deixar em branco."/></label></div>
          <label className="consent"><input name="privacy_consent" type="checkbox" checked={form.privacy_consent} onChange={update} required/><span>Concordo que os dados enviados sejam utilizados para análise desta candidatura, conforme o aviso de privacidade do processo seletivo. *<small>Antes de publicar, inserir o aviso de privacidade aprovado e o canal para solicitações sobre dados pessoais.</small></span></label>
          {error && <p className="form-error" role="alert">{error}</p>}<div className="form-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Voltar</button><button className="primary-button" type="submit" disabled={sending}>{sending ? 'Enviando...' : 'Enviar candidatura'} <ArrowRight size={17}/></button></div>
          {!supabaseConfigured && <p className="setup-note"><ShieldCheck size={15}/> Modo de prévia: banco não configurado; nenhum dado será enviado.</p>}</form>}
        {submitted && <div className="success-card"><CheckCircle2 size={35}/><h3>Candidatura enviada!</h3><p>Recebemos suas informações. Esta confirmação será ajustada ao fluxo final antes da publicação.</p><button className="secondary-button" onClick={() => {setSubmitted(false);setShowForm(false);}}>Voltar à página</button></div>}
      </section>
      <section className="faq-section" id="duvidas"><div><div className="section-kicker">AINDA TEM DÚVIDAS?</div><h2>Transparência<br/>do começo ao fim.</h2></div><div className="faq-list"><details><summary>Preciso ter experiência para me candidatar? <ChevronDown size={18}/></summary><p>Esta oportunidade é de nível pleno. Experiência com atendimento, resolução de problemas e relacionamento com clientes de e-commerce ou SaaS será relevante. Os critérios finais devem ser confirmados pela equipe antes da publicação.</p></details><details><summary>Como funciona o curso de 12 horas? <ChevronDown size={18}/></summary><p>Durante a etapa de entrevista, a equipe apresentará os detalhes do curso e da certificação. A pessoa candidata deverá concluir o curso e enviar o certificado para que a avaliação de contratação possa ser finalizada. Prazo, custo e entidade certificadora precisam ser informados com clareza antes da publicação.</p></details><details><summary>Como meus dados serão utilizados? <ChevronDown size={18}/></summary><p>Os dados devem ser usados apenas para as finalidades descritas no aviso de privacidade aprovado. Antes de abrir candidaturas reais, a equipe deve definir o aviso, o canal para solicitações e por quanto tempo os dados serão mantidos.</p></details></div></section>
    </main>
    <footer className="footer"><a className="brand footer-brand" href="#inicio"><span className="brand-mark">g</span><span>greenn<span className="brand-period">.</span></span></a><span>PRÉVIA INTERNA · NÃO PUBLICADA</span><a href="#inicio">Voltar ao topo ↑</a></footer>
  </div>;
}