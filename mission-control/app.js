const STORAGE_KEY = 'ncs-mission-control-v1';
const defaultData = {
  items: [],
  jobs: [
    { time: '08:00 AM', name: 'Trend + Reel Idea', output: 'Hook, shots, caption, CTA' },
    { time: '10:00 AM', name: 'Booking Gap Fill Check', output: 'Offer, story copy, CTA' },
    { time: '04:00 PM', name: 'Daily Brief', output: '3 bullets + tomorrow move' }
  ],
  schedule: [
    'Monday — Hydrafacial Glow Reset Reel',
    'Tuesday — What Should I Book? Story Sequence',
    'Wednesday — Hydrafacial vs Custom Facial Carousel',
    'Thursday — Peel Education Post',
    'Friday — Opening Available Story',
    'Saturday — Luxury Self-Care Reminder Story',
    'Sunday — Monthly Maintenance Post'
  ]
};
function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(defaultData); }
  catch { return structuredClone(defaultData); }
}
function save(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
let state = load();
function seedDemo() {
  state.items = [
    { id: crypto.randomUUID(), title: 'Natalie: push bridal glow promo', type: 'task', priority: 'high', status: 'todo', notes: 'Need to make this visible next week.' },
    { id: crypto.randomUUID(), title: 'Write Hydrafacial story sequence', type: 'content-request', priority: 'medium', status: 'in-progress', notes: 'Use glow + guidance angle.' },
    { id: crypto.randomUUID(), title: 'Approve peel education caption', type: 'approval', priority: 'medium', status: 'waiting', notes: 'Needs Natalie signoff.' },
    { id: crypto.randomUUID(), title: 'What Should I Book? story set', type: 'content-request', priority: 'high', status: 'ready', notes: 'Ready to post.' },
    { id: crypto.randomUUID(), title: 'Brand audit complete', type: 'task', priority: 'low', status: 'done', notes: 'Completed earlier.' }
  ];
  save(state); render();
}
function metrics() {
  const open = state.items.filter(i => ['todo','in-progress'].includes(i.status)).length;
  const ready = state.items.filter(i => i.status === 'ready').length;
  const approval = state.items.filter(i => i.status === 'waiting').length;
  const done = state.items.filter(i => i.status === 'done').length;
  document.getElementById('metric-open').textContent = open;
  document.getElementById('metric-ready').textContent = ready;
  document.getElementById('metric-approval').textContent = approval;
  document.getElementById('metric-done').textContent = done;
}
function renderList(id, statuses) {
  const root = document.getElementById(id);
  root.innerHTML = '';
  state.items.filter(i => statuses.includes(i.status)).forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <h3>${item.title}</h3>
      <div class="meta">
        <span class="badge ${item.priority}">${item.priority}</span>
        <span class="badge">${item.type}</span>
      </div>
      <div class="small">${item.notes || ''}</div>
      <select data-id="${item.id}">
        <option value="todo" ${item.status==='todo'?'selected':''}>To Do</option>
        <option value="in-progress" ${item.status==='in-progress'?'selected':''}>In Progress</option>
        <option value="waiting" ${item.status==='waiting'?'selected':''}>Waiting Approval</option>
        <option value="ready" ${item.status==='ready'?'selected':''}>Ready to Post</option>
        <option value="done" ${item.status==='done'?'selected':''}>Done</option>
      </select>
    `;
    root.appendChild(div);
  });
}
function renderJobs() {
  const ul = document.getElementById('jobsList'); ul.innerHTML = '';
  state.jobs.forEach(j => {
    const li = document.createElement('div'); li.className='item'; li.innerHTML = `<h3>${j.time} — ${j.name}</h3><div class="small">${j.output}</div>`; ul.appendChild(li);
  });
}
function renderSchedule() {
  const ul = document.getElementById('scheduleList'); ul.innerHTML = '';
  state.schedule.forEach(s => { const li = document.createElement('div'); li.className='item'; li.textContent = s; ul.appendChild(li); });
}
function wireStatusChanges() {
  document.querySelectorAll('.item select').forEach(sel => {
    sel.addEventListener('change', e => {
      const item = state.items.find(i => i.id === e.target.dataset.id);
      if (!item) return;
      item.status = e.target.value;
      save(state); render();
    });
  });
}
function render() {
  metrics();
  renderList('todoList', ['todo']);
  renderList('inProgressList', ['in-progress']);
  renderList('waitingList', ['waiting']);
  renderList('readyDoneList', ['ready', 'done']);
  renderJobs();
  renderSchedule();
  wireStatusChanges();
}
document.getElementById('taskForm').addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  state.items.unshift({
    id: crypto.randomUUID(),
    title: fd.get('title'),
    type: fd.get('type'),
    priority: fd.get('priority'),
    status: fd.get('status'),
    notes: fd.get('notes')
  });
  save(state); e.target.reset(); render();
});
document.getElementById('seedBtn').addEventListener('click', seedDemo);
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Reset Mission Control local data on this device?')) return;
  state = structuredClone(defaultData); save(state); render();
});
render();
