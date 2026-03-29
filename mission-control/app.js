const STORAGE_KEY = 'ncs-mission-control-v6';
const makeItems = (items) => items.map((item) => ({ ...item, id: item.id === '__ID__' ? crypto.randomUUID() : item.id }));

const defaultData = {
  pipeline: makeItems([
    {
      id: '__ID__',
      title: 'Morning Daily Tip — SPF still matters on cloudy days',
      lane: 'Daily Tips',
      daypart: 'Morning',
      type: 'story',
      priority: 'medium',
      status: 'ready',
      cta: 'Save this reminder',
      slot: 'Mon 08:15 AM',
      notes: 'Light-touch morning value post. One clear tip, one soft CTA, no hard sell.',
      owner: 'Michael · Content Engine'
    },
    {
      id: '__ID__',
      title: 'Midday Hydrafacial — what it helps with when skin looks dull',
      lane: 'Hydrafacial',
      daypart: 'Midday',
      type: 'carousel',
      priority: 'high',
      status: 'ready',
      cta: 'Reserve your Hydrafacial',
      slot: 'Mon 12:30 PM',
      notes: 'Clear treatment education that supports bookings without repeating generic hype.',
      owner: 'Michael · Content Engine'
    },
    {
      id: '__ID__',
      title: 'Evening Circadia — protection by day, repair by night',
      lane: 'Circadia',
      daypart: 'Evening',
      type: 'reel',
      priority: 'high',
      status: 'ready',
      cta: 'Ask about your homecare plan',
      slot: 'Mon 07:30 PM',
      notes: 'Hero post of the day with the strongest visual packaging and caption depth.',
      owner: 'Michael · Content Engine'
    },
    {
      id: '__ID__',
      title: 'Morning Daily Tip — stop over-cleansing in the morning',
      lane: 'Daily Tips',
      daypart: 'Morning',
      type: 'static',
      priority: 'medium',
      status: 'production',
      cta: 'Share with a friend',
      slot: 'Tue 08:10 AM',
      notes: 'Fast practical touch designed to feel useful, not filler.',
      owner: 'Michael · Content Engine'
    },
    {
      id: '__ID__',
      title: 'Midday Hydrafacial — why it works before events',
      lane: 'Hydrafacial',
      daypart: 'Midday',
      type: 'story',
      priority: 'high',
      status: 'approval',
      cta: 'DM event glow',
      slot: 'Tue 12:45 PM',
      notes: 'Built to reduce hesitation and drive event-prep bookings.',
      owner: 'Michael · Content Engine'
    },
    {
      id: '__ID__',
      title: 'Evening Circadia — the ritual your skin actually wants',
      lane: 'Circadia',
      daypart: 'Evening',
      type: 'carousel',
      priority: 'high',
      status: 'approval',
      cta: 'Ask about Circadia support',
      slot: 'Tue 07:45 PM',
      notes: 'Hero-post concept with stronger educational payoff and premium tone.',
      owner: 'Michael · Content Engine'
    }
  ]),
  jobs: [
    { time: '07:00', name: 'Morning Daily Tips Builder', output: 'One light-touch Daily Tips asset for fast value and consistency' },
    { time: '11:30', name: 'Midday Hydrafacial Builder', output: 'One educational Hydrafacial asset for consideration and booking support' },
    { time: '17:30', name: 'Evening Circadia Hero Builder', output: 'One premium Circadia post built around rhythm, repair, and trust' },
    { time: '20:00', name: 'Daily Executive Brief', output: 'What shipped, what needs approval, and what to improve tomorrow' }
  ],
  calendar: [
    { day: 'Monday', slot: '08:15 AM', title: 'Daily Tips — SPF still matters on cloudy days', goal: 'Light morning value touch' },
    { day: 'Monday', slot: '12:30 PM', title: 'Hydrafacial — what it helps with when skin looks dull', goal: 'Education + booking support' },
    { day: 'Monday', slot: '07:30 PM', title: 'Circadia — protection by day, repair by night', goal: 'Hero post + homecare trust' },
    { day: 'Tuesday', slot: '08:10 AM', title: 'Daily Tips — stop over-cleansing in the morning', goal: 'Quick practical engagement' },
    { day: 'Tuesday', slot: '12:45 PM', title: 'Hydrafacial — why it works before events', goal: 'Event-prep consideration' },
    { day: 'Tuesday', slot: '07:45 PM', title: 'Circadia — the ritual your skin actually wants', goal: 'Hero post + retail interest' }
  ],
  kpis: [
    { label: 'Daily Tips shipped', value: '5', trend: 'Consistent morning presence without filler' },
    { label: 'Hydrafacial bookings', value: '7', trend: 'Midday education is still the booking engine' },
    { label: 'Circadia hero posts', value: '5', trend: 'Evening content is leading saves and product questions' },
    { label: 'Booked from IG', value: '$4,240', trend: 'Hydrafacial drives demand while Circadia supports retention' }
  ],
  previews: [
    {
      title: 'Daily Tips — SPF still matters on cloudy days',
      lane: 'Daily Tips',
      daypart: 'Morning',
      format: 'Story Set',
      hook: 'Cloudy does not mean your skin gets the day off.',
      caption: 'Morning content should be quick, useful, and easy to consume. This tip keeps NCS visible early without sounding pushy or over-produced.',
      cta: 'Save this reminder',
      status: 'ready',
      visual: 'Soft morning light · one clear skincare tip · elegant minimal story frames',
      cover: 'Morning tip',
      postText: 'A quick habit that protects your glow.',
      notes: 'Light touch only — useful, clean, not salesy.'
    },
    {
      title: 'Hydrafacial — what it helps with when skin looks dull',
      lane: 'Hydrafacial',
      daypart: 'Midday',
      format: 'Carousel',
      hook: 'When skin looks tired, a Hydrafacial is often the cleanest reset.',
      caption: 'Midday content should answer the question before it becomes a DM. This post explains Hydrafacial clearly and supports bookings without repeating the same hype lines.',
      cta: 'Reserve your Hydrafacial',
      status: 'ready',
      visual: 'Clean educational slides · polished treatment visuals · high-trust clinic luxury',
      cover: 'Midday Hydrafacial',
      postText: 'Glow, hydration, and a deeper clean — explained simply.',
      notes: 'Midday touch = clear, persuasive, still restrained.'
    },
    {
      title: 'Circadia — protection by day, repair by night',
      lane: 'Circadia',
      daypart: 'Evening',
      format: 'Reel',
      hook: 'Your skin is not asking for more products. It is asking for the right support at the right time.',
      caption: 'This is the hero post. It gives the strongest visual and emotional payoff of the day while teaching the Circadia day-and-night logic in a premium, calm, intelligent way.',
      cta: 'Ask about your homecare plan',
      status: 'ready',
      visual: 'Moody evening skincare tone · elevated product detail · cinematic repair-and-ritual energy',
      cover: 'Evening Circadia',
      postText: 'Protect by day. Repair by night.',
      notes: 'Hero asset — strongest packaging of the day.'
    },
    {
      title: 'Hydrafacial — why it works before events',
      lane: 'Hydrafacial',
      daypart: 'Midday',
      format: 'Story Set',
      hook: 'Big event coming up? Your skin prep should not start the night before.',
      caption: 'Midday treatment education with event-prep positioning. Short, clear, and easy to act on.',
      cta: 'DM event glow',
      status: 'approval',
      visual: 'Fresh event-prep tone · polished timing guidance · luxury glow language',
      cover: 'Event glow',
      postText: 'Prep earlier. Glow easier.',
      notes: 'Needs Natalie signoff on hook and CTA.'
    },
    {
      title: 'Circadia — the ritual your skin actually wants',
      lane: 'Circadia',
      daypart: 'Evening',
      format: 'Carousel',
      hook: 'Evening skincare should feel supportive, not chaotic.',
      caption: 'Hero-post concept that reframes homecare as a smarter ritual instead of a product pile.',
      cta: 'Ask about Circadia support',
      status: 'approval',
      visual: 'Deep neutral palette · premium night routine feel · calm authority',
      cover: 'Night ritual',
      postText: 'Better rhythm. Better skin.',
      notes: 'Waiting on Natalie signoff.'
    }
  ]
};

