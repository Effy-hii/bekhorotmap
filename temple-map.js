(() => {
  const lawsButton = document.getElementById('temple-map-reveal');
  const bridgeButton = document.getElementById('temple-bridge-reveal');
  const comparisonButton = document.getElementById('temple-comparison-reveal');
  const bridge = document.getElementById('temple-bridge');
  const comparison = document.getElementById('temple-comparison');
  const grid = document.getElementById('temple-comparison-grid');
  const svg = document.getElementById('temple-connections');
  const explanation = document.getElementById('temple-map-explanation');
  const laws = [document.getElementById('temple-work-laws'), document.getElementById('temple-offerings-laws')];
  if ([lawsButton, bridgeButton, comparisonButton, bridge, comparison, grid, svg, explanation, ...laws].some(item => !item)) return;

  const chapters = [...grid.querySelectorAll('[data-map-chapter]')];
  const targets = [...grid.querySelectorAll('[data-map-target]')];
  const links = [
    ['a', 'gifts'], ['b', 'firstborn'], ['c', 'firstborn'],
    ['d', 'firstborn'], ['e', 'firstborn'], ['f', 'altar'],
    ['g', 'entry'], ['h', 'gifts'], ['h', 'inheritance'], ['i', 'firstborn']
  ];
  const summaries = {
    a: 'פרק א׳ · פטר חמור ← הלכות ביכורים ושאר מתנות כהונה שבגבולין, ספר זרעים.',
    b: 'פרק ב׳ · בכור בהמה ← הלכות בכורות, ספר הקרבנות.',
    c: 'פרק ג׳ · בכור בהמה ← הלכות בכורות, ספר הקרבנות.',
    d: 'פרק ד׳ · בכור בהמה ← הלכות בכורות, ספר הקרבנות.',
    e: 'פרק ה׳ · בכור בהמה ← הלכות בכורות, ספר הקרבנות.',
    f: 'פרק ו׳ · מומי בכור בהמה ← הלכות איסורי מזבח, ספר עבודה.',
    g: 'פרק ז׳ · מומי כהנים ← הלכות ביאת המקדש, ספר עבודה.',
    h: 'פרק ח׳ · בכור אדם ← הלכות ביכורים בספר זרעים; חלק מדיני הירושה ← הלכות נחלות בספר משפטים.',
    i: 'פרק ט׳ · מעשר בהמה ← הלכות בכורות, ספר הקרבנות.'
  };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeChapter = null;
  let drawTimers = [];

  function scrollToPanel(panel) {
    panel.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  }

  function setComparison(open) {
    comparison.hidden = !open;
    comparisonButton.setAttribute('aria-expanded', String(open));
    comparisonButton.querySelector('span:first-child').textContent = open
      ? 'הסתירו את מפת הפרקים וההלכות'
      : 'הציגו את מפת הפרקים וההלכות';
    comparisonButton.querySelector('.temple-map-reveal-icon').textContent = open ? '↑' : '↓';
    if (open) {
      requestAnimationFrame(() => {
        drawConnections(true);
        scrollToPanel(comparison);
      });
    } else {
      drawTimers.forEach(clearTimeout);
      drawTimers = [];
      svg.replaceChildren();
    }
  }

  function setBridge(open) {
    if (!open && !comparison.hidden) setComparison(false);
    bridge.hidden = !open;
    bridgeButton.setAttribute('aria-expanded', String(open));
    bridgeButton.querySelector('span:first-child').textContent = open
      ? 'הסתירו את הספרים הנוספים'
      : 'ומה עם דיני בכורות שמחוץ למקדש?';
    bridgeButton.querySelector('.temple-map-reveal-icon').textContent = open ? '↑' : '↓';
    if (open) requestAnimationFrame(() => scrollToPanel(bridge));
  }

  function setLaws(open) {
    laws.forEach(list => { list.hidden = !open; });
    bridgeButton.hidden = false;
    lawsButton.setAttribute('aria-expanded', String(open));
    lawsButton.querySelector('span:first-child').textContent = open
      ? 'הסתירו את פירוט ההלכות'
      : 'הציגו את ההלכות ואת תוכנן בשני הספרים';
    lawsButton.querySelector('.temple-map-reveal-icon').textContent = open ? '−' : '+';
    if (open) requestAnimationFrame(() => scrollToPanel(laws[0]));
  }

  function emphasizeChapter(chapter) {
    activeChapter = activeChapter === chapter ? null : chapter;
    const linkedTargets = new Set(links.filter(([source]) => source === activeChapter).map(([, target]) => target));
    chapters.forEach(button => {
      const active = button.dataset.mapChapter === activeChapter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    targets.forEach(target => target.classList.toggle('is-active', linkedTargets.has(target.dataset.mapTarget)));
    svg.querySelectorAll('.temple-connection').forEach(path => {
      path.classList.toggle('is-active', path.dataset.mapChapter === activeChapter);
    });
    explanation.textContent = activeChapter
      ? summaries[activeChapter]
      : 'בחרו פרק כדי להאיר את הקשר בינו לבין ההלכות ברמב״ם.';
    if (activeChapter && window.innerWidth <= 800) {
      const firstTarget = targets.find(target => linkedTargets.has(target.dataset.mapTarget));
      if (firstTarget) scrollToPanel(firstTarget);
    }
  }

  function drawConnections(animate = false) {
    if (comparison.hidden || window.innerWidth <= 800) return;
    drawTimers.forEach(clearTimeout);
    drawTimers = [];
    const bounds = grid.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    svg.replaceChildren();
    links.forEach(([chapter, destination], index) => {
      const source = chapters.find(item => item.dataset.mapChapter === chapter).getBoundingClientRect();
      const target = targets.find(item => item.dataset.mapTarget === destination).getBoundingClientRect();
      const x1 = source.left - bounds.left;
      const y1 = source.top - bounds.top + source.height / 2;
      const x2 = target.right - bounds.left;
      const y2 = target.top - bounds.top + target.height / 2;
      const mid = (x1 + x2) / 2;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`);
      path.setAttribute('class', `temple-connection${destination === 'inheritance' ? ' temple-connection--partial' : ''}${chapter === activeChapter ? ' is-active' : ''}`);
      path.dataset.mapChapter = chapter;
      svg.appendChild(path);
      if (animate && !reducedMotion.matches) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = String(length);
        path.style.strokeDashoffset = String(length);
        drawTimers.push(setTimeout(() => {
          path.style.transition = 'stroke-dashoffset .65s ease, stroke .25s ease, stroke-width .25s ease, opacity .25s ease';
          path.style.strokeDashoffset = '0';
        }, index * 90 + 40));
        drawTimers.push(setTimeout(() => {
          path.style.strokeDasharray = '';
          path.style.strokeDashoffset = '';
          path.style.transition = '';
        }, index * 90 + 760));
      }
    });
  }

  lawsButton.addEventListener('click', () => setLaws(lawsButton.getAttribute('aria-expanded') !== 'true'));
  bridgeButton.addEventListener('click', () => setBridge(bridgeButton.getAttribute('aria-expanded') !== 'true'));
  comparisonButton.addEventListener('click', () => setComparison(comparisonButton.getAttribute('aria-expanded') !== 'true'));
  chapters.forEach(button => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => emphasizeChapter(button.dataset.mapChapter));
  });
  window.addEventListener('resize', () => drawConnections());
})();
