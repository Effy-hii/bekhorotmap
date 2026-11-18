(() => {
  const links = [...document.querySelectorAll(".side-nav a[data-section]")];
  const sections = links.map(link => document.getElementById(link.dataset.section));
  if (sections.some(section => !section)) return;

  let scheduled = false;
  const update = () => {
    scheduled = false;
    const focusLine = window.innerHeight * 0.38;
    let activeSection = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= focusLine) activeSection = section;
    }
    for (const link of links) {
      const active = link.dataset.section === activeSection.id;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };
  const scheduleUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  update();
})();
