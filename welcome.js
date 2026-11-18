(() => {
  const dialog = document.getElementById("welcome-dialog");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const goToStation = id => {
    const station = document.getElementById(id);
    dialog.close();
    if (!station) return;
    history.replaceState(null, "", `#${id}`);
    station.scrollIntoView({ behavior: "instant", block: "start" });
    station.setAttribute("tabindex", "-1");
    station.focus({ preventScroll: true });
  };

  dialog.addEventListener("click", event => {
    if (event.target === dialog) {
      dialog.close();
      return;
    }
    const path = event.target.closest("[data-welcome-target]");
    if (path) {
      event.preventDefault();
      goToStation(path.dataset.welcomeTarget);
      return;
    }
    if (event.target.closest("[data-welcome-close]")) dialog.close();
  });

  dialog.showModal();
})();
