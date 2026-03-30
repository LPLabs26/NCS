const DATA_URL = './data/approval-posts.json';
const STORAGE_KEY = 'ncs-approval-wall-v5';
const BOOKING_URL = 'https://ncsaesthetics.glossgenius.com/';

let allPosts = [];
let filter = 'all';

const stateLabels = {
  review: 'Needs review',
  approved: 'Approved',
  needs_work: 'Needs more work',
  disapproved: 'Disapproved'
};

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function loadPosts() {
  const res = await fetch(DATA_URL, { cache: 'no-store' });
  const base = await res.json();
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  allPosts = base.map((post, index) => ({
    ...post,
    id: post.id || `post-${index + 1}`,
    status: saved[post.id]?.status || post.status || 'review',
    comments: saved[post.id]?.comments || post.comments || ''
  }));
  render();
}

function persist() {
  const payload = Object.fromEntries(allPosts.map(post => [post.id, { status: post.status, comments: post.comments }]));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function counts(status) {
  return allPosts.filter(post => post.status === status).length;
}

function currentPosts() {
  if (filter === 'all') return allPosts;
  if (filter === 'approved') return allPosts.filter(post => post.status === 'approved');
  return allPosts.filter(post => post.status === 'review');
}

function renderSummary() {
  document.getElementById('countReview').textContent = counts('review');
  document.getElementById('countApproved').textContent = counts('approved');
  document.getElementById('countNeedsWork').textContent = counts('needs_work');
  document.getElementById('countDisapproved').textContent = counts('disapproved');
}

function inferGradient(post) {
  const combo = `${post.daypart} ${post.category}`.toLowerCase();
  if (combo.includes('evening') || combo.includes('circadia')) return 'linear-gradient(180deg,#efe7f3 0%,#d8c4da 100%)';
  if (combo.includes('midday') || combo.includes('hydrafacial')) return 'linear-gradient(180deg,#fff7f1 0%,#ecd7cc 100%)';
  return 'linear-gradient(180deg,#f8efe7 0%,#e4cec3 100%)';
}

function card(post) {
  return `
    <article class="post-card">
      <div class="preview">
        <div class="pill-row">
          <span class="pill">${escapeHtml(post.daypart)}</span>
          <span class="pill">${escapeHtml(post.category)}</span>
          <span class="pill">${escapeHtml(stateLabels[post.status])}</span>
        </div>
        <div class="frame" style="background:${inferGradient(post)}">
          <div class="cover">${escapeHtml(post.title)}</div>
          <div class="hook">${escapeHtml(post.hook)}</div>
          <div class="body-copy">${escapeHtml(post.onScreen || post.body || '')}</div>
          <div class="visual">${escapeHtml(post.visual || 'Premium skincare visual direction')}</div>
          <a class="book-btn" href="${BOOKING_URL}" target="_blank" rel="noopener">Book now</a>
        </div>
      </div>
      <div class="review">
        <div class="title">${escapeHtml(post.title)}</div>
        <div class="meta">${escapeHtml(post.daypart)} · ${escapeHtml(post.category)}</div>
        <div>
          <div class="label">Caption</div>
          <div class="caption">${escapeHtml(post.caption)}</div>
        </div>
        <label class="comment-wrap">
          <span>Comments</span>
          <textarea data-id="${post.id}" placeholder="Add notes here...">${escapeHtml(post.comments)}</textarea>
        </label>
        <div class="actions">
          <button class="action-btn primary" data-action="approved" data-id="${post.id}">Approve</button>
          <button class="action-btn warn" data-action="needs_work" data-id="${post.id}">Needs more work</button>
          <button class="action-btn danger" data-action="disapproved" data-id="${post.id}">Disapprove</button>
        </div>
      </div>
    </article>
  `;
}

function renderGrid() {
  const posts = currentPosts();
  document.getElementById('postGrid').innerHTML = posts.length ? posts.map(card).join('') : '<div class="empty">No posts in this view right now.</div>';

  document.querySelectorAll('textarea[data-id]').forEach((textarea) => {
    textarea.addEventListener('input', (event) => {
      const post = allPosts.find(item => item.id === event.target.dataset.id);
      if (!post) return;
      post.comments = event.target.value;
      persist();
    });
  });

  document.querySelectorAll('button[data-action]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const post = allPosts.find(item => item.id === event.target.dataset.id);
      if (!post) return;
      post.status = event.target.dataset.action;
      persist();
      render();
    });
  });
}

function renderFilters() {
  const mapping = {
    filterAll: 'all',
    filterReview: 'review',
    filterReady: 'approved'
  };
  Object.entries(mapping).forEach(([id, value]) => {
    const el = document.getElementById(id);
    el.classList.toggle('active', filter === value);
    el.onclick = () => {
      filter = value;
      render();
    };
  });
}

function render() {
  renderSummary();
  renderFilters();
  renderGrid();
}

document.getElementById('resetData').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  loadPosts();
});

loadPosts();