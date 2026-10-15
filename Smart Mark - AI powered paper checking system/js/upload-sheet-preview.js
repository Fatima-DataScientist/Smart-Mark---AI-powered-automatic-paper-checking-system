(() => {
  const input = document.querySelector('#file-input');
  const list = document.querySelector('#file-list');
  if (!input || !list) return;

  const dialog = document.createElement('dialog');
  dialog.id = 'sheet-preview';
  dialog.innerHTML = `
    <div class="preview-head">
      <strong id="preview-title">Sheet preview</strong>
      <button type="button" aria-label="Close preview">×</button>
    </div>
    <div class="preview-content" id="preview-content"></div>`;
  document.body.append(dialog);

  const validFiles = (files) => [...files].filter((file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    return ['pdf', 'jpg', 'jpeg', 'png'].includes(extension) && file.size <= 20 * 1024 * 1024;
  });

  const addPreviews = (files, firstNewRow) => {
    validFiles(files).forEach((file, index) => {
      const row = list.children[firstNewRow + index];
      if (!row) return;

      const url = URL.createObjectURL(file);
      row.dataset.previewUrl = url;
      row.dataset.fileType = file.type;
      row.dataset.fileName = file.name;

      const icon = row.querySelector('.file-icon');
      if (file.type.startsWith('image/')) {
        icon.innerHTML = '';
        const thumbnail = document.createElement('img');
        thumbnail.className = 'file-thumbnail';
        thumbnail.src = url;
        thumbnail.alt = `Preview of ${file.name}`;
        icon.classList.add('file-visual');
        icon.append(thumbnail);
      } else {
        icon.textContent = 'PDF';
        icon.classList.add('file-visual', 'pdf-thumbnail');
      }

      const previewButton = document.createElement('button');
      previewButton.type = 'button';
      previewButton.className = 'preview';
      previewButton.textContent = 'Preview';
      row.querySelector('.status').insertAdjacentElement('afterend', previewButton);
    });
  };

  const wrapInputHandler = () => {
    const originalHandler = input.onchange;
    input.onchange = () => {
      const files = [...input.files];
      const firstNewRow = list.children.length;
      originalHandler.call(input);
      addPreviews(files, firstNewRow);
    };
  };
  wrapInputHandler();

  document.querySelector('#dropzone').addEventListener('drop', (event) => {
    // The existing batch-upload listener runs first and adds the rows.
    const firstNewRow = list.children.length - validFiles(event.dataTransfer.files).length;
    addPreviews(event.dataTransfer.files, firstNewRow);
  });

  const showPreview = (row) => {
    const url = row.dataset.previewUrl;
    if (!url) return;
    document.querySelector('#preview-title').textContent = row.dataset.fileName;
    const content = document.querySelector('#preview-content');
    content.replaceChildren();

    if (row.dataset.fileType.startsWith('image/')) {
      const image = document.createElement('img');
      image.src = url;
      image.alt = `Full preview of ${row.dataset.fileName}`;
      content.append(image);
    } else {
      const frame = document.createElement('iframe');
      frame.title = `PDF preview of ${row.dataset.fileName}`;
      frame.src = `${url}#toolbar=0&navpanes=0`;
      content.append(frame);
    }
    dialog.showModal();
  };

  list.addEventListener('click', (event) => {
    const row = event.target.closest('.file');
    if (!row) return;
    if (event.target.closest('.preview') || event.target.closest('.file-visual')) showPreview(row);
    if (event.target.closest('.remove') && row.dataset.previewUrl) URL.revokeObjectURL(row.dataset.previewUrl);
  });

  dialog.querySelector('button').onclick = () => dialog.close();
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
