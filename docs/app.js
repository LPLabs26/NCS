const TRACKING_KEY = 'ncs_analytics_queue';

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

document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

trackPageViewOnce();
bindTrackedLinks();
