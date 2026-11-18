(() => {
  const entries = window.BEKHOROT_AGGADAH || [];
  const filter = document.getElementById("aggadah-chapter-filter");
  const count = document.getElementById("aggadah-visible-count");
  const list = document.getElementById("aggadah-list");
  if (!filter || !count || !list) return;

  const chapterLetters = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳"];
  const chapterLabel = number => `פרק ${chapterLetters[number - 1] || number}`;

  const chapters = new Map(entries.map(entry => [entry.chapter, entry.chapterTitle]));
  for (const [number, title] of [...chapters].sort((a, b) => a[0] - b[0])) {
    const option = document.createElement("option");
    option.value = String(number);
    option.textContent = `${chapterLabel(number)} · ${title}`;
    filter.append(option);
  }

  const render = () => {
    const shown = entries.filter(entry => filter.value === "all" || String(entry.chapter) === filter.value);
    count.textContent = shown.length === 1 ? "סוגיה אחת" : `${shown.length} סוגיות`;
    const cards = shown.map(entry => {
      const card = document.createElement("article");
      card.className = "intro-aggadah-card";
      const heading = document.createElement("h3");
      heading.textContent = entry.title;
      const summary = document.createElement("p");
      const linkedEnding = "ראו על כך כאן";
      if (entry.note) {
        summary.textContent = entry.summary.split("\n")[0];
      } else if (entry.previewLink?.startsWith("https://") && entry.summary.endsWith(linkedEnding)) {
        summary.textContent = entry.summary.slice(0, -"כאן".length);
        const link = document.createElement("a");
        link.href = entry.previewLink;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "כאן";
        summary.append(link);
      } else {
        summary.textContent = entry.summary;
      }
      const types = document.createElement("div");
      types.className = "intro-aggadah-types";
      for (const type of entry.types || ["אגדה"]) {
        const badge = document.createElement("span");
        badge.textContent = type;
        types.append(badge);
      }
      if (entry.note && entry.previewLink?.startsWith("https://")) {
        const note = document.createElement("div");
        note.className = "intro-aggadah-note";
        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "intro-aggadah-note-trigger";
        trigger.textContent = "ⓘ על הסוגיה";
        trigger.setAttribute("aria-label", `מידע נוסף על ${entry.title}`);
        trigger.setAttribute("aria-expanded", "false");
        const panel = document.createElement("div");
        panel.className = "intro-aggadah-popover";
        panel.id = `aggadah-note-${entry.id}`;
        trigger.setAttribute("aria-controls", panel.id);
        const noteText = document.createElement("div");
        noteText.textContent = entry.note;
        const source = document.createElement("div");
        source.append(document.createTextNode("ראו על כך "));
        const link = document.createElement("a");
        link.href = entry.previewLink;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "כאן";
        source.append(link);
        panel.append(noteText, source);
        note.append(trigger, panel);
        trigger.addEventListener("click", () => {
          const open = note.classList.toggle("is-open");
          trigger.setAttribute("aria-expanded", String(open));
        });
        types.append(note);
      }
      const ref = document.createElement("span");
      ref.className = "intro-aggadah-ref";
      ref.textContent = `${chapterLabel(entry.chapter)} · ${entry.daf}`;
      card.append(heading, summary, types, ref);
      return card;
    });
    list.replaceChildren(...cards);
  };

  filter.addEventListener("change", render);
  document.addEventListener("click", event => {
    for (const note of list.querySelectorAll(".intro-aggadah-note.is-open")) {
      if (note.contains(event.target)) continue;
      note.classList.remove("is-open");
      note.querySelector("button")?.setAttribute("aria-expanded", "false");
    }
  });
  render();
})();
