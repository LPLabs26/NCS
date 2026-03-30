const dashboardLinks = [
  {
    title: 'Mission Control',
    href: '../mission-control/index.html',
    copy: 'Main dashboard for the three-lane publishing system, approvals, posting map, and KPI pulse.'
  },
  {
    title: 'Daily cadence doc',
    href: '../docs/content/daily-content-cadence.md',
    copy: 'The exact Morning / Midday / Evening structure: Daily Tips, Hydrafacial, Circadia.'
  },
  {
    title: 'Dashboard blueprint',
    href: '../docs/ops/google-sheets-dashboard-blueprint.md',
    copy: 'How to mirror the same system inside Google Sheets and weekly reporting.'
  }
];

const workflowSteps = [
  'Morning — publish one light-touch Daily Tips asset that delivers real value fast.',
  'Midday — publish one light-touch Hydrafacial asset that answers hesitation and supports bookings.',
  'Evening — publish the strongest Circadia hero post of the day with the best hook, packaging, and caption.',
  'Before posting — Natalie approves, tweaks lightly, or rejects.',
  'End of day — log what shipped, what worked, and what should repeat tomorrow.'
];

const resourceLinks = [
  {
    title: 'Daily content cadence',
    href: '../docs/content/daily-content-cadence.md',
    copy: 'Operating rules for Daily Tips, Hydrafacial, and Circadia across the day.'
  },
  {
    title: 'Natalie dashboard spec',
    href: '../docs/ops/natalie-dashboard-spec.md',
    copy: 'Defines the dashboard around the exact three-lane model.'
  },
  {
    title: 'Dashboard blueprint',
    href: '../docs/ops/google-sheets-dashboard-blueprint.md',
    copy: 'Google Sheets tab structure, fields, and sample tracking rules.'
  },
  {
    title: 'Seeded data plan',
    href: '../templates/google-sheets-csv/sample-seeded-data.md',
    copy: 'Explains how the demo week should teach the system instantly.'
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
