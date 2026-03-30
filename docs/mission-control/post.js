const DATA_URL = './data/approval-posts.json';
const BOOKING_URL = 'https://ncsaesthetics.glossgenius.com/';
const STORAGE_KEY = 'ncs-approval-wall-v5';

const stateLabels = {
  review: 'Needs review',
  approved: 'Approved',
  ready: 'Approved',
  needs_work: 'Needs more work',
  disapproved: 'Disapproved'
};

const gradients = {
  evening: 'radial-gradient(circle at 50% 14%, rgba(255,255,255,0.96), rgba(255,244,230,0.72) 18%, rgba(168,138,196,0.35) 36%, rgba(45,32,67,0.92) 100%)',
  circadia: 'radial-gradient(circle at 50% 14%, rgba(255,255,255,0.96), rgba(255,244,230,0.72) 18%, rgba(168,138,196,0.35) 36%, rgba(45,32,67,0.92) 100%)',
  midday: 'linear-gradient(180deg, #fff8f1 0%, #efddcf 42%, #b88f77 100%)',
  hydrafacial: 'linear-gradient(180deg, #fff8f1 0%, #efddcf 42%, #b88f77 100%)',
  morning: 'linear-gradient(180deg, #fffdf8 0%, #f4e7dc 42%, #d0b0a3 100%)',
  daily: 'linear-gradient(180deg, #fffdf8 0%, #f4e7dc 42%, #d0b0a3 100%)'
};

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function inferGradient(post) {
  const combo = `${post.daypart || ''} ${post.category || ''}`.toLowerCase();
  if (combo.includes('evening') || combo.includes('circadia')) return gradients.evening;
  if (combo.includes('midday') || combo.includes('hydrafacial')) return gradients.midday;
  return gradients.morning;
}

function queryId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function applyStoredState(basePosts) {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return basePosts.map((post, index) => ({
    ...post,
    id: post.id || `post-${index + 1}`,
    status: saved[post.id]?.status || post.status || 'review',
    comments: saved[post.id]?.comments || post.comments || ''
  }));
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value || '';
}

function renderError(message) {
  const root = document.getElementById('viewerRoot');
  root.classList.remove('loading');
  root.innerHTML = `
    <section class="viewer-layout">
      <div class="error-state">
        <p class="panel-eyebrow">Post viewer</p>
        <h1 class="panel-title">That post could not be loaded.</h1>
        <p class="panel-subtitle">${escapeHtml(message)}</p>
        <div class="panel-actions">
          <a class="panel-btn primary" href="index.html">Back to approval wall</a>
        </div>
      </div>
    </section>
  `;
}

function renderPost(post) {
  const status = stateLabels[post.status] || stateLabels.review;
  const subtitle = `${post.daypart} · ${post.category} · ${status}`;

  document.title = `${post.title} · NCS Post Viewer`;
  document.getElementById('viewerRoot').classList.remove('loading');
  document.getElementById('storyCard').style.setProperty('--viewer-gradient', inferGradient(post));
  setText('profileMeta', subtitle);
  setText('storyDaypart', post.daypart);
  setText('storyCategory', post.category);
  setText('storyEyebrow', post.category);
  setText('storyHeadline', post.title || post.hook || 'NCS Aesthetics');
  setText('storyBody', post.body || post.caption || '');
  setText('storyOnScreen', post.onScreen || post.body || post.caption || '');
  setText('storyVisual', post.visual || 'Premium NCS visual direction');
  setText('storyCtaText', post.cta || 'Book now');
  setText('panelTitle', post.title);
  setText('panelSubtitle', `${subtitle}. Designed to feel like a live, already-posted Instagram story or reel cover.`);
  setText('panelCaption', post.caption || '');
  setText('panelHook', post.hook || '');
  setText('panelBody', post.body || '');
  setText('panelStatus', status);

  const bookLabel = post.cta || 'Book now';
  const storyBookLink = document.getElementById('storyBookLink');
  const panelBookBtn = document.getElementById('panelBookBtn');

  storyBookLink.href = BOOKING_URL;
  panelBookBtn.href = BOOKING_URL;
  storyBookLink.textContent = bookLabel;
  panelBookBtn.textContent = bookLabel;
}

async function init() {
  try {
    const id = queryId();
    if (!id) {
      renderError('Missing post id in the URL.');
      return;
    }

    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Unable to load post data (${res.status}).`);

    const basePosts = await res.json();
    const posts = applyStoredState(basePosts);
    const post = posts.find((item) => item.id === id);

    if (!post) {
      renderError(`No post was found for “${id}”.`);
      return;
    }

    renderPost(post);
  } catch (error) {
    renderError(error?.message || 'Unknown error while loading the post.');
  }
}

init();
