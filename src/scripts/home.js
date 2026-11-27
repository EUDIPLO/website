const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Code tabs ---------- */
  const codeTabs = [...document.querySelectorAll('.code-tabs [role="tab"]')];
  const selectTab = (tab) => {
    codeTabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $(t.getAttribute('aria-controls')).hidden = !on;
    });
    $('code-file').textContent = tab.dataset.file;
  };
  codeTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = codeTabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + codeTabs.length) % codeTabs.length];
      selectTab(next);
      next.focus();
    });
  });

  /* ---------- Flow switch: the same section for verifying and issuing ---------- */
  const flowButtons = [...document.querySelectorAll('[data-flow]')];
  const codeLabels = { verify: 'Backend code for the age check', issue: 'Backend code for the employee ID' };
  const sdkFiles = { verify: 'checkout.js', issue: 'employee-id.js' };
  const setFlow = (flow) => {
    flowButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.flow === flow)));
    document.querySelectorAll('[data-only]').forEach((el) => { el.hidden = el.dataset.only !== flow; });
    $('code-main').setAttribute('aria-label', codeLabels[flow]);
    $('tab-sdk').dataset.file = sdkFiles[flow];
    $('code-file').textContent = codeTabs.find((t) => t.getAttribute('aria-selected') === 'true').dataset.file;
  };
  flowButtons.forEach((b) => b.addEventListener('click', () => setFlow(b.dataset.flow)));
  document.querySelectorAll('[data-flow-go]').forEach((b) => b.addEventListener('click', () => {
    setFlow(b.dataset.flowGo);
    $('hood-head').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));

  /* ---------- Timeline: today marker ---------- */
  (() => {
    const tl = $('timeline');
    const start = new Date(2024, 0, 1), end = new Date(2028, 6, 1), now = new Date();
    if (now < start || now > end) return;
    const x = ((now - start) / (end - start)) * 100;
    const today = document.createElement('li');
    today.className = 'today';
    today.style.setProperty('--x', x.toFixed(2) + '%');
    today.textContent = 'Today · ' + now.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    const next = [...tl.querySelectorAll('.ev')].find((ev) => new Date(ev.dataset.date) > now);
    tl.insertBefore(today, next || null);
  })();

  /* ---------- Guilloche ---------- */
  const canvas = $('guilloche');
  function drawGuilloche() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const css = getComputedStyle(document.documentElement);
    const rgb = css.getPropertyValue('--guilloche-rgb').trim();
    const alpha = Number.parseFloat(css.getPropertyValue('--guilloche-a')) || 0.14;
    const wide = w > 1080;
    const cx = wide ? w * 0.73 : w * 0.62;
    const cy = wide ? h * 0.5 : h * 0.86;
    const R = wide ? Math.min(w * 0.36, h * 0.62) : Math.max(w * 0.6, 340);
    ctx.lineWidth = 0.7;
    const bands = [
      { base: 0.52, amp: 0.05, petals: 18, layers: 12 },
      { base: 0.78, amp: 0.06, petals: 26, layers: 14 },
      { base: 1.06, amp: 0.07, petals: 34, layers: 16 },
    ];
    bands.forEach((b, bi) => {
      ctx.strokeStyle = `rgba(${rgb}, ${alpha * (1 - bi * 0.22)})`;
      for (let l = 0; l < b.layers; l++) {
        const phase = (l / b.layers) * Math.PI * 2;
        ctx.beginPath();
        const steps = 900;
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * Math.PI * 2;
          const r = R * (b.base + b.amp * Math.sin(b.petals * t + phase) + b.amp * 0.45 * Math.sin((b.petals / 2) * t - phase / 2));
          const x = cx + r * Math.cos(t), y = cy + r * Math.sin(t);
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    });
  }
  drawGuilloche();
  if ('ResizeObserver' in window) new ResizeObserver(drawGuilloche).observe(canvas);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', drawGuilloche);
  // Redraw once the fonts are in.
  document.fonts?.addEventListener('loadingdone', drawGuilloche);

  /* ---------- Wallet flow stage ---------- */
  function qr(seed) {
    const n = 25;
    let s = seed;
    const rnd = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return s / 0x7fffffff;
    };
    const inFinder = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
    let cells = '';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      if (!inFinder(x, y) && rnd() > 0.5) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
    const finder = (x, y) => `<rect class="qf" x="${x}" y="${y}" width="7" height="7"/><rect class="qb" x="${x + 1}" y="${y + 1}" width="5" height="5"/><rect class="qf" x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
    return `<div class="qr"><svg viewBox="-2 -2 ${n + 4} ${n + 4}"><rect class="qb" x="-2" y="-2" width="${n + 4}" height="${n + 4}"/><g class="qf">${cells}</g>${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg></div>`;
  }

  const bankFields = [['Given name', 'Lena'], ['Family name', 'Fischer'], ['Date of birth', '14 Mar 1991'], ['Address', 'Lindenstraße 12, Berlin']];
  const bankField = (filled, [l, v]) => `<div class="f${filled ? ' filled' : ''}"><small>${l}</small><span>${filled ? v : '&nbsp;'}</span></div>`;
  const bankForm = (filled) => {
    const fields = bankFields.map((field) => bankField(filled, field)).join('');
    return `<div class="b-form${filled ? '' : ' wide-only'}">${fields}</div>`;
  };
  const cartLines = `<ul class="b-lines wide-only"><li><span>Riesling Kabinett 2024</span><span>€14.90</span></li><li><span>Spätburgunder 2023</span><span>€19.50</span></li></ul>`;

  const SCENARIOS = {
    age: {
      kind: 'verify', url: 'shop.example/checkout', title: 'Checkout', seed: 7,
      extra: () => cartLines,
      ask: ['Confirm you are over 18', 'Scan with your EU Digital Identity Wallet to continue.'],
      done: ['Age confirmed', 'Over 18. No name or birth date was shared.'], cta: 'Place order · €34.40',
      requester: 'shop.example', from: 'Personal ID', claims: ['Age over 18'],
      purpose: 'Age check for alcohol', note: 'Name, birth date and address stay in your wallet.', shared: '1 attribute',
      hood: [
        'Your backend calls POST /api/verifier/offer. EUDIPLO builds the DCQL query, signs the request and returns the link for the QR code.',
        'The wallet fetches the signed request and checks the access certificate of shop.example.',
        'The wallet shows who is asking, taken from the registration certificate, and exactly which claim.',
        'EUDIPLO decrypts the answer on your server, checks signature, key binding, trust list and status, then calls your webhook.',
      ],
    },
    bank: {
      kind: 'verify', url: 'bank.example/open-account', title: 'Open a current account', seed: 21,
      extra: (state) => bankForm(state === 'done'),
      ask: ['Fill this in with your wallet', 'Your verified details in one scan, no photo of your ID card.'],
      done: ['Identity verified', 'Taken from the Personal ID issued by Germany.'], cta: 'Continue',
      requester: 'bank.example', from: 'Personal ID', claims: ['Given name', 'Family name', 'Date of birth', 'Address'],
      purpose: 'Open a current account', note: 'Only these four attributes are shared.', shared: '4 attributes',
      hood: [
        'Your backend calls POST /api/verifier/offer with the onboarding configuration. One request accepts the PID as SD-JWT VC or mdoc.',
        'The wallet fetches the signed request and checks the access certificate of bank.example.',
        'The wallet lists the four requested claims and the purpose from the registration certificate.',
        'EUDIPLO verifies the PID against the national trust list and returns the claims as JSON to fill the form.',
      ],
    },
    staff: {
      kind: 'issue', url: 'hr.example/me/employee-id', title: 'Your employee ID', seed: 42,
      extra: () => `<p class="b-sub wide-only">Use it at the office door and to sign in to internal tools.</p>`,
      ask: ['Add your employee ID to your wallet', 'Scan with your EU Digital Identity Wallet.'],
      done: ['Employee ID issued', 'Bound to Lena’s phone. HR can suspend or revoke it.'], cta: 'Done',
      requester: 'hr.example',
      hood: [
        'Your backend calls POST /api/issuer/offer with the employee’s claims. EUDIPLO returns a credential offer.',
        'The wallet reads the issuer metadata and redeems the pre-authorized code for a token.',
        'The wallet proves it holds a key on this phone, so the credential is bound to the device.',
        'EUDIPLO adds a status list entry for revocation, signs the SD-JWT VC and notifies your webhook once the wallet confirms.',
      ],
    },
  };
  const ORDER = ['age', 'bank', 'staff'];
  const DURATIONS = [3400, 2300, 3800, 4600];

  const pidCard = `<div class="cred pid"><div class="cred-top"><b>Personal ID</b><span>DE</span></div><div class="cred-bottom"><span>Lena Fischer</span><span class="mrz-mini">IDD&lt;&lt;FISCHER&lt;&lt;LENA&lt;&lt;&lt;&lt;&lt;&lt;</span></div></div>`;
  const mdlCard = `<div class="cred mdl"><div class="cred-top"><b>Driving licence</b><span>mDL</span></div><div class="cred-bottom"><span>Categories B, A1</span></div></div>`;
  const staffCard = (isNew) => `<div class="cred staff${isNew ? ' is-new' : ''}"><div class="cred-top"><b>Employee ID</b>${isNew ? '<span class="new">New</span>' : '<span>SD-JWT VC</span>'}</div><div class="cred-bottom"><span>Lena Fischer</span><span>Platform Engineering · until 09/2029</span></div></div>`;

  function browserView(S, step) {
    const state = ['ask', 'wait', 'wait', 'done'][step];
    let panel;
    if (state === 'ask') {
      panel = `<div class="b-panel">${qr(S.seed)}<div><strong>${S.ask[0]}</strong><p>${S.ask[1]}</p></div></div>`;
    } else if (state === 'wait') {
      panel = `<div class="b-panel"><span class="spinner"></span><div><strong>Waiting for your wallet</strong><p>${S.kind === 'issue' ? 'Accept the offer' : 'Approve the request'} on your phone.</p></div></div>`;
    } else {
      panel = `<div class="b-panel ok"><span class="tick">✓</span><div><strong>${S.done[0]}</strong><p>${S.done[1]}</p></div></div><span class="b-cta wide-only">${S.cta}</span>`;
    }
    return `<div class="b-title">${S.title}</div>${S.extra(state)}${panel}`;
  }

  function phoneView(S, step) {
    if (step === 0) {
      return `<div class="p-head">Wallet</div><div class="p-body">${pidCard}${mdlCard}</div>`;
    }
    if (step === 1) {
      return `<div class="p-scan"><div class="frame"><span class="line"></span></div><p>Point the camera at the QR code</p></div>`;
    }
    if (step === 2 && S.kind === 'verify') {
      return `<div class="p-head">Share data?</div><div class="p-body">
        <div class="req"><span class="av">${S.requester[0].toUpperCase()}</span><div><b>${S.requester}</b><small>✓ Registered relying party</small></div></div>
        <div class="p-label">From your ${S.from}</div>
        <ul class="ask">${S.claims.map((c) => `<li><span class="ck">✓</span>${c}</li>`).join('')}</ul>
        <p class="p-text"><b>Purpose:</b> ${S.purpose}</p>
        <p class="p-text">${S.note}</p>
        <div class="p-actions"><span class="pb">Decline</span><span class="pb primary press">Share</span></div>
      </div>`;
    }
    if (step === 2) {
      return `<div class="p-head">Add credential?</div><div class="p-body">
        <div class="req"><span class="av">H</span><div><b>${S.requester}</b><small>✓ Registered issuer</small></div></div>
        ${staffCard(false)}
        <p class="p-text">The credential will be bound to a key on this phone.</p>
        <div class="p-actions"><span class="pb">Decline</span><span class="pb primary press">Add</span></div>
      </div>`;
    }
    if (S.kind === 'issue') {
      return `<div class="p-head">Wallet</div><div class="p-body">${staffCard(true)}${pidCard}${mdlCard}</div>`;
    }
    return `<div class="p-done"><span class="big-tick">✓</span><b>Shared with ${S.requester}</b><small>${S.shared} · just now</small></div>`;
  }

  const stageEl = $('stage');
  const tabButtons = [...stageEl.querySelectorAll('[data-scenario]')];
  const stepButtons = [...stageEl.querySelectorAll('[data-step]')];
  const playBtn = $('playpause');
  let scenario = 'age', step = 0, elapsed = 0, playing = !reduceMotion;

  function render() {
    const S = SCENARIOS[scenario];
    $('b-url').textContent = S.url;
    $('b-body').innerHTML = browserView(S, step);
    const view = $('p-view');
    view.innerHTML = phoneView(S, step);
    view.style.animation = 'none';
    view.getBoundingClientRect(); // force a reflow so the animation restarts
    view.style.animation = '';
    $('hood-text').textContent = S.hood[step];
    tabButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.scenario === scenario)));
    stepButtons.forEach((b, i) => {
      if (i === step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.style.setProperty('--p', i < step ? 1 : 0);
    });
  }
  function renderPlay() {
    playBtn.innerHTML = playing
      ? '<svg viewBox="0 0 10 10" aria-hidden="true"><rect x="1" y="1" width="3" height="8"/><rect x="6" y="1" width="3" height="8"/></svg>Pause'
      : '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1 9 5 2 9Z"/></svg>Play';
    playBtn.setAttribute('aria-label', playing ? 'Pause the animation' : 'Play the animation');
  }
  function stop() { playing = false; renderPlay(); }

  tabButtons.forEach((b) => b.addEventListener('click', () => {
    scenario = b.dataset.scenario; step = 0; elapsed = 0; stop(); render();
  }));
  stepButtons.forEach((b) => b.addEventListener('click', () => {
    step = Number(b.dataset.step); elapsed = 0; stop(); render();
  }));
  playBtn.addEventListener('click', () => {
    playing = !playing;
    if (playing && step === 3) { step = 0; elapsed = 0; render(); }
    renderPlay();
  });

  const TICK = 80;
  setInterval(() => {
    if (!playing || document.hidden) return;
    elapsed += TICK;
    const d = DURATIONS[step];
    stepButtons[step].style.setProperty('--p', Math.min(elapsed / d, 1));
    if (elapsed >= d) {
      elapsed = 0;
      if (step < 3) step++;
      else { scenario = ORDER[(ORDER.indexOf(scenario) + 1) % ORDER.length]; step = 0; }
      render();
    }
  }, TICK);

  render();
  renderPlay();
