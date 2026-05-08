/* global React */
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS } = React;

const Reveal = ({ children, delay = 0, as: As = "div", className = "", style = {}, ...rest }) => {
  const ref = useRefS(null);
  const [shown, setShown] = useStateS(false);
  useEffectS(() => {
    const el = ref.current; if (!el) return;
    // Если элемент уже в зоне видимости при mount — показать сразу
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.unobserve(e.target); } });
    }, { threshold: 0, rootMargin: "0px 0px -5% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <As ref={ref} className={`s-reveal ${shown ? "is-shown" : ""} ${className}`}
        style={{ ...style, "--rd": `${delay}ms` }} {...rest}>
      {children}
    </As>
  );
};

const SecHead = ({ kicker, title, sub, align = "left" }) => (
  <header className={`sec-head sec-head-${align}`}>
    {kicker && <div className="sec-kicker"><span className="sec-kicker-dot" /><span>{kicker}</span></div>}
    <h2 className="sec-title">{title}</h2>
    {sub && <p className="sec-sub">{sub}</p>}
  </header>
);

const PROGRAM = [
  { time: "00:00", tag: "Контекст", title: "Почему 90% разработчиков используют ИИ неправильно",
    body: "Главная ошибка — относиться к ассистенту как к автокомплиту. Покажу систему, которая меняет процесс, а не отдельные строки." },
  { time: "00:18", tag: "Демо", title: "MCP в браузере — фиксим баги, не выходя из вкладки",
    body: "Live-демо: подключаем агента к Chrome DevTools и находим причину бага в продакшен-сборке за 4 минуты." },
  { time: "00:42", tag: "Практика", title: "От тикета до PR за один проход",
    body: "Полный цикл: постановка → план → код → тесты → ревью самому себе. Шаблон промта, который можно сразу скопировать в проект." },
  { time: "01:05", tag: "Практика", title: "GitHub Actions: что делать, когда CI красный",
    body: "Подключаем агента к логам сборки. Учим читать стек-трейс и предлагать минимальный фикс — без угадывания." },
  { time: "01:22", tag: "Архитектура", title: "Рефакторинг с учётом всего проекта",
    body: "Как давать ИИ контекст 200k+ токенов так, чтобы он держался ваших соглашений." },
  { time: "01:38", tag: "Q&A", title: "Разбор ваших задач в прямом эфире",
    body: "Заранее присылайте свои кейсы — разберём 3–5 самых интересных." },
];

