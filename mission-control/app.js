const DATA_URL = './data/approval-posts.json';
const QUEUE_URL_CANDIDATES = [
  '../ops/instagram-phase-1/content-queue.csv',
  '../docs/ops/instagram-phase-1/content-queue.csv'
];
const STORAGE_KEY = 'ncs-approval-wall-v6';

let allPosts = [];
let queueRows = [];
let filter = 'all';
let searchQuery = '';
let hideNoticeTimer = null;

const stateLabels = {
  review: 'Needs review',
  approved: 'Approved',
  ready: 'Approved',
  needs_work: 'Needs more work',
  disapproved: 'Disapproved'
};

const queueLabels = {
  ready_to_post: 'Ready to post',
  mission_control_ready: 'Mission Control ready',
  needs_approval: 'Needs Natalie approval',
  backlog: 'Backlog'
};

function postHref(post) {
  return `./post.html?id=${encodeURIComponent(post.id)}`;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeTitle(value = '') {
  return String(value)
    .toLowerCase()
    .replaceAll('&', 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1;
      }
      row.push(value);
      value = '';
      if (row.some(cell => cell !== '')) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    value += char;
  }

  if (value || row.length) {
    row.push(value);
    if (row.some(cell => cell !== '')) {
      rows.push(row);
    }
  }

  if (!rows.length) return [];
  const [headers, ...dataRows] = rows;
  return dataRows.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ''])));
}

async function fetchFirstAvailable(urls) {
  for (const url of urls) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        return response.text();
      }
    } catch (error) {
      // Try next candidate.
    }
  }
  return '';
}

function extractPostId(row = {}) {
  const combined = `${row.asset_path || ''} ${row.caption_source || ''}`;
  const matched = combined.match(/post-\d+/i);
  return matched ? matched[0].toLowerCase() : '';
}

function loadSavedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (error) {
    return {};
  }
}

function isApproved(post) {
  return post.status === 'approved' || post.status === 'ready';
}

function countWhere(predicate) {
  return allPosts.filter(predicate).length;
}

function inferGradient(post) {
  const combo = `${post.daypart} ${post.category}`.toLowerCase();
  if (combo.includes('evening') || combo.includes('circadia')) return 'linear-gradient(180deg,#efe7f3 0%,#d8c4da 100%)';
  if (combo.includes('midday') || combo.includes('hydrafacial')) return 'linear-gradient(180deg,#fff7f1 0%,#ecd7cc 100%)';
  return 'linear-gradient(180deg,#f8efe7 0%,#e4cec3 100%)';
}

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

function formatSlot(post) {
  if (post.publishDate && post.targetTime) {
    const raw = `${post.publishDate}T${post.targetTime}:00`;
    const date = new Date(raw);
    if (!Number.isNaN(date.getTime())) {
      return `${new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(date)} · ${post.targetTime} PT`;
    }
  }
  return `${post.daypart} lane`;
}

function withinNextHours(post, hours) {
  if (!post.publishDate || !post.targetTime) return false;
  const target = new Date(`${post.publishDate}T${post.targetTime}:00`);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return diff >= 0 && diff <= hours * 60 * 60 * 1000;
}

function statusPriority(post) {
  if (post.status === 'needs_work') return 0;
  if (post.status === 'review') return 1;
  if (post.status === 'disapproved') return 2;
  return 3;
}

function daypartPriority(post) {
  if (post.daypart === 'Morning') return 0;
  if (post.daypart === 'Midday') return 1;
  return 2;
}

function comparePosts(a, b) {
  const priorityDiff = statusPriority(a) - statusPriority(b);
  if (priorityDiff) return priorityDiff;

  if (a.publishDate && b.publishDate) {
    const aDate = new Date(`${a.publishDate}T${a.targetTime || '00:00'}:00`).getTime();
    const bDate = new Date(`${b.publishDate}T${b.targetTime || '00:00'}:00`).getTime();
    if (!Number.isNaN(aDate) && !Number.isNaN(bDate) && aDate !== bDate) {
      return aDate - bDate;
    }
  }

  const daypartDiff = daypartPriority(a) - daypartPriority(b);
  if (daypartDiff) return daypartDiff;
  return a.title.localeCompare(b.title);
}

