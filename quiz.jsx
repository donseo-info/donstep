/* global React */
const { useState: useStateQ, useEffect: useEffectQ } = React;

// ============================================================
// Quiz icons (small, abstract glyphs for option cards)
// ============================================================
const QIcons = {
  // Age
  child: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="3"/><path d="M6 21v-3a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3"/><path d="M9 11l-2 4M15 11l2 4"/></svg>),
  teen: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="3.2"/><path d="M5 21v-2.5a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4V21"/></svg>),
  adult: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="6.5" r="3"/><path d="M4 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2"/><path d="M9 12.5l-1 4M15 12.5l1 4"/></svg>),
  senior: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="3"/><path d="M5 21l2-7h10l2 7"/><path d="M10 4.5h4"/></svg>),
  // Level
  zero: "assets/step-1.png",
  pc:   "assets/step-2.png",
  power:"assets/step-3.png",
  pro:  "assets/step-4.png",
  // Direction
  code: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6l-5 6 5 6M16 6l5 6-5 6"/></svg>),
  design: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="17.5" cy="15.5" r="1.5"/><circle cx="13.5" cy="19" r="1.5"/><path d="M12 4a8 8 0 0 0 0 16 2 2 0 0 0 1.6-3.2A2 2 0 0 1 15.2 14a8 8 0 0 0 4.8-7.5A2.5 2.5 0 0 0 17.5 4Z"/></svg>),
  network: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v5c0 5-3.5 9-8 11-4.5-2-8-6-8-11V6Z"/><path d="M9 12l2 2 4-4"/></svg>),
  test: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6v3l-2 3 4 8a2 2 0 0 1-2 3H9a2 2 0 0 1-2-3l4-8L9 6Z"/></svg>),
  start: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v18l5-4 4 3 5-17Z"/></svg>),
  kid: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="5"/><path d="M9 8h.01M15 8h.01M9.5 11.5c.8.7 1.7 1 2.5 1s1.7-.3 2.5-1"/><path d="M5 21l2-5M19 21l-2-5"/></svg>),
  // Time
  weekday: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2"/></svg>),
  weekend: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="16" cy="15" r="2"/></svg>),
  morning: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="14" r="4"/><path d="M3 18h18M12 6v2M6 9l1.5 1.5M18 9l-1.5 1.5"/></svg>),
  day: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"/></svg>),
  evening: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14a8 8 0 1 1-9-10 6 6 0 0 0 9 10Z"/></svg>),
  any: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>),
};

const QUIZ_STEPS = [
  {
    id: "level",
    type: "single",
    title: "Ваш уровень знаний в IT",
    options: [
      { value: "zero", label: "Обучение с 0", icon: "zero" },
      { value: "basic", label: "Базовые знания ПК", icon: "pc" },
      { value: "advanced", label: "Продвинутый пользователь", icon: "power" },
      { value: "specialist", label: "IT-специалист", icon: "pro" },
    ],
    cols: 2,
  },
  {
    id: "age",
    type: "single",
    title: "Ваш возраст",
    options: [
      { value: "6-15", label: "6–15 лет", icon: "child" },
      { value: "15-25", label: "15–25 лет", icon: "teen" },
      { value: "25-40", label: "25–40 лет", icon: "adult" },
      { value: "40-60", label: "40–60 лет", icon: "senior" },
    ],
    cols: 2,
  },
  {
    id: "directions",
    type: "multi",
    title: "Какие направления интересны",
    hint: "Можно выбрать несколько вариантов",
    options: [
      { value: "code", label: "Программирование", icon: "code" },
      { value: "design", label: "Графика и дизайн", icon: "design" },
      { value: "network", label: "Сети и кибербезопасность", icon: "network" },
      { value: "test", label: "Тестирование", icon: "test" },
      { value: "start", label: "Начальные курсы", icon: "start" },
      { value: "kid", label: "Детские программы", icon: "kid" },
    ],
    cols: 3,
  },
  {
    id: "time",
    type: "multi",
    title: "Какое время обучения подходит",
    hint: "Можно выбрать несколько вариантов",
    options: [
      { value: "weekday", label: "Будни", icon: "weekday" },
      { value: "weekend", label: "Выходные", icon: "weekend" },
      { value: "morning", label: "Утро", icon: "morning" },
      { value: "day", label: "День", icon: "day" },
      { value: "evening", label: "Вечер", icon: "evening" },
      { value: "any", label: "Любое время", icon: "any" },
    ],
    cols: 3,
  },
];

