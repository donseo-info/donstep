// ============================================================
// app.js — vanilla JS for landing-v2.html
// ============================================================

// ── Phone mask ──────────────────────────────────────────────
function applyPhoneMask(input) {
  input.addEventListener('input', function(e) {
    let digits = this.value.replace(/\D/g, '');
    // нормализуем: 8 → 7, иначе добавляем 7
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (digits.length > 0 && !digits.startsWith('7')) digits = '7' + digits;
    digits = digits.slice(0, 11);

    let out = '';
    if (digits.length > 0)  out = '+7';
    if (digits.length > 1)  out += ' (' + digits.slice(1, 4);
    if (digits.length >= 4) out += ')';
    if (digits.length > 4)  out += ' ' + digits.slice(4, 7);
    if (digits.length > 7)  out += '-' + digits.slice(7, 9);
    if (digits.length > 9)  out += '-' + digits.slice(9, 11);

    this.value = out;
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Backspace' && this.value === '+7') {
      this.value = '';
      e.preventDefault();
    }
  });

  input.addEventListener('focus', function() {
    if (!this.value) this.value = '+7 (';
  });

  input.addEventListener('blur', function() {
    if (this.value === '+7 (' || this.value === '+7') this.value = '';
  });
}

function isPhoneComplete(input) {
  const digits = input.value.replace(/\D/g, '');
  return digits.length === 11;
}

// ── Theme & accent ──────────────────────────────────────────
const ACCENT_HUE = 302;
const accent      = `oklch(0.68 0.19 ${ACCENT_HUE})`;
const accentSoft  = `oklch(0.68 0.19 ${ACCENT_HUE} / 0.16)`;
const accentBorder= `oklch(0.68 0.19 ${ACCENT_HUE} / 0.35)`;

function applyTheme() {
  const r = document.documentElement.style;
  r.setProperty('--bg-1','#02050d');
  r.setProperty('--bg-2','#050b1f');
  r.setProperty('--bg-card','rgba(99,130,200,0.06)');
  r.setProperty('--bg-card-hover','rgba(99,130,200,0.10)');
  r.setProperty('--border','rgba(99,130,200,0.14)');
  r.setProperty('--border-strong','rgba(99,130,200,0.24)');
  r.setProperty('--fg','#eef3ff');
  r.setProperty('--fg-muted','#8597b8');
  r.setProperty('--fg-dim','#5a6986');
  r.setProperty('--accent', accent);
  r.setProperty('--accent-soft', accentSoft);
  r.setProperty('--accent-border', accentBorder);
  document.body.style.background = '#02050d';
}

// ── Phone rotation ──────────────────────────────────────────
const PHONES = [
  { display: '+7 (949) 404-81-82', tel: '+79494048182' },
  { display: '+7 (949) 441-37-00', tel: '+79494413700' },
];

function initPhoneRotation() {
  const el = document.getElementById('phone-num-link');
  if (!el) return;
  const p = PHONES[Math.floor(Math.random() * PHONES.length)];
  el.textContent = p.display;
  el.href = 'tel:' + p.tel;
}

// ── Reveal on scroll ────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.s-reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-shown'); io.unobserve(e.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { el.classList.add('is-shown'); }
    else { io.observe(el); }
  });
}

// ── Hero mount + parallax ───────────────────────────────────
function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-mounted')));

  const orb1 = hero.querySelector('.hero-bg-orb-1');
  const orb2 = hero.querySelector('.hero-bg-orb-2');
  const visual = hero.querySelector('.hero-visual-inner');

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width/2)  / r.width;
    const dy = (e.clientY - r.top  - r.height/2) / r.height;
    if (orb1) orb1.style.transform = `translate(${dx*-16}px,${dy*-16}px)`;
    if (orb2) orb2.style.transform = `translate(${dx*11}px,${dy*11}px)`;
    if (visual) visual.style.transform = `translate(${dx*8}px,${dy*8}px)`;
  });
}

