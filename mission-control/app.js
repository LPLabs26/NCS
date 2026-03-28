const STORAGE_KEY = 'ncs-mission-control-v2';

const defaultData = {
  pipeline: [
    {
      id: crypto.randomUUID(),
      title: 'Bridal glow countdown reel',
      type: 'reel',
      priority: 'high',
      status: 'approval',
      cta: 'Book bridal prep consultation',
      slot: 'Mon 11:00 AM',
      notes: 'Show 3 treatment milestones before the wedding. Natalie only needs to approve final hook + cover.',
      owner: 'AI Content Operator'
    },
    {
      id: crypto.randomUUID(),
      title: 'Hydrafacial opening story pack',
      type: 'story',
      priority: 'high',
      status: 'ready',
      cta: 'Fill 2 open spots this week',
      slot: 'Tue 9:15 AM',
      notes: 'Urgency story with poll, social proof, and booking sticker copy.',
      owner: 'Gap Fill Workflow'
    },
    {
      id: crypto.randomUUID(),
      title: 'Custom facial vs Hydrafacial carousel',
      type: 'carousel',
      priority: 'medium',
      status: 'production',
      cta: 'DM “which facial?”',
      slot: 'Wed 12:30 PM',
      notes: 'Answer the “what should I book?” objection using Natalie voice guide.',
      owner: 'Content Assistant'
    },
    {
      id: crypto.randomUUID(),
      title: 'Peel myth-busting reel',
      type: 'reel',
      priority: 'medium',
      status: 'idea',
      cta: 'Save for peel season',
      slot: 'Thu 5:30 PM',
      notes: 'Lead with “No, a peel should not leave you terrified.”',
      owner: 'Trend Scanner'
    },
    {
      id: crypto.randomUUID(),
      title: 'Membership retention reminder',
      type: 'offer',
      priority: 'low',
      status: 'approval',
      cta: 'Rebook monthly maintenance',
      slot: 'Fri 1:00 PM',
      notes: 'Simple educational graphic + soft CTA for existing clients.',
      owner: 'Retention Workflow'
    }
  ],
  jobs: [
    { time: '08:00', name: 'Trend + Reel Generator', output: '3 hooks, 1 recommended winner, matching CTA' },
    { time: '10:00', name: 'Gap-Fill Opportunity Scan', output: 'Any open appointments + story/offer package' },
    { time: '13:00', name: 'Approval Bundle Builder', output: 'Compiles draft captions, covers, and posting notes for Natalie' },
    { time: '16:00', name: 'Daily Executive Brief', output: 'Wins, blockers, tomorrow move, revenue note' }
  ],
  calendar: [
    { day: 'Monday', slot: '11:00 AM', title: 'Bridal glow countdown reel', goal: 'Bridal prep bookings' },
    { day: 'Tuesday', slot: '09:15 AM', title: 'Hydrafacial opening story pack', goal: 'Fill two open appointments' },
    { day: 'Wednesday', slot: '12:30 PM', title: 'Custom facial vs Hydrafacial carousel', goal: 'Clarify offer selection' },
    { day: 'Thursday', slot: '05:30 PM', title: 'Peel myth-busting reel', goal: 'Trust + saves' },
    { day: 'Friday', slot: '01:00 PM', title: 'Membership retention reminder', goal: 'Maintenance rebooks' },
    { day: 'Saturday', slot: '10:00 AM', title: 'Luxury self-care story set', goal: 'Weekend engagement' },
    { day: 'Sunday', slot: '06:00 PM', title: 'Next week skin reset teaser', goal: 'Prime Monday bookings' }
  ],
  kpis: [
    { label: 'Reach', value: '18.4k', trend: '+12% vs last week' },
    { label: 'Profile taps', value: '914', trend: '+8% from education posts' },
    { label: 'DM leads', value: '27', trend: '9 tagged as warm' },
    { label: 'Booked from IG', value: '$3,860', trend: 'Hydrafacial still top driver' }
  ],
  briefs: [
    {
      title: 'Hydrafacial opening story pack',
      stage: 'Ready to post',
      detail: 'Includes hook, 4 frame story flow, booking sticker CTA, and caption notes.'
    },
    {
      title: 'Bridal glow countdown reel',
      stage: 'Needs Natalie approval',
      detail: 'Cover text, shot list, CTA, and comment pin are bundled for quick signoff.'
    },
    {
      title: 'Custom facial vs Hydrafacial carousel',
      stage: 'In production',
      detail: 'Draft slides written, waiting for visual references and final service language.'
    }
  ]
};

