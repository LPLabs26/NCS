const STORAGE_KEY = 'ncs-mission-control-v5';
const makeItems = (items) => items.map((item) => ({ ...item, id: item.id === '__ID__' ? crypto.randomUUID() : item.id }));

const defaultData = {
  pipeline: makeItems([
    {
      id: '__ID__',
      title: 'AM Daily Tip — SPF still matters on cloudy days',
      lane: 'Daily Tips',
      daypart: 'Morning',
      type: 'story',
      priority: 'medium',
      status: 'ready',
      cta: 'Save this reminder',
      slot: 'Mon 08:15 AM',
      notes: 'Light-touch morning value post. One tip, one frame set, no hard sell.',
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
      notes: 'Clear midday education piece. Keeps the hero treatment visible without over-selling.',
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
      notes: 'Hero post of the day. Strongest packaging, strongest caption, strongest visual intention.',
      owner: 'Michael · Content Engine'
    },
    {
      id: '__ID__',
      title: 'AM Daily Tip — stop over-cleansing in the morning',
      lane: 'Daily Tips',
      daypart: 'Morning',
      type: 'static',
      priority: 'medium',
      status: 'production',
      cta: 'Share with a friend',
      slot: 'Tue 08:10 AM',
      notes: 'Fast morning touch designed to feel useful, not filler.',
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
      notes: 'Midday booking support built around event-prep timing and easy decision-making.',
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
      notes: 'Second hero post concept. Richer storytelling, stronger educational payoff, premium tone.',
      owner: 'Michael · Content Engine'
    }
  ]),
  jobs: [
    { time: '07:00', name: 'Morning Daily Tips Builder', output: 'One light-touch tip asset for visibility and value' },
    { time: '11:30', name: 'Midday Hydrafacial Builder', output: 'One educational Hydrafacial asset for consideration and booking support' },
    { time: '17:30', name: 'Evening Circadia Hero Builder', output: 'One premium hero post built around rhythm, repair, and trust' },
    { time: '20:00', name: 'Daily Executive Brief', output: 'What shipped, what is approved, what to improve tomorrow' }
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
    { label: 'Daily Tips shipped', value: '5', trend: 'Consistent morning presence without spam' },
    { label: 'Hydrafacial bookings', value: '7', trend: 'Midday education still drives strongest demand' },
    { label: 'Circadia hero posts', value: '5', trend: 'Evening content is leading saves and product questions' },
    { label: 'Booked from IG', value: '$4,240', trend: 'Hydrafacial is the booking engine; Circadia supports retention' }
  ],
  briefs: [
    { title: 'Daily Tips — SPF still matters on cloudy days', stage: 'Ready to post', detail: 'Fast morning package with one tip, one visual direction, one soft CTA.' },
    { title: 'Hydrafacial — why it works before events', stage: 'Need Natalie', detail: 'Midday treatment explainer designed to reduce hesitation and create bookings.' },
    { title: 'Circadia — the ritual your skin actually wants', stage: 'Need Natalie', detail: 'Evening hero package with stronger hook, caption depth, and premium product framing.' }
  ],
  previews: [
    {
      title: 'Daily Tips — SPF still matters on cloudy days',
      lane: 'Daily Tips',
      daypart: 'Morning',
      format: 'Story Set',
      hook: 'Cloudy does not mean your skin gets the day off.',
      caption: 'Morning content should be quick, genuinely useful, and easy to consume. This tip keeps NCS visible early without sounding pushy or over-produced.',
      cta: 'Save this reminder',
      status: 'ready',
      visual: 'Soft morning light · one clean skincare tip · elegant minimal story frames',
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
      caption: 'Midday content should answer the question before it becomes a DM. This post explains Hydrafacial clearly, keeps the language elevated, and supports bookings without repeating the same hype lines.',
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
      caption: 'This is the hero post. It gives the strongest visual and emotional payoff of the day while teaching the Circadia day/night logic in a way that feels premium, calm, and intelligent — not pushy.',
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
      notes: 'Needs final review on hook and CTA.'
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
      notes: 'Evening hero concept waiting on Natalie signoff.'
    }
  ],
  movies: [
    { title: 'The Night-Before Glow', cta: 'Book your reset' },
    { title: 'Booked by Monday', cta: 'Reserve now' },
    { title: 'Skin, In Three Acts', cta: 'Book now' },
    { title: 'The Reset Window', cta: 'Ask about homecare' },
    { title: 'After Yes', cta: 'DM now' }
  ]
};

