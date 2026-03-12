const state = {
  items: [],
  visible: 6,
  filter: 'all',
  search: '',
};

const sampleData = [
  {
    id: 'robot-01',
    title: 'ASIMO-style Humanoid',
    category: 'robotics',
    tags: ['bipedal','service','research'],
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop',
    short: 'Interactive humanoid designed for assistance and research.',
    long: 'This demo showcases locomotion algorithms and natural interaction — voice + gesture. Works in indoor environments.'
  },
  {
    id: 'shinkansen-01',
    title: 'Maglev & High-speed Rail',
    category: 'mobility',
    tags: ['maglev','rail','transport'],
    image: 'train.jpg',
    short: 'Next-gen rails, maglev tests and smart stations.',
    long: 'High-speed rail networks and maglev projects reducing travel time. Integrates platform-level sensors and predictive maintenance.'
  },
  {
    id: 'ai-01',
    title: 'On-device AI Assistants',
    category: 'ai',
    tags: ['ai','nlp','edge'],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
    short: 'Privacy-first AI running on-device for translation and assistance.',
    long: 'Edge-optimized models for translation, handwriting recognition, and context-aware assistance without cloud dependency.'
  },
  {
    id: 'energy-01',
    title: 'Solar Smart Grids',
    category: 'energy',
    tags: ['solar','smart-grid','sustainability'],
    image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=800&auto=format&fit=crop',
    short: 'Microgrids and battery storage paired with predictive demand systems.',
    long: 'Distributed PV, fast battery swapping for EVs, and grid-level forecasting powered by machine learning.'
  },
  {
    id: 'consumer-01',
    title: 'Compact Consumer Electronics',
    category: 'consumer',
    tags: ['gadgets','design','miniaturization'],
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    short: 'Tiny cameras, high-efficiency batteries and minimal UX.',
    long: 'Japanese consumer tech focuses on longevity, repairability, and subtle design — micro-UX refined to delight.'
  },
  {
    id: 'robot-02',
    title: 'Industrial Robotic Arm',
    category: 'robotics',
    tags: ['arm','industry','automation'],
    image: 'robot.jpg',
    short: 'High-precision manipulators used in factories and cleanrooms.',
    long: 'Integration with vision systems and safety sensors provide collaborative operation with humans.'
  },
];

// initial render
window.addEventListener('DOMContentLoaded', () => {
  state.items = sampleData;
  initUI();
  renderCards();
  renderTimeline();
  animateStats();
});

function initUI(){
  const search = document.getElementById('search');
  const clearSearch = document.getElementById('clearSearch');
  const filter = document.getElementById('filterCategory');
  const loadMore = document.getElementById('loadMore');
  const themeBtn = document.getElementById('themeBtn');
  const range = document.getElementById('rangeInteraction');
  const downloadBtn = document.getElementById('downloadBtn');

  search.addEventListener('input', e => { state.search = e.target.value.trim().toLowerCase(); renderCards(); });
  clearSearch.addEventListener('click', () => { search.value=''; state.search=''; renderCards(); });
  filter.addEventListener('change', e => { state.filter = e.target.value; renderCards(); });
  loadMore.addEventListener('click', () => { state.visible += 6; renderCards(); });
  themeBtn.addEventListener('click', toggleTheme);
  range.addEventListener('input', (e)=>{ document.documentElement.style.setProperty('--interaction', e.target.value); });

  downloadBtn.addEventListener('click', ()=>{ alert('Assets are included in this demo. Copy the code or ask me to bundle into a zip.'); });

  // delegate card clicks
  document.body.addEventListener('click', (e)=>{
    const open = e.target.closest('[data-open]');
    if(open){ openModal(open.dataset.open); }

    const card = e.target.closest('.card.interactive');
    if(card){ openModal(card.dataset.id); }

    if(e.target.matches('[data-close]') || e.target.closest('[data-close]')){ closeModal(); }
  });

  // keyboard
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });

  // tilt effect
  delegateTilt();
}

function renderCards(){
  const container = document.getElementById('products');
  container.innerHTML='';

  const filtered = state.items.filter(item=>{
    if(state.filter!=='all' && item.category!==state.filter) return false;
    if(state.search){
      const hay = (item.title + ' ' + item.tags.join(' ') + ' ' + item.short).toLowerCase();
      return hay.includes(state.search);
    }
    return true;
  });

  const visible = filtered.slice(0, state.visible);

  visible.forEach(item=>{
    const el = document.createElement('article');
    el.className = 'card glass interactive tilt';
    el.dataset.id = item.id;

    el.innerHTML = `
      <div class="thumb"><img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy"/></div>
      <h3>${escapeHtml(item.title)}</h3>
      <div class="meta">${escapeHtml(item.short)}</div>
      <div class="tags">${item.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    `;

    // set transform responsiveness based on interaction range
    const interaction = document.getElementById('rangeInteraction')?.value || 70;
    el.dataset.interaction = interaction;

    container.appendChild(el);
  });

  // no results
  if(visible.length===0){
    container.innerHTML = '<div class="glass" style="padding:18px">No results — try another search or category.</div>';
  }

  // reattach tilt
  delegateTilt();
}