function cloneDefault() {
  return JSON.parse(JSON.stringify(defaultData));
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || cloneDefault();
  } catch {
    return cloneDefault();
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = load();

function seedDemo() {
  state = cloneDefault();
  save();
  render();
}

function statusLabel(status) {
  return {
    idea: 'Queued idea',
    production: 'In production',
    approval: 'Need Natalie',
    ready: 'Ready / scheduled'
  }[status] || status;
}

function renderMetricCards() {
  const approval = state.pipeline.filter((item) => item.status === 'approval').length;
  const ready = state.pipeline.filter((item) => item.status === 'ready').length;
  const active = state.pipeline.filter((item) => ['idea', 'production'].includes(item.status)).length;
  const revenue = state.kpis.find((kpi) => kpi.label === 'Booked from IG')?.value || '$0';

  document.getElementById('metric-approval').textContent = approval;
  document.getElementById('metric-ready').textContent = ready;
  document.getElementById('metric-active').textContent = active;
  document.getElementById('metric-focus').textContent = revenue;
}

function laneMarkup(item) {
  return `
    <article class="item-card ${item.status}">
      <div class="item-topline">
        <span class="pill ${item.priority}">${item.priority}</span>
        <span class="pill muted">${item.type}</span>
      </div>
      <h4>${item.title}</h4>
      <p>${item.notes || ''}</p>
      <dl class="meta-grid">
        <div><dt>CTA</dt><dd>${item.cta || '—'}</dd></div>
        <div><dt>Slot</dt><dd>${item.slot || 'TBD'}</dd></div>
        <div><dt>Owner</dt><dd>${item.owner || 'Operator'}</dd></div>
        <div><dt>Status</dt><dd>${statusLabel(item.status)}</dd></div>
      </dl>
      <label class="select-wrap">
        <span>Move stage</span>
        <select data-id="${item.id}">
          <option value="idea" ${item.status === 'idea' ? 'selected' : ''}>Queued Idea</option>
          <option value="production" ${item.status === 'production' ? 'selected' : ''}>In Production</option>
          <option value="approval" ${item.status === 'approval' ? 'selected' : ''}>Need Natalie Approval</option>
          <option value="ready" ${item.status === 'ready' ? 'selected' : ''}>Ready / Scheduled</option>
        </select>
      </label>
    </article>
  `;
}

function renderLane(id, status) {
  const items = state.pipeline.filter((item) => item.status === status);
  document.getElementById(id).innerHTML = items.length
    ? items.map(laneMarkup).join('')
    : '<div class="empty">Nothing here right now.</div>';
  document.getElementById(`count-${status === 'idea' ? 'queued' : status === 'production' ? 'production' : status}`).textContent = items.length;
}

function renderCalendar() {
  document.getElementById('calendarList').innerHTML = state.calendar
    .map((entry) => `
      <article class="mini-card">
        <div class="mini-topline"><strong>${entry.day}</strong><span>${entry.slot}</span></div>
        <h4>${entry.title}</h4>
        <p>${entry.goal}</p>
      </article>
    `)
    .join('');
}

function renderApprovalChecklist() {
  const items = state.pipeline.filter((item) => item.status === 'approval');
  document.getElementById('approvalChecklist').innerHTML = items.length
    ? items.map((item) => `
      <article class="mini-card checklist-card">
        <div class="mini-topline"><strong>${item.title}</strong><span>${item.slot || 'TBD'}</span></div>
        <ul>
          <li>Approve hook and cover</li>
          <li>Confirm CTA: ${item.cta || 'TBD'}</li>
          <li>Reply with approve / tweak / reject</li>
        </ul>
      </article>
    `).join('')
    : '<div class="empty">No approvals waiting.</div>';
}

function renderJobs() {
  document.getElementById('jobsList').innerHTML = state.jobs
    .map((job) => `
      <article class="mini-card">
        <div class="mini-topline"><strong>${job.time}</strong><span>Automated</span></div>
        <h4>${job.name}</h4>
        <p>${job.output}</p>
      </article>
    `)
    .join('');
}

function renderKpis() {
  document.getElementById('kpiList').innerHTML = state.kpis
    .map((kpi) => `
      <article class="mini-card stat-card">
        <span>${kpi.label}</span>
        <strong>${kpi.value}</strong>
        <p>${kpi.trend}</p>
      </article>
    `)
    .join('');
}

function renderBriefs() {
  document.getElementById('briefList').innerHTML = state.briefs
    .map((brief) => `
      <article class="mini-card">
        <div class="mini-topline"><strong>${brief.stage}</strong><span>Package</span></div>
        <h4>${brief.title}</h4>
        <p>${brief.detail}</p>
      </article>
    `)
    .join('');
}

function wireStatusChanges() {
  document.querySelectorAll('select[data-id]').forEach((select) => {
    select.addEventListener('change', (event) => {
      const item = state.pipeline.find((entry) => entry.id === event.target.dataset.id);
      if (!item) return;
      item.status = event.target.value;
      save();
      render();
    });
  });
}

function render() {
  renderMetricCards();
  renderLane('queuedList', 'idea');
  renderLane('productionList', 'production');
  renderLane('approvalList', 'approval');
  renderLane('readyList', 'ready');
  document.getElementById('count-ready').textContent = state.pipeline.filter((item) => item.status === 'ready').length;
  renderCalendar();
  renderApprovalChecklist();
  renderJobs();
  renderKpis();
  renderBriefs();
  wireStatusChanges();
}

document.getElementById('taskForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  const item = {
    id: crypto.randomUUID(),
    title: form.get('title'),
    type: form.get('type'),
    priority: form.get('priority'),
    status: form.get('status'),
    cta: form.get('cta'),
    slot: form.get('slot'),
    notes: form.get('notes'),
    owner: 'Natalie Intake'
  };
  state.pipeline.unshift(item);

  if (item.status === 'approval' || item.status === 'ready') {
    state.briefs.unshift({
      title: item.title,
      stage: statusLabel(item.status),
      detail: `${item.type} package added from intake form. CTA: ${item.cta || 'TBD'}.`
    });
    state.briefs = state.briefs.slice(0, 6);
  }

  save();
  event.target.reset();
  render();
});

document.getElementById('seedBtn').addEventListener('click', seedDemo);
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Reset Mission Control local data on this device?')) return;
  state = cloneDefault();
  save();
  render();
});

render();