// ── Feature cards hover ─────────────────────────────────────
function initFeatureCards() {
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('is-hovered'));
    card.addEventListener('mouseleave', () => card.classList.remove('is-hovered'));
  });
}

// ── FAQ accordion ───────────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });
}

// ── Sticky CTA ──────────────────────────────────────────────
function initStickyCTA() {
  const cta = document.querySelector('.sticky-cta');
  const signup = document.getElementById('signup');
  if (!cta) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY, h = window.innerHeight;
    const top = signup ? signup.getBoundingClientRect().top + y : Infinity;
    if (y > h * 0.8 && y + h < top + 200) cta.classList.add('is-shown');
    else cta.classList.remove('is-shown');
  }, { passive: true });
  document.querySelector('.sticky-cta-btn')?.addEventListener('click', () => {
    if (signup) window.scrollTo({ top: signup.getBoundingClientRect().top + window.scrollY - 24, behavior: 'smooth' });
  });
}

// ── Signup form ─────────────────────────────────────────────
function initSignup() {
  const form = document.querySelector('.signup-form form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = form.querySelector('#f-name').value.trim();
    const email = form.querySelector('#f-email').value.trim();
    let ok = true;
    const nameErr  = form.querySelector('#f-name-err');
    const emailErr = form.querySelector('#f-email-err');
    if (!name)  { nameErr.textContent = 'Укажите имя'; ok = false; } else nameErr.textContent = '';
    if (!/^\S+@\S+\.\S+$/.test(email)) { emailErr.textContent = 'Некорректный email'; ok = false; } else emailErr.textContent = '';
    if (!ok) return;
    if (isLeadSent()) {
      const box = form.closest('.signup-form');
      box.innerHTML = `<div class="signup-success"><h3>Вы уже оставляли заявку</h3><p>Наш менеджер скоро свяжется с вами.</p></div>`;
      return;
    }
    fetch('handler.php', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'signup', name, email }) })
      .then(r => r.json()).then(d => { if (d.ok) fireGoal(); }).catch(()=>{});
    const box = form.closest('.signup-form');
    box.innerHTML = `<div class="signup-success">
      <div class="signup-success-mark"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></div>
      <h3>Записали вас, ${name}!</h3>
      <p>Письмо со ссылкой на эфир уже на пути в ${email}.<br/>До встречи 28 апреля в 19:00 МСК.</p>
    </div>`;
  });
}

// ── Consult modal ───────────────────────────────────────────
function initConsultModal() {
  const btn = document.querySelector('.phone-cta');
  if (!btn) return;
  btn.addEventListener('click', openConsult);
}

