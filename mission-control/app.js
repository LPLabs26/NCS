const STORAGE_KEY = 'ncs-approval-wall-v1';

const makeItems = (items) => items.map((item) => ({
  ...item,
  id: item.id === '__ID__' ? crypto.randomUUID() : item.id,
  reviewComment: item.reviewComment || '',
  decisionAt: item.decisionAt || null
}));

const defaultData = {
  pipeline: makeItems([
    {
      id: '__ID__',
      title: 'Daily Tips — SPF still matters on cloudy days',
      lane: 'Daily Tips',
      daypart: 'Morning',
      type: 'story',
      priority: 'medium',
      status: 'approval',
      cta: 'Save this reminder',
      slot: 'Mon 08:15 AM',
      notes: 'A polished morning education touch: clear, calming, and never pushy.',
      owner: 'Michael · Content Engine'
    },
    {
      id: '__ID__',
      title: 'Hydrafacial — what it helps with when skin looks dull',
      lane: 'Hydrafacial',
      daypart: 'Midday',
      type: 'carousel',
      priority: 'high',
      status: 'approval',
      cta: 'Reserve your Hydrafacial',
      slot: 'Mon 12:30 PM',
      notes: 'Treatment education that feels refined, specific, and ready to convert.',
      owner: 'Michael · Content Engine'
    },
    {
      id: '__ID__',
      title: 'Circadia — protection by day, repair by night',
      lane: 'Circadia',
      daypart: 'Evening',
      type: 'reel',
      priority: 'high',
      status: 'approval',
      cta: 'Ask about your homecare plan',
      slot: 'Mon 07:30 PM',
      notes: 'Evening hero asset with cinematic packaging and a smarter homecare story.',
      owner: 'Michael · Content Engine'
    },
    {
      id: '__ID__',
      title: 'Hydrafacial — why it works before events',
      lane: 'Hydrafacial',
      daypart: 'Midday',
      type: 'story',
      priority: 'high',
      status: 'needs_work',
      cta: 'DM event glow',
      slot: 'Tue 12:45 PM',
      notes: 'Event-prep positioning designed to lower hesitation and pull bookings forward.',
      owner: 'Michael · Content Engine',
      reviewComment: 'Tighten the hook and soften the urgency.'
    },
    {
      id: '__ID__',
      title: 'Circadia — the ritual your skin actually wants',
      lane: 'Circadia',
      daypart: 'Evening',
      type: 'carousel',
      priority: 'high',
      status: 'approved',
      cta: 'Ask about Circadia support',
      slot: 'Tue 07:45 PM',
      notes: 'Refined evening concept that makes homecare feel thoughtful, not excessive.',
      owner: 'Michael · Content Engine',
      reviewComment: 'Approved. Keep the calm premium tone.'
    }
  ]),
  previews: [
    {
      title: 'Daily Tips — SPF still matters on cloudy days',
      lane: 'Daily Tips',
      daypart: 'Morning',
      format: 'Story Set',
      hook: 'Cloudy still counts when it comes to SPF.',
      caption: 'A soft morning reminder that protects the skin and protects the brand. Useful, elegant, and easy to save for later.',
      cta: 'Save this reminder',
      visual: 'Soft morning light · one precise skincare point · elegant minimal story frames',
      cover: 'Morning tip',
      postText: 'A small habit that keeps your skin protected.',
      notes: 'Keep it light, elevated, and instantly useful.'
    },
    {
      title: 'Hydrafacial — what it helps with when skin looks dull',
      lane: 'Hydrafacial',
      daypart: 'Midday',
      format: 'Carousel',
      hook: 'When skin looks flat, Hydrafacial brings back clarity, hydration, and light.',
      caption: 'This midday piece answers the question before it ever turns into a DM. Clear treatment education, polished delivery, and a natural path to booking.',
      cta: 'Reserve your Hydrafacial',
      visual: 'Clean educational slides · polished treatment visuals · clinical luxury with warmth',
      cover: 'Midday Hydrafacial',
      postText: 'Brightness, hydration, and a cleaner finish — explained beautifully.',
      notes: 'Clear, persuasive, and still restrained.'
    },
    {
      title: 'Circadia — protection by day, repair by night',
      lane: 'Circadia',
      daypart: 'Evening',
      format: 'Reel',
      hook: 'Your skin does not need more product. It needs the right support at the right time.',
      caption: 'The evening hero post should feel calm, intelligent, and visually rich. This one teaches the Circadia rhythm in a way that feels premium instead of preachy.',
      cta: 'Ask about your homecare plan',
      visual: 'Moody evening light · elevated product detail · cinematic ritual-and-repair energy',
      cover: 'Evening Circadia',
      postText: 'Protect through the day. Repair through the night.',
      notes: 'Hero asset with the strongest packaging of the day.'
    },
    {
      title: 'Hydrafacial — why it works before events',
      lane: 'Hydrafacial',
      daypart: 'Midday',
      format: 'Story Set',
      hook: 'If a big event is coming, your skin prep should start before the night before.',
      caption: 'Event-prep treatment education with a polished sense of urgency. Short, clear, and easy to act on.',
      cta: 'DM event glow',
      visual: 'Fresh event-prep tone · polished timing guidance · refined glow language',
      cover: 'Event glow',
      postText: 'Start sooner. Glow calmer.',
      notes: 'Tighten the opening line.'
    },
    {
      title: 'Circadia — the ritual your skin actually wants',
      lane: 'Circadia',
      daypart: 'Evening',
      format: 'Carousel',
      hook: 'Evening skincare should feel grounding, not overwhelming.',
      caption: 'A hero-post concept that reframes homecare as a well-matched ritual instead of a crowded shelf.',
      cta: 'Ask about Circadia support',
      visual: 'Deep neutral palette · premium night-routine feel · calm authority',
      cover: 'Night ritual',
      postText: 'Better rhythm. Calmer skin.',
      notes: 'Approved example post.'
    }
  ]
};

