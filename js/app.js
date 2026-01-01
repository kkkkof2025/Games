
(function () {
  const root = document.documentElement;
  const gridEl = document.getElementById('cardGrid');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const pillEls = Array.from(document.querySelectorAll('.pill'));
  const themeToggle = document.getElementById('themeToggle');

  const overlay = document.getElementById('playOverlay');
  const gameFrame = document.getElementById('gameFrame');
  const frameLoading = document.getElementById('frameLoading');
  const playTitleEl = document.getElementById('playTitle');
  const playBadgesEl = document.getElementById('playBadges');
  const btnClose = document.getElementById('btnClose');
  const btnRestart = document.getElementById('btnRestart');
  const btnFullscreen = document.getElementById('btnFullscreen');

  // ---- 主题切换：auto/light/dark ----
  const themeKey = 'hub-theme';
  function applyTheme(val) {
    const mode = val || localStorage.getItem(themeKey) || 'auto';
    root.setAttribute('data-theme', mode === 'auto' ? 'auto' : mode);
    // icon 切换
    document.getElementById('iconSun').style.display = (mode === 'dark') ? 'none' : '';
    document.getElementById('iconMoon').style.display = (mode === 'dark') ? '' : 'none';
  }
  applyTheme();
  themeToggle.addEventListener('click', () => {
    const cur = root.getAttribute('data-theme') || 'auto';
    const next = cur === 'auto' ? 'dark' : (cur === 'dark' ? 'light' : 'auto');
    localStorage.setItem(themeKey, next);
    applyTheme(next);
  });

  // ---- 渲染卡片 ----
  function getBestScore(key) {
    if (!key) return null;
    const v = localStorage.getItem(key);
    return v ? Number(v) : null;
  }
  function renderCards(list) {
    gridEl.innerHTML = '';
    list.forEach(g => {
      const card = document.createElement('article');
      card.className = 'card';

      const cover = document.createElement('div');
      cover.className = 'card-cover';
      cover.style.background = g.cover?.bg || 'var(--primary-weak)';
      cover.style.color = g.cover?.fg || 'var(--primary)';
      cover.innerHTML = `<div style="font-size:48px;">${g.cover?.emoji || '🎮'}</div>`;
      card.appendChild(cover);

      const body = document.createElement('div');
      body.className = 'card-body';

      const title = document.createElement('div');
      title.className = 'card-title';
      const best = getBestScore(g.bestKey);
      title.innerHTML = `<span>${g.name}</span>${best != null ? `<span class="score">最佳：${best}</span>` : '<span class="score">—</span>'}`;
      body.appendChild(title);

      const desc = document.createElement('div');
      desc.className = 'card-desc';
      desc.textContent = g.desc || '一款小游戏';
      body.appendChild(desc);

      const tags = document.createElement('div');
      tags.className = 'card-tags';
      (g.tags || []).forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = t;
        tags.appendChild(tag);
      });
      body.appendChild(tags);

      const actions = document.createElement('div');
      actions.className = 'card-actions';
      const btnPlay = document.createElement('button');
      btnPlay.className = 'btn primary';
      btnPlay.textContent = '开始游戏';
      btnPlay.addEventListener('click', () => openGame(g));
      const btnInfo = document.createElement('button');
      btnInfo.className = 'btn';
      btnInfo.textContent = '详情';
      btnInfo.addEventListener('click', () => alert(`${g.name}\n\n${g.desc}\n分类：${(g.cat||[]).join(', ')}`));
      actions.appendChild(btnPlay);
      actions.appendChild(btnInfo);
      body.appendChild(actions);

      card.appendChild(body);
      gridEl.appendChild(card);
    });
  }

  // ---- 过滤 & 排序 ----
  function getFilteredSorted() {
    const q = (searchInput.value || '').trim().toLowerCase();
    const catActive = pillEls.find(p => p.classList.contains('active'))?.dataset?.cat || 'all';
    const sortKey = sortSelect.value || 'featured';

    let arr = window.GAMES.slice();

    if (catActive !== 'all') {
      arr = arr.filter(g => (g.cat || []).includes(catActive));
    }
    if (q) {
      arr = arr.filter(g =>
        (g.name || '').toLowerCase().includes(q) ||
        (g.desc || '').toLowerCase().includes(q) ||
        (g.tags || []).some(t => (t || '').toLowerCase().includes(q))
      );
    }

    switch (sortKey) {
      case 'name':
        arr.sort((a,b) => a.name.localeCompare(b.name, 'zh'));
        break;
      case 'recent':
        arr.sort((a,b) => new Date(b.addedAt) - new Date(a.addedAt));
        break;
      case 'best':
        arr.sort((a,b) => (Number(localStorage.getItem(b.bestKey)||0) - Number(localStorage.getItem(a.bestKey)||0)));
        break;
      default: // featured
        arr.sort((a,b) => (b.featured?1:0) - (a.featured?1:0));
    }
    return arr;
  }

  function updateGrid() { renderCards(getFilteredSorted()); }

  pillEls.forEach(p => p.addEventListener('click', () => {
    pillEls.forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    updateGrid();
  }));
  searchInput.addEventListener('input', updateGrid);
  sortSelect.addEventListener('change', updateGrid);

  // ---- 打开即玩 ----
  let currentGame = null;
  function openGame(g) {
    currentGame = g;
    playTitleEl.textContent = g.name || '游戏';
    playBadgesEl.innerHTML = '';
    (g.tags || []).slice(0,3).forEach(t => {
      const b = document.createElement('span');
      b.className = 'badge';
      b.textContent = t;
      playBadgesEl.appendChild(b);
    });

    overlay.hidden = false;
    frameLoading.style.display = '';
    gameFrame.src = g.src;
  }
  function closeGame() {
    overlay.hidden = true;
    gameFrame.src = 'about:blank';
    currentGame = null;
  }
  btnClose.addEventListener('click', closeGame);
  btnRestart.addEventListener('click', () => {
    if (currentGame) {
      frameLoading.style.display = '';
      gameFrame.src = currentGame.src; // 直接重载
    }
  });
  btnFullscreen.addEventListener('click', () => {
    const el = document.querySelector('.overlay');
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  // iframe 加载指示
  gameFrame.addEventListener('load', () => {
    setTimeout(() => frameLoading.style.display = 'none', 120);
  });

  // ESC 关闭
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) closeGame();
  });

  // 初次渲染
  updateGrid();
})();
