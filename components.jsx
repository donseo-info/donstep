/* global React */
const { useState, useEffect, useRef } = React;

// ============================================================
// Icons (simple, drawn with primitives only)
// ============================================================
const IconCalendar = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);

const IconClock = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const IconUser = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
  </svg>
);

const IconArrow = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const IconPlay = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

// Feature card icons — abstract glyphs, not branded
const FeatIcons = {
  bug: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6a4 4 0 0 1 8 0" />
      <rect x="6" y="8" width="12" height="11" rx="6" />
      <path d="M3 12h3M18 12h3M3 17l3-1M18 16l3 1M3 8l3 1M18 9l3-1M12 8v11" />
    </svg>
  ),
  cube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4 7v10l8 4 8-4V7l-8-4z" />
      <path d="M4 7l8 4 8-4M12 11v10" />
    </svg>
  ),
  branch: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="12" r="2" />
      <path d="M6 7v10M6 12c0-3 4-5 8-5h2" />
    </svg>
  ),
  refactor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h10l-3-3M20 17H10l3 3" />
      <path d="M4 7l3 3M20 17l-3-3" />
    </svg>
  ),
};

// ============================================================
// Speaker frame — real photo + decorative floating tiles
// ============================================================
const SpeakerPhoto = ({ accent, variant = "card" }) => (
  <div className={`speaker-frame speaker-frame-${variant}`}>
    <div className="speaker-glow" style={{ background: `radial-gradient(55% 55% at 65% 30%, ${accent}40, transparent 70%)` }} />
    <div className="speaker-photo-wrap">
      <img src="assets/speaker.png?v=2" alt="Спикер" className="speaker-img" />
      <div className="speaker-photo-fade" />
    </div>
    {/* Decorative floating tiles */}
    {variant === "card" && (
      <React.Fragment>
        <div className="float-tile float-tile-1">
          <div className="tile-dots"><span /><span /><span /></div>
          <div className="tile-lines">
            <div className="tile-line" style={{ width: "70%" }} />
            <div className="tile-line" style={{ width: "45%" }} />
            <div className="tile-line" style={{ width: "80%" }} />
            <div className="tile-line" style={{ width: "30%" }} />
          </div>
        </div>
        <div className="float-tile float-tile-2">
          <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28, color: accent }}>
            <path d="M14 16l-4 4 4 4M26 16l4 4-4 4M22 12l-4 16" />
          </svg>
        </div>
        <div className="float-tile float-tile-3">
          <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28, color: accent }}>
            <path d="M20 8c-4 4-4 8 0 12s4 8 0 12" />
            <circle cx="14" cy="14" r="2" />
            <circle cx="26" cy="26" r="2" />
            <path d="M8 20h4M28 20h4M20 4v4M20 32v4" />
          </svg>
        </div>
      </React.Fragment>
    )}
  </div>
);

// ============================================================
// Feature card
// ============================================================
const FeatureCard = ({ icon, title, body, accent, density }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`feature-card ${hovered ? "is-hovered" : ""}`}
      data-density={density}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ "--accent": accent }}
    >
      <div className="feature-icon">{FeatIcons[icon]}</div>
      <div className="feature-text">
        <div className="feature-title">{title}</div>
        <div className="feature-body">{body}</div>
      </div>
    </div>
  );
};

