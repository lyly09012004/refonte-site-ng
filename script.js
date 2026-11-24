/* NOVA GRAPH, direction « Aube » : menu, titre du hero, portfolio, filtres, formulaires */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* Menu « Services » et menu mobile */
  const drop = $('.nav__drop');
  if (drop) {
    const btn = $('button', drop);
    const set = (open) => { drop.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', open); };
    btn.addEventListener('click', () => set(!drop.classList.contains('is-open')));
    drop.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('click', (e) => { if (!drop.contains(e.target)) set(false); });
    drop.addEventListener('focusout', (e) => { if (e.relatedTarget && !drop.contains(e.relatedTarget)) set(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drop.classList.contains('is-open')) { set(false); btn.focus(); }
    });
  }
  const burger = $('.nav__burger');
  const drawer = $('.drawer');
  if (burger && drawer) {
    const set = (open) => {
      drawer.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open);
      burger.textContent = open ? 'Fermer' : 'Menu';
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => set(!drawer.classList.contains('is-open')));
    drawer.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) { set(false); burger.focus(); }
    });
    matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) set(false); });
  }

  /* Titre du hero : les quatre fins de phrase défilent une fois, puis la première reste */
  const rotor = $('.rotor');
  if (rotor && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ends = $$('span', rotor);
    let i = 0;
    const timer = setInterval(() => {
      ends[i].classList.remove('is-on');
      i = (i + 1) % ends.length;
      ends[i].classList.add('is-on');
      if (i === 0) clearInterval(timer);
    }, 2600);
  }

  /* Accueil : index des projets */
  const list = $('.index__list');
  if (list) {
    const tabs = $$('.index__item', list);
    const slides = $$('.index__slide');
    const show = (n, focus) => {
      tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === n); t.tabIndex = k === n ? 0 : -1; });
      slides.forEach((s, k) => s.classList.toggle('is-on', k === n));
      if (focus) tabs[n].focus();
    };
    tabs.forEach((t, k) => {
      t.addEventListener('click', () => show(k));
      t.addEventListener('keydown', (e) => {
        const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (d) { e.preventDefault(); show((k + d + tabs.length) % tabs.length, true); }
      });
    });
    show(0);
  }

  /* Filtres (portfolio, blog) */
  $$('.filters').forEach((bar) => {
    const items = $$('[data-category]');
    bar.addEventListener('click', (e) => {
      const b = e.target.closest('.filter');
      if (!b) return;
      $$('.filter', bar).forEach((x) => x.setAttribute('aria-pressed', x === b));
      items.forEach((it) => { it.hidden = b.dataset.filter !== 'all' && it.dataset.category !== b.dataset.filter; });
    });
  });

  /* Visionneuse du portfolio (sans JS, le lien ouvre l'image) */
  const works = $$('.work');
  if (works.length && typeof HTMLDialogElement !== 'undefined') {
    const box = document.createElement('dialog');
    box.className = 'box';
    box.setAttribute('aria-label', 'Visuel du projet');
    box.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure><button type="button" class="box__close">Fermer</button>';
    document.body.appendChild(box);
    works.forEach((w) => w.addEventListener('click', (e) => {
      e.preventDefault();
      $('img', box).src = w.getAttribute('href');
      $('img', box).alt = $('img', w).alt;
      $('figcaption', box).textContent = w.dataset.title;
      box.showModal();
    }));
    $('.box__close', box).addEventListener('click', () => box.close());
    box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
  }

  /* Formulaires : mêmes règles et mêmes messages que le site actuel (api/contact.php revérifie tout) */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const labelOf = (f) => {
    const l = f.form.querySelector(`label[for="${f.id}"]`);
    if (!l) return f.name;
    const c = l.cloneNode(true);
    c.querySelectorAll('.required, .form-optional, a').forEach((n) => n.remove());
    return c.textContent.trim().replace(/\s+/g, ' ').slice(0, 60);
  };
  const check = (f) => {
    const v = f.type === 'checkbox' ? (f.checked ? 'on' : '') : f.value.trim();
    if (f.required && !v) return f.dataset.msgRequired || 'Ce champ est obligatoire.';
    if (!v) return '';
    if (f.type === 'email' && !EMAIL_RE.test(v)) return 'Cette adresse e-mail ne semble pas valide (exemple : nom@domaine.fr).';
    if (f.minLength > 0 && v.length < f.minLength) return f.dataset.msgMinlength || `${f.minLength} caractères minimum.`;
    if (f.maxLength > 0 && v.length > f.maxLength) return `${f.maxLength} caractères maximum.`;
    return '';
  };
  const setError = (f, msg) => {
    const g = f.closest('.form-group');
    if (g) g.classList.toggle('error', !!msg);
    if (msg) f.setAttribute('aria-invalid', 'true'); else f.removeAttribute('aria-invalid');
    const el = f.form.querySelector(`#${CSS.escape(f.id)}-error`);
    if (el) el.textContent = msg;
  };
  const summary = (form, errors) => {
    const box = $('.form-summary', form);
    if (!box) { if (errors.length) errors[0].f.focus(); return; }
    const ul = $('ul', box);
    ul.innerHTML = '';
    if (!errors.length) { box.hidden = true; return; }
    $('.form-summary-title', box).textContent = errors.length === 1 ? 'Un point à corriger avant l’envoi :' : `${errors.length} points à corriger avant l’envoi :`;
    errors.forEach(({ f, msg }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${f.id}`;
      a.textContent = `${labelOf(f)} : ${msg}`;
      a.addEventListener('click', (e) => { e.preventDefault(); f.focus(); });
      li.appendChild(a);
      ul.appendChild(li);
    });
    box.hidden = false;
    box.focus();
  };
  $$('form[data-ajax-form]').forEach((form) => {
    const fields = $$('input, select, textarea', form).filter((f) => f.id && f.type !== 'hidden' && !f.closest('.hp-field'));
    const btn = $('[type="submit"]', form);
    const fb = $('.form-feedback', form);
    fields.forEach((f) => {
      f.addEventListener('blur', () => { if (f.value.trim() || f.closest('.form-group.error')) setError(f, check(f)); });
      f.addEventListener(f.type === 'checkbox' || f.tagName === 'SELECT' ? 'change' : 'input', () => { if (f.closest('.form-group.error')) setError(f, check(f)); });
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      fb.className = 'form-feedback';
      fb.textContent = '';
      const errors = [];
      fields.forEach((f) => { const msg = check(f); setError(f, msg); if (msg) errors.push({ f, msg }); });
      summary(form, errors);
      if (errors.length) return;
      const label = btn.textContent;
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      btn.textContent = 'Envoi en cours…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        const data = await res.json();
        if (data.ok) {
          form.reset();
          fields.forEach((f) => setError(f, ''));
          fb.className = 'form-feedback success';
          fb.textContent = $('[name="form"]', form).value === 'newsletter'
            ? 'C’est noté ! Vous recevrez le prochain article dans votre boîte mail.'
            : 'Bien reçu, merci ! Je vous réponds sous 24 h ouvrées.';
        } else {
          const server = Object.entries(data.errors || {}).map(([n, msg]) => ({ f: form.querySelector(`[name="${n}"]`), msg })).filter((x) => x.f && x.f.id);
          server.forEach(({ f, msg }) => setError(f, msg));
          if (server.length) summary(form, server);
          else { fb.className = 'form-feedback error'; fb.textContent = data.message || 'L’envoi n’a pas abouti. Réessayez dans un instant.'; }
        }
      } catch {
        fb.className = 'form-feedback error';
        fb.textContent = 'Connexion impossible. Vérifiez votre réseau et réessayez, ou écrivez à milvillemegane@nova-graph.com.';
      } finally {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        btn.textContent = label;
      }
    });
  });

  /* Consentement cookies : Google Analytics ne se charge qu'après « Accepter ». Choix gardé 6 mois. */
  const GA_ID = 'G-ND1MCX5YV2';
  const KEY = 'novagraph-consent';
  const banner = $('[data-consent]');
  const readConsent = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved && Date.now() - saved.date < 182 * 864e5) return saved.value;
    } catch { /* stockage indisponible : on redemande */ }
    return null;
  };
  const loadAnalytics = () => {
    if (window.__gaLoaded || !/(^|\.)nova-graph\.com$/.test(location.hostname)) return; // jamais en local
    window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
  };
  const clearCookies = () => {
    const host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => /^_ga/.test(n)).forEach((n) => {
      [host, `.${host}`, ''].forEach((d) => { document.cookie = `${n}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`; });
    });
  };
  if (banner) {
    const show = (on, focus) => {
      banner.hidden = !on;
      if (on && focus) $('[data-consent-choice="refuse"]', banner).focus({ preventScroll: true });
    };
    $$('[data-consent-choice]', banner).forEach((b) => b.addEventListener('click', () => {
      const was = readConsent();
      const value = b.dataset.consentChoice;
      try { localStorage.setItem(KEY, JSON.stringify({ value, date: Date.now() })); } catch { /* ignore */ }
      if (value === 'accept') loadAnalytics(); else clearCookies();
      show(false);
      if (was === 'accept' && value === 'refuse') location.reload();
    }));
    $$('[data-consent-open]').forEach((l) => l.addEventListener('click', (e) => { e.preventDefault(); show(true, true); }));
    const choice = readConsent();
    if (choice === 'accept') loadAnalytics(); else if (choice === null) show(true);
  }
})();
