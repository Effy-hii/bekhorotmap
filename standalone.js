(() => {
  const dialog = document.getElementById('chapter-anatomy-dialog');
  const open = document.getElementById('chapter-anatomy-open');
  const close = document.getElementById('chapter-anatomy-close');
  const next = document.getElementById('chapter-anatomy-next');
  if (!dialog || !open || !close || !next) return;

  open.addEventListener('click', () => dialog.showModal());
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  next.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => open.focus());
})();
