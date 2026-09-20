// Paste each project's complete GitHub repository URL between the quotes below.
// Leave an empty string to keep its button marked "Coming soon".
const projectGitHubUrls = {
  'underwater-mine-seeker': '',
  'rgb-matrix-maze': '',
};

document.querySelectorAll('[data-project-github]').forEach((link) => {
  const value = projectGitHubUrls[link.dataset.projectGithub];
  if (!value) return;
  let url;
  try { url = new URL(value); } catch { return; }
  if (url.protocol !== 'https:' || url.hostname !== 'github.com') return;
  link.href = url.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'View on GitHub ↗';
  link.removeAttribute('aria-disabled');
  link.removeAttribute('role');
});
