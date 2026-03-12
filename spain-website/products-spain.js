const state = {
  items: [],
  visible: 6,
  filter: 'all',
  search: '',
};

const sampleData = [
{
id: 'talgo-01',
title: 'Talgo High-Speed Trains',
category: 'mobility',
tags: ['talgo','rail','transport'],
image: 'talgo.webp',
short: 'Spain’s innovative high-speed rail engineering.',
long: 'Talgo develops lightweight train technology used across Europe. Their trains are known for efficiency, comfort, and advanced suspension systems.'
},
{
id: 'indra-01',
title: 'Indra Defense & Smart Systems',
category: 'ai',
tags: ['defense','ai','systems'],
image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop',
short: 'Advanced simulation, radar and AI systems.',
long: 'Indra is one of Spain’s largest technology companies specializing in defense systems, air traffic control, and AI-driven infrastructure.'
},
{
id: 'telefonica-01',
title: 'Telefónica Digital Networks',
category: 'consumer',
tags: ['telecom','5g','network'],
image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
short: '5G networks and digital infrastructure.',
long: 'Telefónica powers digital connectivity across Europe and Latin America through advanced fiber networks and 5G technologies.'
},
{
id: 'solar-01',
title: 'Solar Energy Innovations',
category: 'energy',
tags: ['solar','renewable','energy'],
image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=800&auto=format&fit=crop',
short: 'Spain leads in solar and renewable energy projects.',
long: 'Large-scale solar farms and smart energy grids help Spain become one of Europe’s leaders in renewable energy production.'
},
{
id: 'robot-01',
title: 'Industrial Robotics',
category: 'robotics',
tags: ['robotics','automation','industry'],
image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800&auto=format&fit=crop',
short: 'Automation used in manufacturing and automotive sectors.',
long: 'Spanish manufacturing industries use robotics for precision assembly, automotive production, and smart factories.'
},
{
id: 'cabify-01',
title: 'Smart Mobility Platforms',
category: 'mobility',
tags: ['mobility','transport','app'],
image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
short: 'Urban mobility technology and ride platforms.',
long: 'Companies like Cabify develop digital transport platforms connecting cities with sustainable ride-sharing solutions.'
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