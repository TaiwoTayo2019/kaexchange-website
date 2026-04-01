'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [qrOpen,      setQrOpen]      = useState(false)
  const [faqOpen,     setFaqOpen]     = useState<number|null>(null)
  const [sendAmt,     setSendAmt]     = useState('500')
  const [currency,    setCurrency]    = useState('GBP')
  const [rates,       setRates]       = useState({ GBP:1974, USD:1580, EUR:1720, CAD:1160 })
  const [isLive,      setIsLive]      = useState(false)
  const [waitEmail,   setWaitEmail]   = useState('')
  const [waitDone,    setWaitDone]    = useState(false)
  const [submitted,   setSubmitted]   = useState(false)

  const FEES:Record<string,number> = { GBP:5, USD:4, EUR:4.5, CAD:5.5 }
  const SYMS:Record<string,string> = { GBP:'£', USD:'$', EUR:'€', CAD:'CA$' }
  const rate = rates[currency as keyof typeof rates]
  const recv = Math.round((parseFloat(sendAmt)||0) * rate)

  useEffect(()=>{
    fetch('https://open.er-api.com/v6/latest/NGN')
      .then(r=>r.json()).then(d=>{
        if(d?.rates){
          setRates({ GBP:Math.round(1/d.rates.GBP), USD:Math.round(1/d.rates.USD), EUR:Math.round(1/d.rates.EUR), CAD:Math.round(1/d.rates.CAD) })
          setIsLive(true)
        }
      }).catch(()=>{})
  },[])

  useEffect(()=>{
    document.body.style.overflow=(menuOpen||contactOpen||qrOpen)?'hidden':''
  },[menuOpen,contactOpen,qrOpen])

  function scrollTo(id:string){ setMenuOpen(false); setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'}),300) }

  const navLinks=[
    {label:'Why Us',id:'why'},
    {label:'How It Works',id:'how'},
    {label:'Corridors',id:'corridors'},
    {label:'Security',id:'security'},
    {label:'FAQ',id:'faq'},
    {label:'Support',id:'support'},
  ]


  const faqs=[
    {q:'Do recipients need to download the app?',a:'No — funds are deposited directly into any Nigerian bank account. Recipients just receive a standard bank credit alert. No sign-up, no app, no hassle.'},
    {q:'How fast are your transfers?',a:'Our average transfer completes in under 60 seconds. We guarantee delivery or we refund your fee, no questions asked.'},
    {q:'Are there any hidden charges?',a:'None. The fee you see before you confirm is the only fee you pay. We do not take a percentage cut from your exchange rate or add charges after the fact.'},
    {q:'Can I send to multiple people at once?',a:'Yes — our split transfer feature lets you send to your mum, dad and siblings in a single transaction. Set different amounts for each recipient and confirm once.'},
    {q:'What bill payments can I make from abroad?',a:'You can pay DSTV subscriptions, NEPA/PHCN electricity bills, and top up MTN, Airtel, Glo and 9mobile airtime or data — all from within the app.'},
    {q:'Is KaExchange regulated and safe?',a:'Yes. KaExchange operates under FCA authorisation (UK), FinCEN MSB registration (US), and CBN licensing (Nigeria). All funds are held in segregated client accounts — never mixed with company funds.'},
    {q:'How is my data protected?',a:'Your data is protected under GDPR (UK/EU), NDPR (Nigeria), PIPEDA (Canada), and relevant US state privacy laws. We are PCI-DSS compliant and ISO 27001 certified. We never sell your data.'},
    {q:'What documents do I need to verify my identity?',a:'A valid passport, driver\'s licence or national ID card. Our automated KYC system typically verifies in under 2 minutes.'},
  ]

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <a href="#" className="nav-logo"><div className="hex">K&gt;</div>KA<span>Exchange</span></a>
        <div className="nav-desktop-links">{navLinks.map(l=><a key={l.id} href={`#${l.id}`}>{l.label}</a>)}</div>
        <button className="nav-desktop-btn" onClick={()=>setQrOpen(true)}>Download App</button>
        <div className="hamburger" onClick={()=>setMenuOpen(true)}><span/><span/><span/></div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen&&(
        <div className="mobile-menu">
          <button className="mob-close-btn" onClick={()=>setMenuOpen(false)}>✕</button>
          {navLinks.map(l=><button key={l.id} className="mob-link" onClick={()=>scrollTo(l.id)}>{l.label}</button>)}
          <button className="mob-cta-btn" onClick={()=>{setMenuOpen(false);setQrOpen(true)}}>Download App</button>
        </div>
      )}

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-glow"/><div className="hero-glow2"/>
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-pill"><span className="pill-dot"/>🇬🇧 🇺🇸 🇨🇦 🇪🇺 → 🇳🇬 Live Now</div>
            <h1>The smarter way to send<br/><em>money back home.</em></h1>
            <p className="hero-sub">
              Transparent pricing. Multiple recipients. Bill payments included.<br/>
              <strong style={{color:'rgba(255,255,255,0.9)'}}>Built exclusively for Nigerians in the diaspora</strong> — by people who understand what home means.
            </p>
            <div className="hero-btns">
              <button className="btn-teal" onClick={()=>setQrOpen(true)}>📱 Download App — It's Free</button>
              <a href="#why" className="btn-outline">See What Makes Us Different</a>
            </div>
            <div className="hero-stats">
              {[['4K+','Active Users'],['100%','Price Transparency'],['&lt;60s','Avg Delivery'],['0','Hidden Charges']].map(([n,l])=>(
                <div key={l} className="stat-box">
                  <span className="stat-n" dangerouslySetInnerHTML={{__html:n}}/>
                  <span className="stat-l">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-calc-col"><div className="calc-wrap">
            <div className="calc-head">
              <span className="calc-title">Live Rate Calculator</span>
              <span className="live-badge"><span className="live-dot"/>{isLive?'Live Rate':'Indicative'}</span>
            </div>
            <div className="calc-label">You Send</div>
            <div className="calc-input-row">
              <input
                type="number"
                value={sendAmt}
                onChange={e=>setSendAmt(e.target.value)}
                autoComplete="off"
              />
              <div className="curr-pill">
                <select value={currency} onChange={e=>setCurrency(e.target.value)}>
                  <option value="GBP">🇬🇧 GBP</option>
                  <option value="USD">🇺🇸 USD</option>
                  <option value="EUR">🇪🇺 EUR</option>
                  <option value="CAD">🇨🇦 CAD</option>
                </select>
              </div>
            </div>
            <div className="calc-rate-row">
              <span className="arrow">↓</span>
              <span className="calc-rate-text">1 {currency} = {rate.toLocaleString()} NGN · No hidden charges</span>
              <span className="arrow">↓</span>
            </div>
            <div className="calc-label">Recipient Gets</div>
            <div className="calc-result-row">
              <div><div className="res-label">They Receive</div></div>
              <div className="res-value">₦{recv.toLocaleString()}</div>
            </div>
            <div className="calc-fee-row">
              <span>Fee: <strong>{SYMS[currency]}{FEES[currency].toFixed(2)}</strong></span>
              <span>What you see is what you pay.</span>
            </div>
            <button className="calc-cta" onClick={()=>setQrOpen(true)}>Send Money Now →</button>
          </div></div>
        </div>
      </section>

      {/* MOBILE ONLY CALCULATOR */}
      <div className="calc-section"><div className="calc-wrap">
        <div className="calc-head">
          <span className="calc-title">Live Rate Calculator</span>
          <span className="live-badge"><span className="live-dot"/>{isLive?'Live Rate':'Indicative'}</span>
        </div>
        <div className="calc-label">You Send</div>
        <div className="calc-input-row">
          <input
            type="number"
            value={sendAmt}
            onChange={e=>setSendAmt(e.target.value)}
            autoComplete="off"
          />
          <div className="curr-pill">
            <select value={currency} onChange={e=>setCurrency(e.target.value)}>
              <option value="GBP">🇬🇧 GBP</option>
              <option value="USD">🇺🇸 USD</option>
              <option value="EUR">🇪🇺 EUR</option>
              <option value="CAD">🇨🇦 CAD</option>
            </select>
          </div>
        </div>
        <div className="calc-rate-row">
          <span className="arrow">↓</span>
          <span className="calc-rate-text">1 {currency} = {rate.toLocaleString()} NGN · No hidden charges</span>
          <span className="arrow">↓</span>
        </div>
        <div className="calc-label">Recipient Gets</div>
        <div className="calc-result-row">
          <div><div className="res-label">They Receive</div></div>
          <div className="res-value">₦{recv.toLocaleString()}</div>
        </div>
        <div className="calc-fee-row">
          <span>Fee: <strong>{SYMS[currency]}{FEES[currency].toFixed(2)}</strong></span>
          <span>What you see is what you pay.</span>
        </div>
        <button className="calc-cta" onClick={()=>setQrOpen(true)}>Send Money Now →</button>
          </div></div>

      {/* PARTNERS */}
      <div className="partners">
        <div className="partners-inner">
          <span className="partners-label">Powered By</span>
          <div className="partners-logos">
            {['Stripe','Paystack','Flutterwave','Smile Identity','Twilio'].map(p=><span key={p} className="p-logo">{p}</span>)}
          </div>
        </div>
      </div>

      {/* WHY */}
      <section className="section diff-section" id="why">
        <div className="section-inner">
          <span className="tag">Why KaExchange</span>
          <h2>Not just another remittance app.</h2>
          <p className="sub">Every feature was built around a real frustration Nigerians in the diaspora told us about. This is what sets us apart.</p>
          <div className="diff-grid">
            <div className="diff-item featured">
              <div className="diff-icon">💸</div>
              <div className="diff-body">
                <h3>Full Price Transparency</h3>
                <p>The fee you see is the only fee you pay. No percentage cuts hidden in the exchange rate, no charges added after you confirm. Complete clarity, every time.</p>
              </div>
              <span className="diff-badge">Our #1 Promise</span>
            </div>
            <div className="diff-item">
              <div className="diff-icon">👨‍👩‍👧‍👦</div>
              <div className="diff-body">
                <h3>Send to the Whole Family at Once</h3>
                <p>Split a single transfer to multiple recipients in one go. Set different amounts, confirm once. No more sending separately to each person.</p>
              </div>
            </div>
            <div className="diff-item">
              <div className="diff-icon">📺</div>
              <div className="diff-body">
                <h3>Pay Nigerian Bills From Abroad</h3>
                <p>DSTV, NEPA/PHCN electricity, MTN/Airtel/Glo airtime and data top-ups — all from inside the KaExchange app without calling anyone.</p>
              </div>
            </div>
            <div className="diff-item">
              <div className="diff-icon">⚡</div>
              <div className="diff-body">
                <h3>Delivery in Under 60 Seconds</h3>
                <p>Faster than the industry average. We guarantee delivery or we refund your fee — that is a promise, not a marketing claim.</p>
              </div>
            </div>
            <div className="diff-item">
              <div className="diff-icon">📒</div>
              <div className="diff-body">
                <h3>Family Address Book</h3>
                <p>Save all your Nigerian recipients once. Never retype bank details again. Send to anyone in your family list in two taps.</p>
              </div>
            </div>
            <div className="diff-item">
              <div className="diff-icon">🇳🇬</div>
              <div className="diff-body">
                <h3>Support That Gets It</h3>
                <p>Our support team is Nigerian. They understand your bank, your family's bank, and why this transfer matters. No bots. Real people.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how">
        <div className="section-inner">
          <span className="tag">Simple Process</span>
          <h2 style={{color:'#fff'}}>Up and running in under 5 minutes.</h2>
          <p className="sub" style={{color:'rgba(255,255,255,0.55)'}}>No branch visits, no wire transfers, no waiting days. Just open the app.</p>
          <div className="steps">
            {[
              ['1',false,'Create Your Account','Sign up in 2 minutes. Verify your identity instantly with your ID and a quick selfie — powered by Smile Identity.'],
              ['2',false,'Add Your Family','Save your recipients once — name, bank, account number. Build your family list and never re-enter details.'],
              ['3',false,'Fund Your Wallet','Top up with debit card, bank transfer, Apple Pay or Google Pay. Funds appear instantly.'],
              ['4',false,'Send or Pay Bills','Choose a recipient or select a bill. Review the transparent pricing. Confirm.'],
              ['✓',true,'Delivered in Seconds','Money hits the account in under 60 seconds. Recipient gets a bank alert. You get a receipt.'],
            ].map(([num,done,title,desc])=>(
              <div key={title as string} className="step">
                <div className={`step-num${done?' done':''}`}>{num}</div>
                <div className="step-body"><h3>{title as string}</h3><p>{desc as string}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORRIDORS */}
      <section className="corr-section" id="corridors">
        <div className="section-inner">
          <span className="tag">Supported Corridors</span>
          <h2>Sending from 4 countries to Nigeria.</h2>
          <p className="sub">Every corridor is fully licensed and regulated in both the sending and receiving country.</p>
          <div className="corr-grid">
            {[
              ['🇬🇧','🇳🇬','UK → Nigeria','GBP · Card, Faster Payments, Open Banking','FCA Authorised · CBN Licensed','→'],
              ['🇺🇸','🇳🇬','USA → Nigeria','USD · Debit card, ACH bank transfer','FinCEN MSB Registered · CBN Licensed','→'],
              ['🇪🇺','🇳🇬','Eurozone → Nigeria','EUR · Debit card, SEPA transfer','PSD2 Compliant · CBN Licensed','→'],
              ['🇨🇦','🇳🇬','Canada → Nigeria','CAD · Debit card, Interac e-Transfer','FINTRAC Registered · CBN Licensed','→'],
            ].map(([f,t,title,desc,reg,arr])=>(
              <div key={title as string} className="corr-item">
                <div className="corr-flags">{f}<span className="corr-arrow">{arr}</span>{t}</div>
                <div className="corr-info">
                  <h4>{title as string}</h4>
                  <p>{desc as string}</p>
                  <p className="corr-reg">✓ {reg as string}</p>
                </div>
                <span className="live-chip">Live</span>
              </div>
            ))}
            <div className="corr-item" style={{background:'#f0fff9',borderColor:'rgba(0,212,160,0.25)',gridColumn:'1/-1'}}>
              <div className="corr-flags">🇳🇬<span className="corr-arrow">↔</span>🇳🇬</div>
              <div className="corr-info">
                <h4>Nigeria ↔ Nigeria</h4>
                <p>Wallet-to-wallet transfers · Zero fee</p>
                <p className="corr-reg">✓ CBN Licensed · NDIC Deposit Protection</p>
              </div>
              <span className="live-chip">Instant</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section className="security-section" id="security">
        <div className="section-inner">
          <span className="tag">Security & Compliance</span>
          <h2 style={{color:'#fff'}}>Your money and data are protected by design.</h2>
          <p className="sub" style={{color:'rgba(255,255,255,0.5)'}}>We do not just say "bank-level security." Here is exactly what we do to protect you.</p>
          <div className="security-grid">
            {[
              ['🔒','PCI-DSS Level 1','The highest card security standard. Your card details are processed by Stripe — we never store them.','PCI-DSS Level 1'],
              ['🏅','ISO 27001','Our infrastructure runs on ISO 27001 certified cloud servers. Information security managed end-to-end.','ISO 27001 Certified'],
              ['🔐','TLS 1.3 + AES-256','All data in transit uses TLS 1.3. Data at rest uses AES-256 encryption. Active on every request.','Military-Grade Encryption'],
              ['🏦','Segregated Accounts','Your funds are held in ring-fenced client accounts — completely separate from KaExchange operating funds.','FCA Client Money Rules'],
              ['🪪','KYC & AML','Every user is verified before sending. Ongoing AML transaction monitoring runs 24/7 on every transfer.','Full KYC/AML'],
              ['👁️','Fraud Detection','Real-time transaction monitoring with automated fraud flags. Suspicious transfers are paused and reviewed instantly.','Real-time Monitoring'],
              ['🔑','2FA Mandatory','Two-factor authentication is required for all accounts. Biometric login supported on compatible devices.','2FA Required'],
              ['🛡️','3DS2 Authentication','All card payments use 3D Secure 2 — an extra authentication layer that protects against unauthorised card use.','3DS2 Enabled'],
            ].map(([icon,title,desc,tag])=>(
              <div key={title as string} className="sec-item">
                <span className="sec-icon">{icon}</span>
                <h4>{title as string}</h4>
                <p>{desc as string}</p>
                <span className="sec-tag">{tag as string}</span>
              </div>
            ))}
          </div>
          <div className="compliance-bar">
            <h4>Regulatory Compliance</h4>
            <div className="compliance-chips">
              {[['🇬🇧','FCA Authorised (UK)'],['🇺🇸','FinCEN MSB (US)'],['🇨🇦','FINTRAC (Canada)'],['🇪🇺','PSD2 (Eurozone)'],['🇳🇬','CBN Licensed (Nigeria)'],['🌍','FATF Compliant']].map(([flag,label])=>(
                <div key={label as string} className="comp-chip"><span>{flag}</span>{label as string}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DATA PROTECTION */}
      <section className="section data-section" id="data">
        <div className="section-inner">
          <span className="tag">Data Protection</span>
          <h2>Your personal data is protected in every country we operate.</h2>
          <p className="sub">As a cross-border platform we comply with every data protection law that applies to our users — not just the convenient ones.</p>
          <div className="data-grid">
            {[
              ['🇬🇧','GDPR','UK & EU Users','General Data Protection Regulation. You have the right to access, correct and delete your data at any time. We never sell personal data.'],
              ['🇳🇬','NDPR','Nigerian Users','Nigeria Data Protection Regulation. All Nigerian user data is processed in accordance with NITDA guidelines and local data sovereignty rules.'],
              ['🇨🇦','PIPEDA','Canadian Users','Personal Information Protection and Electronic Documents Act. Strict consent requirements for all data collection and processing.'],
              ['🇺🇸','State Laws','US Users','We comply with applicable US state privacy laws including CCPA (California) and similar frameworks. Your rights are respected regardless of state.'],
            ].map(([flag,reg,users,desc])=>(
              <div key={reg as string} className="data-item">
                <span className="d-flag">{flag}</span>
                <h4>{reg as string}</h4>
                <span className="d-reg">{users as string}</span>
                <p>{desc as string}</p>
              </div>
            ))}
          </div>
          <div style={{background:'var(--gray1)',border:'1px solid var(--gray2)',borderRadius:14,padding:'18px 20px',marginTop:12,display:'flex',alignItems:'flex-start',gap:14}}>
            <span style={{fontSize:'1.4rem',flexShrink:0}}>🧾</span>
            <div>
              <div style={{fontFamily:'var(--sora)',fontWeight:700,fontSize:'0.9rem',marginBottom:6}}>PII & PCI Data Handling</div>
              <p style={{fontSize:'0.8rem',color:'var(--gray3)',lineHeight:1.7,margin:0}}>Personally Identifiable Information (PII) and Payment Card Industry (PCI) data are processed through certified third-party processors — Stripe (PCI-DSS L1) and Smile Identity. KaExchange never stores raw card numbers or government ID images on its own servers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="test-section" id="testimonials">
        <div className="section-inner">
          <span className="tag">Real Users</span>
          <h2 style={{color:'#fff'}}>Nigerians in the diaspora trust KaExchange.</h2>
          <div className="test-grid">
            {[
              {i:'AO',name:'Adaeze Okonkwo',loc:'London, UK → Lagos',text:'"I always knew exactly what I was paying before confirming. No surprises on the other end. That level of honesty is rare in this space."'},
              {i:'TJ',name:'Taiwo James',loc:'Houston, USA → Abuja',text:'"The split transfer feature is a game changer. I send money to my mum, dad and two sisters every month — one confirmation and it\'s done."'},
              {i:'KA',name:'Kemi Adeyemi',loc:'Toronto, Canada → Ibadan',text:'"I paid my parents\' NEPA bill and DSTV from Canada without calling anyone. My mum didn\'t even know until the lights came back on."'},
            ].map(t=>(
              <div key={t.name} className="t-card">
                <div className="t-stars">★★★★★</div>
                <p className="t-text">{t.text}</p>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div className="t-avatar">{t.i}</div>
                  <div><div className="t-name">{t.name}</div><div className="t-loc">{t.loc}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="section-inner">
          <span className="tag">About KaExchange</span>
          <h2>We are Nigerian diaspora.<br/>We built this for us.</h2>
          <p className="sub">We grew up watching our parents pay excessive fees to send money home. We experienced broken transfers and unhelpful support. KaExchange is the product we always wished existed.</p>
          <div className="about-stats">
            {[['4K+','Active Users'],['100%','Price Transparency'],['99.9%','Success Rate'],['&lt;60s','Avg Delivery']].map(([n,l])=>(
              <div key={l} className="a-stat">
                <span className="n" dangerouslySetInnerHTML={{__html:n as string}}/>
                <span className="l">{l}</span>
              </div>
            ))}
          </div>
          <div className="values-grid">
            {[
              ['🎯','Radical Transparency','You always know the exact cost before you send. The price shown is the price paid.'],
              ['🤍','Family First','Every feature is designed around what Nigerian families actually need — not what looks good in a pitch deck.'],
              ['⚡','Speed as a Promise','Under 60 seconds or your fee is refunded. That is not a marketing claim — it is a guarantee.'],
              ['🌍','Built for Nigerians','We speak your language, know your banks, and understand your family\'s needs. Built by people like you.'],
            ].map(([i,t,d])=>(
              <div key={t as string} className="val-item"><div className="vi">{i}</div><h4>{t as string}</h4><p>{d as string}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:32}}>
            <span className="tag">Common Questions</span>
            <h2 style={{fontFamily:'var(--sora)',fontSize:'clamp(1.6rem,4vw,2.6rem)',fontWeight:800,lineHeight:1.18}}>Everything you need to know.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((f,i)=>(
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={()=>setFaqOpen(faqOpen===i?null:i)}>
                  {f.q}<span className={`faq-icon${faqOpen===i?' open':''}`}>+</span>
                </button>
                {faqOpen===i&&<div className="faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section className="section" id="support">
        <div className="section-inner">
          <div style={{textAlign:'center'}}>
            <span className="tag">Nigerian-Run Support</span>
            <h2>Real people. Real answers.</h2>
            <p className="sub">Our support team is based in Nigeria and the UK. They understand your bank, your situation, and how urgent this is.</p>
          </div>
          <div className="support-list">
            {[
              {i:'💬',t:'Submit a Request',d:'Fill in a ticket with your transaction details. Our team responds in under 2 hours on business days.',a:()=>setContactOpen(true),l:'Submit now →'},
              {i:'📖',t:'Help Centre',d:'Guides covering transfers, KYC verification, wallet management, bill payments and more.',a:()=>scrollTo('faq'),l:'Browse guides →'},
              {i:'📧',t:'Email Support',d:'Prefer email? Reach us at hello@kaexchange.com. We respond within 24 hours.',a:()=>{},l:'hello@kaexchange.com →'},
            ].map(c=>(
              <div key={c.t} className="support-card">
                <div className="sup-icon">{c.i}</div>
                <div><h4>{c.t}</h4><p>{c.d}</p><button className="sup-link" onClick={c.a}>{c.l}</button></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD */}
      <section className="dl-section" id="download">
        <div className="dl-glow"/>
        <div className="dl-inner">
          <div className="avail-badge">🌍 UK · US · EU · Canada · Nigeria</div>
          <h2 style={{fontFamily:'var(--sora)',fontSize:'clamp(1.6rem,4vw,2.6rem)',fontWeight:800,color:'#fff',marginBottom:12,lineHeight:1.18}}>Stop overpaying.<br/>Start sending smarter.</h2>
          <p className="sub" style={{color:'rgba(255,255,255,0.55)'}}>Join thousands of Nigerians in the diaspora who switched to KaExchange and never looked back.</p>
          <div className="app-btns">
            <button className="app-btn" onClick={()=>setQrOpen(true)}>
              <svg viewBox="0 0 814 1000" fill="white" width="22" height="22"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.5 269-317.5 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 192.5-49 31.2 0 108.2 2.6 168.2 101.6zm-208.4-195.4c31.2-36.9 53.3-88.1 53.3-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.3-71.3z"/></svg>
              <div><div className="s">Download on the</div><div className="b">App Store</div></div>
            </button>
            <button className="app-btn" onClick={()=>setQrOpen(true)}>
              <span style={{fontSize:'1.3rem'}}>▶</span>
              <div><div className="s">Get it on</div><div className="b">Google Play</div></div>
            </button>
          </div>
          <p style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.35)',marginBottom:10}}>Or join our early access waitlist</p>
          <div className="waitlist">
            <input type="email" placeholder="Enter your email" value={waitEmail} onChange={e=>setWaitEmail(e.target.value)}/>
            <button onClick={()=>{if(waitEmail){setWaitDone(true);setWaitEmail('');setTimeout(()=>setWaitDone(false),2500)}}}>
              {waitDone?'✓ You\'re in!':'Join Waitlist'}
            </button>
          </div>
          <div className="country-chips">
            {['🇬🇧 United Kingdom','🇺🇸 United States','🇨🇦 Canada','🇪🇺 Europe','🇳🇬 Nigeria'].map(c=><span key={c} className="c-chip">{c}</span>)}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo"><div className="hex">K&gt;</div>KA<span>Exchange</span></div>
            <p className="footer-desc">The remittance platform built exclusively for Nigerians in the diaspora. Transparent pricing. Fastest delivery. Nigerian support team.</p>
            <p style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.2)',lineHeight:1.6}}>KaExchange Ltd is authorised by the Financial Conduct Authority (FCA). Registered in England & Wales. Your funds are protected in segregated client accounts.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col"><h5>Product</h5>{['Send Money','Bill Payments','Family Management','Exchange Rates','Wallet'].map(l=><a key={l} href="#">{l}</a>)}</div>
            <div className="footer-col"><h5>Company</h5>{['About Us','Careers','Blog','Press'].map(l=><a key={l} href="#">{l}</a>)}</div>
            <div className="footer-col"><h5>Legal</h5>{['Privacy Policy','Terms of Service','Cookie Policy','AML Policy','GDPR Rights'].map(l=><a key={l} href="#">{l}</a>)}</div>
            <div className="footer-col"><h5>Contact</h5><p>✉ hello@kaexchange.com</p><p>📞 +44-4567-78956</p><p>📍 Wolverhampton, UK</p></div>
          </div>
          <div className="footer-bottom-row">
            <div className="footer-bottom">
              <p>© 2025 KaExchange Ltd. All rights reserved. FCA Authorised. PCI-DSS Compliant. ISO 27001 Certified.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* CONTACT MODAL */}
      {contactOpen&&(
        <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)setContactOpen(false)}}>
          <div className="sheet">
            <div className="sheet-handle"/>
            <button className="sheet-close" onClick={()=>setContactOpen(false)}>×</button>
            <div className="sheet-title">Submit a Request</div>
            <p className="sheet-sub">Our Nigerian support team will respond within 2 hours.</p>
            <div className="form-2col">
              <div className="form-group"><label>Email *</label><input type="email" placeholder="you@example.com"/></div>
              <div className="form-group"><label>Phone</label><input type="tel" placeholder="+44 7000 000000"/></div>
            </div>
            <div className="form-group"><label>Transaction ID</label><input type="text" placeholder="KAX-0000000"/></div>
            <div className="form-group"><label>Subject *</label><input type="text" placeholder="e.g. Transfer not received"/></div>
            <div className="form-group"><label>Description *</label><textarea placeholder="Describe your issue..."/></div>
            <button className="form-submit" onClick={()=>{setSubmitted(true);setTimeout(()=>{setContactOpen(false);setSubmitted(false)},1800)}}>
              {submitted?'✓ Submitted!':'Submit Request'}
            </button>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {qrOpen&&(
        <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)setQrOpen(false)}}>
          <div className="qr-sheet">
            <div className="sheet-handle"/>
            <button className="sheet-close" onClick={()=>setQrOpen(false)}>×</button>
            <div className="sheet-title">Download KaExchange</div>
            <p className="sheet-sub" style={{color:'var(--gray3)',marginBottom:24}}>Scan with your phone camera to download</p>
            <div className="qr-box">
              <svg width="120" height="120" viewBox="0 0 156 156" fill="none">
                <rect x="8" y="8" width="50" height="50" rx="4" stroke="#00d4a0" strokeWidth="4" fill="none"/>
                <rect x="16" y="16" width="34" height="34" rx="2" fill="#00d4a0"/>
                <rect x="98" y="8" width="50" height="50" rx="4" stroke="#00d4a0" strokeWidth="4" fill="none"/>
                <rect x="106" y="16" width="34" height="34" rx="2" fill="#00d4a0"/>
                <rect x="8" y="98" width="50" height="50" rx="4" stroke="#00d4a0" strokeWidth="4" fill="none"/>
                <rect x="16" y="106" width="34" height="34" rx="2" fill="#00d4a0"/>
                {[[70,8],[84,8],[70,22],[84,36],[70,70],[84,70],[98,70],[112,70],[126,70],[140,70],[70,84],[98,84],[126,84],[70,98],[84,98],[112,98],[140,98],[70,112],[98,112],[126,112],[84,126],[112,126],[140,126],[140,112]].map(([x,y],i)=>(
                  <rect key={i} x={x} y={y} width="10" height="10" rx="1" fill="#00d4a0"/>
                ))}
              </svg>
            </div>
            <p style={{fontSize:'0.78rem',color:'var(--gray3)',marginBottom:16}}>Or choose your platform directly</p>
            <div style={{display:'flex',gap:10,justifyContent:'center'}}>
              <button className="store-btn"><svg viewBox="0 0 814 1000" fill="white" width="16" height="16"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.5 269-317.5 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49 192.5-49 31.2 0 108.2 2.6 168.2 101.6zm-208.4-195.4c31.2-36.9 53.3-88.1 53.3-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.3-71.3z"/></svg> iOS App</button>
              <button className="store-btn">▶ Android</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

