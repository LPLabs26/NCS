const TRACKING_KEY = 'ncs_analytics_queue';

const skinGoals = {
  glow: {
    tag: 'Best for instant glow',
    title: 'Start with Hydrafacial.',
    copy: 'Hydrafacial is the cleanest first move when you want visible refresh, hydration, and a polished reset without overcomplicating the choice.',
    bullets: [
      'Great before events or when skin feels tired and dull',
      'Easy to understand and easy to book first',
      'Supports glow, texture, and regular maintenance',
    ],
    ctaLabel: 'Book Hydrafacial',
    ctaHref: 'https://ncsaesthetics.glossgenius.com/',
  },
  unsure: {
    tag: 'Best for first-time clients',
    title: 'Choose a Custom Facial.',
    copy: 'If you are not sure what your skin needs, a custom facial gives Natalie room to guide the treatment around your current concerns and comfort level.',
    bullets: [
      'Ideal when you want a more personalized recommendation',
      'Helpful for sensitivity, dryness, acne, or dullness',
      'Built to reduce booking hesitation',
    ],
    ctaLabel: 'See Services',
    ctaHref: './services.html',
  },
  corrective: {
    tag: 'Best for more targeted support',
    title: 'Ask about corrective care.',
    copy: 'When your focus is texture, tone, congestion, or renewal, Natalie can point you toward the right peel or corrective treatment path.',
    bullets: [
      'Useful for more corrective skin goals',
      'Best approached with guidance and aftercare',
      'Designed to support long-term skin progress',
    ],
    ctaLabel: 'Contact NCS',
    ctaHref: './contact.html',
  },
};

function queueAnalyticsEvent(name, detail = {}) {
  const payload = {
    name,
    detail,
    path: window.location.pathname,
    ts: new Date().toISOString(),
  };

  try {
    const existing = JSON.parse(localStorage.getItem(TRACKING_KEY) || '[]');
    existing.push(payload);
    localStorage.setItem(TRACKING_KEY, JSON.stringify(existing.slice(-100)));
  } catch (error) {
    // Ignore storage failures.
  }

  if (typeof window.plausible === 'function') {
    window.plausible(name, { props: detail });
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, detail);
  }

  document.dispatchEvent(new CustomEvent('ncs:analytics', { detail: payload }));
}

function trackPageViewOnce() {
  const key = `ncs_pageview:${window.location.pathname}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, '1');
  queueAnalyticsEvent('page_view', { page_title: document.title });
}

function bindTrackedLinks() {
  document.querySelectorAll('[data-track]').forEach((link) => {
    link.addEventListener('click', () => {
      queueAnalyticsEvent(link.dataset.track, {
        label: (link.textContent || '').trim(),
        href: link.href || '',
      });
    });
  });
}

function bindSkinGoals() {
  const root = document.querySelector('[data-goal-root]');
  if (!root) return;

  const tag = root.querySelector('[data-goal-tag]');
  const title = root.querySelector('[data-goal-title]');
  const copy = root.querySelector('[data-goal-copy]');
  const list = root.querySelector('[data-goal-list]');
  const cta = root.querySelector('[data-goal-cta]');
  const buttons = root.querySelectorAll('[data-goal]');

  function renderGoal(goalKey) {
    const goal = skinGoals[goalKey];
    if (!goal) return;

    buttons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.goal === goalKey);
    });

    tag.textContent = goal.tag;
    title.textContent = goal.title;
    copy.textContent = goal.copy;
    list.innerHTML = goal.bullets.map((item) => `<li>${item}</li>`).join('');
    cta.textContent = goal.ctaLabel;
    cta.href = goal.ctaHref;
    cta.dataset.track = `goal_cta_${goalKey}`;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      renderGoal(button.dataset.goal);
      queueAnalyticsEvent('goal_switch', { goal: button.dataset.goal });
    });
  });

  renderGoal(root.dataset.goalDefault || 'glow');
}

function bindReviewCarousel() {
  const root = document.querySelector('[data-review-carousel]');
  if (!root) return;

  const cards = Array.from(root.querySelectorAll('[data-review-card]'));
  const next = root.querySelector('[data-review-next]');
  const prev = root.querySelector('[data-review-prev]');
  let active = 0;
  let timer = null;

  function show(index) {
    active = (index + cards.length) % cards.length;
    cards.forEach((card, cardIndex) => {
      card.classList.toggle('is-active', cardIndex === active);
    });
  }

  function start() {
    if (cards.length < 2) return;
    timer = window.setInterval(() => show(active + 1), 5000);
  }

  function reset() {
    if (timer) window.clearInterval(timer);
    start();
  }

  if (next) next.addEventListener('click', () => { show(active + 1); reset(); queueAnalyticsEvent('review_next'); });
  if (prev) prev.addEventListener('click', () => { show(active - 1); reset(); queueAnalyticsEvent('review_prev'); });

  show(0);
  start();
}

document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

trackPageViewOnce();
bindTrackedLinks();
bindSkinGoals();
bindReviewCarousel();