function cloneDefault() { return JSON.parse(JSON.stringify(defaultData)); }
function load() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || cloneDefault(); } catch { return cloneDefault(); } }
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
let state = load();
function seedDemo() { state = cloneDefault(); save(); render(); }
function statusLabel(status) { return { idea:'Queued idea', production:'In production', approval:'Need Natalie', ready:'Ready / scheduled' }[status] || status; }
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
function laneMarkup(item) { return `<article class="item-card ${item.status}"><div class="item-topline"><span class="pill ${item.priority}">${item.priority}</span><span class="pill muted">${item.type}</span></div><h4>${item.title}</h4><p><strong>${item.daypart}</strong> · <strong>${item.lane}</strong>${item.notes ? ` · ${item.notes}` : ''}</p><dl class="meta-grid"><div><dt>CTA</dt><dd>${item.cta || '—'}</dd></div><div><dt>Slot</dt><dd>${item.slot || 'TBD'}</dd></div><div><dt>Owner</dt><dd>${item.owner || 'Operator'}</dd></div><div><dt>Status</dt><dd>${statusLabel(item.status)}</dd></div></dl><label class="select-wrap"><span>Move stage</span><select data-id="${item.id}"><option value="idea" ${item.status === 'idea' ? 'selected' : ''}>Queued Idea</option><option value="production" ${item.status === 'production' ? 'selected' : ''}>In Production</option><option value="approval" ${item.status === 'approval' ? 'selected' : ''}>Need Natalie Approval</option><option value="ready" ${item.status === 'ready' ? 'selected' : ''}>Ready / Scheduled</option></select></label></article>`; }
function renderLane(id, status) { const items = state.pipeline.filter((item) => item.status === status); document.getElementById(id).innerHTML = items.length ? items.map(laneMarkup).join('') : '<div class="empty">Nothing here right now.</div>'; document.getElementById(`count-${status === 'idea' ? 'queued' : status === 'production' ? 'production' : status}`).textContent = items.length; }
function renderCalendar() { document.getElementById('calendarList').innerHTML = state.calendar.map((entry) => `<article class="mini-card"><div class="mini-topline"><strong>${entry.day}</strong><span>${entry.slot}</span></div><h4>${entry.title}</h4><p>${entry.goal}</p></article>`).join(''); }
function renderApprovalChecklist() { const items = state.pipeline.filter((item) => item.status === 'approval'); document.getElementById('approvalChecklist').innerHTML = items.length ? items.map((item) => `<article class="mini-card checklist-card"><div class="mini-topline"><strong>${item.title}</strong><span>${item.slot || 'TBD'}</span></div><ul><li>Confirm ${item.daypart.toLowerCase()} lane: ${item.lane}</li><li>Confirm CTA: ${item.cta || 'TBD'}</li><li>Reply with approve / tweak / reject</li></ul></article>`).join('') : '<div class="empty">No approvals waiting.</div>'; }
function renderJobs() { document.getElementById('jobsList').innerHTML = state.jobs.map((job) => `<article class="mini-card"><div class="mini-topline"><strong>${job.time}</strong><span>Automated</span></div><h4>${job.name}</h4><p>${job.output}</p></article>`).join(''); }
function renderKpis() { document.getElementById('kpiList').innerHTML = state.kpis.map((kpi) => `<article class="mini-card stat-card"><span>${kpi.label}</span><strong>${kpi.value}</strong><p>${kpi.trend}</p></article>`).join(''); }
function renderBriefs() { document.getElementById('briefList').innerHTML = state.briefs.map((brief) => `<article class="mini-card"><div class="mini-topline"><strong>${brief.stage}</strong><span>Package</span></div><h4>${brief.title}</h4><p>${brief.detail}</p></article>`).join(''); }
function movieHref(title) { return { 'Daily Tips — SPF still matters on cloudy days':'movies/skin-in-three-acts.html','Hydrafacial — what it helps with when skin looks dull':'movies/booked-by-monday.html','Circadia — protection by day, repair by night':'movies/reset-window.html','Hydrafacial — why it works before events':'movies/night-before-glow.html' }[title] || null; }
function renderPreviews() { const previews = (state.previews || []).filter((preview) => ['ready', 'approval'].includes(preview.status)); document.getElementById('previewCount').textContent = `${previews.length} loaded in preview`; document.getElementById('previewGallery').innerHTML = previews.length ? previews.map((preview) => { const movie = movieHref(preview.title); return `<article class="preview-card ${preview.status}"><div class="preview-canvas"><div class="preview-badge">${preview.format}</div><div class="preview-cover">${preview.daypart || ''}${preview.daypart ? ' · ' : ''}${preview.cover || preview.title}</div><div class="preview-hook">${preview.hook}</div><div class="preview-body-copy">${preview.postText || preview.caption}</div><div class="preview-visual">${preview.visual}</div></div><div class="preview-meta"><div class="mini-topline"><strong>${preview.title}</strong><span>${statusLabel(preview.status)}</span></div><p class="caption-label">Caption</p><p>${preview.caption}</p><div class="preview-cta">CTA: ${preview.cta}</div><div class="preview-notes">Posting notes: ${preview.notes || 'Ready to schedule.'}</div>${movie ? `<a class="movie-link" href="${movie}" target="_blank" rel="noopener">Open animated movie</a>` : ''}</div></article>`; }).join('') : '<div class="empty">No ready-to-post previews yet.</div>'; }
function renderMiniMovies() { const items = state.movies || []; const countEl = document.getElementById('miniMovieCount'); const gallery = document.getElementById('miniMovieGrid'); if (!countEl || !gallery) return; countEl.textContent = `${items.length} concepts loaded`; gallery.innerHTML = items.map((movie) => `<article class="mini-card"><div class="mini-topline"><strong>${movie.title}</strong><span>Concept</span></div><p>${movie.cta}</p></article>`).join(''); }
function wireStatusChanges() { document.querySelectorAll('select[data-id]').forEach((select) => { select.addEventListener('change', (event) => { const item = state.pipeline.find((entry) => entry.id === event.target.dataset.id); if (!item) return; item.status = event.target.value; save(); render(); }); }); }
function render() { renderMetricCards(); renderLane('queuedList','idea'); renderLane('productionList','production'); renderLane('approvalList','approval'); renderLane('readyList','ready'); document.getElementById('count-ready').textContent = state.pipeline.filter((item) => item.status === 'ready').length; renderCalendar(); renderApprovalChecklist(); renderJobs(); renderKpis(); renderBriefs(); renderPreviews(); renderMiniMovies(); wireStatusChanges(); }
document.getElementById('taskForm').addEventListener('submit', (event) => { event.preventDefault(); const form = new FormData(event.target); const item = { id: crypto.randomUUID(), title: form.get('title'), lane: 'Custom', daypart: 'Custom', type: form.get('type'), priority: form.get('priority'), status: form.get('status'), cta: form.get('cta'), slot: form.get('slot'), notes: form.get('notes'), owner: 'Natalie Intake' }; state.pipeline.unshift(item); if (item.status === 'approval' || item.status === 'ready') { state.briefs.unshift({ title: item.title, stage: statusLabel(item.status), detail: `${item.type} package added from intake form. CTA: ${item.cta || 'TBD'}.` }); state.briefs = state.briefs.slice(0,6); state.previews.unshift({ title: item.title, lane: 'Custom', daypart: 'Custom', format: item.type, hook: item.title, caption: item.notes || 'Freshly added from the intake form.', cta: item.cta || 'TBD', status: item.status, visual: `Preview concept · ${item.type} · ${item.slot || 'schedule TBD'}`, cover: 'Custom post', postText: item.title, notes: 'Added from intake form.' }); state.previews = state.previews.slice(0,8); } save(); event.target.reset(); render(); });
document.getElementById('seedBtn').addEventListener('click', seedDemo);
document.getElementById('resetBtn').addEventListener('click', () => { if (!confirm('Reset Mission Control local data on this device?')) return; state = cloneDefault(); save(); render(); });
document.getElementById('openPreviewBtn').addEventListener('click', () => { document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
document.getElementById('jumpToReadyBtn').addEventListener('click', () => { document.getElementById('readyLaneSection').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
render();
