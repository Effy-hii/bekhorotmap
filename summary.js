(() => {
  const chapters = window.BEKHOROT_SUMMARY || [];
  const stats = document.getElementById('summary-stats');
  const grid = document.getElementById('summary-grid');
  const dialog = document.getElementById('summary-dialog');
  const content = document.getElementById('summary-dialog-content');
  const close = document.getElementById('summary-dialog-close');
  if (chapters.length !== 9 || !stats || !grid || !dialog || !content || !close) return;

  const total = key => chapters.reduce((sum, chapter) => sum + (chapter[key] || 0), 0);
  const statItems = [
    [9, 'פרקים'],
    [60, 'דפים'],
    [total('sugyot'), 'סוגיות בסך הכול'],
    [total('aggadah'), 'סוגיות אגדה'],
    [total('aside'), 'סוגיות בדרך אגב במסכת']
  ];
  for (const [value, label] of statItems) {
    const item = document.createElement('div');
    item.setAttribute('aria-label', `${value} ${label}`);
    const number = document.createElement('b');
    number.className = 'count-up';
    number.dataset.target = String(value);
    number.setAttribute('aria-hidden', 'true');
    number.textContent = '0';
    const caption = document.createElement('span');
    caption.textContent = label;
    item.append(number, caption);
    stats.append(item);
  }

  const letters = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳', 'ט׳'];
  let returnFocus = null;

  function labeledCell(label, value) {
    const cell = document.createElement('span');
    cell.className = 'journey-summary-cell';
    const heading = document.createElement('b');
    heading.textContent = label;
    const text = document.createElement('span');
    text.textContent = value;
    cell.append(heading, text);
    return cell;
  }

  function openChapter(chapter, trigger) {
    returnFocus = trigger;
    content.replaceChildren();
    const heading = document.createElement('header');
    const title = document.createElement('h3');
    title.id = 'summary-dialog-title';
    title.textContent = chapter.title;
    const subtitle = document.createElement('p');
    subtitle.textContent = `פרק ${letters[chapter.number - 1]} · פירוט מלא`;
    const intro = document.createElement('p');
    intro.className = 'journey-summary-intro';
    intro.textContent = chapter.intro;
    heading.append(title, subtitle, intro);
    const list = document.createElement('div');
    list.className = 'journey-summary-topics';
    for (const topic of chapter.topics) {
      const article = document.createElement('article');
      const name = document.createElement('h4');
      name.textContent = topic.title;
      const description = document.createElement('p');
      description.textContent = topic.description;
      article.append(name, description);
      if (topic.aside) {
        const aside = document.createElement('span');
        aside.className = 'journey-summary-aside';
        aside.textContent = `${topic.aside} ${topic.aside === 1 ? 'סוגיה בדרך אגב' : 'סוגיות בדרך אגב'}`;
        article.append(aside);
      }
      list.append(article);
    }
    content.append(heading, list);
    dialog.showModal();
  }

  for (const chapter of chapters) {
    const available = Array.isArray(chapter.topics);
    const row = document.createElement(available ? 'button' : 'div');
    row.className = `journey-summary-row${available ? '' : ' is-pending'}`;
    if (available) {
      row.type = 'button';
      row.setAttribute('aria-haspopup', 'dialog');
      row.setAttribute('aria-label', `פתיחת נושאי פרק ${letters[chapter.number - 1]}: ${chapter.title}`);
      row.addEventListener('click', () => openChapter(chapter, row));
    }
    const name = document.createElement('span');
    name.className = 'journey-summary-name';
    const title = document.createElement('strong');
    title.textContent = chapter.title;
    const subtitle = document.createElement('span');
    subtitle.textContent = `פרק ${letters[chapter.number - 1]} · ${chapter.subtitle}`;
    name.append(title, subtitle);
    const arrow = document.createElement('span');
    arrow.className = 'journey-summary-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = available ? '←' : '—';
    row.append(
      name,
      labeledCell('סוגיות', String(chapter.sugyot)),
      labeledCell('אגדה', `${chapter.aggadah} ${chapter.aggadah === 1 ? 'סוגיית אגדה' : 'סוגיות אגדה'}`),
      labeledCell('בדרך אגב', available ? (chapter.aside ? `${chapter.aside} סוגיות` : 'אין') : 'הפירוט בהכנה'),
      arrow
    );
    grid.append(row);
  }

  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => returnFocus?.focus());

  const counters = [...stats.querySelectorAll('.count-up')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const numberFormat = new Intl.NumberFormat('he-IL');
  let statsVisible = false;
  let animationRun = 0;
  const animateCounter = (counter, delay, runId) => {
    const target = Number(counter.dataset.target);
    if (reduceMotion) {
      counter.textContent = numberFormat.format(target);
      return;
    }
    window.setTimeout(() => {
      if (runId !== animationRun) return;
      const startedAt = performance.now();
      const duration = 1500;
      const tick = now => {
        if (runId !== animationRun) return;
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = numberFormat.format(Math.round(target * eased));
        if (progress < 1) window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    }, delay);
  };
  const statsObserver = new IntersectionObserver(entries => {
    const entry = entries.find(item => item.target === stats);
    if (!entry || !entry.isIntersecting || statsVisible) return;
    statsVisible = true;
    animationRun += 1;
    const runId = animationRun;
    counters.forEach((counter, index) => animateCounter(counter, index * 110, runId));
    statsObserver.disconnect();
  }, { threshold: .55 });
  statsObserver.observe(stats);
})();
