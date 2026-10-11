async function loadComponent(placeholderId, fileName) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;

  try {
    const response = await fetch(fileName);
    if (!response.ok) throw new Error(`Unable to load ${fileName}`);
    placeholder.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

loadComponent('header-placeholder', 'header.html');
loadComponent('footer-placeholder', 'footer.html');
