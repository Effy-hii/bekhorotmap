(() => {
  const groups = [
    {
      key: "exodus",
      title: "ציווי על הבכורה ביציאת מצרים",
      subtitle: "שמות י״ג · קדושת הבכור באדם ובבהמה",
      chapters: [{ source: "c0213.htm", label: "שמות י״ג, ב; יא–טו" }]
    },
    {
      key: "wilderness",
      title: "פדיון הבכורות במדבר",
      subtitle: "במדבר ג׳ · החלפת הבכורות בלויים ופדיון העודפים",
      chapters: [{ source: "c0403.htm", label: "במדבר ג׳, יא–טז; מ–נא" }]
    },
    {
      key: "additional",
      title: "ציוויים נוספים על הבכורה",
      subtitle: "שמות ל״ד, במדבר י״ח ודברים ט״ו",
      chapters: [
        { source: "c0234.htm", label: "שמות ל״ד, יט–כ" },
        { source: "c0418.htm", label: "במדבר י״ח, טו–יח" },
        { source: "c0515.htm", label: "דברים ט״ו, יט–כג" }
      ]
    },
    {
      key: "tithe",
      title: "מעשר בהמה",
      subtitle: "ויקרא כ״ז · הבהמה העשירית העוברת תחת השבט",
      chapters: [{ source: "c0327.htm", label: "ויקרא כ״ז, לב–לג" }]
    }
  ];
  const container = document.getElementById("verse-groups");
  const passages = window.BEKHOROT_TORAH_PASSAGES || [];
  if (!container || !passages.length) return;

  for (const group of groups) {
    const section = document.createElement("section");
    section.className = `verse-group verse-group--${group.key}`;
    if (group.key === "tithe") section.hidden = true;
    section.setAttribute("aria-labelledby", `verses-${group.key}`);
    const header = document.createElement("div");
    header.className = "verse-group-heading";
    const title = document.createElement("h3");
    title.id = `verses-${group.key}`;
    title.textContent = group.title;
    const subtitle = document.createElement("p");
    subtitle.textContent = group.subtitle;
    header.append(title, subtitle);
    section.append(header);

    const list = document.createElement("div");
    list.className = "passage-list";
    for (const chapter of group.chapters) {
      const chapterPassages = passages.filter(passage => passage.sourceUrl.endsWith(chapter.source));
      if (!chapterPassages.length) continue;
      const details = document.createElement("details");
      details.className = "passage";
      const summary = document.createElement("summary");
      const label = document.createElement("strong");
      label.textContent = chapter.label;
      const prompt = document.createElement("span");
      prompt.textContent = "לקריאת הפסוקים";
      summary.append(label, prompt);
      details.append(summary);
      const body = document.createElement("div");
      body.className = "passage-body";
      for (const [passageIndex, passage] of chapterPassages.entries()) {
        if (passageIndex > 0 && chapter.source !== "c0418.htm") {
          const gap = document.createElement("hr");
          gap.className = "verse-gap";
          gap.setAttribute("aria-label", "דילוג בין קטעי פסוקים");
          body.append(gap);
        }
        for (const verse of passage.verses) {
          const line = document.createElement("p");
          line.className = "verse";
          const number = document.createElement("span");
          number.className = "verse-number";
          number.textContent = verse.number;
          line.append(number, document.createTextNode(verse.text));
          body.append(line);
        }
      }
      const source = document.createElement("a");
      source.href = chapterPassages[0].sourceUrl;
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      source.className = "verse-source-link";
      source.textContent = "לפרק המלא במכון ממרא";
      body.append(source);
      details.append(body);
      list.append(details);
    }
    section.append(list);
    container.append(section);
  }
})();
