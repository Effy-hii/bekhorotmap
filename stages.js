(() => {
  const button = document.getElementById("toggle-tithe");
  const layout = document.getElementById("topic-layout");
  const tithePanel = document.getElementById("tithe-panel");
  const closingLine = document.getElementById("closing-line");
  const title = document.getElementById("page-title");
  const lead = document.getElementById("intro-lead");
  if (!button || !layout || !tithePanel || !title || !lead) return;

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    const nextOpen = !isOpen;
    tithePanel.hidden = !nextOpen;
    if (closingLine) closingLine.hidden = !nextOpen;
    layout.classList.toggle("tithe-visible", nextOpen);
    button.setAttribute("aria-expanded", String(nextOpen));
    button.innerHTML = nextOpen
      ? 'הציגו בכורה בלבד <span aria-hidden="true">→</span>'
      : 'המשיכו למעשר בהמה <span aria-hidden="true">←</span>';
    title.innerHTML = nextOpen
      ? 'מי הראשון — <strong>ומי העשירי?</strong>'
      : 'מי נחשב <strong>בכור?</strong>';
    lead.textContent = nextOpen
      ? 'מסכת בכורות עוסקת בקדושת הבכור באדם ובבהמה, ולבסוף בדיני מעשר בהמה — הקדושה החלה על הבהמה העשירית.'
      : 'מסכת בכורות פותחת בקדושת הבכור באדם ובבהמה: פטר חמור, בכור בהמה טהורה ופדיון הבן.';
    if (nextOpen) tithePanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    else layout.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
