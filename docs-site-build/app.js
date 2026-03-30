const dashboardLinks = [
  {
    title: 'Mission Control',
    href: '../mission-control/index.html',
    copy: 'Main operator dashboard for pipeline, approvals, posting map, and KPI pulse.'
  },
  {
    title: 'Repo index',
    href: '../INDEX.md',
    copy: 'Fast scan of the brand, content, ops, and research docs already living in this system.'
  },
  {
    title: 'Docs home',
    href: '../docs/index.html',
    copy: 'Existing docs surface for deeper strategy and internal references.'
  }
];

const workflowSteps = [
  '08:00 — generate 3 new hooks tied to offers, seasonality, or gaps in the books.',
  '10:00 — scan open appointments and create a same-day story package if needed.',
  '13:00 — bundle captions, covers, and CTA notes into one clean approval stack.',
  'Before posting — Natalie approves, tweaks lightly, or rejects.',
  '16:00 — send a brief with what shipped, what is blocked, and tomorrow’s biggest move.'
];

const resourceLinks = [
  {
    title: '30-day content plan',
    href: '../docs/content/30-day-content-plan.md',
    copy: 'Strategic long-range content ideas already mapped in the repo.'
  },
  {
    title: 'Offer ladder strategy',
    href: '../docs/brand/offer-ladder-strategy.md',
    copy: 'Messaging hierarchy for Hydrafacial, custom facials, peels, and upsells.'
  },
  {
    title: 'Weekly workflow SOP',
    href: '../docs/ops/weekly-workflow-sop.md',
    copy: 'Operational rhythm for running content and follow-up without chaos.'
  },
  {
    title: 'Reel template',
    href: '../templates/reel-template.md',
    copy: 'Reusable format for scripting and packaging short-form video ideas.'
  }
];

function renderLinks(targetId, items) {
  const root = document.getElementById(targetId);
  root.innerHTML = items.map((item) => `
    <a class="link-card" href="${item.href}">
      <strong>${item.title}</strong>
      <span>${item.copy}</span>
    </a>
  `).join('');
}

function renderWorkflow() {
  const root = document.getElementById('workflowList');
  root.innerHTML = workflowSteps.map((step) => `<div class="flow-step">${step}</div>`).join('');
}

renderLinks('dashboardLinks', dashboardLinks);
renderLinks('resourceLinks', resourceLinks);
renderWorkflow();

document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
