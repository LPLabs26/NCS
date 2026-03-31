const dashboardLinks = [
  {
    title: 'Mission Control',
    href: '../mission-control/index.html',
    copy: 'Approval wall for the three-lane posting system with the Phase 1 schedule visible at the top.'
  },
  {
    title: 'Phase 1 operator kit',
    href: '../docs/ops/instagram-phase-1/README.md',
    copy: 'Canonical folder for the strategy, weekly schedule, queue, maintenance loop, and reporting.'
  },
  {
    title: 'Weekly schedule',
    href: '../docs/ops/instagram-phase-1/weekly-operating-schedule.md',
    copy: 'Seven-day rhythm for the Morning / Midday / Evening system.'
  }
];

const workflowSteps = [
  'Start with the queue: fill every slot for the coming week in the Phase 1 CSV.',
  'Batch approvals instead of sending random one-off requests.',
  'Post in the three daily windows: 8:30 AM, 12:30 PM, and 7:30 PM PT.',
  'Treat the evening Circadia slot as the hero post and protect its quality first.',
  'End the week with a short review and one concrete schedule adjustment.'
];

const resourceLinks = [
  {
    title: 'Strategy',
    href: '../docs/ops/instagram-phase-1/strategy.md',
    copy: 'Cadence, timing, approvals, engagement rules, and what Phase 1 does not automate.'
  },
  {
    title: 'Content queue',
    href: '../docs/ops/instagram-phase-1/content-queue.csv',
    copy: 'Live queue and status tracker for every Instagram slot.'
  },
  {
    title: 'Performance log',
    href: '../docs/ops/instagram-phase-1/performance-log.csv',
    copy: 'Weekly scorecard for completion, engagement, and booking signals.'
  },
  {
    title: 'Maintenance workflow',
    href: '../docs/ops/instagram-phase-1/maintenance-workflow.md',
    copy: 'Simple review loop for keeping the schedule sharp instead of noisy.'
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
