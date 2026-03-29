const STORAGE_KEY = 'ncs-mission-control-v3';

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
  miniMovies: [
    {
      id: crypto.randomUUID(),
      title: 'The Night-Before Glow',
      duration: '24 sec concept',
      format: 'Mini-movie reel',
      status: 'Ready to storyboard',
      lead: 'Event prep / bridal',
      hook: 'The camera tracks one client from stress to soft-focus confidence in under 24 seconds.',
      logline: 'A night-before treatment story that turns pre-event nerves into luminous, camera-ready calm.',
      visualHook: 'Champagne lighting, vanity reflections, treatment closeups, silk robe exit shot.',
      cta: 'DM “glow plan”',
      beats: [
        'Cold open: text on mirror — “Big day tomorrow?”',
        'Treatment beat: Hydrafacial serum sweep + LED glow pulse',
        'Final frame: client catches her reflection, then smiles into soft flash'
      ]
    },
    {
      id: crypto.randomUUID(),
      title: 'Booked by Monday',
      duration: '18 sec concept',
      format: 'Mini-movie sequence',
      status: 'Ready to package',
      lead: 'Gap-fill offer',
      hook: 'Fast-cut micro story showing how one open slot becomes a booked treatment before lunch.',
      logline: 'A cinematic appointment-fill concept built around urgency, confidence, and one clean CTA.',
      visualHook: 'Mission-control UI overlays, notification pop, polished desk-to-treatment transition.',
      cta: 'Tap to claim the opening',
      beats: [
        'Open slot flashes on-screen with luxe gold outline',
        'Story card rolls into a DM inquiry and instant confirmation',
        'End frame: treatment room ready, “one opening left today”'
      ]
    },
    {
      id: crypto.randomUUID(),
      title: 'Skin, In Three Acts',
      duration: '21 sec concept',
      format: 'Mini-movie carousel/reel hybrid',
      status: 'Awaiting Natalie',
      lead: 'Corrective education',
      hook: 'Beginning, middle, glow-up: a skin journey framed like a prestige teaser trailer.',
      logline: 'An elevated before-during-after narrative that makes corrective care feel intentional instead of intimidating.',
      visualHook: 'Three-panel act cards, subtle grain, calm voiceover captions, ingredient textures.',
      cta: 'Book a corrective consult',
      beats: [
        'Act I: “When your skin starts asking for more”',
        'Act II: peel strategy + calm education overlay',
        'Act III: restored confidence with polished post-treatment closeup'
      ]
    },
    {
      id: crypto.randomUUID(),
      title: 'The Reset Window',
      duration: '15 sec concept',
      format: 'Mini-movie reel',
      status: 'Ready to storyboard',
      lead: 'Hydrafacial hero',
      hook: 'A single afternoon slot becomes a full sensory reset: water, light, and skin texture doing the talking.',
      logline: 'Minimal dialogue, maximum atmosphere — a pure mood-piece that sells the feeling of a Hydrafacial reset.',
      visualHook: 'Macro hydration textures, glass reflections, creamy neutral gradients, close crop skin detail.',
      cta: 'Reserve your reset',
      beats: [
        'Open on city-noise text, then cut to silence inside the studio',
        'Hydration pass, extractions, LED finish in rhythmic cuts',
        'End title: “Come back to yourself in one appointment.”'
      ]
    },
    {
      id: crypto.randomUUID(),
      title: 'After Yes',
      duration: '20 sec concept',
      format: 'Mini-movie story arc',
      status: 'Ready to package',
      lead: 'Bridal runway',
      hook: 'This starts the second the ring goes on — and follows the skin plan that gets her to the aisle glowing.',
      logline: 'A bridal prep teaser told like a romance trailer, built to sell long-tail treatment planning.',
      visualHook: 'Ring closeup, timeline cards, consultation notes, luminous finish shot with veil-white palette.',
      cta: 'Ask for the bridal timeline',
      beats: [
        'Inciting moment: hand reveal + “after yes comes the plan”',
        'Timeline montage: consult, Hydrafacial, peel, maintenance touchpoint',
        'Final beat: wedding-week glow framed like the final scene'
      ]
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
      caption: 'Glowing, refreshed skin does not always need more products — it may just need the right treatment. Our Hydrafacial is one of our favorite ways to help skin look smoother, more hydrated, and event-ready with that fresh glow everyone asks for. If your skin has been feeling dull, congested, or just in need of a reset, this is a beautiful place to start. ✨\n\nBook your glow reset at NCS Aesthetics.',
      cta: 'Book your glow reset',
      status: 'ready',
      visual: 'Hydrafacial glow · champagne cream backdrop · radiant skin closeup',
      cover: 'Glow reset',
      postText: 'Hydrated. Refreshed. Radiant.',
      notes: 'Use polished treatment footage + water/serum texture clips.'
    },
    {
      title: 'Why Hydrafacial is a hero service carousel',
      format: 'Carousel',
      hook: 'Why Hydrafacial stays one of our most requested treatments.',
      caption: 'There is a reason Hydrafacial stays one of our most-loved treatments. It is a beautiful option when your goal is skin that feels cleaner, smoother, more hydrated, and visibly refreshed. We love it for glow maintenance, event prep, and those moments when your skin just feels off and needs support.\n\nReserve your Hydrafacial this week if your skin is ready for a reset.',
      cta: 'Reserve your Hydrafacial this week',
      status: 'ready',
      visual: 'Clinical results made elegant · polished slides · soft gold accents',
      cover: 'Why clients love Hydrafacial',
      postText: 'Glow • hydration • smoother-looking skin',
      notes: 'Carousel slides: glow, hydration, event prep, maintenance, CTA.'
    },
    {
      title: 'Not sure what to book? story set',
      format: 'Story Set',
      hook: 'If you are not sure what your skin needs, start here.',
      caption: 'If you have ever looked at a treatment menu and thought “I have no idea what to book,” you are not alone. That is exactly why we love starting unsure clients with a custom facial. It gives us room to look at what your skin needs right now and tailor the experience from there.\n\nStart with a custom facial and let us guide you.',
      cta: 'Start with a custom facial',
      status: 'ready',
      visual: 'Q&A stories · elevated neutral backgrounds · easy choice framing',
      cover: 'Not sure what to book?',
      postText: 'Start with the treatment that meets your skin where it is.',
      notes: 'Story frames: unsure → custom facial → tailored plan → booking CTA.'
    },
    {
      title: 'Circadia day + night skin education carousel',
      format: 'Carousel',
      hook: 'Your skin has different needs by day and by night.',
      caption: 'Your skin is not doing the same job all day long. During the day, it is working to protect itself. At night, it shifts into repair and recovery mode. That is one of the reasons we love Circadia’s approach — it is built around supporting the skin’s natural rhythm instead of fighting it.\n\nBuild a routine that works with your skin, not against it.',
      cta: 'Build a routine that works with your skin',
      status: 'ready',
      visual: 'Split day/night design · sun/moon motif · science + nature tone',
      cover: 'Day skin vs night skin',
      postText: 'Protect by day. Repair by night.',
      notes: 'Educational carousel with simple day/night language and retail CTA.'
    },
    {
      title: 'Bridal prep timeline reel',
      format: 'Reel',
      hook: 'Wedding skin prep works better when you do not wait until the last minute.',
      caption: 'If your wedding or a big event is coming up, your skin prep should feel intentional — not rushed. A thoughtful treatment timeline gives your skin time to respond, glow, and stay balanced leading into the day you want to feel your absolute best.\n\nDM us “bridal glow” if you want help mapping out your prep.',
      cta: 'DM bridal glow',
      status: 'ready',
      visual: 'Bridal whites · luxury prep timeline · polished clinic footage',
      cover: 'Bridal prep timeline',
      postText: 'Do not wait until the week of.',
      notes: 'Use bridal prep timeline text overlays + treatment footage.'
    },
    {
      title: 'Chemical peel myth-busting reel',
      format: 'Reel',
      hook: 'A peel should feel strategic, not scary.',
      caption: 'One of the biggest misconceptions about peels is that they have to feel aggressive to be effective. The truth is, a peel should be selected thoughtfully, guided professionally, and matched to what your skin can actually benefit from.\n\nIf you have been curious about peels but hesitant, book a corrective consultation and let’s talk about what makes sense for your skin.',
      cta: 'Book your corrective consultation',
      status: 'ready',
      visual: 'Corrective skincare tone · calm educational lower thirds',
      cover: 'Peel myth: it has to be scary',
      postText: 'Strategic > aggressive.',
      notes: 'Calm educational reel, no fear-based language.'
    },
    {
      title: 'Monthly maintenance reminder story pack',
      format: 'Story Set',
      hook: 'Great skin usually comes from consistency, not one random appointment.',
      caption: 'Skin goals are usually built through consistency. One treatment can be a great reset, but maintenance is what helps you stay on track over time. If you love how your skin feels after a treatment, the next step is keeping that momentum going.\n\nRebook your next treatment and stay consistent with your skin goals.',
      cta: 'Rebook your next treatment',
      status: 'ready',
      visual: 'Soft mauve stories · maintenance messaging · simple booking prompt',
      cover: 'Consistency changes skin',
      postText: 'Maintenance is the magic.',
      notes: 'Simple rebook story flow with soft luxury tone.'
    },
    {
      title: 'Circadia hydration feature post',
      format: 'Carousel',
      hook: 'Hydrated skin looks healthier, calmer, and more radiant.',
      caption: 'When skin is dehydrated, it can feel tight, dull, reactive, and harder to balance. Hydration support matters because calm, comfortable skin tends to look smoother, fresher, and more radiant. This is one of the reasons we love hydration-focused care and thoughtful homecare support.\n\nAsk about homecare support if your skin has been feeling dry or depleted.',
      cta: 'Ask about homecare support',
      status: 'ready',
      visual: 'Hydration focus · glossy closeups · product support angle',
      cover: 'Why hydration matters',
      postText: 'Calm skin. Fresh glow. Better balance.',
      notes: 'Use hydration textures and elevated product visuals.'
    },
    {
      title: 'Event-ready skin fast carousel',
      format: 'Carousel',
      hook: 'Need your skin to look fresh for an event this week?',
      caption: 'If you have something coming up and want your skin to look refreshed, smooth, and glowing, the right treatment can make a big difference. We love helping clients get event-ready in a way that feels polished, intentional, and realistic for their timeline.\n\nReserve your event-ready treatment while openings are available.',
      cta: 'Reserve your event-ready treatment',
      status: 'ready',
      visual: 'Event prep aesthetic · luxe neutrals · before-event confidence',
      cover: 'Event this week?',
      postText: 'Fresh, polished, event-ready skin.',
      notes: 'Use event-prep urgency without sounding discount-heavy.'
    },
    {
      title: 'Personalized luxury care brand post',
      format: 'Brand Post',
      hook: 'Luxury skincare should still feel personal.',
      caption: 'We believe great skincare should feel elevated, thoughtful, and tailored — never rushed and never one-size-fits-all. The goal is not just a beautiful treatment in the moment, but a level of care that helps you feel understood, supported, and confident in your skin over time.\n\nBook your appointment at NCS Aesthetics and let your skin experience personalized luxury care.',
      cta: 'Book your appointment at NCS Aesthetics',
      status: 'ready',
      visual: 'Founder-led trust post · premium but warm visual language',
      cover: 'Luxury, but personal',
      postText: 'Tailored care. Elevated results.',
      notes: 'Use brand photography / Natalie / studio atmosphere.'
    }
  ]
};

