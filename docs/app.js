const QUEUE_URL = './ops/instagram-phase-1/content-queue.csv';

const dashboardLinks = [
  {
    title: 'Mission Control',
    href: './mission-control/index.html',
    copy: 'Use this for approvals, review notes, and the live content pipeline.'
  },
  {
    title: 'Executive dashboard',
    href: './site/index.html',
    copy: 'Use this when you want the higher-level lane logic and operator summary.'
  },
  {
    title: 'Instagram Phase 1',
    href: './ops/instagram-phase-1/README.md',
    copy: 'Canonical operator kit: strategy, schedule, queue, maintenance, and reporting.'
  }
];

const workflowSteps = [
  '08:00 — generate 3 hooks tied to offers, seasonality, or gaps in the books.',
  '10:00 — check open appointments and prep a same-day story package if needed.',
  '13:00 — bundle captions, covers, and CTA notes into one clean approval stack.',
  'Before posting — Natalie approves, tweaks lightly, or rejects.',
  '16:00 — send a short brief with what shipped, what is blocked, and tomorrow’s biggest move.'
];

const resourceLinks = [
  {
    title: 'Team status',
    href: './ops/team-status.md',
    copy: 'Fast machine-generated snapshot of queue health and current operating surfaces.'
  },
  {
    title: 'Content queue',
    href: './ops/instagram-phase-1/content-queue.csv',
    copy: 'Live CSV for the upcoming posting windows and approval state.'
  },
  {
    title: 'Performance log',
    href: './ops/instagram-phase-1/performance-log.csv',
    copy: 'Weekly completion and engagement scorecard for the three-lane system.'
  },
  {
    title: 'Google Sheets blueprint',
    href: './ops/google-sheets-dashboard-blueprint.md',
    copy: 'Reference for turning the reporting system into a live spreadsheet dashboard.'
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

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const cells = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      const next = line[i + 1];
      if (char === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        cells.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] || '']));
  });
}

function inNextHours(row, hours) {
  if (!row.publish_date || !row.target_time_pt) return false;
  const target = new Date(`${row.publish_date}T${row.target_time_pt}:00`);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return diff >= 0 && diff <= hours * 60 * 60 * 1000;
}

function renderPulse(rows) {
  const pulse = document.getElementById('livePulse');
  if (!rows.length) {
    pulse.innerHTML = `
      <article class="pulse-card card">
        <span>Queue status</span>
        <strong>Unavailable</strong>
        <p>Queue data could not be loaded from the Phase 1 CSV.</p>
      </article>
    `;
    document.getElementById('todayFocus').innerHTML = '<div class="flow-step">Open Mission Control first and confirm the queue is reachable from this surface.</div>';
    return;
  }

  const approved = rows.filter((row) => row.approval_status === 'approved').length;
  const review = rows.filter((row) => row.approval_status === 'needs_review').length;
  const next72Approved = rows.filter((row) => row.approval_status === 'approved' && inNextHours(row, 72)).length;
  const heroApproved = rows.filter((row) => row.approval_status === 'approved' && row.daypart === 'Evening').length;

  pulse.innerHTML = [
    { label: 'Approved queue', value: approved, note: 'Posts cleared for scheduling' },
    { label: 'Needs review', value: review, note: 'Items still waiting on approval' },
    { label: 'Next 72h covered', value: next72Approved, note: 'Approved near-term posting windows' },
    { label: 'Hero posts ready', value: heroApproved, note: 'Evening Circadia approvals available' }
  ].map((item) => `
    <article class="pulse-card card">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <p>${item.note}</p>
    </article>
  `).join('');

  const focus = [];
  if (review > 0) {
    focus.push(`Open Mission Control and clear ${review} remaining review item${review === 1 ? '' : 's'}.`);
  }
  if (next72Approved < 3) {
    focus.push('Top up near-term approved coverage so the next 72 hours stay protected.');
  }
  if (heroApproved < 2) {
    focus.push('Protect the evening lane first — there are not enough approved Circadia hero posts buffered.');
  }
  if (!focus.length) {
    focus.push('Near-term queue health looks stable. Use the executive dashboard for the weekly review loop.');
    focus.push('If time is available, improve packaging quality instead of adding more volume.');
  }

  document.getElementById('todayFocus').innerHTML = focus.map((item) => `<div class="flow-step">${item}</div>`).join('');
}

async function loadQueuePulse() {
  try {
    const response = await fetch(QUEUE_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error('Queue fetch failed');
    const text = await response.text();
    renderPulse(parseCsv(text));
  } catch (error) {
    renderPulse([]);
  }
}

renderLinks('dashboardLinks', dashboardLinks);
renderLinks('resourceLinks', resourceLinks);
renderWorkflow();
loadQueuePulse();

document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
