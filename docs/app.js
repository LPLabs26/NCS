const dashboardLinks = [
  {
    title: 'Mission Control',
    href: './mission-control/index.html',
    copy: 'Main operator dashboard for pipeline, approvals, posting map, and KPI pulse.'
  },
  {
    title: 'Executive summary',
    href: './ops/executive-summary.md',
    copy: 'Fast scan of the strategy, operator model, and system goals already built for NCS.'
  },
  {
    title: 'Instagram Phase 1',
    href: './ops/instagram-phase-1/README.md',
    copy: 'Approval-first posting strategy, schedule, queue, and maintenance loop.'
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
    href: './content/30-day-content-plan.md',
    copy: 'Strategic long-range content ideas already mapped in the repo.'
  },
  {
    title: 'Offer ladder strategy',
    href: './brand/offer-ladder-strategy.md',
    copy: 'Messaging hierarchy for Hydrafacial, custom facials, peels, and upsells.'
  },
  {
    title: 'Weekly workflow SOP',
    href: './ops/weekly-workflow-sop.md',
    copy: 'Operational rhythm for running content and follow-up without chaos.'
  },
  {
    title: 'Production batch structure',
    href: './content/production-batch-structure.md',
    copy: 'Reusable structure for turning approved ideas into weekly production packets.'
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
