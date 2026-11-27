const $ = (id) => document.getElementById(id);

  /* ---------- Mobile menu ---------- */
  const toggle = $('menu-toggle'), nav = $('primary-nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- Copy buttons ---------- */
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const el = $(btn.dataset.copy);
      const label = btn.textContent;
      try {
        await navigator.clipboard.writeText(el.textContent);
        btn.textContent = 'Copied';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        btn.textContent = 'Selected';
      }
      setTimeout(() => (btn.textContent = label), 1600);
    });
  });

  /* ---------- MRZ strip (decorative, styled like an ID card's machine-readable zone) ---------- */
  const mrz = ['EUDIPLO<<ISSUE<VERIFY<TRUST', 'APACHE<2<0<<LF<DECENTRALIZED<TRUST'];
  $('mrz').textContent = mrz.map((l) => l.padEnd(44, '<').slice(0, 44)).join('\n');

