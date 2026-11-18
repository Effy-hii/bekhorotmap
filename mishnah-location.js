(() => {
  const station = document.getElementById("mishnah-location");
  const openButton = document.getElementById("open-kodashim");
  const closeButton = document.getElementById("close-kodashim");
  const tractates = document.getElementById("kodashim-tractates");
  if (!station || !openButton || !closeButton || !tractates) return;

  const revealOrders = () => station.classList.add("is-visible");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      revealOrders();
      observer.disconnect();
    }, { threshold: 0.15 });
    observer.observe(station);
  } else revealOrders();

  const scrollBehavior = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  openButton.addEventListener("click", () => {
    tractates.hidden = false;
    tractates.classList.add("is-open");
    openButton.setAttribute("aria-expanded", "true");
    openButton.querySelector("small").textContent = "סדר קדשים פתוח";
    tractates.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  });
  closeButton.addEventListener("click", () => {
    tractates.hidden = true;
    tractates.classList.remove("is-open");
    openButton.setAttribute("aria-expanded", "false");
    openButton.querySelector("small").textContent = "לחצו לפתיחת הסדר ←";
    openButton.focus({ preventScroll: true });
    station.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  });
})();
