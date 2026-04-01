const QUEUE_URL = '../ops/instagram-phase-1/content-queue.csv';

const actionLinks = [
  {
    title: 'Mission Control',
    href: '../mission-control/index.html',
    copy: 'Run approvals, comments, and queue decisions here.'
  },
  {
    title: 'Team status',
    href: '../ops/team-status.md',
    copy: 'Read the current queue snapshot and operating surfaces fast.'
  },
  {
    title: 'Main dashboard',
    href: '../index.html',
    copy: 'Jump back to the front door and broader operating references.'
  },
  {
    title: 'Google Sheets blueprint',
    href: '../ops/google-sheets-dashboard-blueprint.md',
    copy: 'Use this when translating the operating model into reporting.'
  }
];

function renderActionLinks() {
  const root = document.getElementById('actionLinks');
  root.innerHTML = actionLinks.map((item) => `
    <a class="quick-link-card" href="${item.href}">
      <strong>${item.title}</strong>
      <span>${item.copy}</span>
    </a>
  `).join('');
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

function renderStatus(rows) {
  const summary = document.getElementById('statusSummary');
  const grid = document.getElementById('statusGrid');
  const attention = document.getElementById('attentionList');

  if (!rows.length) {
    summary.textContent = 'Queue data is unavailable from this surface right now.';
    grid.innerHTML = '<div class="status-tile"><span>Status</span><strong>Unavailable</strong><small>Check the queue file or local preview.</small></div>';
    attention.innerHTML = '<div class="attention-item">Open Mission Control first and verify the queue is reachable.</div>';
    return;
  }

  const approved = rows.filter((row) => row.approval_status === 'approved').length;
  const review = rows.filter((row) => row.approval_status === 'needs_review').length;
  const backlog = rows.filter((row) => row.queue_status === 'backlog').length;
  const heroApproved = rows.filter((row) => row.approval_status === 'approved' && row.daypart === 'Evening').length;
  const next72Approved = rows.filter((row) => row.approval_status === 'approved' && inNextHours(row, 72)).length;

  summary.textContent = `${approved} approved, ${review} still in review, and ${heroApproved} evening hero posts currently protected.`;

  grid.innerHTML = [
    { label: 'Approved', value: approved, note: 'Ready for scheduling' },
    { label: 'Needs review', value: review, note: 'Awaiting approval decision' },
    { label: 'Backlog', value: backlog, note: 'Fallback assets available' },
    { label: 'Next 72h covered', value: next72Approved, note: 'Approved near-term slots' }
  ].map((item) => `
    <div class="status-tile">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <small>${item.note}</small>
    </div>
  `).join('');

  const items = [];
  if (review > 0) items.push(`Open Mission Control and clear ${review} remaining review item${review === 1 ? '' : 's'} before adding fresh volume.`);
  if (next72Approved < 3) items.push('Top up near-term approved coverage so the next 72 hours stay protected.');
  if (heroApproved < 2) items.push('Protect the evening Circadia lane first — hero coverage is too thin.');
  if (!items.length) items.push('Queue health looks stable. Use this surface for weekly tuning, not emergency triage.');

  attention.innerHTML = items.map((item) => `<div class="attention-item">${item}</div>`).join('');
}

async function loadQueue() {
  try {
    const response = await fetch(QUEUE_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error('Queue fetch failed');
    const text = await response.text();
    renderStatus(parseCsv(text));
  } catch (error) {
    renderStatus([]);
  }
}

renderActionLinks();
loadQueue();

document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
