const STORAGE_KEY = 'ncs-mission-control-v2';

const defaultData = {
  pipeline: [
    {
      id: crypto.randomUUID(),
      title: 'Hydrafacial glow reset reel',
      type: 'reel',
      priority: 'high',
      status: 'ready',
      cta: 'Book your glow reset',
      slot: 'Mon 11:00 AM',
      notes: 'Built around Hydrafacial’s clinically proven glow, hydration, and tone/texture positioning.',
      owner: 'Michael · Content Engine'
    },
    {
      id: crypto.randomUUID(),
      title: 'Why Hydrafacial is a hero service carousel',
      type: 'carousel',
      priority: 'high',
      status: 'ready',
      cta: 'Reserve your Hydrafacial this week',
      slot: 'Tue 09:15 AM',
      notes: 'Explains why Hydrafacial stays central to the offer ladder without sounding too clinical.',
      owner: 'Michael · Content Engine'
    },
    {
      id: crypto.randomUUID(),
      title: 'Not sure what to book? story set',
      type: 'story',
      priority: 'high',
      status: 'ready',
      cta: 'Start with a custom facial',
      slot: 'Tue 04:30 PM',
      notes: 'Uses the custom facial as the confident bridge offer for unsure clients.',
      owner: 'Michael · Content Engine'
    },
    {
      id: crypto.randomUUID(),
      title: 'Circadia day + night skin education carousel',
      type: 'carousel',
      priority: 'medium',
      status: 'ready',
      cta: 'Build a routine that works with your skin',
      slot: 'Wed 12:30 PM',
      notes: 'Science + nature angle: protect by day, repair by night.',
      owner: 'Michael · Content Engine'
    },
    {
      id: crypto.randomUUID(),
      title: 'Bridal prep timeline reel',
      type: 'reel',
      priority: 'high',
      status: 'ready',
      cta: 'DM bridal glow',
      slot: 'Thu 11:30 AM',
      notes: 'High-value bridal prep positioning with a luxury, guided voice.',
      owner: 'Michael · Content Engine'
    },
    {
      id: crypto.randomUUID(),
      title: 'Chemical peel myth-busting reel',
      type: 'reel',
      priority: 'medium',
      status: 'ready',
      cta: 'Book your corrective consultation',
      slot: 'Thu 05:30 PM',
      notes: 'Reframes peels as strategic and expert-guided, not scary.',
      owner: 'Michael · Content Engine'
    },
    {
      id: crypto.randomUUID(),
      title: 'Monthly maintenance reminder story pack',
      type: 'story',
      priority: 'medium',
      status: 'ready',
      cta: 'Rebook your next treatment',
      slot: 'Fri 10:00 AM',
      notes: 'Maintenance and consistency angle to support retention.',
      owner: 'Retention Workflow'
    },
    {
      id: crypto.randomUUID(),
      title: 'Circadia hydration feature post',
      type: 'carousel',
      priority: 'medium',
      status: 'ready',
      cta: 'Ask about homecare support',
      slot: 'Fri 03:00 PM',
      notes: 'Highlights hydrated, calm, radiant skin and supports retail conversation.',
      owner: 'Michael · Content Engine'
    },
    {
      id: crypto.randomUUID(),
      title: 'Event-ready skin fast carousel',
      type: 'carousel',
      priority: 'high',
      status: 'ready',
      cta: 'Reserve your event-ready treatment',
      slot: 'Sat 10:00 AM',
      notes: 'Fast-turn event skin content built around visible glow and confidence.',
      owner: 'Gap Fill Workflow'
    },
    {
      id: crypto.randomUUID(),
      title: 'Personalized luxury care brand post',
      type: 'offer',
      priority: 'medium',
      status: 'ready',
      cta: 'Book your appointment at NCS Aesthetics',
      slot: 'Sun 06:00 PM',
      notes: 'Warm, elevated brand post reinforcing tailored care and premium experience.',
      owner: 'Brand Operator'
    }
  ],
  jobs: [
    { time: '08:00', name: 'Trend + Reel Generator', output: '3 hooks, 1 recommended winner, matching CTA' },
    { time: '10:00', name: 'Gap-Fill Opportunity Scan', output: 'Any open appointments + story/offer package' },
    { time: '13:00', name: 'Approval Bundle Builder', output: 'Compiles draft captions, covers, and posting notes for Natalie' },
    { time: '16:00', name: 'Daily Executive Brief', output: 'Wins, blockers, tomorrow move, revenue note' }
  ],
  calendar: [
    { day: 'Monday', slot: '11:00 AM', title: 'Hydrafacial glow reset reel', goal: 'Glow reset bookings' },
    { day: 'Tuesday', slot: '09:15 AM', title: 'Why Hydrafacial is a hero service carousel', goal: 'Hydrafacial authority' },
    { day: 'Tuesday', slot: '04:30 PM', title: 'Not sure what to book? story set', goal: 'Reduce booking hesitation' },
    { day: 'Wednesday', slot: '12:30 PM', title: 'Circadia day + night skin education carousel', goal: 'Education + saves' },
    { day: 'Thursday', slot: '11:30 AM', title: 'Bridal prep timeline reel', goal: 'Bridal prep consults' },
    { day: 'Thursday', slot: '05:30 PM', title: 'Chemical peel myth-busting reel', goal: 'Corrective consults' },
    { day: 'Friday', slot: '10:00 AM', title: 'Monthly maintenance reminder story pack', goal: 'Retention + rebooks' },
    { day: 'Friday', slot: '03:00 PM', title: 'Circadia hydration feature post', goal: 'Retail + trust' },
    { day: 'Saturday', slot: '10:00 AM', title: 'Event-ready skin fast carousel', goal: 'Event bookings' },
    { day: 'Sunday', slot: '06:00 PM', title: 'Personalized luxury care brand post', goal: 'Brand trust + bookings' }
  ],
  kpis: [
    { label: 'Reach', value: '18.4k', trend: '+12% vs last week' },
    { label: 'Profile taps', value: '914', trend: '+8% from education posts' },
    { label: 'DM leads', value: '27', trend: '9 tagged as warm' },
    { label: 'Booked from IG', value: '$3,860', trend: 'Hydrafacial still top driver' }
  ],
  briefs: [
    {
      title: 'Hydrafacial glow reset reel',
      stage: 'Ready to post',
      detail: 'Hook, caption, on-screen text, and booking CTA packaged for a fast post.'
    },
    {
      title: 'Circadia day + night skin education carousel',
      stage: 'Ready to post',
      detail: 'Educational slide flow translating Circadia’s day/night rhythm into client-friendly language.'
    },
    {
      title: 'Bridal prep timeline reel',
      stage: 'Ready to post',
      detail: 'Luxury bridal prep content with consultation CTA and milestone structure.'
    },
    {
      title: 'Chemical peel myth-busting reel',
      stage: 'Ready to post',
      detail: 'Corrective-care angle that reduces fear and increases confidence.'
    },
    {
      title: 'Circadia hydration feature post',
      stage: 'Ready to post',
      detail: 'Retail-supportive educational post focused on hydration and calm, radiant skin.'
    }
  ],
  previews: [
    {
      title: 'Hydrafacial glow reset reel',
      format: 'Reel',
      hook: 'Glowing skin can start with one well-chosen treatment.',
      caption: 'Positioned around Hydrafacial’s glow, hydration, and texture benefits with a luxury but warm tone.',
      cta: 'Book your glow reset',
      status: 'ready',
      visual: 'Hydrafacial glow · champagne cream backdrop · radiant skin closeup'
    },
    {
      title: 'Why Hydrafacial is a hero service carousel',
      format: 'Carousel',
      hook: 'Why Hydrafacial stays one of our most requested treatments.',
      caption: 'Explains visible glow, pore appearance, hydration, and confidence in a client-friendly way.',
      cta: 'Reserve your Hydrafacial this week',
      status: 'ready',
      visual: 'Clinical results made elegant · polished slides · soft gold accents'
    },
    {
      title: 'Not sure what to book? story set',
      format: 'Story Set',
      hook: 'If you are not sure what your skin needs, start here.',
      caption: 'Uses the custom facial as the easiest bridge offer for uncertain first-time clients.',
      cta: 'Start with a custom facial',
      status: 'ready',
      visual: 'Q&A stories · elevated neutral backgrounds · easy choice framing'
    },
    {
      title: 'Circadia day + night skin education carousel',
      format: 'Carousel',
      hook: 'Your skin has different needs by day and by night.',
      caption: 'Built from Circadia’s protect-by-day, repair-by-night framework.',
      cta: 'Build a routine that works with your skin',
      status: 'ready',
      visual: 'Split day/night design · sun/moon motif · science + nature tone'
    },
    {
      title: 'Bridal prep timeline reel',
      format: 'Reel',
      hook: 'Wedding skin prep works better when you do not wait until the last minute.',
      caption: 'High-value bridal prep content with a guided timeline and consultation CTA.',
      cta: 'DM bridal glow',
      status: 'ready',
      visual: 'Bridal whites · luxury prep timeline · polished clinic footage'
    },
    {
      title: 'Chemical peel myth-busting reel',
      format: 'Reel',
      hook: 'A peel should feel strategic, not scary.',
      caption: 'Corrective-care education that builds trust and lowers resistance.',
      cta: 'Book your corrective consultation',
      status: 'ready',
      visual: 'Corrective skincare tone · calm educational lower thirds'
    },
    {
      title: 'Monthly maintenance reminder story pack',
      format: 'Story Set',
      hook: 'Great skin usually comes from consistency, not one random appointment.',
      caption: 'Soft maintenance reminder designed to drive rebooks without sounding desperate.',
      cta: 'Rebook your next treatment',
      status: 'ready',
      visual: 'Soft mauve stories · maintenance messaging · simple booking prompt'
    },
    {
      title: 'Circadia hydration feature post',
      format: 'Carousel',
      hook: 'Hydrated skin looks healthier, calmer, and more radiant.',
      caption: 'Educational retail-supportive content using Circadia hydration positioning.',
      cta: 'Ask about homecare support',
      status: 'ready',
      visual: 'Hydration focus · glossy closeups · product support angle'
    },
    {
      title: 'Event-ready skin fast carousel',
      format: 'Carousel',
      hook: 'Need your skin to look fresh for an event this week?',
      caption: 'Fast-turn event-ready angle that supports timely booking decisions.',
      cta: 'Reserve your event-ready treatment',
      status: 'ready',
      visual: 'Event prep aesthetic · luxe neutrals · before-event confidence'
    },
    {
      title: 'Personalized luxury care brand post',
      format: 'Brand Post',
      hook: 'Luxury skincare should still feel personal.',
      caption: 'Brand trust piece reinforcing tailored care, warmth, and premium experience.',
      cta: 'Book your appointment at NCS Aesthetics',
      status: 'ready',
      visual: 'Founder-led trust post · premium but warm visual language'
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

function renderPreviews() {
  const previews = (state.previews || []).filter((preview) => preview.status === 'ready');
  document.getElementById('previewCount').textContent = `${previews.length} ready to preview`;
  document.getElementById('previewGallery').innerHTML = previews.length
    ? previews.map((preview) => `
      <article class="preview-card ${preview.status}">
        <div class="preview-canvas">
          <div class="preview-badge">${preview.format}</div>
          <div class="preview-hook">${preview.hook}</div>
          <div class="preview-visual">${preview.visual}</div>
        </div>
        <div class="preview-meta">
          <div class="mini-topline"><strong>${preview.title}</strong><span>${statusLabel(preview.status)}</span></div>
          <p>${preview.caption}</p>
          <div class="preview-cta">CTA: ${preview.cta}</div>
        </div>
      </article>
    `).join('')
    : '<div class="empty">No ready-to-post previews yet.</div>';
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
  renderPreviews();
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

    state.previews.unshift({
      title: item.title,
      format: item.type,
      hook: item.title,
      caption: item.notes || 'Freshly added from the intake form.',
      cta: item.cta || 'TBD',
      status: item.status,
      visual: `Preview concept · ${item.type} · ${item.slot || 'schedule TBD'}`
    });
    state.previews = state.previews.slice(0, 8);
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
document.getElementById('openPreviewBtn').addEventListener('click', () => {
  document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.getElementById('jumpToReadyBtn').addEventListener('click', () => {
  document.getElementById('readyLaneSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

render();
