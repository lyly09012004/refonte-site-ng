/* Estimateur de projet Nova Graph : même logique et mêmes textes que le site actuel */
(function () {
  'use strict';

  /* ------------------------------------------------------
     ⚙️ CONFIGURATION
     ------------------------------------------------------ */
  var CONFIG = {
    // Budget affiché dans le récapitulatif :
    // 'none' = aucun prix | 'symbols' = €€ / €€€ / €€€€ | 'range' = fourchette chiffrée
    budgetMode: 'none',

    // Envoi via le serveur du site (réglages dans private/config.php)
    endpoint: 'api/contact.php',
    fallbackEmail: 'milvillemegane@nova-graph.com',

    refPrefix: 'NG',

    // Hook analytics (GTM / GA4 si présent)
    onEvent: function (name, data) {
      if (window.dataLayer) window.dataLayer.push(Object.assign({ event: 'est_' + name }, data));
    }
  };

  /* ------------------------------------------------------
     DONNÉES
     ------------------------------------------------------ */
  var CATS = [
    { id: 'identite',  icon: '<path d="m12 3 8 8-9 9H4v-7z"/><path d="m14.5 5.5 4 4"/>', name: 'Identité',  desc: 'Créer ou repenser votre univers visuel' },
    { id: 'digital',   icon: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>', name: 'Digital',   desc: 'Site web, landing page, interface' },
    { id: 'social',    icon: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18.5h2"/>', name: 'Social',    desc: 'Réseaux sociaux, templates, contenus' },
    { id: 'packaging', icon: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>', name: 'Packaging', desc: 'Packaging, étiquettes, gammes produit' },
    { id: 'print',     icon: '<path d="M7 8V3h10v5M7 17H4v-6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6h-3"/><path d="M7 14h10v7H7z"/>', name: 'Print',     desc: 'Cartes de visite, flyers, affiches, brochures' },
    { id: 'business',  icon: '<path d="M4 20V4M4 20h16M9 16v-4M13 16V8M17 16v-6"/>', name: 'Business',  desc: 'Présentations et documents commerciaux' }
  ];

  var SERVICES = [
    { id: 'logo',         cat: 'identite',  name: 'Logo',                 desc: 'Une identité reconnaissable et mémorable' },
    { id: 'charte',       cat: 'identite',  name: 'Charte graphique',     desc: 'Les règles qui font tenir votre image dans le temps' },
    { id: 'identite_c',   cat: 'identite',  name: 'Identité complète',    desc: 'Logo, charte, déclinaisons et direction artistique' },

    { id: 'site',         cat: 'digital',   name: 'Site web',             desc: 'Un site vitrine à votre image' },
    { id: 'landing',      cat: 'digital',   name: 'Landing page',         desc: 'Une page pensée pour convertir' },
    { id: 'ui',           cat: 'digital',   name: 'Interface / UI',       desc: "Maquettes d’application ou d’outil" },

    { id: 'templates',    cat: 'social',    name: 'Templates',            desc: 'Des gabarits réutilisables et cohérents' },
    { id: 'kit_social',   cat: 'social',    name: 'Kit réseaux sociaux',  desc: 'Bannières, avatars, stories, highlights' },
    { id: 'contenus',     cat: 'social',    name: 'Création de contenus', desc: 'Visuels et carrousels prêts à publier' },

    { id: 'packaging',    cat: 'packaging', name: 'Packaging',            desc: 'Un packaging qui raconte votre produit' },
    { id: 'etiquette',    cat: 'packaging', name: 'Étiquette',            desc: 'Des étiquettes conformes et bien dessinées' },
    { id: 'gamme',        cat: 'packaging', name: 'Gamme complète',       desc: 'Une déclinaison cohérente sur toute la gamme' },

    { id: 'carte_visite', cat: 'print',     name: 'Carte de visite',      desc: 'Le support qu’on garde en poche après vous avoir rencontré' },
    { id: 'flyer',        cat: 'print',     name: 'Flyer',                desc: 'Un support court, direct, efficace' },
    { id: 'affiche',      cat: 'print',     name: 'Affiche',              desc: "Un visuel fort qui s’impose de loin" },
    { id: 'brochure',     cat: 'print',     name: 'Brochure',             desc: 'Un document soigné qui donne envie de lire' },
    { id: 'catalogue',    cat: 'print',     name: 'Catalogue',            desc: 'Une mise en page structurée pour vos produits' },

    { id: 'presentation', cat: 'business',  name: 'Présentation',         desc: 'Un deck clair, élégant, convaincant' },
    { id: 'plaquette',    cat: 'business',  name: 'Plaquette',            desc: 'Votre offre en quelques pages tenues' },
    { id: 'doc_co',       cat: 'business',  name: 'Document commercial',  desc: 'Proposition, devis, dossier de presse' }
  ];

  var STAGES = [
    { id: 'zero',     num: '01', name: 'Je pars de zéro',        desc: 'Je lance mon activité ou ma marque.' },
    { id: 'existant', num: '02', name: "J’ai déjà une identité", desc: 'Mais elle manque de cohérence.' },
    { id: 'moderne',  num: '03', name: 'Je veux moderniser',     desc: 'Mon image ne correspond plus à mon positionnement.' },
    { id: 'refonte',  num: '04', name: 'Je veux tout repenser',  desc: 'Nouvelle stratégie, nouvelle identité.' }
  ];

  var GOALS = [
    { id: 'pro',     icon: '<path d="M12 3c.6 5 3 8 9 9-6 1-8.4 4-9 9-.6-5-3-8-9-9 6-1 8.4-4 9-9z"/>', name: 'Être plus professionnel', desc: 'Inspirer confiance dès le premier regard' },
    { id: 'diff',    icon: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12h.01"/>', name: 'Me différencier',         desc: 'Sortir du lot face à mes concurrents' },
    { id: 'lancer',  icon: '<path d="M5 19c0-3 1.5-4.5 3-4.5S11 16 11 17.5 8 19 5 19z"/><path d="M9 14c1-6 5-10 11-10 0 6-4 10-10 11"/>', name: 'Lancer une marque',       desc: 'Exister clairement dès le départ' },
    { id: 'gamme',   icon: '<path d="M7 4h10l4 5-9 11L3 9z"/><path d="M3 9h18M9 9l3 11 3-11"/>', name: 'Monter en gamme',         desc: 'Justifier un positionnement plus premium' },
    { id: 'visible', icon: '<path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/>', name: 'Développer ma visibilité',desc: 'Être vu, reconnu, mémorisé' },
    { id: 'moderne', icon: '<path d="M20 11a8 8 0 0 0-14-4L4 9M4 13a8 8 0 0 0 14 4l2-2"/><path d="M4 4v5h5M20 20v-5h-5"/>', name: 'Moderniser mon image',    desc: 'Remettre mon image à jour' }
  ];

  var LEVELS = [
    {
      id: 'cible', name: 'Ciblé',
      desc: "Un périmètre resserré, entièrement concentré sur ce qui compte le plus pour vous aujourd’hui.",
      items: ['Logo', 'Palette', 'Typographies', 'Déclinaisons principales'],
      panel: 'Un socle net et cohérent, concentré sur votre priorité du moment.',
      symbols: '€€', range: '750 – 1 200 €'
    },
    {
      id: 'complet', name: 'Complet',
      desc: "Une identité pensée pour vivre sur plusieurs supports, avec ses règles d’usage.",
      items: ['Identité', 'Charte graphique', 'Templates', 'Supports principaux'],
      panel: 'Votre identité et ses principales déclinaisons, prêtes à être utilisées au quotidien.',
      symbols: '€€€', range: '1 500 – 3 000 €'
    },
    {
      id: 'surmesure', name: 'Sur-mesure',
      desc: 'Une direction artistique complète, construite autour de votre marque et de tous ses points de contact.',
      items: ['Stratégie visuelle', 'Identité complète', 'Déclinaisons', 'Accompagnement', 'Supports personnalisés'],
      panel: 'Un accompagnement sur-mesure : une identité cohérente et ses déclinaisons sur plusieurs points de contact.',
      symbols: '€€€€', range: '3 000 – 6 000 €'
    }
  ];

  var SCREEN_NAMES = [
    'Vos besoins', 'Vos prestations', 'Votre situation', 'Vos objectifs',
    'Votre accompagnement', 'Votre projet', 'Prise de contact'
  ];

  /* Les piliers du score regroupent des CATÉGORIES, pas des prestations :
     ajouter une prestation à SERVICES la fait automatiquement compter dans
     le bon pilier, sans rien toucher ici. */
  var PILLARS = [
    { id: 'identite', cats: ['identite'],            points: 12, manque: "un socle d’identité" },
    { id: 'digital',  cats: ['digital', 'social'],   points: 9,  manque: 'votre présence digitale' },
    { id: 'supports', cats: ['packaging', 'print'],  points: 6,  manque: 'vos supports imprimés ou produit' },
    { id: 'business', cats: ['business'],            points: 5,  manque: 'vos supports commerciaux' }
  ];

  /* Une catégorie / un pilier est « couvert » dès qu'une de ses prestations
     est sélectionnée. Utilisé par le score comme par les recommandations. */
  function hasCat(set, catId) {
    return SERVICES.some(function (s) { return s.cat === catId && set.has(s.id); });
  }
  function hasPillar(set, pillarId) {
    var p = PILLARS.filter(function (x) { return x.id === pillarId; })[0];
    return !!p && p.cats.some(function (c) { return hasCat(set, c); });
  }

  /* Recommandations intelligentes (2 max affichées) */
  var RECOS = [
    {
      id: 'charte',
      when: function (s) { return s.has('logo') && !s.has('charte') && !s.has('identite_c'); },
      title: 'Prévoyez une mini-charte graphique',
      text: "Votre sélection couvre votre présence visuelle de base. Pour qu’elle reste cohérente d’un support à l’autre, une charte — même courte — évite que l’identité se délite au fil des usages.",
      add: 'charte'
    },
    {
      id: 'identite_pack',
      when: function (s) { return hasCat(s, 'packaging') && !s.has('identite_c'); },
      title: 'Votre identité doit fonctionner sur vos produits',
      text: "Un packaging porte votre marque autant que votre logo. Une identité visuelle complète assure la cohérence entre la marque et ce que le client tient en main.",
      add: 'identite_c'
    },
    {
      id: 'digital',
      when: function (s) { return hasPillar(s, 'identite') && !hasPillar(s, 'digital'); },
      title: 'Il manque peut-être votre présence digitale',
      text: "Vous avez défini votre identité et vos supports. C’est pourtant souvent en ligne que la première rencontre a lieu — une landing page ou un kit réseaux sociaux prolonge le travail au lieu de le laisser en vitrine.",
      add: 'site'
    },
    {
      id: 'templates',
      when: function (s) { return (s.has('kit_social') || s.has('contenus')) && !s.has('templates'); },
      title: 'Gagnez du temps avec des templates',
      text: 'Des gabarits réutilisables vous rendent autonome sur vos publications, tout en gardant une ligne graphique tenue.',
      add: 'templates'
    },
    {
      id: 'business',
      when: function (s) { return s.has('site') && !hasPillar(s, 'business'); },
      title: 'Et vos supports commerciaux ?',
      text: "Un site attire, un document convainc. Une présentation ou une plaquette à votre image prolonge la cohérence jusqu’au rendez-vous client.",
      add: 'presentation'
    },
    {
      id: 'identite_print',
      when: function (s) { return hasCat(s, 'print') && !hasPillar(s, 'identite'); },
      title: 'Vos supports méritent une identité derrière eux',
      text: "Un flyer ou une brochure sans univers visuel défini repart de zéro à chaque fois. Poser l’identité en amont rend tous les supports suivants plus rapides et plus cohérents.",
      add: 'identite_c'
    },
    {
      id: 'charte_business',
      when: function (s) { return hasPillar(s, 'business') && !s.has('charte') && !s.has('identite_c'); },
      title: 'Vos documents commerciaux gagnent à être cadrés',
      text: "Une charte, même courte, vous permet de produire vos prochains documents vous-même sans que l’image se disperse.",
      add: 'charte'
    }
  ];

  /* Suggestions de repli : tant que le projet n'est pas complet, il reste
     toujours une piste à proposer, dans cet ordre de priorité. */
  var FALLBACKS = [
    { id: 'fb_identite_c', add: 'identite_c', title: 'Aller au bout de votre identité',
      text: "Une identité complète — logo, charte, déclinaisons et direction artistique — donne à tous vos supports le même socle et vous évite de rouvrir le sujet à chaque nouveau besoin." },
    { id: 'fb_site', add: 'site', title: 'Donnez-vous une adresse à vous',
      text: "Réseaux sociaux et supports imprimés renvoient tous quelque part. Un site vitrine est le point d’arrivée qui vous appartient vraiment." },
    { id: 'fb_templates', add: 'templates', title: 'Restez autonome au quotidien',
      text: 'Des templates réutilisables vous permettent de publier régulièrement sans repartir de zéro, et sans que la ligne graphique se délite.' },
    { id: 'fb_presentation', add: 'presentation', title: 'Pensez à vos rendez-vous clients',
      text: "Une présentation à votre image prolonge la cohérence jusqu’au moment où ça se joue vraiment : l’échange commercial." },
    { id: 'fb_brochure', add: 'brochure', title: 'Un support à laisser derrière vous',
      text: "Une brochure imprimée reste sur un bureau bien après le rendez-vous. C’est souvent ce qui fait qu’on se souvient de vous." },
    { id: 'fb_kit_social', add: 'kit_social', title: 'Soignez vos réseaux sociaux',
      text: 'Bannières, avatars, couvertures de stories : ce sont les premiers éléments que voient les gens, et souvent les derniers auxquels on pense.' }
  ];

  /* ------------------------------------------------------
     ÉTAT
     ------------------------------------------------------ */
  var TOTAL = SCREEN_NAMES.length;
  function newRef() { return CONFIG.refPrefix + String(Math.floor(Math.random() * 900) + 100); }

  /* Pas de liste des recos déjà ajoutées : chaque règle se referme d'elle-même
     une fois sa prestation sélectionnée. */
  var state = {
    screen: 0,
    cats: new Set(),
    services: new Set(),
    stage: null,
    goals: new Set(),
    level: 1,
    ref: newRef()
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var track = function (n, d) { try { CONFIG.onEvent(n, d || {}); } catch (e) {} };
  var byId = function (arr, id) { return arr.filter(function (x) { return x.id === id; })[0]; };

  /* Garde-fou : une reco qui pointerait vers une prestation inexistante
     ajouterait une ligne fantôme au brief sans rien afficher. */
  RECOS.concat(FALLBACKS).forEach(function (r) {
    if (!byId(SERVICES, r.add)) {
      console.warn('[estimateur] la reco "' + r.id + '" cible une prestation inconnue : ' + r.add);
    }
  });

  var root = $('#est');
  if (!root) return;

  var elStep = $('#estStep'), elStepName = $('#estStepName'), elFill = $('#estFill');
  var elBack = $('#estBack'), elNext = $('#estNext'), elNextLabel = $('#estNextLabel');
  var elActions = $('#estActions'), elLive = $('#estLive');

  /* ------------------------------------------------------
     CARTES
     ------------------------------------------------------ */
  function card(id, name, desc, top) {
    return '<button type="button" class="est-card" data-id="' + id + '" aria-pressed="false">' +
      (top || '') +
      '<span class="est-card-name">' + esc(name) + '</span>' +
      '<span class="est-card-desc">' + esc(desc) + '</span>' +
      '<span class="est-mark" aria-hidden="true"></span>' +
      '</button>';
  }
  var svg = function (d) { return '<svg class="est-ico" viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>'; };

  function bindGrid(container, set, opts) {
    opts = opts || {};
    container.addEventListener('click', function (e) {
      var btn = e.target.closest('.est-card');
      if (!btn || !container.contains(btn)) return;
      var id = btn.dataset.id;

      if (opts.single) {
        $$('.est-card', container).forEach(function (b) {
          b.classList.remove('is-on');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-on');
        btn.setAttribute('aria-pressed', 'true');
        state.stage = id;
      } else if (set.has(id)) {
        set.delete(id);
        btn.classList.remove('is-on');
        btn.setAttribute('aria-pressed', 'false');
      } else {
        set.add(id);
        btn.classList.add('is-on');
        btn.setAttribute('aria-pressed', 'true');
      }

      track('select', { step: state.screen, id: id });
      refreshNext();
    });
  }

  function syncGrid(container, set) {
    $$('.est-card', container).forEach(function (b) {
      var on = set.has(b.dataset.id);
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* Écran 1 — catégories */
  var catsEl = $('#estCats');
  catsEl.innerHTML = CATS.map(function (c) {
    return card(c.id, c.name, c.desc, svg(c.icon));
  }).join('');
  bindGrid(catsEl, state.cats);

  /* Écran 2 — prestations filtrées */
  var servicesEl = $('#estServices');
  var servicesSignature = null;
  function renderServices() {
    var cats = state.cats.size ? CATS.filter(function (c) { return state.cats.has(c.id); }) : CATS;

    /* L'écran ne dépend que des catégories : inutile de reconstruire une
       centaine de nœuds à chaque aller-retour entre les étapes 1 et 2. */
    var signature = cats.map(function (c) { return c.id; }).join();
    if (signature === servicesSignature) {
      syncGrid(servicesEl, state.services);
      return;
    }
    servicesSignature = signature;

    servicesEl.innerHTML = cats.map(function (c) {
      var list = SERVICES.filter(function (s) { return s.cat === c.id; });
      return '<p class="est-group-label">' + svg(c.icon) + ' ' + esc(c.name) + '</p>' +
        '<div class="est-grid est-grid-3" role="group" aria-label="' + esc(c.name) + '">' +
        list.map(function (s) { return card(s.id, s.name, s.desc); }).join('') +
        '</div>';
    }).join('');
    syncGrid(servicesEl, state.services);
  }
  bindGrid(servicesEl, state.services);

  /* Écran 3 — situation */
  var stageEl = $('#estStage');
  stageEl.innerHTML = STAGES.map(function (s) {
    return card(s.id, s.name, s.desc);
  }).join('');
  bindGrid(stageEl, null, { single: true });

  /* Écran 4 — objectifs */
  var goalsEl = $('#estGoals');
  goalsEl.innerHTML = GOALS.map(function (g) {
    return card(g.id, g.name, g.desc, svg(g.icon));
  }).join('');
  bindGrid(goalsEl, state.goals);

  /* ------------------------------------------------------
     NIVEAU D'ACCOMPAGNEMENT
     ------------------------------------------------------ */
  var range = $('#estRange'), levelEl = $('#estLevel'), labelsEl = $('#estLevelLabels');

  /* Un niveau ajouté à LEVELS apparaît de lui-même, curseur compris. */
  labelsEl.innerHTML = LEVELS.map(function (L) { return '<b>' + esc(L.name) + '</b>'; }).join('');
  range.max = LEVELS.length - 1;
  range.value = state.level;

  function renderLevel() {
    var L = LEVELS[state.level];
    $$('b', labelsEl).forEach(function (b, i) { b.classList.toggle('is-on', i === state.level); });
    range.setAttribute('aria-valuetext', L.name);
    levelEl.innerHTML =
      '<p class="est-level-name">' + esc(L.name) + '</p>' +
      '<p>' + esc(L.desc) + '</p>' +
      '<ul class="est-chips">' + L.items.map(function (i) { return '<li class="badge">' + esc(i) + '</li>'; }).join('') + '</ul>';
  }
  range.addEventListener('input', function () { state.level = Number(range.value); renderLevel(); });
  range.addEventListener('change', function () { track('level', { level: LEVELS[state.level].id }); });
  renderLevel();

  /* ------------------------------------------------------
     SCORE DE COHÉRENCE
     ------------------------------------------------------ */
  function pillars() {
    var p = {};
    PILLARS.forEach(function (x) { p[x.id] = hasPillar(state.services, x.id); });
    return p;
  }

  /* Barème volontairement monotone : chaque ajout ne peut que faire monter
     le score. Plancher à 50 % (un projet exprimé est déjà un projet qui
     tient), plafond à 96 % pour qu'il reste toujours une piste à explorer. */
  var SCORE = {
    plancher: 50,
    plafond: 96,
    // les points par pilier sont portés par PILLARS               (32 max)
    parPrestation: 1.5, prestationsComptees: 6,                  //  9 max
    situation: 4,                                                //  4 max
    parObjectif: 1.5, objectifsComptes: 3,                       //  4.5 max
    niveau: [0, 1.5, 3]                                          //  3 max
  };

  function computeScore() {
    var p = pillars();
    var n = SCORE.plancher;

    PILLARS.forEach(function (x) { if (p[x.id]) n += x.points; });
    n += Math.min(state.services.size, SCORE.prestationsComptees) * SCORE.parPrestation;
    if (state.stage) n += SCORE.situation;
    n += Math.min(state.goals.size, SCORE.objectifsComptes) * SCORE.parObjectif;
    n += SCORE.niveau[state.level] || 0;

    return Math.round(Math.max(SCORE.plancher, Math.min(SCORE.plafond, n)));
  }

  function scoreText() {
    var p = pillars();
    var gaps = PILLARS.filter(function (x) { return !p[x.id]; }).map(function (x) { return x.manque; });
    var couverts = PILLARS.length - gaps.length;

    if (!gaps.length) {
      return "Votre projet couvre l’ensemble de vos points de contact : identité, digital, supports et commercial. Il ne reste qu’à en préciser le périmètre ensemble.";
    }

    var base = couverts >= 2
      ? 'Votre projet est déjà cohérent : il tient sur plusieurs points de contact.'
      : 'Votre projet part sur une base claire.';

    return base + ' Pour aller plus loin, il reste à explorer ' + gaps.slice(0, 2).join(' et ') + '.';
  }

  /* ------------------------------------------------------
     RÉCAPITULATIF
     ------------------------------------------------------ */
  function selectedByCat() {
    return CATS.map(function (c) {
      return {
        cat: c,
        items: SERVICES.filter(function (s) { return s.cat === c.id && state.services.has(s.id); })
      };
    }).filter(function (g) { return g.items.length; });
  }

  function renderRecap() {
    var groups = selectedByCat();
    var html = '';

    if (groups.length) {
      html += groups.map(function (g) {
        return '<div class="est-recap-block"><h3>' + svg(g.cat.icon) + ' ' + esc(g.cat.name) + '</h3><ul class="est-recap-list">' +
          g.items.map(function (s) { return '<li>' + esc(s.name) + '</li>'; }).join('') + '</ul></div>';
      }).join('');
    } else {
      html += '<div class="est-recap-block"><h3>Prestations</h3><p>Aucune prestation sélectionnée — nous partirons de votre situation et de vos objectifs.</p></div>';
    }

    if (state.stage) {
      html += '<div class="est-recap-block"><h3>Votre situation</h3><ul class="est-recap-list"><li>' +
        esc(byId(STAGES, state.stage).name) + '</li></ul></div>';
    }

    if (state.goals.size) {
      html += '<div class="est-recap-block"><h3>Vos objectifs</h3><ul class="est-recap-list">' +
        GOALS.filter(function (g) { return state.goals.has(g.id); })
          .map(function (g) { return '<li>' + esc(g.name) + '</li>'; })
          .join('') + '</ul></div>';
    }

    $('#estRecap').innerHTML = html;

    var L = LEVELS[state.level];
    $('#estPanelLevel').textContent = L.name;
    $('#estPanelText').textContent = L.panel;

    var budget = $('#estBudget');
    if (CONFIG.budgetMode === 'none') {
      budget.hidden = true;
    } else {
      budget.hidden = false;
      $('#estBudgetValue').textContent = CONFIG.budgetMode === 'symbols' ? L.symbols : L.range;
    }

    var score = computeScore();
    $('#estScoreValue').textContent = score + ' %';
    $('#estScoreText').textContent = scoreText();
    requestAnimationFrame(function () { $('#estScoreFill').style.width = score + '%'; });

    renderRecos();
  }

  /* Recommandations affichées : les règles qui matchent, complétées si besoin
     par une suggestion de repli tant que le score n'a pas atteint le plafond. */
  function currentRecos() {
    var list = RECOS.filter(function (r) { return r.when(state.services); }).slice(0, 2);

    if (!list.length && computeScore() < SCORE.plafond) {
      var fb = FALLBACKS.filter(function (r) { return !state.services.has(r.add); })[0];
      if (fb) list = [fb];
    }
    return list;
  }

  function renderRecos() {
    var list = currentRecos();

    $('#estRecos').innerHTML = list.length
      ? '<h3 class="est-recos-title">' +
        (list.length > 1 ? 'Quelques recommandations' : 'Une petite recommandation') + '</h3>' +
        list.map(function (r) {
          return '<div class="est-reco" data-reco="' + r.id + '">' +
            '<span class="badge">Suggestion</span>' +
            '<h4>' + esc(r.title) + '</h4>' +
            '<p>' + esc(r.text) + '</p>' +
            '<button type="button" class="btn btn--sm btn--line est-reco-add">Ajouter à mon projet</button>' +
            '</div>';
        }).join('')
      : '';
  }

  $('#estRecos').addEventListener('click', function (e) {
    var btn = e.target.closest('.est-reco-add');
    if (!btn) return;
    var box = btn.closest('.est-reco');
    var reco = byId(RECOS.concat(FALLBACKS), box.dataset.reco);
    if (!reco) return;

    state.services.add(reco.add);
    var svc = byId(SERVICES, reco.add);
    if (svc) state.cats.add(svc.cat);

    box.classList.add('is-added');
    btn.textContent = 'Ajouté ✓';
    track('reco_add', { reco: reco.id, service: reco.add });

    syncGrid(catsEl, state.cats);
    renderServices();
    setTimeout(renderRecap, 450);
    say('Prestation ajoutée à votre projet.');
  });

  /* ------------------------------------------------------
     BRIEF
     ------------------------------------------------------ */
  function briefData() {
    var groups = selectedByCat();
    var st = byId(STAGES, state.stage);
    var L = LEVELS[state.level];
    return {
      ref: state.ref,
      besoin: groups.length ? groups.map(function (g) { return g.cat.name; }).join(' + ') : '—',
      supports: groups.length ? groups.map(function (g) {
        return g.items.map(function (i) { return i.name; }).join(', ');
      }).join(' / ') : '—',
      situation: st ? st.name : '—',
      objectif: state.goals.size
        ? GOALS.filter(function (g) { return state.goals.has(g.id); }).map(function (g) { return g.name; }).join(', ')
        : '—',
      accompagnement: L.name,
      budget: CONFIG.budgetMode === 'none' ? null : (CONFIG.budgetMode === 'symbols' ? L.symbols : L.range),
      score: computeScore() + ' %',
      suite: 'Échange avec Mégane'
    };
  }

  /* Source unique des lignes du brief : le brief affiché et le brief envoyé
     ne peuvent pas diverger. */
  function briefRows(d) {
    return [
      ['Besoin', d.besoin],
      ['Supports', d.supports],
      ['Situation', d.situation],
      ['Objectif', d.objectif],
      ['Accompagnement', d.accompagnement],
      d.budget ? ['Budget indicatif', d.budget] : null,
      ['Cohérence du projet', d.score],
      ['Prochaine étape', d.suite]
    ].filter(Boolean);
  }

  function renderBrief(d) {
    d = d || briefData();
    var rows = briefRows(d);

    $('#estBrief').innerHTML =
      '<div class="est-brief-head">' +
        '<span class="est-brief-ref">Brief projet — #' + esc(d.ref) + '</span>' +
        '<span class="est-brief-date">' + new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) + '</span>' +
      '</div>' +
      rows.map(function (r) {
        return '<div class="est-brief-row"><span class="est-brief-key">' + esc(r[0]) + '</span>' +
               '<span class="est-brief-val">' + esc(r[1]) + '</span></div>';
      }).join('');
  }

  function briefText(d) {
    d = d || briefData();
    return 'BRIEF PROJET — #' + d.ref + '\n\n' +
      briefRows(d).map(function (r) { return r[0] + ' : ' + r[1]; }).join('\n') + '\n';
  }

  $('#estCopy').addEventListener('click', function () {
    var self = this, txt = briefText();
    var done = function () {
      self.textContent = 'Brief copié ✓';
      setTimeout(function () { self.textContent = 'Copier le brief'; }, 2200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      done();
    }
    track('brief_copy', { ref: state.ref });
  });

  $('#estPrint').addEventListener('click', function () {
    track('brief_print', { ref: state.ref });
    window.print();
  });

  /* ------------------------------------------------------
     NAVIGATION
     ------------------------------------------------------ */
  function canAdvance() {
    if (state.screen === 0) return state.cats.size > 0;
    if (state.screen === 1) return state.services.size > 0;
    if (state.screen === 2) return !!state.stage;
    if (state.screen === 3) return state.goals.size > 0;
    return true;
  }

  function refreshNext() {
    elNext.disabled = !canAdvance();   // l'apparence désactivée vient de .est-actions .btn:disabled
    elNextLabel.textContent =
      state.screen === 5 ? 'Demander une estimation' :
      state.screen === 6 ? 'Envoyer mon brief' : 'Continuer';
  }

  function say(msg) { elLive.textContent = msg; }

  function goTo(n, noScroll) {
    var prev = state.screen;
    state.screen = n;

    $$('.est-screen', root).forEach(function (s) {
      s.classList.toggle('is-active', Number(s.dataset.screen) === n);
    });

    if (n === 1) renderServices();
    if (n === 5) renderRecap();
    if (n === 6) {
      var d = briefData();
      renderBrief(d);
      $('#estBriefField').value = briefText(d);
    }

    var done = n >= TOTAL;
    elActions.style.display = done ? 'none' : '';
    $('.est-progress').style.visibility = done ? 'hidden' : '';
    elBack.hidden = (n === 0 || done);
    elFill.style.width = (done ? 100 : (n / (TOTAL - 1)) * 100) + '%';
    elStep.textContent = String(Math.min(n + 1, TOTAL)).padStart(2, '0');
    elStepName.textContent = SCREEN_NAMES[Math.min(n, TOTAL - 1)];

    refreshNext();
    say('Étape ' + (n + 1) + ' sur ' + TOTAL);
    track('step', { from: prev, to: n });

    if (!noScroll) {
      var top = root.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  }

  elNext.addEventListener('click', function () {
    if (!canAdvance()) return;
    if (state.screen === 6) { submit(); return; }
    goTo(state.screen + 1);
  });
  elBack.addEventListener('click', function () {
    if (state.screen > 0) goTo(state.screen - 1);
  });

  function reset() {
    state.cats.clear(); state.services.clear(); state.goals.clear();
    state.stage = null; state.level = 1;
    state.ref = newRef();
    range.value = 1; renderLevel();
    syncGrid(catsEl, state.cats);
    syncGrid(goalsEl, state.goals);
    syncGrid(stageEl, new Set());
    $('#estForm').reset();
    $('#estFeedback').className = 'form-feedback';
    $('#estFeedback').textContent = '';
    fieldError($('#estConsent'), '');
    $('#estScoreFill').style.width = '0';
    goTo(0);
  }
  $('#estRestart').addEventListener('click', reset);

  /* ------------------------------------------------------
     ENVOI (via api/contact.php)
     ------------------------------------------------------ */
  var form = $('#estForm');
  var feedback = $('#estFeedback');

  function fieldError(input, msg) {
    var group = input.closest('.form-group');
    if (!group) return;
    group.classList.toggle('error', !!msg);
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    var span = group.querySelector('.form-error');
    if (span) span.textContent = msg || '';
  }

  function validate() {
    var ok = true;
    var name = $('#estName'), email = $('#estEmail'), consent = $('#estConsent');

    if (!name.value.trim()) { fieldError(name, 'Merci d’indiquer votre nom'); ok = false; }
    else fieldError(name, '');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      fieldError(email, 'Adresse email invalide'); ok = false;
    } else fieldError(email, '');

    if (!consent.checked) { fieldError(consent, 'Merci de cocher cette case pour continuer'); ok = false; }
    else fieldError(consent, '');

    if (!ok) {
      var firstError = form.querySelector('.form-group.error input, #estConsent');
      if (firstError) firstError.focus();
    }
    return ok;
  }

  function submit() {
    if (!validate()) return;

    var d = briefData();
    $('#estBriefField').value = briefText();

    var data = new FormData(form);
    data.append('categories', Array.from(state.cats).join(', '));
    data.append('prestations', Array.from(state.services).join(', '));
    data.append('situation', state.stage || '');
    data.append('objectifs', Array.from(state.goals).join(', '));
    data.append('accompagnement', LEVELS[state.level].id);
    data.append('score', d.score);
    data.append('reference', d.ref);
    if (d.budget) data.append('budget_indicatif', d.budget);

    track('submit', {
      ref: d.ref,
      level: LEVELS[state.level].id,
      nb_prestations: state.services.size
    });

    elNext.disabled = true;
    elNextLabel.textContent = 'Envoi en cours…';
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    fetch(CONFIG.endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.ok) {
          var map = { name: '#estName', email: '#estEmail', phone: '#estPhone', consent: '#estConsent' };
          Object.keys(res.errors || {}).forEach(function (k) { if (map[k]) fieldError($(map[k]), res.errors[k]); });
          throw new Error(res.message || 'refus');
        }
        $('#estDoneText').textContent =
          'Votre brief #' + d.ref + ' a bien été transmis. Je reviens vers vous sous 24 h ouvrées avec une première proposition d’accompagnement.';
        goTo(TOTAL);
      })
      .catch(function () {
        elNext.disabled = false;
        refreshNext();
        feedback.className = 'form-feedback error';
        feedback.textContent = '✗ L’envoi a échoué. Réessayez, ou copiez le brief et envoyez-le à ' + CONFIG.fallbackEmail;
      });
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); submit(); });
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); submit(); }
  });

  /* Init — sans scroll automatique au chargement */
  goTo(0, true);
})();
