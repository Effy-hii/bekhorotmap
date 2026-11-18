(() => {
  const chapters = {
    a: { location: "פרק א׳ · פטר חמור", title: "הלוקח עובר חמורו", copy: "פתיחת המסכת בדיני פטר חמור ודרכי פדיונו." },
    b: { location: "פרק ב׳ · בכור בהמה", title: "הלוקח עובר פרתו", copy: "החיוב והפטור בבכור בהמה טהורה." },
    c: { location: "פרק ג׳ · בכור בהמה", title: "הלוקח בהמה", copy: "בירור ספקות בכורה בקניית בהמה." },
    d: { location: "פרק ד׳ · בכור בהמה", title: "עד כמה", copy: "הטיפול בבכור הבהמה ובדיקת מומיו." },
    e: { location: "פרק ה׳ · בכור בהמה", title: "כל פסולי המוקדשין", copy: "דיני בהמות קדושות שנפסלו, ובכללן בכור בעל מום." },
    f: { location: "פרק ו׳ · בכור בהמה", title: "על אלו מומין", copy: "מומי הבכור הפוסלים אותו מהקרבה." },
    g: { location: "פרק ז׳ · מומי כהנים", title: "מומין אלו", copy: "מומים הפוסלים כהן מעבודת המקדש — נושא נלווה לענייני הבכורה." },
    h: { location: "פרק ח׳ · בכור אדם", title: "יש בכור", copy: "בכורה לנחלה ופדיון הבן." },
    i: { location: "פרק ט׳ · מעשר בהמה", title: "מעשר בהמה", copy: "חיוב מעשר בהמה, צירוף עדרים, מועדי ההפרשה ומניין הבהמות היוצאות מן הדיר." }
  };
  const buttons = [...document.querySelectorAll("[data-structure-chapter]")];
  const rows = [...document.querySelectorAll("[data-structure-row]")];
  const studyLayout = document.getElementById("structure-study");
  const studyPanel = document.querySelector(".structure-study-panel");
  const location = document.getElementById("structure-detail-location");
  const title = document.getElementById("structure-detail-title");
  const copy = document.getElementById("structure-detail-copy");
  const mishnahSection = document.getElementById("structure-mishnah");
  const mishnahSummary = mishnahSection?.querySelector("summary span");
  const mishnahCount = document.getElementById("structure-mishnah-count");
  const mishnahIntro = document.getElementById("structure-mishnah-intro");
  const mishnahList = document.getElementById("structure-mishnah-list");
  const mishnahChapters = window.BEKHOROT_MISHNAH?.chapters || [];
  const chapterLetters = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳"];
  const mishnahLetters = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳", "י׳", "י״א", "י״ב"];
  if (!buttons.length || !rows.length || !location || !title || !copy) return;

  const renderMishnayot = chapterNumber => {
    if (!mishnahSummary || !mishnahCount || !mishnahIntro || !mishnahList) return;
    const mishnayot = mishnahChapters.find(chapter => chapter.chapter === chapterNumber)?.mishnayot || [];
    const chapterLetter = chapterLetters[chapterNumber - 1];
    mishnahSummary.textContent = `לימוד משניות פרק ${chapterLetter}`;
    mishnahCount.textContent = `${mishnayot.length} משניות`;
    mishnahIntro.textContent = `פרק ${chapterLetter} · המשניות לפי סדרן`;
    mishnahList.replaceChildren();
    for (const [index, text] of mishnayot.entries()) {
      const article = document.createElement("article");
      article.className = "structure-mishnah-unit";
      const heading = document.createElement("h4");
      heading.textContent = `משנה ${mishnahLetters[index] || index + 1}`;
      const body = document.createElement("p");
      body.textContent = text.trim();
      article.append(heading, body);
      mishnahList.append(article);
    }
  };

  const selectChapter = (key, source) => {
    const chapter = chapters[key];
    if (!chapter) return;
    for (const item of buttons) {
      const active = item.dataset.structureChapter === key;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    }
    for (const row of rows) {
      const active = row.dataset.structureRow === key;
      row.classList.toggle("is-active", active);
      row.setAttribute("aria-pressed", String(active));
    }
    location.textContent = chapter.location;
    title.textContent = chapter.title;
    copy.textContent = chapter.copy;
    renderMishnayot(Object.keys(chapters).indexOf(key) + 1);
    if (source === "map") studyLayout?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (source === "row" && window.matchMedia("(max-width: 900px)").matches) {
      studyPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  for (const button of buttons) button.addEventListener("click", () => selectChapter(button.dataset.structureChapter, "map"));
  for (const row of rows) row.addEventListener("click", () => selectChapter(row.dataset.structureRow, "row"));
  renderMishnayot(1);
})();