const QuizSection = () => {
  const [step, setStep] = useStateQ(0);
  const [answers, setAnswers] = useStateQ({ age: null, level: null, directions: [], time: [] });
  const [done, setDone] = useStateQ(false);
  const [name, setName] = useStateQ("");
  const [phone, setPhone] = useStateQ("");
  const [messengers, setMessengers] = useStateQ(["whatsapp"]);
  const [consent, setConsent] = useStateQ(true);
  const [errors, setErrors] = useStateQ({});
  const [submitted, setSubmitted] = useStateQ(false);

  const toggleMsgr = (id) => {
    setMessengers([id]);
  };

  const validatePhone = (v) => {
    const digits = (v || "").replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  };

  const submitForm = (e) => {
    e.preventDefault();
    const errs = {};
    if (!validatePhone(phone)) errs.phone = "Укажите действующий номер телефона";
    if (!messengers.length) errs.messengers = "Выберите хотя бы один способ связи";
    if (!consent) errs.consent = "Необходимо согласие";
    setErrors(errs);
    if (Object.keys(errs).length === 0) setSubmitted(true);
  };

  const total = QUIZ_STEPS.length;
  const progress = done ? 100 : Math.round((step / total) * 100);
  const current = QUIZ_STEPS[step];

  const select = (val) => {
    if (!current) return;
    if (current.type === "single") {
      setAnswers((a) => ({ ...a, [current.id]: val }));
    } else {
      setAnswers((a) => {
        const arr = a[current.id] || [];
        const next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
        return { ...a, [current.id]: next };
      });
    }
  };

  const isSelected = (val) => {
    if (!current) return false;
    if (current.type === "single") return answers[current.id] === val;
    return (answers[current.id] || []).includes(val);
  };

  const canGoNext = () => {
    if (!current) return false;
    if (current.type === "single") return answers[current.id] != null;
    return (answers[current.id] || []).length > 0;
  };

  const next = () => {
    if (!canGoNext()) return;
    if (step < total - 1) setStep(step + 1);
    else setDone(true);
  };
  const back = () => {
    if (done) { setDone(false); return; }
    if (step > 0) setStep(step - 1);
  };

  const summary = {
    "Уровень": (QUIZ_STEPS[0].options.find(o => o.value === answers.level) || {}).label || "—",
    "Возраст": (QUIZ_STEPS[1].options.find(o => o.value === answers.age) || {}).label || "—",
    "Направления": (answers.directions || []).map(v => QUIZ_STEPS[2].options.find(o => o.value === v)?.label).filter(Boolean).join(", ") || "—",
    "Время": (answers.time || []).map(v => QUIZ_STEPS[3].options.find(o => o.value === v)?.label).filter(Boolean).join(", ") || "—",
  };

  return (
    <section className="sec sec--alt" id="quiz">
      <div className="sec-orb" style={{ width: 540, height: 540, background: "radial-gradient(circle, var(--accent-soft), transparent 65%)", top: -200, left: -160 }} />
      <div className="sec-inner">
        <Reveal>
          <SecHead
            kicker="Подбор программы"
            title={<>Подберём <em>программу обучения</em> за 4 шага</>}
            sub="Ответьте на несколько вопросов — менеджер пришлёт подборку курсов с расписанием и стоимостью под ваш запрос."
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="quiz-card">
            {/* Aside */}
            <aside className="quiz-aside">
              <div className="quiz-expert">
                <span className="quiz-expert-online"><span className="dot" /> Онлайн</span>
                <img src="assets/speaker.png?v=2" alt="Менеджер по подбору программы" />
                <div className="quiz-expert-name">
                  <strong>Анна Болотова</strong>
                  <span>Эксперт по подбору программ</span>
                </div>
              </div>
              <p className="quiz-aside-text">
                Ответьте на 4 вопроса — пришлём <strong>персональную подборку курсов</strong>, расписание и стоимость + чек-лист подготовки.
              </p>
              <div className="quiz-bonuses-label">Вы получите:</div>
              <ul className="quiz-bonus-list">
                <li>
                  <span className="quiz-bonus-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M9 14h6M9 17h4"/></svg>
                  </span>
                  Программу под ваш уровень и цели
                </li>
                <li>
                  <span className="quiz-bonus-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/><path d="M8 14l2 2 4-4"/></svg>
                  </span>
                  Расписание под удобное время
                </li>
                <li>
                  <span className="quiz-bonus-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l9 4-9 4-9-4 9-4Z"/><path d="M3 11l9 4 9-4M3 16l9 4 9-4"/></svg>
                  </span>
                  Чек-лист «5 шагов в IT»
                </li>
              </ul>
            </aside>

            {/* Body */}
            <div className="quiz-body">
              {!done && (
                <div className="quiz-progress">
                  <div className="quiz-progress-row">
                    <span>Расчёт пройден на <strong>{progress}%</strong></span>
                    <span className="quiz-step-counter">шаг {step + 1} из {total}</span>
                  </div>
                  <div className="quiz-progress-track">
                    <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {!done && current && (
                <div className="quiz-step" key={current.id}>
                  <div className="quiz-q-head">
                    <span className="quiz-q-tag">Вопрос {step + 1} из {total}</span>
                    <h3 className="quiz-q-title">{current.title}</h3>
                  </div>
                  {current.hint && <div className="quiz-q-hint">{current.hint}</div>}

                  <div className="quiz-options" data-cols={current.cols} style={{ marginTop: 8 }}>
                    {current.options.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        className={`quiz-option ${isSelected(o.value) ? "is-selected" : ""}`}
                        onClick={() => select(o.value)}
                      >
                        <div className="quiz-option-icon" style={typeof QIcons[o.icon] === "string" ? {background:"transparent"} : undefined}>
          {typeof QIcons[o.icon] === "string"
            ? <img src={QIcons[o.icon]} alt={o.label} style={{width:44,height:44,objectFit:"contain",display:"block"}} />
            : QIcons[o.icon]}
        </div>
                        <div className="quiz-option-label">{o.label}</div>
                        <div className="quiz-option-check">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 8.5l3.2 3.2L13 4.8" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="quiz-footer">
                    <button type="button" className="quiz-back" onClick={back} disabled={step === 0}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M11 6l-6 6 6 6" />
                      </svg>
                      Назад
                    </button>
                    <button type="button" className="quiz-next" onClick={next} disabled={!canGoNext()}>
                      {step === total - 1 ? "Получить подборку" : "Далее"}
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {done && !submitted && (
                <div className="quiz-step quiz-result">
                  <span className="quiz-q-tag" style={{ alignSelf: "flex-start" }}>Тест пройден!</span>
                  <h3 className="quiz-result-title">
                    Подборка программ + расписание + чек-лист почти у вас. <em>Куда удобнее получить результат?</em>
                  </h3>

                  <div className="quiz-result-split">
                    <div className="quiz-result-left">
                      <form className="quiz-result-form" onSubmit={submitForm} noValidate>
                    <div className="qr-msgr-label">Способ связи · выберите один</div>
                    <div className="qr-msgrs">
                      <button type="button" className={`qr-msgr qr-msgr-wa ${messengers.includes("whatsapp") ? "is-selected" : ""}`} onClick={() => toggleMsgr("whatsapp")}>
                        <span className="qr-msgr-circle">
                          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11 11 0 0 0 3.6 17.3L2 22l4.8-1.5A11 11 0 1 0 20.5 3.5ZM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 1 1 12 20Zm4.6-6c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1c-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6l.4-.4c.1-.1.2-.2.2-.4s.1-.3 0-.5l-.7-1.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2 0 1.1.8 2.2.9 2.4.1.1 1.6 2.5 4 3.4.5.2 1 .3 1.3.4.6.2 1.1.2 1.5.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>
                        </span>
                        <span className="qr-msgr-name">WhatsApp</span>
                        <span className="qr-msgr-check">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg>
                        </span>
                      </button>
                      <button type="button" className={`qr-msgr qr-msgr-tg ${messengers.includes("telegram") ? "is-selected" : ""}`} onClick={() => toggleMsgr("telegram")}>
                        <span className="qr-msgr-circle">
                          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 4.3 18.4 19.6c-.2 1-.9 1.3-1.7.8l-4.7-3.4-2.2 2.1c-.2.2-.5.5-.9.5l.3-4.7L18 7c.4-.3-.1-.5-.6-.2L7 13.4l-4.5-1.4c-1-.3-1-1 .2-1.5L20.1 3c.8-.3 1.6.2 1.4 1.3Z"/></svg>
                        </span>
                        <span className="qr-msgr-name">Telegram</span>
                        <span className="qr-msgr-check">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg>
                        </span>
                      </button>
                      <button type="button" className={`qr-msgr qr-msgr-max ${messengers.includes("max") ? "is-selected" : ""}`} onClick={() => toggleMsgr("max")}>
                        <span className="qr-msgr-circle">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8"/><path d="M9 16V8l3 4 3-4v8"/></svg>
                        </span>
                        <span className="qr-msgr-name">MAX</span>
                        <span className="qr-msgr-check">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg>
                        </span>
                      </button>
                      <button type="button" className={`qr-msgr qr-msgr-ph ${messengers.includes("phone") ? "is-selected" : ""}`} onClick={() => toggleMsgr("phone")}>
                        <span className="qr-msgr-circle">
                          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z"/></svg>
                        </span>
                        <span className="qr-msgr-name">Телефон</span>
                        <span className="qr-msgr-check">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg>
                        </span>
                      </button>
                    </div>
                    {errors.messengers && <div className="qr-error">{errors.messengers}</div>}

                    <input
                      className="qr-input"
                      type="text"
                      placeholder="Ваше имя"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      className={`qr-input ${errors.phone ? "is-error" : ""}`}
                      type="tel"
                      placeholder="Действующий номер телефона *"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors({ ...errors, phone: undefined }); }}
                      required
                    />
                    {errors.phone && <div className="qr-error">{errors.phone}</div>}

                    <button type="submit" className="qr-submit">
                      Получить подборку — это бесплатно
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    </button>

                    <label className="qr-consent">
                      <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                      <span className="qr-consent-box">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg>
                      </span>
                      <span>Ознакомлен с <a href="#">политикой конфиденциальности</a> и согласен на обработку персональных данных</span>
                    </label>
                    {errors.consent && <div className="qr-error">{errors.consent}</div>}
                  </form>

                      <div className="qr-receipt">
                        <div className="qr-receipt-label">Вы сейчас получите:</div>
                        <div className="qr-receipt-items">
                          <div className="qr-receipt-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M9 14h6M9 17h4"/></svg>
                            Подборку программ
                          </div>
                          <div className="qr-receipt-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/><path d="M8 14l2 2 4-4"/></svg>
                            Расписание и стоимость
                          </div>
                          <div className="qr-receipt-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                            Чек-лист «5 шагов в IT»
                          </div>
                        </div>
                      </div>

                      <div className="quiz-footer" style={{ marginTop: 0 }}>
                        <button type="button" className="quiz-back" onClick={back}>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M11 6l-6 6 6 6" />
                          </svg>
                          Изменить ответы
                        </button>
                      </div>
                    </div>

                    <div className="quiz-result-right">
                      <div className="qr-phone">
                        <div className="qr-phone-glow" />
                        <div className="qr-phone-screen">
                          <div className="qr-phone-status">
                            <span>13:34</span>
                            <div className="qr-phone-status-icons"><span/><span/><span/></div>
                          </div>
                          <div className="qr-phone-header">
                            <span className="qr-phone-back">‹</span>
                            <div className="qr-phone-avatar">L</div>
                            <div className="qr-phone-title">
                              <strong>Lectoria · подбор</strong>
                              <span>в сети, печатает…</span>
                            </div>
                            <div className="qr-phone-header-icons">
                              <span>📹</span><span>☎</span><span>⋮</span>
                            </div>
                          </div>
                          <div className="qr-phone-body">
                            <div className="qr-bubble">
                              Здравствуйте! Высылаю индивидуальную подборку программ и расписание под ваш запрос.
                              <span className="qr-bubble-time">13:35</span>
                            </div>
                            <div className="qr-bubble">
                              <strong>Подборка курсов</strong>
                              <div className="qr-bubble-card">
                                <div className="qr-bubble-card-title">Frontend с нуля</div>
                                <div className="qr-bubble-card-meta">9 мес · вечер · 38 900 ₽/мес</div>
                              </div>
                              <div className="qr-bubble-card">
                                <div className="qr-bubble-card-title">Тестировщик ПО</div>
                                <div className="qr-bubble-card-meta">6 мес · выходные · 32 400 ₽/мес</div>
                              </div>
                              <span className="qr-bubble-time">13:35</span>
                            </div>
                            <div className="qr-bubble">
                              <div className="qr-bubble-doc">
                                <div className="qr-bubble-doc-ic">PDF</div>
                                <div>
                                  <div className="qr-bubble-doc-name">Расписание_и_стоимость.pdf</div>
                                  <div className="qr-bubble-doc-meta">2 страницы · PDF</div>
                                </div>
                              </div>
                              <div className="qr-bubble-doc">
                                <div className="qr-bubble-doc-ic">PDF</div>
                                <div>
                                  <div className="qr-bubble-doc-name">Чек-лист_5_шагов.pdf</div>
                                  <div className="qr-bubble-doc-meta">1 страница · PDF</div>
                                </div>
                              </div>
                              <span className="qr-bubble-time">13:36</span>
                            </div>
                          </div>
                          <div className="qr-phone-input">
                            <div className="qr-phone-input-pill">Введите текст</div>
                            <div className="qr-phone-input-mic">🎤</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {done && submitted && (
                <div className="quiz-step quiz-result">
                  <div className="quiz-result-mark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </div>
                  <h3 className="quiz-result-title">Спасибо! Заявка <em>принята</em></h3>
                  <p className="quiz-result-sub">
                    Менеджер свяжется с вами в течение часа на номер <strong style={{color:"var(--fg)"}}>{phone}</strong>. Подборка программ уже летит вам на почту.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

Object.assign(window, { QuizSection });
