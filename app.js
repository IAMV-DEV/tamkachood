(() => {
  'use strict';

  /* ---------- ชื่อโต๊ะจาก QR Code (URL: ?table=T01) ---------- */
  const TABLE = new URLSearchParams(location.search).get('table') || 'T01';
  const tableLabel = TABLE;            // แสดงเฉพาะรหัสโต๊ะ เช่น T01
  const tableFull = 'โต๊ะ ' + TABLE;   // ใช้ในประโยค เช่น "มาที่โต๊ะ T01"

  /* ---------- ชื่อลูกค้า (A, B, C) ---------- */
  const CUSTOMER = 'A';

  /* ---------- Data (จากภาพหน้าจอ) ---------- */
  const CATEGORIES = ['ตำ', 'ต้ม', 'ยำ', 'ย่าง', 'ทอด', 'ผัด', 'ลาบ', 'เครื่องดื่ม', 'ข้าว', 'ทานเล่น'];

  /* กลุ่มตัวเลือก (Option) */
  const OPTION_GROUPS = {
    spicy: {
      name: 'ระดับความเผ็ด', type: 'single', max: 1,
      choices: [{ name: 'เผ็ดน้อย' }, { name: 'เผ็ดกลาง' }, { name: 'เผ็ดมาก' }, { name: 'ไม่เผ็ด' }],
    },
    /* ขนาดหม้อ (เล็ก/ใหญ่) สำหรับเมนูต้ม ตามราคาในภาพเมนู */
    size100: {
      name: 'ขนาด', type: 'single', max: 1,
      choices: [{ name: 'หม้อเล็ก' }, { name: 'หม้อใหญ่', price: 100 }],
    },
    size140: {
      name: 'ขนาด', type: 'single', max: 1,
      choices: [{ name: 'หม้อเล็ก' }, { name: 'หม้อใหญ่', price: 140 }],
    },
    size150: {
      name: 'ขนาด', type: 'single', max: 1,
      choices: [{ name: 'หม้อเล็ก' }, { name: 'หม้อใหญ่', price: 150 }],
    },
    size170: {
      name: 'ขนาด', type: 'single', max: 1,
      choices: [{ name: 'หม้อเล็ก' }, { name: 'หม้อใหญ่', price: 170 }],
    },
    /* น้ำหนักกุ้งแม่น้ำ คิดตามน้ำหนัก */
    prawn: {
      name: 'น้ำหนัก', type: 'single', max: 1,
      choices: [{ name: 'ครึ่งกิโลกรัม' }, { name: 'หนึ่งกิโลกรัม', price: 350 }],
    },
    meat: {
      name: 'เนื้อสัตว์', type: 'multi',
      choices: [
        { name: 'กุ้ง', price: 100 }, { name: 'หมึก', price: 80 }, { name: 'แมงกะพรุน', price: 80 },
        { name: 'ไข่แดงเค็ม', price: 50 }, { name: 'เล็บมือนาง', price: 60 }, { name: 'แคบหมู', price: 40 },
        { name: 'ไข่ปู', price: 40 }, { name: 'หมูกรอบ', price: 80 }, { name: 'หอยแครง', price: 80 },
      ],
    },
  };

  const MENU = [
    { id: 'yum-woonsen', name: 'ยำวุ้นเส้นหมูสับโบราณ', price: 150, cat: 'ยำ', img: 'img/yum-woonsen.jpg', options: ['spicy', 'meat'] },
    { id: 'namtok-kor-moo', name: 'น้ำตกคอหมูย่าง', price: 140, cat: 'ยำ', img: 'img/namtok-kor-moo.jpg', options: ['spicy'] },
    { id: 'kor-moo-yang', name: 'คอหมูย่าง', price: 140, cat: 'ย่าง', img: 'img/kor-moo-yang.jpg' },
    { id: 'ribs', name: 'ซี่โครงหมูย่าง', price: 180, cat: 'ย่าง', img: 'img/ribs.jpg' },
    { id: 'pork-tongue', name: 'ลิ้นหมูย่าง', price: 150, cat: 'ย่าง', img: 'img/pork-tongue.jpg' },
    { id: 'beef-tongue', name: 'ลิ้นเนื้อย่าง', price: 160, cat: 'ย่าง', img: 'img/beef-tongue.jpg' },
    { id: 'moo-yang', name: 'หมูย่าง', price: 130, cat: 'ย่าง', img: 'img/moo-yang.jpg' },
    { id: 'beer', name: 'เบียร์สดสิงห์ เหยือก', price: 190, cat: 'เครื่องดื่ม', img: 'img/beer.jpg' },
    { id: 'coke', name: 'โค้กใหญ่', price: 50, cat: 'เครื่องดื่ม', img: 'img/coke.jpg', fit: 'contain' },
    { id: 'fanta-red', name: 'Fanta แดง', price: 20, cat: 'เครื่องดื่ม', img: 'img/fanta-red.jpg', fit: 'dark' },
    { id: 'fanta-green', name: 'Fanta เขียว', price: 20, cat: 'เครื่องดื่ม', img: 'img/fanta-green.jpg', fit: 'dark' },
    { id: 'fanta-orange', name: 'Fanta ส้ม', price: 20, cat: 'เครื่องดื่ม', img: 'img/fanta-orange.jpg', fit: 'dark' },
    /* ---------- หมวดทอด (จากภาพเมนู) ---------- */
    { id: 'fries', name: 'เฟรนช์ฟรายส์', price: 100, cat: 'ทอด', img: 'img/fries.jpg' },
    { id: 'pla-krapong-tod-nam-pla', name: 'ปลากระพงทอดน้ำปลา', price: 450, cat: 'ทอด', img: 'img/pla-krapong-tod-nam-pla.jpg', fit: 'contain' },
    { id: 'pla-thapthim-lui-suan', name: 'ปลาทับทิมลุยสวน', price: 380, cat: 'ทอด', img: 'img/pla-thapthim-lui-suan.jpg', fit: 'contain' },
    { id: 'sai-krok-isan-tod', name: 'ไส้กรอกอีสานทอด', price: 150, cat: 'ทอด', img: 'img/sai-krok-isan-tod.jpg', fit: 'contain' },
    { id: 'moo-sam-chan-tod-nam-pla', name: 'หมูสามชั้นทอดน้ำปลา', price: 150, cat: 'ทอด', img: 'img/moo-sam-chan-tod-nam-pla.jpg', fit: 'contain' },
    { id: 'goong-foi-chup-paeng-tod', name: 'กุ้งฝอยชุบแป้งทอด', price: 180, cat: 'ทอด', img: 'img/goong-foi-chup-paeng-tod.jpg', fit: 'contain' },
    { id: 'tod-man-goong', name: 'ทอดมันกุ้ง', price: 140, cat: 'ทอด', img: 'img/tod-man-goong.jpg', fit: 'contain' },
    { id: 'kop-tod-kraitiam', name: 'กบทอดกระเทียม', price: 150, cat: 'ทอด', img: 'img/kop-tod-kraitiam.jpg', fit: 'contain' },
    { id: 'neua-daet-diao-tod', name: 'เนื้อแดดเดียวทอด', price: 150, cat: 'ทอด', img: 'img/neua-daet-diao-tod.jpg', fit: 'contain' },
    { id: 'peek-kai-tod', name: 'ปีกไก่ทอด', price: 120, cat: 'ทอด', img: 'img/peek-kai-tod.jpg', fit: 'contain' },
    { id: 'en-kai-tod', name: 'เอ็นไก่ทอด', price: 130, cat: 'ทอด', img: 'img/en-kai-tod.jpg', fit: 'contain' },
    { id: 'pak-ped-tod', name: 'ปากเป็ดทอด', price: 150, cat: 'ทอด', img: 'img/pak-ped-tod.jpg', fit: 'contain' },
    { id: 'hoy-jo', name: 'จ๊อปูก้อน', price: 200, cat: 'ทอด', img: 'img/hoy-jo.jpg' },
    /* ---------- หมวดตำ (จากภาพเมนู) ---------- */
    { id: 'tam-kor-moo', name: 'ตำคอหมูย่าง', price: 180, cat: 'ตำ', img: 'img/tam-kor-moo.jpg', options: ['spicy'] },
    { id: 'tam-moo-yor', name: 'ตำหมูยอ', price: 95, cat: 'ตำ', img: 'img/tam-moo-yor.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-lai-bua-hoi-kraeng', name: 'ตำไหลบัวหอยแครง', price: 180, cat: 'ตำ', img: 'img/tam-lai-bua-hoi-kraeng.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-hoi-kraeng', name: 'ตำหอยแครง', price: 160, cat: 'ตำ', img: 'img/tam-hoi-kraeng.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-poo-ma', name: 'ตำปูม้า', price: 180, cat: 'ตำ', img: 'img/tam-poo-ma.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-lai-bua-goong-sod', name: 'ตำไหลบัวกุ้งสด', price: 160, cat: 'ตำ', img: 'img/tam-lai-bua-goong-sod.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-tua', name: 'ตำถั่ว', price: 75, cat: 'ตำ', img: 'img/tam-tua.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-luang-prabang', name: 'ตำหลวงพระบาง', price: 75, cat: 'ตำ', img: 'img/tam-luang-prabang.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-lai-bua', name: 'ตำไหลบัว', price: 85, cat: 'ตำ', img: 'img/tam-lai-bua.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-goong-sod', name: 'ตำกุ้งสด', price: 160, cat: 'ตำ', img: 'img/tam-goong-sod.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-hoi-khong', name: 'ตำหอยโข่ง', price: 150, cat: 'ตำ', img: 'img/tam-hoi-khong.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-krachoot-baan-na', name: 'ตำกระฉูดบ้านนา', price: 260, cat: 'ตำ', img: 'img/tam-krachoot-baan-na.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-pa', name: 'ตำป่า', price: 75, cat: 'ตำ', img: 'img/tam-pa.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-poo-pla-ra', name: 'ตำปูปลาร้า', price: 70, cat: 'ตำ', img: 'img/tam-poo-pla-ra.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-poo', name: 'ตำปู', price: 70, cat: 'ตำ', img: 'img/tam-poo.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-taeng', name: 'ตำแตง', price: 70, cat: 'ตำ', img: 'img/tam-taeng.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-mamuang', name: 'ตำมะม่วง', price: 70, cat: 'ตำ', img: 'img/tam-mamuang.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tam-sen-lek', name: 'ตำเส้นเล็ก', price: 140, cat: 'ตำ', img: 'img/tam-sen-lek.jpg', fit: 'contain', options: ['spicy'] },
    /* ---------- หมวดต้ม (จากภาพเมนู) ---------- */
    { id: 'gaeng-hed', name: 'แกงเห็ด', price: 150, cat: 'ต้ม', img: 'img/gaeng-hed.jpg', fit: 'contain', options: ['size150'] },
    { id: 'super-kha-kai', name: 'ซุปเปอร์ขาไก่', price: 150, cat: 'ต้ม', img: 'img/super-kha-kai.jpg', fit: 'contain', options: ['size140'] },
    { id: 'kai-tai-nam', name: 'ไก่ใต้น้ำ', price: 140, cat: 'ต้ม', img: 'img/kai-tai-nam.jpg', fit: 'contain', options: ['spicy'] },
    { id: 'tom-saep-kraduk-kaew-moo', name: 'ต้มแซ่บกระดูกแก้วหมู', price: 140, cat: 'ต้ม', img: 'img/tom-saep-kraduk-kaew-moo.jpg', fit: 'contain', options: ['spicy', 'size140'] },
    { id: 'tom-saep-en-kaew-neua', name: 'ต้มแซ่บเอ็นแก้วเนื้อ', price: 150, cat: 'ต้ม', img: 'img/tom-saep-en-kaew-neua.jpg', fit: 'contain', options: ['spicy', 'size150'] },
    { id: 'tom-yum-pla-kot', name: 'ต้มยำปลากด', price: 140, cat: 'ต้ม', img: 'img/tom-yum-pla-kot.jpg', fit: 'contain', options: ['spicy', 'size140'] },
    { id: 'tom-yum-pla-khang', name: 'ต้มยำปลาคัง', price: 180, cat: 'ต้ม', img: 'img/tom-yum-pla-khang.jpg', fit: 'contain', options: ['spicy', 'size170'] },
    { id: 'gaeng-om-moo', name: 'แกงอ่อมหมู', price: 150, cat: 'ต้ม', img: 'img/gaeng-om-moo.jpg', fit: 'contain', options: ['size150'] },
    { id: 'tom-yum-goong-mae-nam', name: 'ต้มยำกุ้งแม่น้ำ (คิดตามน้ำหนัก)', price: 450, cat: 'ต้ม', img: 'img/tom-yum-goong-mae-nam.jpg', fit: 'contain', options: ['spicy', 'prawn'] },
    { id: 'tom-yum-ruam', name: 'ต้มยำรวม', price: 180, cat: 'ต้ม', img: 'img/tom-yum-ruam.jpg', fit: 'contain', options: ['spicy', 'size140'] },
    { id: 'tom-yum-kai-baan', name: 'ต้มยำไก่บ้าน', price: 140, cat: 'ต้ม', img: 'img/tom-yum-kai-baan.jpg', fit: 'contain', options: ['spicy', 'size100'] },
    { id: 'squid', name: 'หมึกไข่ผัดน้ำดำ', price: 200, cat: 'ผัด', img: 'img/squid.jpg' },
    { id: 'larb-moo', name: 'ลาบหมู', price: 120, cat: 'ลาบ', img: 'img/larb-moo.jpg', options: ['spicy'] },
  ];
  const byId = Object.fromEntries(MENU.map(m => [m.id, m]));

  /* ---------- State ---------- */
  let cart = [];          // {key, id, qty, note}
  let orders = [          // ตัวอย่างรายการที่สั่งไว้แล้ว
    { id: 'beer', qty: 1, note: '', by: 'A', status: 'cooking' },
    { id: 'larb-moo', qty: 1, note: '', by: 'A', status: 'cooking' },
    { id: 'squid', qty: 1, note: '', by: 'A', status: 'cooking' },
    { id: 'hoy-jo', qty: 1, note: '', by: 'A', status: 'cooking' },
    { id: 'coke', qty: 1, note: '', by: 'B', status: 'cancelled' },
  ];
  orders.forEach(o => { o.opts = o.opts || {}; });
  let billCalled = false;
  let ordersTime = new Date();
  let activeCat = CATEGORIES[0];
  let catOrder = [...CATEGORIES];   // ลำดับการแสดงผลหมวดหมู่ (หมวดที่เลือกจะถูกดึงขึ้นมาติดบนสุด)
  let editing = null;      // {mode:'new'|'edit', id, key, qty}
  let seenOrders = false;

  /* ---------- Helpers ---------- */
  const $ = s => document.querySelector(s);
  const baht = (n, dec = true) => '฿' + n.toLocaleString('en-US', { minimumFractionDigits: dec ? 2 : 0, maximumFractionDigits: dec ? 2 : 0 });
  const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const timeStr = d => d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
  const imageSrc = m => m.img.replace('img/', 'img/webp/').replace('.jpg', '.webp');
  const thumb = (m, priority = false) => `<div class="thumb ${m.fit || ''}"><img src="${imageSrc(m)}" alt="" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>`;
  const optExtra = (opts = {}) => Object.entries(opts).reduce((a, [g, idxs]) =>
    a + idxs.reduce((b, i) => b + (OPTION_GROUPS[g].choices[i].price || 0), 0), 0);
  const unitPrice = x => byId[x.id].price + optExtra(x.opts);
  const optLabel = (opts = {}) => Object.entries(opts).flatMap(([g, idxs]) =>
    idxs.map(i => { const c = OPTION_GROUPS[g].choices[i]; return c.price ? `${c.name} (+${c.price})` : c.name; })).join(', ');
  const optKey = (opts = {}) => JSON.stringify(Object.keys(opts).sort().map(k => [k, [...opts[k]].sort()]));
  const cartQtyOf = id => cart.filter(c => c.id === id).reduce((a, c) => a + c.qty, 0);
  const cartCount = () => cart.reduce((a, c) => a + c.qty, 0);
  const cartTotal = () => cart.reduce((a, c) => a + c.qty * unitPrice(c), 0);
  const STATUS = { sent: 'ส่งแล้ว', cooking: 'กำลังทำ', served: 'เสิร์ฟแล้ว', cancelled: 'ยกเลิก' };

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  const views = ['#dialog', '#catSheet', '#itemView', '#paidView', '#checkView', '#billView', '#ordersView', '#cartView', '#searchView'];
  const returnFocus = new WeakMap();
  const activeView = () => views.map($).find(v => !v.hidden);
  function syncViews() {
    const active = activeView();
    document.body.classList.toggle('has-overlay', Boolean(active));
    for (const part of document.querySelectorAll('.skip-link,.topbar,.tabs,.menu,.cartbar-wrap,.locked-banner')) part.inert = Boolean(active);
    for (const view of views.map($)) {
      const current = view === active;
      view.inert = !current;
      (view.querySelector('[role="alertdialog"]') || view).setAttribute('aria-modal', String(current));
    }
    return active;
  }
  function focusView(view) {
    const target = view.querySelector('#searchInput, .page-head button, #catClose, #itemClose, .dlg-actions button');
    view.tabIndex = -1;
    (target || view).focus({ preventScroll: true });
  }
  function show(sel) {
    const view = $(sel);
    if (!views.includes(sel)) { view.hidden = false; return; }
    if (view.hidden) returnFocus.set(view, document.activeElement);
    view.hidden = false;
    if (syncViews() === view) focusView(view);
  }
  function hide(sel) {
    const view = $(sel);
    if (!views.includes(sel)) { view.hidden = true; return; }
    const wasActive = activeView() === view;
    view.hidden = true;
    const active = syncViews();
    if (!wasActive) return;
    const previous = returnFocus.get(view);
    if (previous?.isConnected && !previous.closest('[hidden], [inert]')) previous.focus({ preventScroll: true });
    else if (active) focusView(active);
    else $('#menu').focus({ preventScroll: true });
  }

  /* ---------- Menu rendering ---------- */
  function itemRow(m, query = '', priority = false) {
    let name = esc(m.name);
    if (query) {
      const i = m.name.toLowerCase().indexOf(query.toLowerCase());
      if (i >= 0) name = esc(m.name.slice(0, i)) + '<mark>' + esc(m.name.slice(i, i + query.length)) + '</mark>' + esc(m.name.slice(i + query.length));
    }
    const q = cartQtyOf(m.id);
    return `<button class="menu-item${m.cat === 'เครื่องดื่ม' ? ' drink-item' : ''}" data-item="${m.id}">
      ${thumb(m, priority)}
      <div class="mi-text"><div class="mi-name">${name}</div><div class="mi-price">${hasPricedOpts(m) ? 'เริ่มต้น ' : ''}${baht(m.price)}</div></div>
      <span class="menu-add" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5v14"/></svg></span>
      ${q ? `<span class="badge" aria-label="${q} ในตะกร้า">${q}</span>` : ''}
    </button>`;
  }

  function hasPricedOpts(m) {
    return (m.options || []).some(g => OPTION_GROUPS[g].choices.some(c => c.price));
  }

  function renderTabs() {
    $('#tabScroll').innerHTML = CATEGORIES.map(c =>
      `<button class="tab ${c === activeCat ? 'active' : ''}" aria-pressed="${c === activeCat}" data-tab="${c}">${c}</button>`).join('');
  }

  function renderMenu() {
    $('#menuSections').innerHTML = catOrder.map((c, sectionIndex) => {
      const items = MENU.filter(m => m.cat === c);
      return `<section class="cat-section" id="cat-${c}" data-cat="${c}">
        <h2 class="cat-title">${c}</h2>
        ${items.length ? `<div class="menu-grid">${items.map((m, itemIndex) => itemRow(m, '', sectionIndex === 0 && itemIndex === 0)).join('')}</div>` : '<p class="cat-empty">ยังไม่มีเมนูในหมวดนี้</p>'}
      </section>`;
    }).join('');
  }

  function setActiveTab(c, scrollTab = true) {
    if (activeCat === c) return;
    activeCat = c;
    document.querySelectorAll('.tab').forEach(t => {
      const selected = t.dataset.tab === c;
      t.classList.toggle('active', selected);
      t.setAttribute('aria-pressed', String(selected));
    });
    if (scrollTab) {
      const t = document.querySelector(`.tab[data-tab="${c}"]`);
      const sc = $('#tabScroll');
      if (t) {
        const rect = t.getBoundingClientRect(), track = sc.getBoundingClientRect();
        if (rect.left < track.left || rect.right > track.right) sc.scrollBy({ left: rect.left - track.left - 6, behavior: scrollBehavior() });
      }
    }
  }

  function goToCat(c) {
    // ดึงหมวดที่เลือกขึ้นมาติดบนสุดของรายการ แทนการเลื่อนไปหาที่อยู่ด้านล่าง
    const i = catOrder.indexOf(c);
    if (i > 0) {
      catOrder.splice(i, 1);
      catOrder.unshift(c);
      renderMenu();
    }
    lockSpy = true;
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    setActiveTab(c);
    setTimeout(() => { lockSpy = false; }, 700);
  }

  const scrollBehavior = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
  let lockSpy = false;
  function spy() {
    if (lockSpy) return;
    const offset = $('#tabsBar').getBoundingClientRect().bottom + 10;
    let current = catOrder[0];
    document.querySelectorAll('.cat-section').forEach(s => {
      if (s.getBoundingClientRect().top <= offset) current = s.dataset.cat;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = catOrder[catOrder.length - 1];
    setActiveTab(current);
  }

  /* ---------- Cart bar ---------- */
  function renderCartBar() {
    const n = cartCount();
    $('#cartbarWrap').hidden = n === 0;
    $('#cartbarCount').textContent = `${n} รายการในตะกร้า`;
    $('#cartbarTotal').textContent = baht(cartTotal());
  }

  function refreshAll() {
    renderMenu();
    renderCartBar();
    if (!$('#searchView').hidden) renderSearch();
    if (!$('#cartView').hidden) renderCart();
  }

  /* ---------- Item detail ---------- */
  function openItem(id, cartKey = null) {
    if (billCalled) { toast('เรียกเช็คบิลแล้ว ไม่สามารถสั่งอาหารเพิ่มได้'); return; }
    const m = byId[id];
    const existing = cartKey ? cart.find(c => c.key === cartKey) : null;
    const opts = {};
    (m.options || []).forEach(g => { opts[g] = existing && existing.opts[g] ? [...existing.opts[g]] : []; });
    editing = { mode: existing ? 'edit' : 'new', id, key: cartKey, qty: existing ? existing.qty : 1, opts };
    const hero = $('#itemView .item-hero');
    hero.className = 'item-hero ' + (m.fit || '');
    $('#itemImg').src = imageSrc(m);
    $('#itemImg').alt = m.name;
    $('#itemName').textContent = m.name;
    $('#itemTopTitle').textContent = m.name;
    $('#itemFrom').hidden = !hasPricedOpts(m);
    $('#itemPrice').textContent = baht(m.price);
    $('#itemNote').value = existing ? existing.note : '';
    renderOptions();
    updateItemFoot();
    show('#itemView');
    $('#itemScroll').scrollTop = 0;
    onItemScroll();
  }

  function renderOptions() {
    const m = byId[editing.id];
    $('#itemOptions').innerHTML = (m.options || []).map(g => {
      const grp = OPTION_GROUPS[g];
      const single = grp.type === 'single';
      return `<fieldset class="opt-group" data-group="${g}">
        <div class="opt-head"><div><h3>${grp.name}</h3><small>${single ? 'เลือกได้สูงสุด ' + grp.max : 'เลือกได้ไม่จำกัด'}</small></div></div>
        <div class="opt-list">
          ${grp.choices.map((c, i) => `<label class="opt">
            <input type="checkbox" data-g="${g}" data-i="${i}" ${editing.opts[g].includes(i) ? 'checked' : ''}>
            <span class="mark ${single ? 'r' : 'c'}"></span>
            <span class="opt-text"><b>${esc(c.name)}</b>${c.price ? `<span>+ ${baht(c.price)}</span>` : ''}</span>
          </label>`).join('')}
        </div>
      </fieldset>`;
    }).join('');
  }

  function onOptionChange(input) {
    const g = input.dataset.g, i = +input.dataset.i, grp = OPTION_GROUPS[g];
    let sel = editing.opts[g];
    if (input.checked) {
      if (grp.type === 'single') sel = [i];
      else sel = sel.concat(i);
    } else sel = sel.filter(x => x !== i);
    editing.opts[g] = sel;
    if (grp.type === 'single') {
      document.querySelectorAll(`#itemOptions input[data-g="${g}"]`).forEach(el => { el.checked = sel.includes(+el.dataset.i); });
    }
    updateItemFoot();
  }

  function onItemScroll() {
    const sc = $('#itemScroll');
    const heroH = $('#itemView .item-hero').offsetHeight;
    const past = !matchMedia('(min-width: 760px)').matches && sc.scrollTop > heroH - 90;
    $('#itemTopbar').classList.toggle('show', past);
    $('#itemClose').classList.toggle('hide', past);
  }

  function updateItemFoot() {
    $('#qtyVal').textContent = editing.qty;
    $('#qtyMinus').disabled = editing.qty <= 1;
    const label = editing.mode === 'edit' ? 'บันทึก' : 'เพิ่มลงตะกร้า';
    $('#addBtn').textContent = `${label} ${baht(unitPrice(editing) * editing.qty, false)}`;
  }

  function cleanOpts(opts) {
    const o = {};
    Object.entries(opts).forEach(([g, v]) => { if (v.length) o[g] = [...v]; });
    return o;
  }

  function commitItem() {
    const note = $('#itemNote').value.trim();
    const opts = cleanOpts(editing.opts);
    const same = (a, b) => a.id === b.id && a.note === b.note && optKey(a.opts) === optKey(b.opts);
    if (editing.mode === 'edit') {
      const row = cart.find(c => c.key === editing.key);
      row.qty = editing.qty; row.note = note; row.opts = opts;
      const dup = cart.find(c => c !== row && same(c, row));
      if (dup) { dup.qty += row.qty; cart = cart.filter(c => c !== row); }
      toast('บันทึกการแก้ไขแล้ว');
    } else {
      const cand = { id: editing.id, note, opts };
      const found = cart.find(c => same(c, cand));
      if (found) found.qty += editing.qty;
      else cart.push({ key: Date.now() + Math.random().toString(36).slice(2), ...cand, qty: editing.qty });
      toast(`เพิ่ม ${byId[editing.id].name} ลงตะกร้าแล้ว`);
    }
    hide('#itemView');
    refreshAll();
  }

  /* ---------- Search ---------- */
  function renderSearch() {
    const q = $('#searchInput').value.trim();
    const box = $('#searchResults');
    if (!q) { box.innerHTML = '<p class="search-empty">พิมพ์ชื่อเมนูเพื่อค้นหา</p>'; return; }
    const res = MENU.filter(m => m.name.toLowerCase().includes(q.toLowerCase()));
    box.innerHTML = res.length ? `<div class="menu-grid">${res.map(m => itemRow(m, q)).join('')}</div>`
      : `<p class="search-empty">ไม่พบเมนู “${esc(q)}”</p>`;
  }

  /* ---------- Cart ---------- */
  const basketSvg = `<svg width="118" height="118" viewBox="0 0 120 120"><path d="M38 52 60 26l22 26" fill="none" stroke="#D5D5D8" stroke-width="9" stroke-linejoin="round"/><path d="M20 50h80l-9 44a10 10 0 0 1-10 8H39a10 10 0 0 1-10-8z" fill="#8E8E92"/><path d="M45 64l3 24M60 64v24M75 64l-3 24" stroke="#fff" stroke-width="7" stroke-linecap="round"/></svg>`;

  function renderCart() {
    const list = $('#cartList');
    const n = cartCount();
    $('#cartFoot').hidden = n === 0;
    if (!n) {
      list.innerHTML = `<div class="empty">${basketSvg}<h3>ตะกร้าคุณยังไม่มีอาหาร</h3><p>เพิ่มเมนูลงตะกร้าเพื่อสั่งอาหารเลย</p><button class="btn-primary" id="goMenu">ดูเมนู</button></div>`;
      return;
    }
    list.innerHTML = cart.map(c => {
      const m = byId[c.id];
      return `<div class="cart-row">
        ${thumb(m)}
        <div class="cr-main">
          <div class="cr-top"><span>${esc(m.name)}</span><b>${baht(unitPrice(c) * c.qty, false)}</b></div>
          ${optLabel(c.opts) ? `<div class="opt-line">${esc(optLabel(c.opts))}</div>` : ''}
          ${c.note ? `<div class="cr-note">หมายเหตุ: ${esc(c.note)}</div>` : ''}
          <div class="cr-bottom">
            <button class="edit-link" data-edit="${c.key}">แก้ไข</button>
            <div class="stepper">
              <button data-dec="${c.key}" aria-label="ลดจำนวน"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5"/><path d="M7.5 12h9"/></svg></button>
              <span>${c.qty}</span>
              <button data-inc="${c.key}" aria-label="เพิ่มจำนวน"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5"/><path d="M7.5 12h9M12 7.5v9"/></svg></button>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');
    $('#cartTotal').textContent = baht(cartTotal());
    $('#submitOrder').textContent = `สั่ง ${n} รายการ`;
  }

  /* ---------- Dialog ---------- */
  const trashSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13M10 11v5M14 11v5"/></svg>`;
  const checkSvg = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>`;

  function dialog({ icon = 'trash', title, text = '', notice = '', actions }) {
    const ic = $('#dlgIcon');
    if (icon === 'bill') { ic.className = 'dlg-illus'; ic.innerHTML = receiptSvg('dollar'); }
    else { ic.className = 'dlg-icon' + (icon === 'ok' ? ' ok' : ''); ic.innerHTML = icon === 'ok' ? checkSvg : trashSvg; }
    $('#dlgTitle').textContent = title;
    $('#dlgText').textContent = text;
    $('#dlgText').hidden = !text;
    $('#dlgNotice').textContent = notice;
    $('#dlgNotice').hidden = !notice;
    const box = $('#dlgActions');
    box.innerHTML = '';
    actions.forEach(a => {
      const b = document.createElement('button');
      b.className = a.cls; b.textContent = a.label;
      b.onclick = () => { hide('#dialog'); a.onClick && a.onClick(); };
      box.appendChild(b);
    });
    show('#dialog');
  }

  function confirmRemove(key) {
    dialog({
      title: 'ยืนยันการลบเมนู',
      text: 'รายการเมนูจะถูกลบออกจากตะกร้า',
      actions: [
        { label: 'ยกเลิก', cls: 'dlg-cancel' },
        { label: 'ลบ', cls: 'dlg-danger', onClick: () => { cart = cart.filter(c => c.key !== key); refreshAll(); } },
      ],
    });
  }

  function submitOrder() {
    if (billCalled) { toast('เรียกเช็คบิลแล้ว ไม่สามารถสั่งอาหารเพิ่มได้'); return; }
    const n = cartCount();
    if (!n) return;
    dialog({
      icon: 'ok',
      title: 'ยืนยันการสั่งอาหาร',
      text: `สั่ง ${n} รายการ รวม ${baht(cartTotal())} ส่งไปยังครัว`,
      notice: 'หลังยืนยันแล้วจะไม่สามารถยกเลิกรายการอาหารได้',
      actions: [
        { label: 'ยกเลิก', cls: 'dlg-cancel' },
        {
          label: 'ยืนยัน', cls: 'dlg-ok', onClick: () => {
            const batch = cart.map(c => ({ id: c.id, qty: c.qty, note: c.note, opts: c.opts, by: CUSTOMER, status: 'sent' }));
            orders = batch.concat(orders);
            ordersTime = new Date();
            cart = [];
            seenOrders = false;
            $('#ordersDot').hidden = false;
            hide('#cartView');
            refreshAll();
            toast('ส่งรายการสั่งอาหารเรียบร้อย');
            // จำลองสถานะครัว
            setTimeout(() => { batch.forEach(o => { if (o.status === 'sent') o.status = 'cooking'; }); ordersTime = new Date(); if (!$('#ordersView').hidden) renderOrders(); }, 6000);
            setTimeout(() => { batch.forEach(o => { if (o.status === 'cooking') o.status = 'served'; }); ordersTime = new Date(); if (!$('#ordersView').hidden) renderOrders(); }, 20000);
          }
        },
      ],
    });
  }

  /* ---------- Orders & bill ---------- */
  // Historical cancellations are visible for reference, but not charged.
  const active = () => orders.filter(o => o.status !== 'cancelled');
  const ordersCount = () => active().reduce((a, o) => a + o.qty, 0);
  const ordersTotal = () => active().reduce((a, o) => a + o.qty * unitPrice(o), 0);
  const thb = n => n.toLocaleString('en-US', { minimumFractionDigits: 2 }) + '฿';

  function renderOrders() {
    $('#ordersTime').textContent = `ข้อมูล ณ เวลา ${timeStr(ordersTime)}`;
    $('#ordersList').innerHTML = orders.length ? orders.map(o => {
      const m = byId[o.id];
      const ol = optLabel(o.opts);
      return `<div class="order-row">
        <div class="or-top">
          ${thumb(m)}
          <div class="or-main">
            <div class="or-line"><span>${esc(m.name)}</span><b>${o.status === 'cancelled' ? '-' : baht(unitPrice(o) * o.qty, false)}</b></div>
            ${ol ? `<div class="opt-line">${esc(ol)}</div>` : ''}
            ${o.note ? `<div class="or-note">หมายเหตุ: ${esc(o.note)}</div>` : ''}
            <div class="or-qty"><strong>x ${o.qty}</strong><span class="status ${o.status}">${STATUS[o.status]}</span></div>
          </div>
        </div>
        <div class="or-by">สั่งโดย: ${o.by}</div>
      </div>`;
    }).join('') : `<div class="empty"><h3>ยังไม่มีรายการที่สั่ง</h3></div>`;
    $('#ordersCount').textContent = `${ordersCount()} รายการ`;
    $('#ordersTotal').textContent = baht(ordersTotal());
    $('#billBtn').innerHTML = billCalled
      ? 'ดูสถานะเช็คบิล'
      : '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14v18l-2.3-1.5L14.3 21 12 19.5 9.7 21l-2.4-1.5L5 21z"/><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4"/></svg> บิลค่าอาหาร';
  }

  function extraLines(o) {
    const parts = [];
    const ol = optLabel(o.opts);
    if (ol) parts.push(ol);
    if (o.note) parts.push(o.note);
    return parts.length ? `เพิ่มเติม: ${esc(parts.join(', '))}` : '';
  }

  function renderBill() {
    $('#billList').innerHTML = orders.map(o => {
      const m = byId[o.id], cancelled = o.status === 'cancelled', ex = extraLines(o);
      return `<div class="bill-row">
        <span class="q">${o.qty}x</span>
        <div class="bm">
          <div class="bn"><span>${esc(m.name)}</span><span>${cancelled ? 'ไม่คิดเงิน' : baht(unitPrice(o) * o.qty, false)}</span></div>
          ${ex ? `<div class="opt-line">${ex}</div>` : ''}
          ${cancelled ? '<div class="cancel-note">รายการอาหารถูกยกเลิก</div>' : ''}
          <div class="by">สั่งโดย: ${o.by}</div>
        </div>
      </div>`;
    }).join('');
    $('#billSub').textContent = baht(ordersTotal());
    $('#billTotal').textContent = baht(ordersTotal());
    $('#payContinue').disabled = ordersCount() === 0;
  }

  function renderCheck() {
    $('#checkIllus').innerHTML = receiptSvg('check');
    $('#checkCount').textContent = `รายการอาหารที่สั่ง (${ordersCount()})`;
    $('#checkList').innerHTML = orders.map(o => {
      const m = byId[o.id], cancelled = o.status === 'cancelled', ex = extraLines(o);
      return `<div class="ck-row">
        <span class="q">${o.qty}x</span>
        <div class="cm">
          <div class="cn"><span>${esc(m.name)}</span><span>${cancelled ? '' : (unitPrice(o) * o.qty) + '฿'}</span></div>
          ${ex ? `<div class="extra">${ex}</div>` : ''}
          ${cancelled ? '<div class="cancel-note">รายการอาหารถูกยกเลิก</div>' : ''}
        </div>
      </div>`;
    }).join('');
    $('#checkSub').textContent = thb(ordersTotal());
    $('#checkTotal').textContent = thb(ordersTotal());
  }

  function continuePayment() {
    dialog({
      icon: 'bill',
      title: 'ยืนยันการเรียกเช็คบิล',
      notice: 'โปรดทราบ หากเรียกเช็คบิลแล้ว\nคุณจะไม่สามารถสั่งอาหารต่อได้',
      actions: [
        { label: 'ยกเลิก', cls: 'dlg-outline' },
        { label: 'ยืนยัน', cls: 'dlg-ok', onClick: callBill },
      ],
    });
  }

  function callBill() {
    billCalled = true;
    cart = [];
    ['#billView', '#ordersView', '#cartView'].forEach(s => { $(s).hidden = true; });
    renderCheck();
    show('#checkView');
    $('#checkView .page-body').scrollTop = 0;
    renderLockBanner();
    refreshAll();
  }

  function markPaid() {
    hide('#checkView');
    $('#chefIllus').innerHTML = chefSvg;
    show('#paidView');
  }

  function renderLockBanner() {
    let b = $('#lockBanner');
    if (!billCalled) { if (b) b.remove(); return; }
    if (!b) {
      b = document.createElement('div');
      b.id = 'lockBanner'; b.className = 'locked-banner';
      b.innerHTML = '<span>เรียกเช็คบิลแล้ว ไม่สามารถสั่งอาหารเพิ่มได้</span><button id="lockView">ดูบิล</button>';
      $('#menu').before(b);
      $('#lockView').onclick = () => { renderCheck(); show('#checkView'); };
      b.inert = Boolean(activeView());
    }
  }

  /* ---------- Illustrations ---------- */
  function receiptSvg(kind) {
    const badge = kind === 'check'
      ? '<circle cx="120" cy="58" r="21" fill="#22C55E"/><path d="m110 58 7 7 13-13" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
      : '<text x="120" y="74" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="44" fill="#17B3C9">$</text>';
    return `<svg viewBox="0 0 240 190" width="100%" role="img" aria-label="ใบเสร็จ">
      <defs>
        <linearGradient id="pg${kind}" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E6E9F2"/></linearGradient>
        <radialGradient id="gl${kind}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#EEF0F5"/><stop offset="1" stop-color="#EEF0F5" stop-opacity="0"/></radialGradient>
      </defs>
      <ellipse cx="120" cy="150" rx="118" ry="44" fill="url(#gl${kind})"/>
      <rect x="74" y="18" width="94" height="136" rx="8" fill="url(#pg${kind})" stroke="#E3E6EE"/>
      ${badge}
      <path d="M96 98h50M96 112h50M96 126h36" stroke="#9FB2D1" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M64 132h96v22a8 8 0 0 1-8 8H64a8 8 0 0 1-8-8v-14a8 8 0 0 1 8-8z" fill="#FFFDF8" stroke="#ECEAE3"/>
      <path d="M160 132c6 0 8 4 8 10v12a8 8 0 0 1-8 8" fill="#C8CFE0"/>
    </svg>`;
  }

  const chefSvg = `<svg viewBox="0 0 280 260" width="100%" role="img" aria-label="พ่อครัวไหว้ขอบคุณ">
    <path d="M30 170c0-50 40-80 90-78 30 1 50 12 72 10 40-3 70 22 66 58-4 38-44 62-110 64-70 2-118-14-118-54z" fill="#EFF0F2"/>
    <path d="M70 250c0-52 30-86 70-86s70 34 70 86z" fill="#F7F8FA"/>
    <path d="M70 250c0-40 18-70 44-80l-8 80z M210 250c0-40-18-70-44-80l8 80z" fill="#E7EAF0"/>
    <path d="M106 250V176h68v74z" fill="#1E9BEA"/>
    <path d="M114 176l-6-22h8l8 22zM166 176l6-22h-8l-8 22z" fill="#1E9BEA"/>
    <rect x="124" y="120" width="32" height="40" rx="6" fill="#F4A07A"/>
    <ellipse cx="140" cy="112" rx="26" ry="31" fill="#F7AE88"/>
    <path d="M114 104c0-16 12-24 26-24s26 8 26 24c-4-8-14-10-26-10s-22 2-26 10z" fill="#2F2F35"/>
    <path d="M131 112v6M149 112v6" stroke="#5B3A2A" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M134 128c4 2 8 2 12 0" stroke="#C9714E" stroke-width="2" fill="none" stroke-linecap="round"/>
    <rect x="114" y="66" width="52" height="18" rx="3" fill="#fff" stroke="#E2E4EA"/>
    <path d="M112 68c-8-6-6-22 6-24 2-14 20-18 26-8 8-8 24-2 22 10 12 2 12 18 2 22z" fill="#fff" stroke="#E2E4EA"/>
    <path d="M128 48v20M140 44v24M152 48v20" stroke="#ECEEF2" stroke-width="2"/>
    <path d="M140 160c-10 6-14 22-12 36l12 8 12-8c2-14-2-30-12-36z" fill="#F7AE88"/>
    <path d="M140 162v40" stroke="#E18E66" stroke-width="1.6"/>
    <path d="M96 196c10-6 24-4 32 0l-2 14c-10 2-22 0-30-4z M184 196c-10-6-24-4-32 0l2 14c10 2 22 0 30-4z" fill="#F7F8FA" stroke="#E2E4EA"/>
  </svg>`;

  /* ---------- Category sheet ---------- */
  function renderCatList() {
    const q = $('#catSearch').value.trim();
    const list = CATEGORIES.filter(c => c.includes(q));
    $('#catList').innerHTML = list.length ? list.map(c => {
      const n = MENU.filter(m => m.cat === c).length;
      return `<li><button class="${c === activeCat ? 'active' : ''}" data-pick="${c}"><span>${c}<span class="count">${n} เมนู</span></span>${c === activeCat ? '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>' : ''}</button></li>`;
    }).join('') : '<li class="search-empty">ไม่พบหมวดหมู่</li>';
  }
  function openCats() { $('#catSearch').value = ''; renderCatList(); show('#catScrim'); show('#catSheet'); }
  function closeCats() { hide('#catScrim'); hide('#catSheet'); }

  /* ---------- Events ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-item],[data-tab],[data-edit],[data-inc],[data-dec],[data-close],[data-pick],[data-info],#goMenu');
    if (!t) return;
    if (t.dataset.item) openItem(t.dataset.item);
    else if (t.dataset.tab) goToCat(t.dataset.tab);
    else if (t.dataset.edit) { const c = cart.find(x => x.key === t.dataset.edit); openItem(c.id, c.key); }
    else if (t.dataset.inc) { cart.find(x => x.key === t.dataset.inc).qty++; refreshAll(); }
    else if (t.dataset.dec) {
      const c = cart.find(x => x.key === t.dataset.dec);
      if (c.qty <= 1) confirmRemove(c.key); else { c.qty--; refreshAll(); }
    }
    else if (t.dataset.close) hide('#' + t.dataset.close);
    else if (t.dataset.pick) { closeCats(); goToCat(t.dataset.pick); }
    else if (t.hasAttribute('data-info')) toast('ยอดรวมคำนวณจากราคาเมนูทั้งหมดที่เลือก');
    else if (t.id === 'goMenu') hide('#cartView');
  });

  $('#qtyMinus').onclick = () => { if (editing.qty > 1) { editing.qty--; updateItemFoot(); } };
  $('#qtyPlus').onclick = () => { if (editing.qty < 99) { editing.qty++; updateItemFoot(); } };
  $('#addBtn').onclick = commitItem;
  $('#itemClose').onclick = () => hide('#itemView');
  $('#itemClose2').onclick = () => hide('#itemView');
  $('#itemScroll').addEventListener('scroll', onItemScroll, { passive: true });
  matchMedia('(min-width: 760px)').addEventListener('change', () => { if (!$('#itemView').hidden) onItemScroll(); });
  $('#itemOptions').addEventListener('change', e => { if (e.target.matches('input[data-g]')) onOptionChange(e.target); });
  $('#payContinue').onclick = continuePayment;
  $('#demoPaid').onclick = markPaid;

  $('#searchBtn').onclick = () => { $('#searchInput').value = ''; renderSearch(); show('#searchView'); };
  $('#searchCancel').onclick = () => hide('#searchView');
  $('#searchInput').addEventListener('input', renderSearch);

  $('#catBtn').onclick = openCats;
  $('#catClose').onclick = closeCats;
  $('#catScrim').onclick = closeCats;
  $('#catSearch').addEventListener('input', renderCatList);

  $('#cartbar').onclick = () => { renderCart(); show('#cartView'); };
  $('#submitOrder').onclick = submitOrder;

  $('#ordersBtn').onclick = () => {
    if (billCalled) { renderCheck(); show('#checkView'); return; }
    renderOrders(); show('#ordersView'); seenOrders = true; $('#ordersDot').hidden = true;
  };
  $('#billBtn').onclick = () => {
    if (billCalled) { hide('#ordersView'); renderCheck(); show('#checkView'); return; }
    renderBill(); show('#billView'); $('#billView .page-body').scrollTop = 0;
  };

  $('#callBtn').onclick = () => dialog({
    icon: 'ok', title: 'เรียกพนักงาน', text: `ต้องการเรียกพนักงานมาที่${tableFull} ใช่หรือไม่`,
    actions: [{ label: 'ยกเลิก', cls: 'dlg-cancel' }, { label: 'เรียก', cls: 'dlg-ok', onClick: () => toast('เรียกพนักงานแล้ว กรุณารอสักครู่') }],
  });
  $('#langBtn').onclick = () => toast('ภาษาไทย');
  $('#tableBtn').onclick = () => toast(`${tableLabel} · ผู้สั่ง: ${CUSTOMER}`);

  document.addEventListener('keydown', e => {
    const view = activeView();
    if (!view) return;
    if (e.key === 'Escape' && view.id !== 'paidView') {
      e.preventDefault();
      view.id === 'catSheet' ? closeCats() : hide('#' + view.id);
    }
    if (e.key === 'Tab') {
      const targets = [...view.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled])')]
        .filter(el => !el.closest('[hidden]') && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
      const first = targets[0], last = targets[targets.length - 1];
      if (!first || !targets.includes(document.activeElement) ||
          (e.shiftKey && document.activeElement === first) || (!e.shiftKey && document.activeElement === last)) {
        e.preventDefault();
        (e.shiftKey ? last : first)?.focus();
      }
    }
  });

  window.addEventListener('scroll', () => requestAnimationFrame(spy), { passive: true });

  /* ---------- Init ---------- */
  // แสดงชื่อโต๊ะจาก QR Code (?table=T01) และชื่อลูกค้า (A, B, C) ทุกจุดที่เกี่ยวข้อง
  document.title = `ตำกระฉูด | สั่งอาหารโต๊ะ ${tableLabel}`;
  $('#tableName').textContent = tableLabel;
  $('#customerName').textContent = `ผู้สั่ง ${CUSTOMER}`;
  $('#checkView .table-chip').textContent = tableLabel;
  renderTabs();
  renderMenu();
  renderCartBar();
  syncViews();
})();