const ProgramSection = () => (
  <section className="sec sec--alt" id="program">
    <div className="sec-orb" style={{ width: 540, height: 540, background: "radial-gradient(circle, var(--accent-soft), transparent 65%)", top: -200, right: -160 }} />
    <div className="sec-inner">
      <Reveal><SecHead kicker="Программа" title={<>1.5 часа практики, <em>без воды</em></>}
        sub="Шесть блоков, которые превращают ИИ из «помощника по автокомплиту» в полноценного участника команды." /></Reveal>
      <ol className="program-list">
        {PROGRAM.map((p, i) => (
          <Reveal key={i} delay={i * 70} as="li" className="program-row">
            <div className="program-time">
              <span className="program-time-num">{p.time}</span>
              <span className="program-time-tag">{p.tag}</span>
            </div>
            <div className="program-rail">
              <span className="program-dot" />
              {i < PROGRAM.length - 1 && <span className="program-line" />}
            </div>
            <div className="program-body">
              <h3 className="program-title">{p.title}</h3>
              <p className="program-text">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);

const AUDIENCE = [
  { fit: "Будет полезно", title: "Middle / Senior разработчикам",
    body: "Если вы пробовали Copilot и Cursor, но чувствуете, что выжимаете не больше 20% от возможного." },
  { fit: "Будет полезно", title: "Тимлидам и архитекторам",
    body: "Хотите внедрить ИИ-инструменты в команду осознанно — с метриками и регламентами." },
  { fit: "Будет полезно", title: "Junior-разработчикам",
    body: "Готовы инвестировать в навыки, которые через год станут гигиеной — как git и code review." },
  { fit: "Не подойдёт", title: "Тем, кто ждёт «серебряную пулю»", negative: true,
    body: "Будем работать руками и говорить про ограничения. Магии не обещаем." },
];

const AudienceSection = () => (
  <section className="sec" id="audience">
    <div className="sec-inner">
      <Reveal><SecHead kicker="Для кого" title="Кому будет полезно"
        sub="Без «всем подряд». Узнаёте себя в одном из пунктов — приходите." /></Reveal>
      <div className="audience-grid">
        {AUDIENCE.map((a, i) => (
          <Reveal key={i} delay={i * 70} className={`audience-card ${a.negative ? "is-negative" : ""}`}>
            <div className="audience-fit">
              {a.negative
                ? <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>
                : <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.2 3.2L13 4.8" /></svg>}
              <span>{a.fit}</span>
            </div>
            <h3 className="audience-title">{a.title}</h3>
            <p className="audience-body">{a.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const SpeakerSection = () => (
  <section className="sec sec--alt" id="speaker">
    <div className="sec-inner speaker-layout">
      <Reveal>
        <div className="speaker-portrait-big">
          <div className="speaker-portrait-glow" />
          <img src="assets/speaker.png?v=2" alt="Иван Дулин" />
          <div className="speaker-portrait-badge">
            <span className="dot" /><span>в эфире 28 апреля</span>
          </div>
        </div>
      </Reveal>
      <div className="speaker-info-col">
        <Reveal>
          <SecHead kicker="Спикер" title="Иван Дулин"
            sub="Lead engineer, ex-Yandex. Последние пять лет — про инфраструктуру для ИИ-агентов в инженерных командах." />
        </Reveal>
        <Reveal delay={120}>
          <ul className="speaker-bullets">
            <li>Внедрял ИИ-разработку в командах от стартапов до банковских монолитов на 3M+ строк.</li>
            <li>Автор курса «AI-driven development» — более 8 000 выпускников.</li>
            <li>Контрибьютор открытых MCP-серверов и инструментов агентного программирования.</li>
          </ul>
        </Reveal>
        <Reveal delay={200}>
          <div className="speaker-stats">
            {[{v:"12+",l:"лет в индустрии"},{v:"50+",l:"команд внедрили подход"},{v:"8k",l:"разработчиков на курсах"},{v:"4.9",l:"средняя оценка"}].map((s, i) => (
              <div key={i} className="speaker-stat">
                <div className="speaker-stat-v">{s.v}</div>
                <div className="speaker-stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

const BONUSES = [
  { tag: "PDF + .md", title: "Шаблоны промтов для разработки",
    body: "12 готовых промтов: от постановки задачи до ревью PR. Можно вставлять в репозиторий как .cursorrules / AGENTS.md." },
  { tag: "Markdown", title: "Чек-лист «MCP за 30 минут»",
    body: "Пошаговый сетап MCP-сервера для браузера, GitHub и локальной IDE. С готовыми конфигами под VS Code и Cursor." },
  { tag: "Видео", title: "Запись вебинара на 30 дней",
    body: "Если не сможете быть в эфире — пришлём ссылку с тайм-кодами. Доступ открыт месяц." },
];

const BonusesSection = () => (
  <section className="sec" id="bonuses">
    <div className="sec-inner">
      <Reveal><SecHead kicker="Бонусы" title="Получите вместе с записью"
        sub="Материалы, которые останутся у вас после вебинара." /></Reveal>
      <div className="bonus-grid">
        {BONUSES.map((b, i) => (
          <Reveal key={i} delay={i * 90} className="bonus-card">
            <div className="bonus-num">{String(i + 1).padStart(2, "0")}</div>
            <div className="bonus-tag">{b.tag}</div>
            <h3 className="bonus-title">{b.title}</h3>
            <p className="bonus-body">{b.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const FAQ_ITEMS = [
  { q: "Это правда бесплатно? В чём подвох?",
    a: "Бесплатно. Мы рассчитываем заинтересовать вас полным курсом, но это не «вебинар-продажник» — содержательная часть занимает 1ч 20мин из полутора часов, и материалы остаются у вас в любом случае." },
  { q: "Я не пишу на JavaScript / TypeScript. Будет полезно?",
    a: "Да. Все примеры мы делаем на TS, но принципы работы с агентами, MCP и контекстом универсальны. Подход применяли на Go, Python, Rust и SQL." },
  { q: "Нужны ли платные подписки на ИИ-инструменты?",
    a: "Для просмотра — нет. Чтобы повторять за нами после эфира, удобнее иметь доступ к Claude или GPT-4. Бесплатные тарифы Cursor / Claude.ai тоже подойдут для большинства сценариев." },
  { q: "Будет ли запись?",
    a: "Да. Все зарегистрированные получат ссылку на запись в течение часа после эфира. Доступ открыт 30 дней." },
  { q: "Можно задать вопрос заранее?",
    a: "Конечно. После регистрации придёт письмо с формой — туда можно прислать свой кейс или задачу. Самые интересные разберём в эфире." },
];

const FAQSection = () => {
  const [open, setOpen] = useStateS(0);
  return (
    <section className="sec sec--alt" id="faq">
      <div className="sec-inner">
        <Reveal><SecHead kicker="FAQ" title="Частые вопросы" /></Reveal>
        <Reveal delay={80}>
          <div className="faq-list">
            {FAQ_ITEMS.map((f, i) => (
              <div key={i} className={`faq-item ${open === i ? "is-open" : ""}`}>
                <button type="button" className="faq-q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                  <span>{f.q}</span>
                  <span className="faq-q-icon">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M8 3v10M3 8h10" />
                    </svg>
                  </span>
                </button>
                <div className="faq-a"><div className="faq-a-inner"><p>{f.a}</p></div></div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const SignupSection = () => {
  const [form, setForm] = useStateS({ name: "", email: "", role: "" });
  const [errs, setErrs] = useStateS({});
  const [done, setDone] = useStateS(false);
  const [pending, setPending] = useStateS(false);
  const submit = (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.name.trim()) e.name = "Укажите имя";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Похоже на некорректный email";
    setErrs(e);
    if (Object.keys(e).length) return;
    setPending(true);
    setTimeout(() => { setPending(false); setDone(true); }, 700);
  };
  return (
    <section className="sec" id="signup">
      <div className="sec-inner">
        <div className="signup-card">
          <div className="signup-grid">
            <div>
              <Reveal as="h2" className="signup-headline">
                Бесплатный вебинар <em>28 апреля, 19:00 МСК</em>
              </Reveal>
              <Reveal delay={120} as="p" className="signup-sub">
                Зарегистрируйтесь — пришлём ссылку на эфир, материалы и напоминание за час до старта.
              </Reveal>
              <Reveal delay={200}>
                <div className="signup-meta">
                  <div className="signup-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" />
                    </svg>
                    <span>28 апреля, среда</span>
                  </div>
                  <div className="signup-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                    </svg>
                    <span>1.5 часа</span>
                  </div>
                  <div className="signup-meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 7v10l8 4 8-4V7l-8-4z" />
                    </svg>
                    <span>Запись + материалы</span>
                  </div>
                </div>
              </Reveal>
            </div>
            <Reveal delay={120}>
              {!done ? (
                <form className="signup-form" onSubmit={submit} noValidate>
                  <div className="signup-form-title">Регистрация</div>
                  <div className="field">
                    <label className="field-label" htmlFor="f-name">Как к вам обращаться</label>
                    <input id="f-name" type="text" className={`field-input ${errs.name ? "is-error" : ""}`}
                      value={form.name} placeholder="Иван"
                      onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <div className="field-error">{errs.name || ""}</div>
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="f-email">Email для ссылки на эфир</label>
                    <input id="f-email" type="email" className={`field-input ${errs.email ? "is-error" : ""}`}
                      value={form.email} placeholder="you@example.com"
                      onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <div className="field-error">{errs.email || ""}</div>
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="f-role">Должность (необязательно)</label>
                    <input id="f-role" type="text" className="field-input"
                      value={form.role} placeholder="Senior Frontend Developer"
                      onChange={(e) => setForm({ ...form, role: e.target.value })} />
                  </div>
                  <button type="submit" className="signup-submit" disabled={pending}>
                    {pending ? "Отправляем…" : "Записаться бесплатно"}
                    {!pending && (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    )}
                  </button>
                  <p className="signup-fineprint">
                    Нажимая на кнопку, вы соглашаетесь с <a href="#">политикой обработки данных</a>. Не присылаем спам.
                  </p>
                </form>
              ) : (
                <div className="signup-form">
                  <div className="signup-success">
                    <div className="signup-success-mark">
                      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </div>
                    <h3>Записали вас, {form.name}!</h3>
                    <p>Письмо со ссылкой на эфир уже на пути в {form.email}.<br/>До встречи 28 апреля в 19:00 МСК.</p>
                  </div>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="foot">
    <div className="foot-inner">
      <div>
        <div className="foot-brand">
          <div className="foot-brand-mark">L</div>
          <div className="foot-brand-name">Lectoria</div>
        </div>
        <p className="foot-tag">Образовательная платформа для разработчиков. Курсы, вебинары и сообщество — про инженерную практику без хайпа.</p>
      </div>
      <div className="foot-col">
        <h4>Платформа</h4>
        <ul>
          <li><a href="#">Курсы</a></li><li><a href="#">Вебинары</a></li>
          <li><a href="#">Сообщество</a></li><li><a href="#">Блог</a></li>
        </ul>
      </div>
      <div className="foot-col">
        <h4>Компания</h4>
        <ul>
          <li><a href="#">О нас</a></li><li><a href="#">Контакты</a></li>
          <li><a href="#">Партнёрство</a></li><li><a href="#">Карьера</a></li>
        </ul>
      </div>
      <div className="foot-col">
        <h4>Помощь</h4>
        <ul>
          <li><a href="#">FAQ</a></li><li><a href="#">Поддержка</a></li>
          <li><a href="#">Политика</a></li><li><a href="#">Оферта</a></li>
        </ul>
      </div>
    </div>
    <div className="foot-bottom">
      <span>© 2026 Lectoria. Все права защищены.</span>
      <span>Сделано с любовью к разработке</span>
    </div>
  </footer>
);

const StickyCTA = () => {
  const [shown, setShown] = useStateS(false);
  useEffectS(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      const signup = document.getElementById("signup");
      const signupTop = signup ? signup.getBoundingClientRect().top + y : Infinity;
      setShown(y > h * 0.8 && y + h < signupTop + 200);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const go = () => {
    const el = document.getElementById("signup");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 24, behavior: "smooth" });
  };
  return (
    <div className={`sticky-cta ${shown ? "is-shown" : ""}`}>
      <div className="sticky-cta-text">
        <strong>28 апреля, 19:00 МСК</strong>
        <span>Бесплатный вебинар · 1.5 часа</span>
      </div>
      <button type="button" className="sticky-cta-btn" onClick={go}>
        Записаться
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
};

Object.assign(window, {
  ProgramSection, AudienceSection, SpeakerSection, BonusesSection,
  FAQSection, SignupSection, Footer, StickyCTA,
});
