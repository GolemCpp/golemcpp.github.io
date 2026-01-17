// Put your custom JS code here
window.addEventListener('scroll', () => {
  const scroll = window.scrollY / (document.body.scrollHeight - window.innerHeight);

  // Animate position diagonally with scroll (0-100%)
  document.documentElement.style.setProperty('--bg-pos-x', `${scroll * 100}%`);
  document.documentElement.style.setProperty('--bg-pos-y', `${scroll * 100}%`);

  // Or animate color stops: `--offset: ${scroll * 100}%`
});