function openConsult() {
  const existing = document.querySelector('.cm-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'cm-overlay';
  overlay.innerHTML = `
    <div class="cm-modal">
      <button class="cm-close" aria-label="Закрыть">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="cm-badge">Бесплатно · без обязательств</div>
      <h2 class="cm-title">Быстрая консультация</h2>
      <p class="cm-sub">Менеджер перезвонит в течение <strong>15 минут</strong> и ответит на все вопросы о программах и поступлении.</p>
      <div class="cm-features">
        <div class="cm-feature"><span class="cm-feature-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></span>Подбор программы под ваши цели</div>
        <div class="cm-feature"><span class="cm-feature-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg></span>Расписание и варианты оплаты</div>
        <div class="cm-feature"><span class="cm-feature-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 4-9 4-9-4 9-4Z"/><path d="M3 11l9 4 9-4M3 16l9 4 9-4"/></svg></span>Ответы на вопросы об обучении</div>
      </div>
      <form class="cm-form" novalidate>
        <input class="cm-input" type="text" placeholder="Ваше имя" id="cm-name"/>
        <input class="cm-input" type="tel" placeholder="Номер телефона *" id="cm-phone" required/>
        <div class="cm-error" id="cm-err"></div>
        <button type="submit" class="cm-submit">Перезвоните мне <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
        <label class="cm-consent">
          <input type="checkbox" checked id="cm-consent-cb"/>
          <span class="cm-consent-box">${CHECK_SVG}</span>
          <span>Соглашаюсь с <a href="https://www.donstep.com/politika-konfidencialnosti-doneckoj-kompyuternoj-akademii/" target="_blank" rel="noopener">политикой конфиденциальности</a> и на обработку персональных данных</span>
        </label>
      </form>
    </div>`;

  document.body.appendChild(overlay);

  overlay.querySelector('.cm-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); } });
  applyPhoneMask(overlay.querySelector('#cm-phone'));

  overlay.querySelector('.cm-form').addEventListener('submit', e => {
    e.preventDefault();
    const phone = overlay.querySelector('#cm-phone').value;
    const name  = overlay.querySelector('#cm-name').value.trim();
    const digits = phone.replace(/\D/g, '');
    const consent = overlay.querySelector('#cm-consent-cb');
    if (!consent?.checked) { overlay.querySelector('#cm-err').textContent = 'Необходимо согласие с политикой конфиденциальности'; return; }
    if (!isPhoneComplete(overlay.querySelector('#cm-phone'))) { overlay.querySelector('#cm-err').textContent = 'Введите полный номер телефона'; return; }
    fetch('handler.php', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'consult', phone, name }) })
      .then(r => r.json()).then(d => { if (d.ok) fireGoal(); }).catch(()=>{});
    overlay.querySelector('.cm-modal').innerHTML = `
      <div class="cm-success">
        <div class="cm-success-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></div>
        <h2 class="cm-title">Заявка принята!</h2>
        <p class="cm-sub">Менеджер перезвонит на номер <strong>${phone}</strong> в течение 15 минут. Работаем 9:00–19:00.</p>
        <button class="cm-submit" style="margin-top:24px">Отлично, спасибо!</button>
      </div>`;
    overlay.querySelector('.cm-submit').addEventListener('click', () => overlay.remove());
  });
}

// ── Quiz ────────────────────────────────────────────────────
const STEPS = [
  { id:'level', type:'single', title:'Ваш уровень знаний в IT', cols:2, options:[
    { val:'zero',     label:'Обучение с 0',              img:'assets/step-1.png' },
    { val:'basic',    label:'Базовые знания ПК',          img:'assets/step-2.png' },
    { val:'advanced', label:'Продвинутый пользователь',   img:'assets/step-3.png' },
    { val:'pro',      label:'IT-специалист',              img:'assets/step-4.png' },
  ]},
  { id:'age', type:'single', title:'Ваш возраст', cols:2, options:[
    { val:'6-15',  label:'6–15 лет',  svg:'child' },
    { val:'15-25', label:'15–25 лет', svg:'teen'  },
    { val:'25-40', label:'25–40 лет', svg:'adult' },
    { val:'40-60', label:'40–60 лет', svg:'senior'},
  ]},
  { id:'directions', type:'multi', title:'Какие направления интересны', hint:'Можно выбрать несколько', cols:3, options:[
    { val:'code',    label:'Программирование',         img:'assets/p-1.png' },
    { val:'design',  label:'Графика и дизайн',          img:'assets/p-2.png' },
    { val:'network', label:'Сети и кибербезопасность',  img:'assets/p-3.png' },
    { val:'test',    label:'Тестирование',              img:'assets/p-4.png' },
    { val:'start',   label:'Начальные курсы',           img:'assets/p-5.png' },
    { val:'kid',     label:'Детские программы',         img:'assets/p-6.png' },
  ]},
  { id:'time', type:'multi', title:'Какое время обучения подходит', hint:'Можно выбрать несколько', cols:3, options:[
    { val:'weekday', label:'Будни',        svg:'weekday' },
    { val:'weekend', label:'Выходные',     svg:'weekend' },
    { val:'morning', label:'Утро',         svg:'morning' },
    { val:'day',     label:'День',         svg:'day'     },
    { val:'evening', label:'Вечер',        svg:'evening' },
    { val:'any',     label:'Любое время',  svg:'any'     },
  ]},
];