function currentPosts() {
  let posts = [...allPosts];

  if (filter === 'review') {
    posts = posts.filter(post => post.status === 'review');
  } else if (filter === 'approved') {
    posts = posts.filter(post => isApproved(post));
  } else if (filter === 'needs_work') {
    posts = posts.filter(post => post.status === 'needs_work');
  } else if (filter === 'disapproved') {
    posts = posts.filter(post => post.status === 'disapproved');
  }

  if (searchQuery) {
    const query = normalizeTitle(searchQuery);
    posts = posts.filter((post) => {
      const haystack = normalizeTitle([
        post.title,
        post.daypart,
        post.category,
        post.caption,
        post.comments,
        post.objective,
        post.queueStatusLabel,
        post.primaryMetric,
        post.slotLabel
      ].join(' '));
      return haystack.includes(query);
    });
  }

  return posts.sort(comparePosts);
}

function showNotice(message, variant = 'neutral') {
  const notice = document.getElementById('statusNotice');
  notice.textContent = message;
  notice.className = `status-notice ${variant}`;
  clearTimeout(hideNoticeTimer);
  hideNoticeTimer = setTimeout(() => {
    notice.className = 'status-notice hidden';
  }, 3000);
}

function persist(reason = 'Saved locally.') {
  const updatedAt = new Date().toISOString();
  const payload = {
    updatedAt,
    posts: Object.fromEntries(allPosts.map(post => [post.id, {
      status: post.status,
      comments: post.comments,
      lastTouchedAt: post.lastTouchedAt || updatedAt,
      lastTouchedLabel: post.lastTouchedLabel || reason
    }]))
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  document.getElementById('saveState').textContent = `Saved locally · ${formatDateTime(updatedAt)}`;
  document.getElementById('lastAction').textContent = reason;
}

function renderSummary() {
  const reviewCount = countWhere(post => post.status === 'review');
  const approvedCount = countWhere(post => isApproved(post));
  const needsWorkCount = countWhere(post => post.status === 'needs_work');
  const disapprovedCount = countWhere(post => post.status === 'disapproved');
  const next72Approved = countWhere(post => isApproved(post) && withinNextHours(post, 72));
  const heroApproved = countWhere(post => post.daypart === 'Evening' && isApproved(post));
  const noteCount = countWhere(post => post.comments && post.comments.trim());
  const review72 = countWhere(post => post.status === 'review' && withinNextHours(post, 72));

  document.getElementById('countReview').textContent = reviewCount;
  document.getElementById('countApproved').textContent = approvedCount;
  document.getElementById('countNeedsWork').textContent = needsWorkCount;
  document.getElementById('countDisapproved').textContent = disapprovedCount;
  document.getElementById('countNext72').textContent = next72Approved;
  document.getElementById('countHeroApproved').textContent = heroApproved;

  document.getElementById('reviewDetail').textContent = review72 ? `${review72} need a decision in the next 72h` : 'No urgent review gaps in the next 72h';
  document.getElementById('approvedDetail').textContent = `${approvedCount} posts cleared for scheduling`;
  document.getElementById('needsWorkDetail').textContent = noteCount ? `${noteCount} cards already have operator notes` : 'Add notes before sending work back';
  document.getElementById('disapprovedDetail').textContent = disapprovedCount ? 'Pulled back from the queue' : 'No hard stops right now';
  document.getElementById('next72Detail').textContent = next72Approved ? 'Coverage exists for near-term slots' : 'No approved scheduled assets in the next 72h';
  document.getElementById('heroDetail').textContent = `${heroApproved} evening assets are approval-safe`;
}

function renderOpsPulse() {
  const approved = countWhere(post => isApproved(post));
  const review = countWhere(post => post.status === 'review');
  const needsWork = countWhere(post => post.status === 'needs_work');
  const next72Review = countWhere(post => post.status === 'review' && withinNextHours(post, 72));
  const headlineParts = [
    `${approved} approved`,
    `${review} still in review`,
    `${needsWork} need rework`
  ];
  let headline = `${headlineParts.join(' · ')}.`;
  if (next72Review) {
    headline += ` ${next72Review} of those are tied to the next 72 hours, so they should be handled first.`;
  } else {
    headline += ' Near-term posting windows are covered or not yet scheduled.';
  }
  document.getElementById('queueHeadline').textContent = headline;

  const saved = loadSavedState();
  if (saved.updatedAt) {
    document.getElementById('saveState').textContent = `Saved locally · ${formatDateTime(saved.updatedAt)}`;
  } else {
    document.getElementById('saveState').textContent = 'No local overrides yet.';
  }
  document.getElementById('lastAction').textContent = saved.updatedAt ? 'This board keeps comments and decisions in local browser storage.' : 'Approve or comment on a card to start local state tracking.';
}

function card(post) {
  const statusLabel = escapeHtml(stateLabels[post.status] || stateLabels.review);
  const queueLabel = escapeHtml(post.queueStatusLabel || 'Live on approval wall');
  const slotLabel = escapeHtml(post.slotLabel || `${post.daypart} lane`);
  const objective = escapeHtml(post.objective || 'Keep this lane strategically useful and easy to approve.');
  const primaryMetric = escapeHtml(post.primaryMetric || 'approvals');
  const reviewerNote = post.comments && post.comments.trim() ? `${post.comments.trim().slice(0, 120)}${post.comments.trim().length > 120 ? '…' : ''}` : 'No operator note yet.';
  const lastTouched = post.lastTouchedAt ? `Updated ${escapeHtml(formatDateTime(post.lastTouchedAt))}` : 'No local changes yet';

  const previewFrame = post.previewImage
    ? `
        <div class="frame asset-frame">
          <img class="frame-image" src="${escapeHtml(post.previewImage)}" alt="${escapeHtml(post.title)} preview" loading="lazy" />
          <div class="asset-frame-overlay"></div>
          <div class="open-indicator">Open viewer ↗</div>
          <div class="asset-frame-footer">
            <span class="asset-chip">Rendered preview</span>
            <div class="asset-title">${escapeHtml(post.title)}</div>
            <div class="asset-hook">${escapeHtml(post.hook || '')}</div>
          </div>
        </div>
      `
    : `
        <div class="frame" style="background:${inferGradient(post)}">
          <div class="open-indicator">Open viewer ↗</div>
          <div class="cover">${escapeHtml(post.title)}</div>
          <div class="hook">${escapeHtml(post.hook || '')}</div>
          <div class="body-copy">${escapeHtml(post.body || post.caption || '')}</div>
          <div class="visual">${escapeHtml(post.visual || 'Premium skincare visual direction')}</div>
          <span class="book-btn faux-btn">${escapeHtml(post.cta || 'Book now')}</span>
        </div>
      `;

  return `
    <article class="post-card status-${escapeHtml(post.status)}">
      <a class="preview preview-link" href="${postHref(post)}" aria-label="Open ${escapeHtml(post.title)} post viewer">
        <div class="pill-row">
          <span class="pill">${escapeHtml(post.daypart)}</span>
          <span class="pill">${escapeHtml(post.category)}</span>
          <span class="pill pill-status">${statusLabel}</span>
        </div>
        ${previewFrame}
      </a>
      <div class="review">
        <div class="title-row">
          <div>
            <div class="title">${escapeHtml(post.title)}</div>
            <div class="meta">${escapeHtml(post.daypart)} · ${escapeHtml(post.category)} · ${statusLabel}</div>
          </div>
          <a class="view-link" href="${postHref(post)}">Open post ↗</a>
        </div>

        <div class="meta-grid">
          <div class="meta-card"><span>Scheduled slot</span><strong>${slotLabel}</strong></div>
          <div class="meta-card"><span>Queue state</span><strong>${queueLabel}</strong></div>
          <div class="meta-card"><span>Primary metric</span><strong>${primaryMetric}</strong></div>
          <div class="meta-card"><span>Last touch</span><strong>${lastTouched}</strong></div>
        </div>

        <div class="brief-grid">
          <div class="brief-card">
            <div class="label">Objective</div>
            <p>${objective}</p>
          </div>
          <div class="brief-card">
            <div class="label">Operator note</div>
            <p>${escapeHtml(reviewerNote)}</p>
          </div>
        </div>

        <div>
          <div class="label">Caption</div>
          <div class="caption">${escapeHtml(post.caption)}</div>
        </div>

        <label class="comment-wrap">
          <span>Comments</span>
          <textarea data-id="${post.id}" placeholder="Add notes here before sending work back...">${escapeHtml(post.comments)}</textarea>
        </label>

        <div class="actions">
          <button class="action-btn primary ${post.status === 'approved' || post.status === 'ready' ? 'current' : ''}" data-action="approved" data-id="${post.id}">Approve</button>
          <button class="action-btn warn ${post.status === 'needs_work' ? 'current' : ''}" data-action="needs_work" data-id="${post.id}">Needs more work</button>
          <button class="action-btn danger ${post.status === 'disapproved' ? 'current' : ''}" data-action="disapproved" data-id="${post.id}">Disapprove</button>
        </div>
      </div>
    </article>
  `;
}

function bindCommentInputs() {
  document.querySelectorAll('textarea[data-id]').forEach((textarea) => {
    textarea.addEventListener('input', (event) => {
      const post = allPosts.find(item => item.id === event.target.dataset.id);
      if (!post) return;
      post.comments = event.target.value;
      post.lastTouchedAt = new Date().toISOString();
      post.lastTouchedLabel = `Comment updated for ${post.title}`;
      persist(post.lastTouchedLabel);
      renderSummary();
      renderOpsPulse();
    });
  });
}

function bindActions() {
  document.querySelectorAll('button[data-action]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const { action, id } = event.currentTarget.dataset;
      const post = allPosts.find(item => item.id === id);
      if (!post) return;

      if ((action === 'needs_work' || action === 'disapproved') && !post.comments.trim()) {
        showNotice('Add a comment before sending work back or disapproving it.', 'warning');
        const textarea = document.querySelector(`textarea[data-id="${id}"]`);
        if (textarea) textarea.focus();
        return;
      }

      post.status = action;
      post.lastTouchedAt = new Date().toISOString();
      post.lastTouchedLabel = `${stateLabels[action] || 'Updated'} · ${post.title}`;
      persist(post.lastTouchedLabel);
      showNotice(`${post.title} marked as ${stateLabels[action] || 'updated'}.`, action === 'approved' ? 'success' : 'warning');
      render();
    });
  });
}