function cloneDefault() {
  return JSON.parse(JSON.stringify(defaultData));
}

function migrateData(data) {
  if (!data || typeof data !== 'object') return cloneDefault();
  const merged = { ...cloneDefault(), ...data };
  if (!Array.isArray(merged.miniMovies) || merged.miniMovies.length === 0) {
    merged.miniMovies = cloneDefault().miniMovies;
  }
  return merged;
}

function load() {
  try {
    return migrateData(JSON.parse(localStorage.getItem(STORAGE_KEY)));
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

function renderMiniMovies() {
  const miniMovies = state.miniMovies || [];
  document.getElementById('miniMovieCount').textContent = `${miniMovies.length} concepts loaded`;
  document.getElementById('miniMovieGrid').innerHTML = miniMovies.length
    ? miniMovies.map((movie, index) => `
      <article class="mini-movie-card">
        <div class="mini-movie-stage">
          <div class="mini-movie-stage-topline">
            <span class="mini-movie-index">0${index + 1}</span>
            <span class="mini-movie-duration">${movie.duration}</span>
          </div>
          <div>
            <p class="mini-movie-lead">${movie.lead}</p>
            <h3>${movie.title}</h3>
            <p class="mini-movie-hook">${movie.hook}</p>
          </div>
          <div class="mini-movie-visual">${movie.visualHook}</div>
        </div>
        <div class="mini-movie-meta">
          <div class="mini-topline">
            <strong>${movie.format}</strong>
            <span>${movie.status}</span>
          </div>
          <p>${movie.logline}</p>
          <div class="mini-movie-beats">
            ${movie.beats.map((beat, beatIndex) => `
              <div class="beat-chip">
                <span>${beatIndex + 1}</span>
                <p>${beat}</p>
              </div>
            `).join('')}
          </div>
          <div class="mini-movie-footer">
            <span class="pill muted">CTA</span>
            <strong>${movie.cta}</strong>
          </div>
        </div>
      </article>
    `).join('')
    : '<div class="empty">No mini-movie concepts loaded yet.</div>';
}

function movieHref(title) {
  const map = {
    'Hydrafacial glow reset reel': 'movies/night-before-glow.html',
    'Why Hydrafacial is a hero service carousel': 'movies/booked-by-monday.html',
    'Not sure what to book? story set': 'movies/skin-in-three-acts.html',
    'Circadia day + night skin education carousel': 'movies/reset-window.html',
    'Bridal prep timeline reel': 'movies/after-yes.html'
  };
  return map[title] || null;
}

function renderPreviews() {
  const previews = (state.previews || []).filter((preview) => preview.status === 'ready');
  document.getElementById('previewCount').textContent = `${previews.length} ready to preview`;
  document.getElementById('previewGallery').innerHTML = previews.length
    ? previews.map((preview) => {
      const movie = movieHref(preview.title);
      return `
      <article class="preview-card ${preview.status}">
        <div class="preview-canvas">
          <div class="preview-badge">${preview.format}</div>
          <div class="preview-cover">${preview.cover || preview.title}</div>
          <div class="preview-hook">${preview.hook}</div>
          <div class="preview-body-copy">${preview.postText || preview.caption}</div>
          <div class="preview-visual">${preview.visual}</div>
        </div>
        <div class="preview-meta">
          <div class="mini-topline"><strong>${preview.title}</strong><span>${statusLabel(preview.status)}</span></div>
          <p class="caption-label">Caption</p>
          <p>${preview.caption}</p>
          <div class="preview-cta">CTA: ${preview.cta}</div>
          <div class="preview-notes">Posting notes: ${preview.notes || 'Ready to schedule.'}</div>
          ${movie ? `<a class="movie-link" href="${movie}" target="_blank" rel="noopener">Open animated movie</a>` : ''}
        </div>
      </article>`;
    }).join('')
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
  renderMiniMovies();
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