const SVGS = {
  child:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="3"/><path d="M6 21v-3a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3"/></svg>',
  teen:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="3.2"/><path d="M5 21v-2.5a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4V21"/></svg>',
  adult:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6.5" r="3"/><path d="M4 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2"/></svg>',
  senior:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="3"/><path d="M5 21l2-7h10l2 7"/></svg>',
  code:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6l-5 6 5 6M16 6l5 6-5 6"/></svg>',
  design:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="13.5" cy="19" r="1.5"/><path d="M12 4a8 8 0 0 0 0 16"/></svg>',
  network: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v5c0 5-3.5 9-8 11-4.5-2-8-6-8-11V6Z"/><path d="M9 12l2 2 4-4"/></svg>',
  test:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v3l-2 3 4 8a2 2 0 0 1-2 3H9a2 2 0 0 1-2-3l4-8L9 6Z"/></svg>',
  start:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v18l5-4 4 3 5-17Z"/></svg>',
  kid:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5"/><path d="M9 8h.01M15 8h.01M9.5 11.5c.8.7 2.5 1 3 0"/></svg>',
  weekday: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  weekend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="16" cy="15" r="2"/></svg>',
  morning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="4"/><path d="M3 18h18M12 6v2M6 9l1.5 1.5M18 9l-1.5 1.5"/></svg>',
  day:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"/></svg>',
  evening: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14a8 8 0 1 1-9-10 6 6 0 0 0 9 10Z"/></svg>',
  any:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
};

const CHECK_SVG = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg>';
const ARROW_R = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ARROW_L = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';