function cloneDefault() {
  return JSON.parse(JSON.stringify(defaultData));
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data ? hydrateState(data) : cloneDefault();
  } catch {
    return cloneDefault();
  }
}

function hydrateState(data) {
  return {
    ...data,
    pipeline: makeItems((data.pipeline || defaultData.pipeline).map((item) => ({
      ...item,
      status: normalizeStatus(item.status)
    }))),
    previews: data.previews || cloneDefault().previews
  };
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeStatus(status) {
  const map = {
    ready: 'approved',
    approval: 'approval',
    production: 'needs_work',
    idea: 'disapproved',
    approved: 'approved',
    needs_work: 'needs_work',
    disapproved: 'disapproved'
  };
  return map[status] || 'approval';
}

let state = hydrateState(load());

function seedDemo() {
  state = cloneDefault();
  save();
  render();
}

function itemsByStatus(status) {
  return state.pipeline.filter((item) => normalizeStatus(item.status) === status);
}

function statusLabel(status) {
  return {
    approval: 'Waiting for review',
    approved: 'Approved',
    needs_work: 'Needs more work',
    disapproved: 'Disapproved'
  }[normalizeStatus(status)] || 'Waiting for review';
}

function statusClass(status) {
  return normalizeStatus(status).replace('_', '-');
}

function decisionCopy(item) {
  const status = normalizeStatus(item.status);
  if (status === 'approved') return 'Approved and ready to post.';
  if (status === 'needs_work') return 'Sent back with feedback.';
  if (status === 'disapproved') return 'Marked as not moving forward.';
  return 'Waiting for a decision.';
}

function previewFor(item) {
  return state.previews.find((preview) => preview.title === item.title) || {
    title: item.title,
    lane: item.lane,
    daypart: item.daypart,
    format: item.type,
    hook: item.title,
    caption: item.notes,
    cta: item.cta,
    visual: item.notes,
    cover: item.lane,
    postText: item.notes,
    notes: item.notes
  };
}

function setStatus(id, status) {
  const item = state.pipeline.find((entry) => entry.id === id);
  if (!item) return;
  item.status = normalizeStatus(status);
  item.decisionAt = new Date().toISOString();
  save();
  render();
}

function updateComment(id, value) {
  const item = state.pipeline.find((entry) => entry.id === id);
  if (!item) return;
  item.reviewComment = value;
  save();
}

function renderMetrics() {
  document.getElementById('metricWaiting').textContent = itemsByStatus('approval').length;
  document.getElementById('metricApproved').textContent = itemsByStatus('approved').length;
  document.getElementById('metricNeedsWork').textContent = itemsByStatus('needs_work').length;
  document.getElementById('metricDisapproved').textContent = itemsByStatus('disapproved').length;
}

function renderFocus() {
  const waiting = itemsByStatus('approval');
  const title = document.getElementById('focusTitle');
  const copy = document.getElementById('focusCopy');

  if (waiting.length) {
    const item = waiting[0];
    title.textContent = `${waiting.length} post${waiting.length === 1 ? '' : 's'} waiting for review`;
    copy.textContent = `Start with ${item.title}. Review the preview, leave a comment if needed, then choose one of the three actions.`;
    return;
  }

  const needsWork = itemsByStatus('needs_work');
  if (needsWork.length) {
    title.textContent = 'No approvals blocked right now';
    copy.textContent = `${needsWork.length} post${needsWork.length === 1 ? '' : 's'} currently need more work before they come back for review.`;
    return;
  }

  title.textContent = 'Nothing waiting right now';
  copy.textContent = 'Everything in the wall has already been decided on this device.';
}

function approvalCardMarkup(item) {
  const preview = previewFor(item);
  return `<article class="approval-post-card ${statusClass(item.status)}">
    <div class="phone-frame">
      <div class="phone-topbar">
        <span class="avatar-dot"></span>
        <div>
          <strong>ncs.aesthetics</strong>
          <p>${escapeHtml(item.daypart)} · ${escapeHtml(item.lane)}</p>
        </div>
      </div>
      <div class="instagram-canvas ${statusClass(item.status)}">
        <div class="canvas-chip">${escapeHtml(preview.format || item.type || 'Post')}</div>
        <div class="canvas-cover">${escapeHtml(preview.cover || item.lane)}</div>
        <h3>${escapeHtml(preview.hook || item.title)}</h3>
        <p class="canvas-body">${escapeHtml(preview.postText || preview.caption || item.notes || '')}</p>
        <p class="canvas-visual">${escapeHtml(preview.visual || item.notes || '')}</p>
      </div>
      <div class="post-caption">
        <div class="caption-meta">
          <span>${escapeHtml(item.slot || 'TBD')}</span>
          <span>${escapeHtml(statusLabel(item.status))}</span>
        </div>
        <p><strong>@ncs.aesthetics</strong> ${escapeHtml(preview.caption || item.notes || '')}</p>
        <p class="post-cta">CTA: ${escapeHtml(item.cta || preview.cta || 'TBD')}</p>
      </div>
    </div>

    <div class="review-panel">
      <div class="review-header">
        <div>
          <p class="eyebrow">Review decision</p>
          <h3>${escapeHtml(item.title)}</h3>
        </div>
        <span class="decision-pill ${statusClass(item.status)}">${escapeHtml(statusLabel(item.status))}</span>
      </div>
      <p class="review-notes">${escapeHtml(preview.notes || item.notes || '')}</p>
      <label class="comment-field">
        <span>Comment for the team</span>
        <textarea data-comment-id="${item.id}" placeholder="Add feedback, approval notes, or what to fix next...">${escapeHtml(item.reviewComment || '')}</textarea>
      </label>
      <div class="decision-actions">
        <button class="approve-btn" data-action="approved" data-id="${item.id}">Approve</button>
        <button class="ghost warm-btn" data-action="needs_work" data-id="${item.id}">Needs more work</button>
        <button class="ghost danger-btn" data-action="disapproved" data-id="${item.id}">Disapprove</button>
      </div>
      <p class="decision-summary">${escapeHtml(decisionCopy(item))}</p>
    </div>
  </article>`;
}

function renderApprovalWall() {
  const ordered = [
    ...itemsByStatus('approval'),
    ...itemsByStatus('approved'),
    ...itemsByStatus('needs_work'),
    ...itemsByStatus('disapproved')
  ];

  document.getElementById('approvalWall').innerHTML = ordered.length
    ? ordered.map(approvalCardMarkup).join('')
    : '<div class="empty">No posts loaded.</div>';
}

function simpleQueueMarkup(items, emptyCopy) {
  if (!items.length) return `<div class="empty">${escapeHtml(emptyCopy)}</div>`;
  return items.map((item) => `<article class="queue-item ${statusClass(item.status)}"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.slot || 'TBD')} · ${escapeHtml(item.daypart)} · ${escapeHtml(item.lane)}</p>${item.reviewComment ? `<p class="queue-comment">${escapeHtml(item.reviewComment)}</p>` : ''}</article>`).join('');
}

function renderQueues() {
  document.getElementById('approvedQueue').innerHTML = simpleQueueMarkup(itemsByStatus('approved'), 'Nothing approved yet.');
  document.getElementById('needsWorkQueue').innerHTML = simpleQueueMarkup(itemsByStatus('needs_work'), 'Nothing has been sent back.');
  document.getElementById('disapprovedQueue').innerHTML = simpleQueueMarkup(itemsByStatus('disapproved'), 'Nothing has been disapproved.');
}

function wireEvents() {
  document.querySelectorAll('button[data-action][data-id]').forEach((button) => {
    button.addEventListener('click', () => setStatus(button.dataset.id, button.dataset.action));
  });

  document.querySelectorAll('textarea[data-comment-id]').forEach((textarea) => {
    textarea.addEventListener('input', (event) => updateComment(event.target.dataset.commentId, event.target.value));
  });
}

function render() {
  renderMetrics();
  renderFocus();
  renderApprovalWall();
  renderQueues();
  wireEvents();
}

document.getElementById('seedBtn').addEventListener('click', seedDemo);
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Reset approval wall data on this device?')) return;
  state = cloneDefault();
  save();
  render();
});
document.getElementById('jumpToApprovalsBtn').addEventListener('click', () => {
  document.getElementById('approvalWallSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

render();
