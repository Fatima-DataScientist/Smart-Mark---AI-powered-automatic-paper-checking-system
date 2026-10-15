/* Keeps the shared SmartMark sidebar destinations consistent across every page. */
(() => {
  const destinations = {
    dashboard: 'dashboard.html',
    'my exams': 'my-exams.html',
    'create exam': 'create-exam.html',
    analytics: 'class-selection.html',
    'report cards': 'export-reports.html',
    settings: 'settings.html'
  };

  document.querySelectorAll('a').forEach((link) => {
    const label = link.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
    const destinationKey = Object.keys(destinations).find(
      (key) => label === key || label.endsWith(key)
    );
    const destination = destinations[destinationKey];

    if (destination) {
      link.setAttribute('href', destination);
    }
  });
})();