const Q = {
  step: 0,
  done: false,
  submitted: false,
  messengers: ['whatsapp'],
  answers: { level:null, age:null, directions:[], time:[] },

  init() {
    this.el = document.getElementById('quiz-body');
    if (!this.el) return;
    this.render();
  },

  isSelected(step, val) {
    const s = STEPS[step];
    if (s.type === 'single') return this.answers[s.id] === val;
    return this.answers[s.id].includes(val);
  },

  select(val) {
    const s = STEPS[this.step];
    if (s.type === 'single') {
      this.answers[s.id] = val;
      // auto-advance after short delay for single select
      setTimeout(() => this.next(), 220);
    } else {
      const arr = this.answers[s.id];
      const idx = arr.indexOf(val);
      if (idx > -1) arr.splice(idx, 1); else arr.push(val);
    }
    this.render();
  },

  canNext() {
    const s = STEPS[this.step];
    if (s.type === 'single') return this.answers[s.id] !== null;
    return this.answers[s.id].length > 0;
  },

  next() {
    if (!this.canNext()) return;
    if (this.step < STEPS.length - 1) { this.step++; this.render(); }
    else { this.done = true; this.render(); }
  },

  back() {
    if (this.done) { this.done = false; this.render(); return; }
    if (this.step > 0) { this.step--; this.render(); }
  },

  toggleMsgr(id) { this.messengers = [id]; this.render(); },

  submitForm() {
    const phoneInput = this.el.querySelector('#qr-phone');
    const phone = phoneInput?.value || '';
    const msgrs = this.el.querySelector('#qr-msgr-err');
    const phoneErr = this.el.querySelector('#qr-phone-err');
    let ok = true;
    if (!this.messengers.length) { if (msgrs) msgrs.textContent='Выберите способ связи'; ok=false; } else { if (msgrs) msgrs.textContent=''; }
    if (!isPhoneComplete(phoneInput)) { if (phoneErr) phoneErr.textContent='Введите полный номер телефона'; ok=false; } else { if (phoneErr) phoneErr.textContent=''; }
    if (!ok) return;
    this.submitted = true;
    this._submittedPhone = phone;
    fetch('handler.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'quiz',
        phone,
        messengers: this.messengers,
        age:        this.answers.age,
        level:      this.answers.level,
        directions: this.answers.directions,
        time:       this.answers.time,
      })
    }).then(r => r.json()).then(d => { if (d.ok) fireGoal(); }).catch(() => {});
    this.render();
  },

  optionHTML(s, o) {
    const sel = this.isSelected(STEPS.indexOf(s), o.val);
    const icon = o.img
      ? `<div class="quiz-option-icon" style="background:transparent"><img src="${o.img}" alt="${o.label}" style="width:44px;height:44px;object-fit:contain;display:block"/></div>`
      : `<div class="quiz-option-icon">${SVGS[o.svg]||''}</div>`;
    return `<button type="button" class="quiz-option${sel?' is-selected':''}" data-val="${o.val}">
      ${icon}
      <div class="quiz-option-label">${o.label}</div>
      <div class="quiz-option-check">${CHECK_SVG}</div>
    </button>`;
  },

  msgrBtn(id, label, iconSvg, cls) {
    const sel = this.messengers.includes(id);
    return `<button type="button" class="qr-msgr ${cls}${sel?' is-selected':''}" data-msgr="${id}">
      <span class="qr-msgr-circle">${iconSvg}</span>
      <span class="qr-msgr-name">${label}</span>
      <span class="qr-msgr-check">${CHECK_SVG}</span>
    </button>`;
  },

  render() {
    const total = STEPS.length;
    const progress = this.done ? 100 : Math.round((this.step / total) * 100);

    if (this.done && this.submitted) {
      this.el.innerHTML = `<div class="quiz-step quiz-result">
        <div class="quiz-result-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg></div>
        <h3 class="quiz-result-title">Спасибо! Заявка <em>принята</em></h3>
        <p class="quiz-result-sub">Менеджер свяжется с вами в течение часа на номер <strong style="color:var(--fg)">${this._submittedPhone}</strong>. Подборка программ уже летит к вам!</p>
      </div>`;
      return;
    }

    if (this.done) {
      this.el.innerHTML = `<div class="quiz-step quiz-result">
        <span class="quiz-q-tag" style="align-self:flex-start">Тест пройден!</span>
        <h3 class="quiz-result-title">Подборка программ + расписание + чек-лист почти у вас. <em>Куда удобнее получить результат?</em></h3>
        <div class="quiz-result-split">
          <div class="quiz-result-left">
            <form class="quiz-result-form" id="qr-form" novalidate>
              <div class="qr-msgr-label">Способ связи · выберите один</div>
              <div class="qr-msgrs">
                ${this.msgrBtn('whatsapp','WhatsApp','<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11 11 0 0 0 3.6 17.3L2 22l4.8-1.5A11 11 0 1 0 20.5 3.5ZM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.9.9-2.8-.2-.3A8 8 0 1 1 12 20Zm4.6-6c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1c-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6l.4-.4c.1-.1.2-.2.2-.4s.1-.3 0-.5l-.7-1.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2 0 1.1.8 2.2.9 2.4.1.1 1.6 2.5 4 3.4.5.2 1 .3 1.3.4.6.2 1.1.2 1.5.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>','qr-msgr-wa')}
                ${this.msgrBtn('telegram','Telegram','<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 4.3 18.4 19.6c-.2 1-.9 1.3-1.7.8l-4.7-3.4-2.2 2.1c-.2.2-.5.5-.9.5l.3-4.7L18 7c.4-.3-.1-.5-.6-.2L7 13.4l-4.5-1.4c-1-.3-1-1 .2-1.5L20.1 3c.8-.3 1.6.2 1.4 1.3Z"/></svg>','qr-msgr-tg')}
                ${this.msgrBtn('max','MAX','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M9 16V8l3 4 3-4v8"/></svg>','qr-msgr-max')}
                ${this.msgrBtn('phone','Телефон','<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8Z"/></svg>','qr-msgr-ph')}
              </div>
              <div class="qr-error" id="qr-msgr-err"></div>
              <input class="qr-input" type="text" placeholder="Ваше имя" id="qr-name"/>
              <input class="qr-input" type="tel" placeholder="Действующий номер телефона *" id="qr-phone" required/>
              <div class="qr-error" id="qr-phone-err"></div>
              <button type="submit" class="qr-submit">Получить подборку — это бесплатно ${ARROW_R}</button>
              <label class="qr-consent">
                <input type="checkbox" checked id="qr-consent"/>
                <span class="qr-consent-box">${CHECK_SVG}</span>
                <span>Ознакомлен с <a href="https://www.donstep.com/politika-konfidencialnosti-doneckoj-kompyuternoj-akademii/">политикой конфиденциальности</a> и согласен на обработку данных</span>
              </label>
            </form>
            <div class="qr-receipt">
              <div class="qr-receipt-label">Вы сейчас получите:</div>
              <div class="qr-receipt-items">
                <div class="qr-receipt-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M9 14h6M9 17h4"/></svg>Подборку программ</div>
                <div class="qr-receipt-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>Расписание и стоимость</div>
                <div class="qr-receipt-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>Чек-лист «5 шагов в IT»</div>
              </div>
            </div>
            <div class="quiz-footer" style="margin-top:0">
              <button type="button" class="quiz-back" id="qr-back-btn">${ARROW_L} Изменить ответы</button>
            </div>
          </div>
          <div class="quiz-result-right">
            <div class="qr-phone">
              <div class="qr-phone-glow"></div>
              <div class="qr-phone-screen">
                <div class="qr-phone-status"><span>13:34</span><div class="qr-phone-status-icons"><span></span><span></span><span></span></div></div>
                <div class="qr-phone-header">
                  <span class="qr-phone-back">‹</span>
                  <div class="qr-phone-avatar">L</div>
                  <div class="qr-phone-title"><strong>IT-академия · подбор</strong><span>в сети, печатает…</span></div>
                  <div class="qr-phone-header-icons"><span>📹</span><span>☎</span><span>⋮</span></div>
                </div>
                <div class="qr-phone-body">
                  <div class="qr-bubble">Здравствуйте! Высылаю индивидуальную подборку программ.<span class="qr-bubble-time">13:35</span></div>
                  <div class="qr-bubble"><strong>Подборка курсов</strong>
                    <div class="qr-bubble-card"><div class="qr-bubble-card-title">Frontend с нуля</div><div class="qr-bubble-card-meta">12 мес · вечер · 7 000 ₽/мес</div></div>
                    <div class="qr-bubble-card"><div class="qr-bubble-card-title">Тестировщик ПО</div><div class="qr-bubble-card-meta">6 мес · выходные · 8 000 ₽/мес</div></div>
                    <span class="qr-bubble-time">13:35</span>
                  </div>
                  <div class="qr-bubble">
                    <div class="qr-bubble-doc"><div class="qr-bubble-doc-ic">PDF</div><div><div class="qr-bubble-doc-name">Расписание_и_стоимость.pdf</div><div class="qr-bubble-doc-meta">2 стр · PDF</div></div></div>
                    <div class="qr-bubble-doc"><div class="qr-bubble-doc-ic">PDF</div><div><div class="qr-bubble-doc-name">Чек-лист_5_шагов.pdf</div><div class="qr-bubble-doc-meta">1 стр · PDF</div></div></div>
                    <span class="qr-bubble-time">13:36</span>
                  </div>
                </div>
                <div class="qr-phone-input"><div class="qr-phone-input-pill">Введите текст</div><div class="qr-phone-input-mic">🎤</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

      // bind events
      this.el.querySelectorAll('.qr-msgr').forEach(b => b.addEventListener('click', () => { this.toggleMsgr(b.dataset.msgr); }));
      this.el.querySelector('#qr-form')?.addEventListener('submit', e => { e.preventDefault(); this.submitForm(); });
      this.el.querySelector('#qr-back-btn')?.addEventListener('click', () => this.back());
      const qrPhone = this.el.querySelector('#qr-phone');
      if (qrPhone) applyPhoneMask(qrPhone);
      return;
    }

    // question screen
    const s = STEPS[this.step];
    this.el.innerHTML = `
      <div class="quiz-progress">
        <div class="quiz-progress-row"><span>Расчёт пройден на <strong>${progress}%</strong></span><span class="quiz-step-counter">шаг ${this.step+1} из ${total}</span></div>
        <div class="quiz-progress-track"><div class="quiz-progress-fill" style="width:${progress}%"></div></div>
      </div>
      <div class="quiz-step" id="quiz-step-inner">
        <div class="quiz-q-head">
          <span class="quiz-q-tag">Вопрос ${this.step+1} из ${total}</span>
          <h3 class="quiz-q-title">${s.title}</h3>
        </div>
        ${s.hint ? `<div class="quiz-q-hint">${s.hint}</div>` : ''}
        <div class="quiz-options" data-cols="${s.cols}" style="margin-top:8px">
          ${s.options.map(o => this.optionHTML(s, o)).join('')}
        </div>
        <div class="quiz-footer">
          <button type="button" class="quiz-back" id="q-back" ${this.step===0?'disabled':''}>${ARROW_L} Назад</button>
          <button type="button" class="quiz-next" id="q-next" ${this.canNext()?'':'disabled'}>${this.step===total-1?'Получить подборку':'Далее'} ${ARROW_R}</button>
        </div>
      </div>`;

    this.el.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => this.select(btn.dataset.val));
    });
    this.el.querySelector('#q-back')?.addEventListener('click', () => this.back());
    this.el.querySelector('#q-next')?.addEventListener('click', () => this.next());
  }
};

// ── Cookie helpers ──────────────────────────────────────────
function setCookie(name, value, days) {
  const exp = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${exp}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((acc, c) => {
    const [k, v] = c.split('=');
    return k === name ? decodeURIComponent(v) : acc;
  }, null);
}

const LEAD_COOKIE = 'lead_sent';

function isLeadSent() {
  return getCookie(LEAD_COOKIE) === '1';
}

function markLeadSent() {
  setCookie(LEAD_COOKIE, '1', 365);
}

function fireGoal() {
  if (isLeadSent()) {
    console.log('[goal] skip — cookie lead_sent already set');
    return;
  }
  markLeadSent();
  console.log('[goal] firing lead, metrikaId=', window._metrikaId);
  // Яндекс.Метрика
  try {
    if (typeof ym !== 'undefined') {
      ym(window._metrikaId, 'reachGoal', 'lead');
      console.log('[goal] ym() called');
    } else {
      console.warn('[goal] ym not defined — metrika not loaded');
    }
  } catch (e) { console.error('[goal] ym error:', e); }

  // VK Pixel
  try {
    if (typeof _tmr !== 'undefined') {
      _tmr.push({ type: 'reachGoal', id: window._vkPixelId || 0, goal: 'lead' });
      console.log('[goal] _tmr.push() called');
    } else {
      console.warn('[goal] _tmr not defined — vk pixel not loaded');
    }
  } catch (e) { console.error('[goal] vk error:', e); }

  // GTM dataLayer fallback
  try {
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'send_lead' });
      console.log('[goal] dataLayer pushed');
    }
  } catch (e) { console.error('[goal] dataLayer error:', e); }
}

// ── Boot ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  initPhoneRotation();
  initHero();
  initReveal();
  initFeatureCards();
  initFAQ();
  initStickyCTA();
  initSignup();
  initConsultModal();
  Q.init();
});