function renderGrid() {
  const posts = currentPosts();
  document.getElementById('postGrid').innerHTML = posts.length
    ? posts.map(card).join('')
    : '<div class="empty">No posts match this view right now. Try another filter or clear the search.</div>';

  bindCommentInputs();
  bindActions();
}

function renderFilters() {
  const mapping = {
    filterAll: 'all',
    filterReview: 'review',
    filterReady: 'approved',
    filterNeedsWork: 'needs_work',
    filterDisapproved: 'disapproved'
  };

  Object.entries(mapping).forEach(([id, value]) => {
    const el = document.getElementById(id);
    el.classList.toggle('active', filter === value);
    el.onclick = () => {
      filter = value;
      renderGrid();
      renderFilters();
    };
  });
}

function render() {
  renderSummary();
  renderOpsPulse();
  renderFilters();
  renderGrid();
}

async function loadQueueRows() {
  const csvText = await fetchFirstAvailable(QUEUE_URL_CANDIDATES);
  queueRows = csvText ? parseCsv(csvText) : [];
}

async function loadPosts() {
  await loadQueueRows();

  const [postsResponse] = await Promise.all([
    fetch(DATA_URL, { cache: 'no-store' })
  ]);

  const basePosts = await postsResponse.json();
  const saved = loadSavedState();
  const savedPosts = saved.posts || saved;

  const queueById = new Map();
  const queueByTitle = new Map();
  queueRows.forEach((row) => {
    const postId = extractPostId(row);
    const metadata = {
      publishDate: row.publish_date || '',
      targetTime: row.target_time_pt || '',
      slotLabel: row.publish_date && row.target_time_pt ? `${row.publish_date} · ${row.target_time_pt} PT` : '',
      queueStatus: row.queue_status || '',
      queueStatusLabel: queueLabels[row.queue_status] || row.queue_status || '',
      objective: row.objective || '',
      primaryMetric: row.primary_metric || '',
      queueNotes: row.notes || ''
    };
    if (postId) queueById.set(postId, metadata);
    if (row.title) queueByTitle.set(normalizeTitle(row.title), metadata);
  });

  allPosts = basePosts.map((post, index) => {
    const persisted = savedPosts[post.id] || {};
    const queueMeta = queueById.get(post.id) || queueByTitle.get(normalizeTitle(post.title)) || {};
    return {
      ...post,
      ...queueMeta,
      id: post.id || `post-${index + 1}`,
      status: persisted.status || post.status || 'review',
      comments: persisted.comments || post.comments || '',
      lastTouchedAt: persisted.lastTouchedAt || '',
      lastTouchedLabel: persisted.lastTouchedLabel || ''
    };
  });

  render();
}

document.getElementById('resetData').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  showNotice('Local review state reset for this browser.', 'neutral');
  loadPosts();
});

document.getElementById('searchInput').addEventListener('input', (event) => {
  searchQuery = event.target.value || '';
  renderGrid();
});

loadPosts();