function cloneDefault() { return JSON.parse(JSON.stringify(defaultData)); }
function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || cloneDefault();
  } catch {
    return cloneDefault();
  }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
let state = load();
function seedDemo() { state = cloneDefault(); save(); render(); }
function statusLabel(status) {
  return {
    idea: 'New idea',
    production: 'Being made',
    approval: 'Needs Natalie',
    ready: 'Ready to post'
  }[status] || status;
}
function statusTone(status) {
  return status === 'approval' ? 'urgent' : '';
}
function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
function itemsByStatus(status) { return state.pipeline.filter((item) => item.status === status); }
function renderMetricCards() {
  document.getElementById('metric-approval').textContent = itemsByStatus('approval').length;
  document.getElementById('metric-ready').textContent = itemsByStatus('ready').length;
  document.getElementById('metric-active').textContent = state.pipeline.filter((item) => ['idea', 'production'].includes(item.status)).length;
  document.getElementById('metric-focus').textContent = state.kpis.find((kpi) => kpi.label === 'Booked from IG')?.value || '$0';
}
function laneMarkup(item) {
  return `<article class="item-card ${item.status}"><div class="item-topline"><span class="pill ${item.priority}">${escapeHtml(item.priority)}</span><span class="pill muted">${escapeHtml(item.type)}</span></div><h4>${escapeHtml(item.title)}</h4><p><strong>${escapeHtml(item.daypart)}</strong> · <strong>${escapeHtml(item.lane)}</strong>${item.notes ? ` · ${escapeHtml(item.notes)}` : ''}</p><dl class="meta-grid"><div><dt>CTA</dt><dd>${escapeHtml(item.cta || '—')}</dd></div><div><dt>Slot</dt><dd>${escapeHtml(item.slot || 'TBD')}</dd></div><div><dt>Owner</dt><dd>${escapeHtml(item.owner || 'Operator')}</dd></div><div><dt>Status</dt><dd>${escapeHtml(statusLabel(item.status))}</dd></div></dl><label class="select-wrap"><span>Move stage</span><select data-id="${item.id}"><option value="idea" ${item.status === 'idea' ? 'selected' : ''}>New idea</option><option value="production" ${item.status === 'production' ? 'selected' : ''}>Being made</option><option value="approval" ${item.status === 'approval' ? 'selected' : ''}>Needs Natalie</option><option value="ready" ${item.status === 'ready' ? 'selected' : ''}>Ready to post</option></select></label></article>`;
}
function renderLane(id, status) {
  const items = itemsByStatus(status);
  document.getElementById(id).innerHTML = items.length ? items.map(laneMarkup).join('') : '<div class="empty">Nothing here right now.</div>';
  document.getElementById(`count-${status === 'idea' ? 'queued' : status === 'production' ? 'production' : status}`).textContent = items.length;
}
function nextUpcomingFor(daypart) {
  return state.pipeline.find((item) => item.daypart === daypart && item.status === 'approval')
    || state.pipeline.find((item) => item.daypart === daypart && item.status === 'ready')
    || state.pipeline.find((item) => item.daypart === daypart && item.status === 'production')
    || state.pipeline.find((item) => item.daypart === daypart && item.status === 'idea')
    || null;
}
function renderLaneSnapshots() {
  const lanes = [
    { daypart: 'Morning', lane: 'Daily Tips', promise: 'Light value touch' },
    { daypart: 'Midday', lane: 'Hydrafacial', promise: 'Demand + booking support' },
    { daypart: 'Evening', lane: 'Circadia', promise: 'Hero education + trust' }
  ];
  document.getElementById('laneSnapshotGrid').innerHTML = lanes.map(({ daypart, lane, promise }) => {
    const item = nextUpcomingFor(daypart);
    return `<article class="item-card ${item?.status || ''}"><div class="item-topline"><span class="pill muted">${daypart}</span><span class="pill ${item?.priority || 'low'}">${item ? statusLabel(item.status) : 'Open slot'}</span></div><h4>${lane}</h4><p>${promise}</p>${item ? `<dl class="meta-grid"><div><dt>Current item</dt><dd>${escapeHtml(item.title)}</dd></div><div><dt>Slot</dt><dd>${escapeHtml(item.slot || 'TBD')}</dd></div><div><dt>CTA</dt><dd>${escapeHtml(item.cta || '—')}</dd></div><div><dt>Owner</dt><dd>${escapeHtml(item.owner || 'Operator')}</dd></div></dl><p>${escapeHtml(item.notes || '')}</p>` : '<div class="empty">No item loaded for this lane yet.</div>'}</article>`;
  }).join('');
}
function renderCalendar() {
  document.getElementById('calendarList').innerHTML = state.calendar.map((entry) => `<article class="mini-card"><div class="mini-topline"><strong>${escapeHtml(entry.day)}</strong><span>${escapeHtml(entry.slot)}</span></div><h4>${escapeHtml(entry.title)}</h4><p>${escapeHtml(entry.goal)}</p></article>`).join('');
}
function setStatus(id, status) {
  const item = state.pipeline.find((entry) => entry.id === id);
  if (!item) return;
  item.status = status;
  syncDerivedCollections();
  save();
  render();
}
function renderApprovalChecklist() {
  const items = itemsByStatus('approval');
  document.getElementById('approvalChecklist').innerHTML = items.length ? items.map((item) => {
    const preview = (state.previews || []).find((entry) => entry.title === item.title) || {};
    const movie = movieHref(item.title);
    return `<article class="mini-card checklist-card approval-preview-card">
      <div class="mini-topline"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.slot || 'TBD')}</span></div>
      <div class="approval-preview-shell">
        <div class="approval-preview-canvas">
          <div class="preview-badge">${escapeHtml(preview.format || item.type || 'Post')}</div>
          <div class="preview-cover">${escapeHtml(preview.daypart || item.daypart || '')}${(preview.daypart || item.daypart) ? ' · ' : ''}${escapeHtml(preview.cover || item.lane || item.title)}</div>
          <div class="preview-hook">${escapeHtml(preview.hook || item.title)}</div>
          <div class="preview-body-copy">${escapeHtml(preview.postText || preview.caption || item.notes || '')}</div>
          <div class="preview-visual">${escapeHtml(preview.visual || item.notes || '')}</div>
        </div>
        <div class="approval-copy">
          <p class="caption-label">Caption preview</p>
          <p>${escapeHtml(preview.caption || item.notes || '')}</p>
          <div class="preview-cta">CTA: ${escapeHtml(item.cta || preview.cta || 'TBD')}</div>
          <div class="preview-notes">Lane: ${escapeHtml(item.daypart)} · ${escapeHtml(item.lane)}</div>
          <div class="preview-actions">
            <button class="approve-btn" data-action="ready" data-id="${item.id}">Approve</button>
            <button class="ghost" data-action="production" data-id="${item.id}">Needs tweak</button>
            <button class="ghost danger-text" data-action="idea" data-id="${item.id}">Reject</button>
            ${movie ? `<a class="movie-link" href="${movie}" target="_blank" rel="noopener">Open animated movie</a>` : ''}
          </div>
        </div>
      </div>
    </article>`;
  }).join('') : '<div class="empty">No approvals waiting.</div>';
}
function renderJobs() {
  document.getElementById('jobsList').innerHTML = state.jobs.map((job) => `<article class="mini-card"><div class="mini-topline"><strong>${escapeHtml(job.time)}</strong><span>Automated</span></div><h4>${escapeHtml(job.name)}</h4><p>${escapeHtml(job.output)}</p></article>`).join('');
}
function renderKpis() {
  document.getElementById('kpiList').innerHTML = state.kpis.map((kpi) => `<article class="mini-card stat-card"><span>${escapeHtml(kpi.label)}</span><strong>${escapeHtml(kpi.value)}</strong><p>${escapeHtml(kpi.trend)}</p></article>`).join('');
}
function movieHref(title) {
  return {
    'Daily Tips — SPF still matters on cloudy days': 'movies/skin-in-three-acts.html',
    'Hydrafacial — what it helps with when skin looks dull': 'movies/booked-by-monday.html',
    'Circadia — protection by day, repair by night': 'movies/reset-window.html',
    'Hydrafacial — why it works before events': 'movies/night-before-glow.html'
  }[title] || null;
}
function renderPreviews() {
  const previews = (state.previews || []).filter((preview) => ['ready', 'approval'].includes(preview.status));
  document.getElementById('previewCount').textContent = `${previews.length} loaded in preview`;
  document.getElementById('previewGallery').innerHTML = previews.length ? previews.map((preview) => {
    const movie = movieHref(preview.title);
    return `<article class="preview-card ${preview.status}"><div class="preview-canvas"><div class="preview-badge">${escapeHtml(preview.format)}</div><div class="preview-cover">${escapeHtml(preview.daypart || '')}${preview.daypart ? ' · ' : ''}${escapeHtml(preview.cover || preview.title)}</div><div class="preview-hook">${escapeHtml(preview.hook)}</div><div class="preview-body-copy">${escapeHtml(preview.postText || preview.caption)}</div><div class="preview-visual">${escapeHtml(preview.visual)}</div></div><div class="preview-meta"><div class="mini-topline"><strong>${escapeHtml(preview.title)}</strong><span>${escapeHtml(statusLabel(preview.status))}</span></div><p class="caption-label">Caption</p><p>${escapeHtml(preview.caption)}</p><div class="preview-cta">CTA: ${escapeHtml(preview.cta)}</div><div class="preview-notes">Posting notes: ${escapeHtml(preview.notes || 'Ready to schedule.')}</div><div class="preview-actions"><a class="book-link" href="${BOOKING_URL}" target="_blank" rel="noopener">Book now</a>${movie ? `<a class="movie-link" href="${movie}" target="_blank" rel="noopener">Open animated movie</a>` : ''}</div></div></article>`;
  }).join('') : '<div class="empty">No ready-to-post previews yet.</div>';
}
function renderNextAction() {
  const approvals = itemsByStatus('approval');
  const ready = itemsByStatus('ready');
  const titleEl = document.getElementById('nextActionTitle');
  const copyEl = document.getElementById('nextActionCopy');
  const actionEl = document.getElementById('priorityAction');

  if (approvals.length) {
    const item = approvals[0];
    titleEl.textContent = `${approvals.length} approval${approvals.length === 1 ? '' : 's'} waiting`;
    copyEl.textContent = `Start with ${item.daypart} ${item.lane}. Natalie can approve, send back for tweaks, or reject in one tap.`;
    actionEl.innerHTML = `<div class="next-step-card ${statusTone('approval')}"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.slot || 'TBD')} · CTA: ${escapeHtml(item.cta || 'TBD')}</p><div class="action-row"><button class="approve-btn" data-action="ready" data-id="${item.id}">Approve now</button><button class="ghost" data-jump="#approvalSection">Review queue</button></div></div>`;
    return;
  }

  if (ready.length) {
    const item = ready[0];
    titleEl.textContent = `${ready.length} post${ready.length === 1 ? '' : 's'} ready to schedule`;
    copyEl.textContent = `Nothing is blocked on Natalie right now. Move the ready posts into scheduling or posting.`;
    actionEl.innerHTML = `<div class="next-step-card"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.slot || 'Ready now')} · ${escapeHtml(item.daypart)} ${escapeHtml(item.lane)}</p><div class="action-row"><button data-jump="#previewSection">Open ready posts</button></div></div>`;
    return;
  }

  titleEl.textContent = 'Everything is on track';
  copyEl.textContent = 'No approvals are blocked right now. Keep the three lanes moving and load the next items when needed.';
  actionEl.innerHTML = '<div class="next-step-card"><strong>Next best move</strong><p>Check the lane cards and make sure Morning, Midday, and Evening each have one clear post moving forward.</p></div>';
}
function syncDerivedCollections() {
  state.previews = state.previews.map((preview) => {
    const matching = state.pipeline.find((item) => item.title.includes(preview.title) || preview.title.includes(item.title) || item.title === preview.title);
    return matching ? { ...preview, status: matching.status, cta: matching.cta || preview.cta, daypart: matching.daypart || preview.daypart, lane: matching.lane || preview.lane } : preview;
  });
}
function wireStatusChanges() {
  document.querySelectorAll('select[data-id]').forEach((select) => {
    select.addEventListener('change', (event) => {
      setStatus(event.target.dataset.id, event.target.value);
    });
  });
  document.querySelectorAll('button[data-action][data-id]').forEach((button) => {
    button.addEventListener('click', () => setStatus(button.dataset.id, button.dataset.action));
  });
  document.querySelectorAll('button[data-jump]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.jump);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
function render() {
  renderMetricCards();
  renderNextAction();
  renderLaneSnapshots();
  renderApprovalChecklist();
  renderPreviews();
  renderLane('queuedList', 'idea');
  renderLane('productionList', 'production');
  renderLane('approvalList', 'approval');
  renderLane('readyList', 'ready');
  renderCalendar();
  renderJobs();
  renderKpis();
  wireStatusChanges();
}

document.getElementById('seedBtn').addEventListener('click', seedDemo);
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Reset Mission Control local data on this device?')) return;
  state = cloneDefault();
  save();
  render();
});
document.getElementById('openApprovalsBtn').addEventListener('click', () => {
  document.getElementById('approvalSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.getElementById('openPreviewBtn').addEventListener('click', () => {
  document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

syncDerivedCollections();
render();