// ============================================================
// Hero — main composition
// ============================================================
const Hero = ({ tweaks }) => {
  const {
    theme,         // 'dark' | 'midnight' | 'light'
    accentHue,     // number (0..360)
    layout,        // 'split' | 'centered' | 'overlay'
    headingStyle,  // 'bold' | 'display' | 'mono'
    density,       // 'compact' | 'comfy'
    showCountdown, // bool
    parallax,      // bool
  } = tweaks;

  const accent = `oklch(0.68 0.19 ${accentHue})`;
  const accentSoft = `oklch(0.68 0.19 ${accentHue} / 0.16)`;
  const accentBorder = `oklch(0.68 0.19 ${accentHue} / 0.35)`;

  const heroRef = useRef(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Two rAFs: first paints the "from" state (opacity:0, translateY),
    // second flips the class so the transition actually fires.
    let id1 = requestAnimationFrame(() => {
      let id2 = requestAnimationFrame(() => setMounted(true));
      id1 = id2;
    });
    return () => cancelAnimationFrame(id1);
  }, []);

  useEffect(() => {
    if (!parallax) return;
    const handler = (e) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      setParallaxOffset({ x: dx * 14, y: dy * 14 });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [parallax]);

  // Countdown to a fixed-ish target — purely visual
  const [countdown, setCountdown] = useState({ d: 12, h: 7, m: 41, s: 22 });
  useEffect(() => {
    if (!showCountdown) return;
    const target = new Date();
    target.setDate(target.getDate() + 12);
    target.setHours(19, 0, 0, 0);
    const tick = () => {
      const ms = target - new Date();
      if (ms < 0) return;
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setCountdown({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [showCountdown]);

  const features = [
    { icon: "bug", title: "Чиним баги", body: "в браузере через MCP" },
    { icon: "cube", title: "Делаем фичи", body: "от постановки до кода" },
    { icon: "branch", title: "Исправляем", body: "ошибки сборки в CI" },
    { icon: "refactor", title: "Рефакторим", body: "с учётом контекста" },
  ];

  return (
    <div
      ref={heroRef}
      className={`hero hero-theme-${theme} hero-layout-${layout} hero-density-${density} hero-heading-${headingStyle} ${mounted ? "is-mounted" : ""}`}
      style={{
        "--accent": accent,
        "--accent-soft": accentSoft,
        "--accent-border": accentBorder,
      }}
    >
      {/* Ambient bg */}
      <div className="hero-bg">
        <div
          className="hero-bg-orb hero-bg-orb-1"
          style={{
            background: `radial-gradient(circle, ${accent}55, transparent 65%)`,
            transform: parallax ? `translate(${parallaxOffset.x * -1.2}px, ${parallaxOffset.y * -1.2}px)` : undefined,
          }}
        />
        <div
          className="hero-bg-orb hero-bg-orb-2"
          style={{
            transform: parallax ? `translate(${parallaxOffset.x * 0.8}px, ${parallaxOffset.y * 0.8}px)` : undefined,
          }}
        />
        <div className="hero-bg-grid" />
      </div>

      {/* Top nav */}
      <header className="hero-nav reveal" style={{ "--reveal-delay": "0ms" }}>
        <div className="brand">
          <div className="brand-mark" style={{ background: accent }}>
            <span>L</span>
          </div>
          <span className="brand-name">Lectoria</span>
        </div>
        <nav className="nav-links">
          <a href="#">Курсы</a>
          <a href="#">Вебинары</a>
          <a href="#">Сообщество</a>
          <a href="#">Блог</a>
        </nav>
        <div className="contact-widget">
          <div className="rating-badge">
            <div className="rating-mark">Я</div>
            <div className="rating-body">
              <div className="rating-place">Хорошее место</div>
              <div className="rating-stars">
                <span className="stars">★★★★★</span>
                <span className="rating-num">5.0</span>
              </div>
            </div>
          </div>
          <div className="phone-block">
            <div className="phone-status">
              <span className="phone-dot" />
              <span>Звоните, мы работаем 9:00–19:00</span>
            </div>
            <a href="tel:+73432473190" className="phone-num">+7 (343) 247-31-90</a>
            <button type="button" className="phone-cta" onClick={() => window.__openConsult && window.__openConsult()}>Быстрая консультация</button>
          </div>
        </div>
      </header>

      {/* Main grid */}
      <div className="hero-grid">
        <div className="hero-content">
          <div className="hero-pills reveal" style={{ "--reveal-delay": "100ms" }}>
            <div className="pill pill-date">
              <IconCalendar />
              <span>28 апреля, 19:00 МСК</span>
            </div>
            <div className="pill pill-free">
              <span className="pulse-dot" />
              <span>Бесплатный вебинар</span>
            </div>
          </div>

          <h1 className="hero-title reveal" style={{ "--reveal-delay": "200ms" }}>
            <span className="title-line">Разработка с ИИ в 2026:</span>
            <span className="title-line title-accent">как реально ускорить работу в 2–5 раз</span>
          </h1>

          <p className="hero-sub reveal" style={{ "--reveal-delay": "320ms" }}>
            Системный подход к работе с ИИ для разработчиков — без хайпа, на конкретных рабочих сценариях.
          </p>

          <div className="features-row reveal" style={{ "--reveal-delay": "440ms" }}>
            {features.map((f) => (
              <FeatureCard
                key={f.icon}
                icon={f.icon}
                title={f.title}
                body={f.body}
                accent={accent}
                density={density}
              />
            ))}
          </div>

          <div className="hero-cta-row reveal" style={{ "--reveal-delay": "560ms" }}>
            <button
              className="btn-primary"
              style={{ background: accent }}
              onClick={() => alert("Регистрация (демо)")}
            >
              <span>Записаться бесплатно</span>
              <IconArrow />
            </button>
            <div className="speaker-line">
              <div className="speaker-avatar">
                <svg viewBox="0 0 40 40" style={{ width: "100%", height: "100%" }}>
                  <rect width="40" height="40" fill="#1a2540" />
                  <circle cx="20" cy="16" r="6" fill="rgba(255,255,255,0.15)" />
                  <path d="M8 40 Q8 28 20 28 Q32 28 32 40 Z" fill="rgba(255,255,255,0.15)" />
                </svg>
              </div>
              <div className="speaker-meta">
                <div className="speaker-name">
                  <IconUser />
                  <span>Иван Дулин</span>
                </div>
                <div className="speaker-role">Lead engineer · 1.5 часа практики</div>
              </div>
            </div>
          </div>

          {showCountdown && (
            <div className="countdown reveal" style={{ "--reveal-delay": "680ms" }}>
              <div className="countdown-label">До старта</div>
              <div className="countdown-cells">
                {[
                  { v: countdown.d, l: "дней" },
                  { v: countdown.h, l: "часов" },
                  { v: countdown.m, l: "минут" },
                  { v: countdown.s, l: "секунд" },
                ].map((c, i) => (
                  <div key={i} className="countdown-cell">
                    <div className="countdown-num">{String(c.v).padStart(2, "0")}</div>
                    <div className="countdown-unit">{c.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="hero-visual reveal"
          style={{ "--reveal-delay": "300ms" }}
        >
          <div
            className="hero-visual-inner"
            style={{
              transform: parallax
                ? `translate(${parallaxOffset.x * 0.6}px, ${parallaxOffset.y * 0.6}px)`
                : undefined,
            }}
          >
            <SpeakerPhoto accent={accent} variant={layout === "overlay" ? "bg" : "card"} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ConsultModal
// ============================================================
const ConsultModal = ({ onClose }) => {
  const [phone, setPhone] = React.useState("");
  const [name, setName] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [err, setErr] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) { setErr("Введите действующий номер телефона"); return; }
    setErr("");
    setSent(true);
  };

  // Close on overlay click
  const overlayRef = React.useRef(null);
  const handleOverlay = (e) => { if (e.target === overlayRef.current) onClose(); };

  // Close on Escape
  React.useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  return (
    <div className="cm-overlay" ref={overlayRef} onClick={handleOverlay}>
      <div className="cm-modal">
        <button className="cm-close" onClick={onClose} aria-label="Закрыть">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>

        {!sent ? (
          <>
            <div className="cm-badge">Бесплатно · без обязательств</div>
            <h2 className="cm-title">Быстрая консультация</h2>
            <p className="cm-sub">Менеджер перезвонит в течение <strong>15 минут</strong> и ответит на все вопросы о программах и поступлении.</p>

            <div className="cm-features">
              <div className="cm-feature">
                <span className="cm-feature-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                </span>
                Подбор программы под ваши цели
              </div>
              <div className="cm-feature">
                <span className="cm-feature-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>
                </span>
                Расписание и варианты оплаты
              </div>
              <div className="cm-feature">
                <span className="cm-feature-ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l9 4-9 4-9-4 9-4Z"/><path d="M3 11l9 4 9-4M3 16l9 4 9-4"/></svg>
                </span>
                Ответы на вопросы об обучении
              </div>
            </div>

            <form className="cm-form" onSubmit={handleSubmit} noValidate>
              <input
                className="cm-input"
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className={`cm-input ${err ? "is-error" : ""}`}
                type="tel"
                placeholder="Номер телефона *"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setErr(""); }}
                required
              />
              {err && <div className="cm-error">{err}</div>}
              <button type="submit" className="cm-submit">
                Перезвоните мне
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </button>
              <p className="cm-note">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
            </form>
          </>
        ) : (
          <div className="cm-success">
            <div className="cm-success-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
            </div>
            <h2 className="cm-title">Заявка принята!</h2>
            <p className="cm-sub">Менеджер перезвонит на номер <strong>{phone}</strong> в течение 15 минут. Работаем 9:00–19:00.</p>
            <button className="cm-submit" style={{ marginTop: 24 }} onClick={onClose}>Отлично, спасибо!</button>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { Hero, FeatureCard, SpeakerPhoto, ConsultModal });
