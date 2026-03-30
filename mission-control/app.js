const STORAGE_KEY = 'ncs-approval-wall-v4';
const BOOKING_URL = 'https://ncsaesthetics.glossgenius.com/';

const seedPosts = [
  {
    id: 'p1',
    title: 'Morning glow reset',
    daypart: 'Morning',
    category: 'Daily Tips',
    status: 'ready',
    hook: 'Fresh skin starts here.',
    body: 'If your skin has been looking dull, flat, or tired, a glow-focused reset can make all the difference.',
    caption: 'If your skin has been looking dull, flat, or tired, a glow-focused reset can make all the difference. A beautiful treatment should leave your skin looking refreshed, polished, and more like yourself again. Book your glow reset at NCS Aesthetics.',
    cta: 'Book your glow reset',
    visual: 'Soft cream background · polished fresh-skin closeup · clean luxury tone',
    comments: ''
  },
  {
    id: 'p2',
    title: 'Midday Hydrafacial authority',
    daypart: 'Midday',
    category: 'Hydrafacial',
    status: 'ready',
    hook: 'Why Hydrafacial stays a favorite.',
    body: 'Brightness, hydration, and a cleaner finish — explained beautifully.',
    caption: 'There is a reason Hydrafacial stays one of our most requested treatments. It is one of our favorite ways to support brightness, hydration, and a cleaner finish in a way clients can actually feel. Reserve your Hydrafacial this week.',
    cta: 'Reserve this week',
    visual: 'Soft gold details · treatment-led visual · elevated educational feel',
    comments: ''
  },
  {
    id: 'p3',
    title: 'Evening Circadia hero',
    daypart: 'Evening',
    category: 'Circadia',
    status: 'review',
    hook: 'Protect by day. Repair by night.',
    body: 'Your skin does some of its most important recovery work at night.',
    caption: 'Your skin does some of its most important recovery work at night. That is why evening care should feel supportive, calming, and consistent — not chaotic. Ask us about homecare that works with your skin.',
    cta: 'Ask about homecare',
    visual: 'Evening ritual visual · calm premium skincare tone · moonlit softness',
    comments: ''
  },
  {
    id: 'p4',
    title: 'Bridal prep prompt',
    daypart: 'Morning',
    category: 'Daily Tips',
    status: 'review',
    hook: 'Do not leave glow to the last week.',
    body: 'The best bridal glow usually comes from a thoughtful timeline, not a rushed treatment.',
    caption: 'The best bridal glow usually comes from a thoughtful timeline, not a rushed treatment the week of. If your wedding or event is coming up, let’s map out your prep beautifully. DM us “bridal glow.”',
    cta: 'DM bridal glow',
    visual: 'Bridal whites · elegant prep timeline · soft luxury confidence',
    comments: ''
  },
  {
    id: 'p5',
    title: 'Custom facial first step',
    daypart: 'Midday',
    category: 'Hydrafacial',
    status: 'ready',
    hook: 'Not sure what to book?',
    body: 'That is exactly why custom facials exist.',
    caption: 'Not sure what to book? That is exactly why custom facials exist. Start with the treatment that meets your skin where it is right now. Book a skin consult at NCS Aesthetics.',
    cta: 'Book a skin consult',
    visual: 'Question-led layout · calm neutral palette · warm esthetician guidance',
    comments: ''
  }
];

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : structuredClone(seedPosts);
  } catch {
    return structuredClone(seedPosts);
  }
}

let posts = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderStats() {
  const count = (status) => posts.filter((post) => post.status === status).length;
  document.getElementById('readyCount').textContent = count('ready');
  document.getElementById('reviewCount').textContent = count('review');
  document.getElementById('approvedCount').textContent = count('approved');
  document.getElementById('needsWorkCount').textContent = count('needs_work');
}

function renderWall(targetId, status) {
  const list = posts.filter((post) => post.status === status);
  document.getElementById(targetId).innerHTML = list.length
    ? list.map(postCard).join('')
    : '<div class="empty">Nothing here right now.</div>';
}

function renderMiniList(targetId, status, emptyText) {
  const list = posts.filter((post) => post.status === status);
  document.getElementById(targetId).innerHTML = list.length
    ? list.map((post) => `<article class="mini-card"><strong>${escapeHtml(post.title)}</strong><span>${escapeHtml(post.daypart)} · ${escapeHtml(post.category)}</span></article>`).join('')
    : `<div class="empty">${emptyText}</div>`;
}

function postCard(post) {
  return `
    <article class="post-card">
      <div class="post-preview">
        <div class="post-topline">
          <span class="pill">${escapeHtml(post.daypart)}</span>
          <span class="pill muted">${escapeHtml(post.category)}</span>
        </div>
        <div class="post-frame">
          <div class="post-cover">${escapeHtml(post.title)}</div>
          <div class="post-hook">${escapeHtml(post.hook)}</div>
          <div class="post-body">${escapeHtml(post.body)}</div>
          <div class="post-visual">${escapeHtml(post.visual)}</div>
          <a class="book-link" href="${BOOKING_URL}" target="_blank" rel="noopener">Book now</a>
        </div>
      </div>
      <div class="post-review">
        <h3>${escapeHtml(post.title)}</h3>
        <p class="caption-label">Caption preview</p>
        <p class="caption-text">${escapeHtml(post.caption)}</p>
        <label class="comment-box">
          <span>Comments</span>
          <textarea data-id="${post.id}" placeholder="Add notes here...">${escapeHtml(post.comments || '')}</textarea>
        </label>
        <div class="action-row">
          <button class="approve-btn" data-id="${post.id}" data-action="approved">Approve</button>
          <button class="ghost" data-id="${post.id}" data-action="needs_work">Needs more work</button>
          <button class="ghost danger" data-id="${post.id}" data-action="disapproved">Disapprove</button>
        </div>
      </div>
    </article>
  `;
}

function bindEvents() {
  document.querySelectorAll('textarea[data-id]').forEach((textarea) => {
    textarea.addEventListener('input', (event) => {
      const post = posts.find((item) => item.id === event.target.dataset.id);
      if (!post) return;
      post.comments = event.target.value;
      saveState();
    });
  });

  document.querySelectorAll('button[data-action]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const post = posts.find((item) => item.id === event.target.dataset.id);
      if (!post) return;
      post.status = event.target.dataset.action;
      saveState();
      render();
    });
  });

  document.getElementById('showReadyBtn').addEventListener('click', () => {
    document.getElementById('readySection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('showReviewBtn').addEventListener('click', () => {
    document.getElementById('reviewSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    posts = structuredClone(seedPosts);
    saveState();
    render();
  });
}

function render() {
  renderStats();
  renderWall('readyWall', 'ready');
  renderWall('reviewWall', 'review');
  renderMiniList('approvedList', 'approved', 'Nothing approved yet.');
  renderMiniList('needsWorkList', 'needs_work', 'Nothing sent back yet.');
  renderMiniList('disapprovedList', 'disapproved', 'Nothing disapproved yet.');
  bindEvents();
}

render();