function renderTimeline(){
  const timeline = document.querySelector('.timeline');
  const events = [
    {year: 1964, title: 'Bullet train', desc: 'Shinkansen revolutionises rail travel.'},
    {year: 1970, title: 'Consumer electronics boom', desc: 'Miniaturisation and global exports.'},
    {year: 1990, title: 'Robotics in industry', desc: 'Industrial robotics become mainstream.'},
    {year: 2010, title: 'AI & mobile', desc: 'On-device capabilities improve dramatically.'},
    {year: 2023, title: 'Green energy push', desc: 'Microgrids and sustainability projects grow.'}
  ];

  timeline.innerHTML = events.map(ev=>`
    <div class="entry glass">
      <div class="year">${ev.year}</div>
      <div>
        <div class="title">${ev.title}</div>
        <div class="desc" style="color:var(--muted)">${ev.desc}</div>
      </div>
    </div>
  `).join('');
}

function openModal(id){
  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');
  modal.setAttribute('aria-hidden','false');

  // allow special demos by id
  if(id === 'robot'){
    content.innerHTML = `
      <h2>Robotics Demo — Live Preview</h2>
      <p class="sub">A short interactive animation controlled by JS.</p>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <div id="robotCanvas" style="width:320px;height:240px;border-radius:12px;background:linear-gradient(180deg,#08121a,#0b2230);display:flex;align-items:center;justify-content:center;">🤖</div>
        <div style="flex:1">
          <p style="color:var(--muted)">Use the slider to control arm speed (demo).</p>
          <input id="robotSpeed" type="range" min="10" max="100" value="50" />
        </div>
      </div>
    `;

    // small demo: animate emoji
    requestAnimationFrame(()=>robotDemo());
  } else {
    const item = state.items.find(i=>i.id===id);
    if(item){
      content.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start">
          <div><img src="${item.image}" alt="${escapeHtml(item.title)}" style="width:100%;height:220px;object-fit:cover;border-radius:10px"/></div>
          <div>
            <h2>${escapeHtml(item.title)}</h2>
            <p style="color:var(--muted)">${escapeHtml(item.long)}</p>
            <div style="margin-top:10px"><strong>Tags:</strong> ${item.tags.map(t=>`<span class="tag" style="margin-left:6px">${t}</span>`).join('')}</div>
            <div style="margin-top:12px;display:flex;gap:8px">
              <button class="btn primary" onclick="alert('Simulated demo started')">Run Demo</button>
              <button class="btn ghost" onclick="navigator.clipboard?.writeText(location.href+'#'+encodeURIComponent('${item.id}'))">Copy Link</button>
            </div>
          </div>
        </div>
      `;
    } else {
      content.innerHTML = `<div>Demo not found.</div>`;
    }
  }
}

function closeModal(){
  const modal = document.getElementById('modal');
  modal.setAttribute('aria-hidden','true');
  document.getElementById('modalContent').innerHTML = '';
}

// simple robot emoji animation demo
let robotAnim;
function robotDemo(){
  const canvas = document.getElementById('robotCanvas');
  const speedInput = document.getElementById('robotSpeed');
  if(!canvas) return;
  let angle = 0;
  cancelAnimationFrame(robotAnim);
  function step(){
    const v = speedInput?.value || 50;
    angle += (v/2000);
    canvas.style.transform = `rotate(${Math.sin(angle)*6}deg)`;
    robotAnim = requestAnimationFrame(step);
  }
  step();
}

// tiny tilt delegate
function delegateTilt(){
  const cards = document.querySelectorAll('.tilt');
  cards.forEach(card=>{
    card.addEventListener('pointermove', onTilt);
    card.addEventListener('pointerleave', onTiltReset);
  });
}

function onTilt(e){
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  const ix = (el.dataset.interaction || 70) / 100;
  const rx = (y - 0.5) * 12 * ix/1;
  const ry = (x - 0.5) * -12 * ix/1;
  el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
}

function onTiltReset(e){
  const el = e.currentTarget;
  el.style.transform = '';
}

// simple stat counting
function animateStats(){
  document.querySelectorAll('.stat .num').forEach(el=>{
    const target = +el.dataset.count || 0; let cur=0; const step= Math.max(1, Math.round(target/60));
    const id = setInterval(()=>{ cur+=step; if(cur>=target){ el.textContent = target; clearInterval(id);} else el.textContent = cur; }, 16);
  });
}

function toggleTheme(){
  const root = document.documentElement;
  const current = root.getAttribute('data-theme');
  if(current==='light'){ root.removeAttribute('data-theme'); } else { root.setAttribute('data-theme','light'); }
}

function escapeHtml(s){ return (s+'').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" })[c]); }