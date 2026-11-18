(() => {
  const station = document.getElementById('chapter-expansion');
  const image = document.getElementById('chapter-expansion-image');
  const visual = document.getElementById('chapter-expansion-visual');
  const title = document.getElementById('chapter-expansion-caption-title');
  const copy = document.getElementById('chapter-expansion-caption-copy');
  const buttons = [...document.querySelectorAll('[data-expansion-topic]')];
  if (!station || !image || !visual || !title || !copy || buttons.length !== 4) return;

  const topics = {
    mistake: {
      src: 'chapter-four-images/judge-mistake.jpg',
      alt: 'דיין מהרהר בפסק מול בעלי דין, ופרה ועגל נראים בחצר מאחוריהם',
      title: 'דיני הטועה בדין',
      copy: 'מן האחריות של מי שהתיר בכור על סמך בדיקת מום, המשנה עוברת לאחריותו של דיין שטעה בדין וגרם הפסד.'
    },
    payment: {
      src: 'chapter-four-images/mitzvah-payment.jpg',
      alt: 'מומחה בודק את עינו של עגל בכור, ולצדו בעל הבהמה ומטבעות על שולחן',
      title: 'נטילת שכר למצוות',
      copy: 'משכרו של מומחה הבודק מומי בכורות, הדיון מתרחב לשכר על הוראה, עדות ומצוות ולהיתר שכר בטלה.'
    },
    trust: {
      src: 'chapter-four-images/suspected-observance.png',
      alt: 'בשוק עתיק, בעל עגל משוחח עם קונה וחכם בשאלת הנאמנות לדבריו',
      title: 'דיני חשודים למצוות',
      copy: 'מן הנאמנות על מומי בכור, המשנה והגמרא בוחנות את נאמנות החשודים גם בענייני תרומות, מעשרות ושביעית.'
    },
    chaver: {
      src: 'chapter-four-images/chaver-status.png',
      alt: 'חכם מלמד בני בית בחצר עתיקה ליד סלי תבואה ופירות וכלי אוכל',
      title: 'דיני חברות',
      copy: 'מבירור מי נאמן בענייני בכורות, הדיון עובר לקבלת חברות, למעמד בני הבית ולנאמנותו של החבר.'
    }
  };

  let active = 'mistake';
  buttons.forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.expansionTopic;
    const topic = topics[key];
    if (!topic || key === active) return;
    active = key;
    buttons.forEach(item => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    image.alt = topic.alt;
    image.src = topic.src;
    title.textContent = topic.title;
    copy.textContent = topic.copy;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      image.classList.remove('is-changing');
      void image.offsetWidth;
      image.classList.add('is-changing');
    }
    if (window.matchMedia('(max-width: 950px)').matches) {
      visual.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  }));

  const preload = () => Object.values(topics).slice(1).forEach(topic => {
    const preview = new Image();
    preview.src = topic.src;
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      preload();
      observer.disconnect();
    }, { rootMargin: '350px' });
    observer.observe(station);
  } else preload();
})();
