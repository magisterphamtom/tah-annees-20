/**
 * Token Action HUD — Thèmes années 20
 * Ajoute trois styles à la liste des styles de Token Action HUD Core
 * (Paramètres › Token Action HUD Core › Style) :
 *   annees20  — Années 20 (Art Déco noir et or)
 *   newyork20 — New York années 20 (Manhattan, Broadway)
 *   montagnes — Par-delà les Montagnes Hallucinées (carnet d'expédition)
 */

const ID = 'tah-annees-20';
const TAH = 'token-action-hud-core';

const THEMES = {
  annees20: { class: 'tah-style-annees20', file: 'tah-annees20', label: 'TAH20.Styles.annees20', fallback: 'Années 20 (Art Déco)', colors: ['#efe3c6', '#c9a24a', '#ecd08a'] },
  newyork20: { class: 'tah-style-newyork20', file: 'tah-newyork', label: 'TAH20.Styles.newyork20', fallback: 'New York années 20', colors: ['#e9edf3', '#c8d2df', '#f6c560'] },
  montagnes: { class: 'tah-style-montagnes', file: 'tah-montagnes', label: 'TAH20.Styles.montagnes', fallback: 'Par-delà les Montagnes Hallucinées', colors: ['#1d2b3a', '#3f6a8e', '#23415e'] },
  ny2026: { class: 'tah-style-ny2026', file: 'tah-ny2026', label: 'TAH20.Styles.ny2026', fallback: 'New York 2026', colors: ['#f2f3f5', '#fccc0a', '#0039a6'] },
  antarctique2026: { class: 'tah-style-antarctique2026', file: 'tah-antarctique2026', label: 'TAH20.Styles.antarctique2026', fallback: 'Antarctique 2026', colors: ['#13202c', '#ff6a13', '#1f7fbf'] }
};

const label = (key, fallback) => (game.i18n?.has?.(key) ? game.i18n.localize(key) : fallback);

// Appelé par Token Action HUD Core quand il construit sa liste de styles.
Hooks.on('tokenActionHudCoreRegisterStyles', (styles) => {
  try {
    for (const [key, t] of Object.entries(THEMES)) {
      styles[key] = {
        class: t.class,
        file: t.file,
        moduleId: ID,
        name: label(t.label, t.fallback),
        primaryColor: t.colors[0],
        secondaryColor: t.colors[1],
        tertiaryColor: t.colors[2]
      };
    }
  } catch (err) {
    console.error(`${ID} | Impossible d'enregistrer les styles`, err);
  }
});

/** Classes sur <body> (les infobulles du HUD s'affichent hors du HUD). */
function updateBodyClass () {
  let style = null;
  try { style = game.settings.get(TAH, 'style'); } catch (err) { /* TAH pas encore prêt */ }
  document.body.classList.toggle('tah-annees20-active', style === 'annees20');
  document.body.classList.toggle('tah-newyork20-active', style === 'newyork20');
  document.body.classList.toggle('tah-montagnes-active', style === 'montagnes');
  document.body.classList.toggle('tah-ny2026-active', style === 'ny2026');
  document.body.classList.toggle('tah-antarctique2026-active', style === 'antarctique2026');
}

/* -------------------------------------------- */
/*  Option du Gardien : imposer un thème à tous */
/* -------------------------------------------- */

Hooks.once('init', () => {
  game.settings.register(ID, 'forceStyle', {
    name: 'TAH20.Settings.ForceStyle.Name',
    hint: 'TAH20.Settings.ForceStyle.Hint',
    scope: 'world',
    config: true,
    type: String,
    choices: {
      '': 'TAH20.Settings.ForceStyle.Free',
      annees20: 'TAH20.Styles.annees20',
      newyork20: 'TAH20.Styles.newyork20',
      montagnes: 'TAH20.Styles.montagnes',
      ny2026: 'TAH20.Styles.ny2026',
      antarctique2026: 'TAH20.Styles.antarctique2026'
    },
    default: '',
    onChange: () => applyForcedStyle()
  });
  // Ancien réglage (v1.0.0, case à cocher) : conservé caché pour la migration
  game.settings.register(ID, 'forceForAll', { scope: 'world', config: false, type: Boolean, default: false });
});

function tahStyleReady () {
  return game.settings.settings.has(`${TAH}.style`);
}

/** Thème imposé par le Gardien, s'il y en a un. */
function forcedStyle () {
  try {
    const value = game.settings.get(ID, 'forceStyle');
    if (value) return value;
    if (game.settings.get(ID, 'forceForAll')) return 'annees20';
  } catch (err) { /* réglages pas encore prêts */ }
  return '';
}

/** Applique un style de Token Action HUD à ce client (utilisé aussi par le module de cartes de chat). */
async function setStyle (style) {
  if (!style || !tahStyleReady()) return false;
  try {
    if (game.settings.get(TAH, 'style') !== style) await game.settings.set(TAH, 'style', style);
    return true;
  } catch (err) {
    console.error(`${ID} | Impossible d'appliquer le style ${style}`, err);
    return false;
  }
}

async function applyForcedStyle () {
  const style = forcedStyle();
  if (style) await setStyle(style);
  updateBodyClass();
}

Hooks.once('ready', () => {
  if (!game.modules.get(TAH)?.active) {
    ui.notifications.warn(game.i18n.localize('TAH20.NeedCore'));
    return;
  }
  game.modules.get(ID).api = { THEMES, setStyle, isReady: tahStyleReady };
  updateBodyClass();
  // Token Action HUD Core enregistre ses réglages un peu après « ready » : on patiente (10 s max)
  let tries = 0;
  const wait = setInterval(() => {
    tries++;
    if (tahStyleReady() || tries > 40) {
      clearInterval(wait);
      applyForcedStyle();
      Hooks.callAll('tahAnnees20Ready');
    }
  }, 250);
});

Hooks.on('clientSettingChanged', (key) => {
  if (key === `${TAH}.style`) updateBodyClass();
});
