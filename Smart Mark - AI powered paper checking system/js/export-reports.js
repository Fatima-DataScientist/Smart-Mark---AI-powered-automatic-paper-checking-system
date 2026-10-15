(() => {
  const sessionKey = 'smartmark-demo-session';
  if (localStorage.getItem(sessionKey) !== 'active') { location.replace('login.html'); return; }
  const students = ['Ahmed Raza','Sara Khan','Ali Hassan','Fatima Noor','Ayesha Khan','Hamza Ali','Zainab Ahmed','Usman Tariq','Hira Malik','Bilal Shah','Maham Iqbal','Danish Khan','Noor Fatima','Ibrahim Ali','Sana Raza','Omar Farooq','Laiba Khan','Abdullah Ahmed','Anaya Malik','Saad Hussain','Maryam Ali','Talha Raza','Iqra Khan','Hassan Ali','Minal Shah','Rayan Ahmed','Eman Noor','Arham Khan','Alina Raza','Rida Fatima'].map((name, index) => ({ id: `STU-${String(index + 1).padStart(3, '0')}`, name, score: 10 + ((index * 3 + 3) % 6), flagged: [1,4,8,14,21,27].includes(index), email: `${name.toLowerCase().replace(/\s+/g, '.')}@school.edu` }));
  const $ = selector => document.querySelector(selector);
  $('#email').innerHTML = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-4px;margin-right:7px"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>Email to Students';
  const $$ = selector => [...document.querySelectorAll(selector)];
  let format = 'individual';
  let recipientMode = 'all';
  const manual = new Set(students.map(student => student.id));
  const toast = $('.toast'); let toastTimer;
  const say = message => { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3300); };
  $('[data-logout]').addEventListener('click', () => { localStorage.removeItem(sessionKey); localStorage.removeItem('smartmark-demo-name'); location.href = 'login.html'; });

  const selectedStudents = () => recipientMode === 'flagged' ? students.filter(student => student.flagged) : recipientMode === 'manual' ? students.filter(student => manual.has(student.id)) : students;
  const fileSafe = student => `${student.name.replace(/\s+/g, '_')}_Midterm_ReportCard`;
  const options = () => ({ breakdown: $('#breakdown').checked, comparison: $('#comparison').checked, feedback: $('#feedback').checked });
  const csvValue = value => `"${String(value).replaceAll('"', '""')}"`;
  const makeCsv = list => {
    const header = ['Student ID','Student name','Q1','Q2','Q3','Total marks (out of 15)','Percentage','Grade','Flagged for review'];
    const rows = list.map((student, index) => { const q1 = 3 + (index % 3), q2 = 3 + ((index + 1) % 3), q3 = student.score - q1 - q2; return [student.id, student.name, q1, q2, q3, student.score, `${Math.round(student.score / 15 * 100)}%`, student.score >= 12 ? 'A' : student.score >= 10 ? 'B' : 'C', student.flagged ? 'Yes' : 'No']; });
    return '\uFEFF' + [header, ...rows].map(row => row.map(csvValue).join(',')).join('\r\n');
  };
  const download = (content, fileName, type) => { const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement('a'); link.href = url; link.download = fileName; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500); };
  const pdfEscape = text => String(text).replace(/[\\()]/g, '\\$&').replace(/[^\x20-\x7E]/g, '?');
  const makePdf = list => {
    const lines = ['SmartMark — Midterm Examination report cards', `Generated: ${new Date().toLocaleDateString()}`, ''];
    list.forEach((student, index) => { lines.push(`${index + 1}. ${student.name} (${student.id}) — ${student.score}/15 (${Math.round(student.score / 15 * 100)}%)`); if (options().breakdown) lines.push('   Question marks: Q1 4/5, Q2 5/5, Q3 ' + Math.max(1, student.score - 9) + '/5'); if (options().comparison) lines.push('   Class average: 12/15'); if (options().feedback) lines.push('   Feedback: Good work. Continue practising the topics covered.'); lines.push(''); });
    const content = lines.slice(0, 46).map((line, index) => `BT /F1 11 Tf 50 ${790 - index * 16} Td (${pdfEscape(line)}) Tj ET`).join('\n');
    const objects = ['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${content.length} >>\nstream\n${content}\nendstream`];
    let output = '%PDF-1.4\n'; const offsets = [0]; objects.forEach((object, index) => { offsets.push(output.length); output += `${index + 1} 0 obj\n${object}\nendobj\n`; }); const start = output.length; output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`; return output;
  };
  const previewStudent = student => { const score = Math.round(student.score / 15 * 100); const popup = window.open('', '_blank', 'width=760,height=760'); if (!popup) { say('Please allow pop-ups to preview this report card.'); return; } popup.document.write(`<!doctype html><title>${student.name} — Report Card</title><style>body{font:16px Arial;margin:55px;color:#17172c}header{border-bottom:4px solid #6d5ce8;padding-bottom:18px}h1{margin:0;color:#6d5ce8}.score{font-size:42px;color:#6d5ce8;margin:35px 0 20px}section{border:1px solid #ddd;border-radius:10px;padding:18px;margin-top:20px}</style><header><h1>SmartMark</h1><p>Midterm Examination — Student Report Card</p></header><h2>${student.name}</h2><p>Student ID: ${student.id}</p><p class="score">${student.score}<small>/15 (${score}%)</small></p><section><h3>Question-by-question breakdown</h3><p>Q1: 4/5 &nbsp; Q2: 5/5 &nbsp; Q3: ${Math.max(1, student.score - 9)}/5</p></section><section><h3>Teacher feedback</h3><p>Good work. Continue practising the topics covered.</p></section>`); popup.document.close(); };
  const render = () => {
    const list = selectedStudents(); const formatLabel = format === 'csv' ? 'Spreadsheet (CSV)' : format === 'combined' ? 'Combined PDF' : 'Individual PDFs';
    $$('.format-card').forEach(card => { const active = card.dataset.format === format; card.classList.toggle('selected', active); card.setAttribute('aria-checked', active); });
    $('.manual-picker').hidden = recipientMode !== 'manual';
    $('#summary').innerHTML = `Exporting <b>${list.length} ${format === 'csv' ? 'students' : 'report cards'}</b> as <b>${formatLabel}</b>`;
    $('#preview-list').innerHTML = list.length ? list.slice(0, 4).map(student => `<article class="preview-item"><div class="doc-icon">▱</div><div class="preview-text"><b>${fileSafe(student)}.pdf</b><span>1 page · Score, breakdown, class comparison, feedback</span></div><div><button class="btn-outline" type="button" data-preview="${student.id}">Preview</button><button class="btn-primary" type="button" data-download="${student.id}">Download PDF</button></div></article>`).join('') + (list.length > 4 ? `<div class="preview-more">+ ${list.length - 4} more included in the export</div>` : '') : '<div class="preview-more">No students selected. Choose at least one student.</div>';
  };
  $$('.format-card').forEach(card => card.addEventListener('click', () => { format = card.dataset.format; render(); }));
  $$('input[name="recipients"]').forEach(radio => radio.addEventListener('change', () => { recipientMode = radio.value; render(); }));
  $('#student-picker').innerHTML = students.map(student => `<label><input type="checkbox" value="${student.id}" checked> ${student.name}</label>`).join('');
  $('#student-picker').addEventListener('change', event => { if (event.target.checked) manual.add(event.target.value); else manual.delete(event.target.value); render(); });
  $('[data-select-all]').addEventListener('click', () => { students.forEach(student => manual.add(student.id)); $$('#student-picker input').forEach(input => input.checked = true); render(); });
  $('[data-clear]').addEventListener('click', () => { manual.clear(); $$('#student-picker input').forEach(input => input.checked = false); render(); });
  $('#preview-list').addEventListener('click', event => { const id = event.target.dataset.preview || event.target.dataset.download; if (!id) return; const student = students.find(item => item.id === id); if (event.target.dataset.preview) previewStudent(student); else { download(makePdf([student]), `${fileSafe(student)}.pdf`, 'application/pdf'); say(`Downloaded ${fileSafe(student)}.pdf`); } });
  $('#generate').addEventListener('click', () => { const list = selectedStudents(); if (!list.length) { say('Select at least one student first.'); return; } if (format === 'csv') { download(makeCsv(list), 'Midterm_Examination_Combined_Results.csv', 'text/csv;charset=utf-8'); say(`Downloaded combined CSV results for ${list.length} students.`); } else { const suffix = format === 'combined' ? 'Combined_Report_Cards' : 'Selected_Report_Cards'; download(makePdf(list), `Midterm_Examination_${suffix}.pdf`, 'application/pdf'); say(`Downloaded ${list.length} report card${list.length === 1 ? '' : 's'}.`); } });
  const modal = $('#email-modal'); const closeEmail = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); };
  $('#email').addEventListener('click', () => { const count = selectedStudents().length; if (!count) { say('Select at least one student first.'); return; } $('#email-count').textContent = `${count} ${count === 1 ? 'student' : 'students'}`; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); });
  $$('[data-close-email]').forEach(button => button.addEventListener('click', closeEmail));
  $('#send-email').addEventListener('click', () => { const list = selectedStudents(); const subject = $('#email-subject').value.trim(); if (!subject) { say('Please add an email subject.'); return; } const body = $('#email-message').value; const bcc = list.map(student => student.email).join(','); location.href = `mailto:?bcc=${encodeURIComponent(bcc)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`; closeEmail(); say('Email draft opened with the selected students in Bcc.'); });
  const referenceCsvRows = [
    ['STU-001','Ahmed Raza',9,8,7,9,8,41,'82%','A',3,'35.7'],['STU-002','Sara Khan',7,8,9,5,10,39,'78%','B',7,'35.7'],['STU-003','Ali Hassan',4,5,8,6,8,31,'62%','C',26,'35.7'],['STU-004','Fatima Noor',9,10,5,6,6,36,'72%','B',14,'35.7'],['STU-005','Usman Tariq',8,9,6,7,9,39,'78%','B',7,'35.7'],['STU-006','Ayesha Malik',6,5,8,5,9,33,'66%','C',21,'35.7'],['STU-007','Bilal Ahmad',9,6,4,10,4,33,'66%','C',21,'35.7'],['STU-008','Hira Saleem',5,4,7,5,6,27,'54%','D',30,'35.7'],['STU-009','Hamza Sheikh',6,7,6,7,8,34,'68%','C',19,'35.7'],['STU-010','Zainab Iqbal',6,6,8,9,9,38,'76%','B',10,'35.7'],
    ['STU-011','Omar Farooq',9,5,5,4,5,28,'56%','D',29,'35.7'],['STU-012','Maryam Aslam',8,9,5,10,7,39,'78%','B',7,'35.7'],['STU-013','Daniyal Butt',10,9,6,5,5,35,'70%','B',16,'35.7'],['STU-014','Sana Javed',9,7,6,6,5,33,'66%','C',21,'35.7'],['STU-015','Talha Mehmood',9,6,5,5,8,33,'66%','C',21,'35.7'],['STU-016','Noor Fatima',9,7,10,10,6,42,'84%','A',2,'35.7'],['STU-017','Hassan Raza',9,7,6,8,8,38,'76%','B',10,'35.7'],['STU-018','Iqra Shahid',7,10,5,6,4,32,'64%','C',25,'35.7'],['STU-019','Faisal Mahmood',6,5,7,5,8,31,'62%','C',26,'35.7'],['STU-020','Laiba Rauf',8,5,8,8,7,36,'72%','B',14,'35.7'],
    ['STU-021','Saad Anwar',7,8,8,8,9,40,'80%','A',5,'35.7'],['STU-022','Rabia Nawaz',7,10,7,8,8,40,'80%','A',5,'35.7'],['STU-023','Junaid Akhtar',6,8,7,6,10,37,'74%','B',13,'35.7'],['STU-024','Amna Siddiqui',9,9,9,6,8,41,'82%','A',3,'35.7'],['STU-025','Shahzaib Ali',9,9,7,10,8,43,'86%','A',1,'35.7'],['STU-026','Mehwish Zafar',6,7,10,6,6,35,'70%','B',16,'35.7'],['STU-027','Kamran Yousaf',8,5,5,6,6,30,'60%','C',28,'35.7'],['STU-028','Anum Rashid',10,8,6,6,4,34,'68%','C',19,'35.7'],['STU-029','Waqar Hussain',9,7,9,5,8,38,'76%','B',10,'35.7'],['STU-030','Komal Riaz',10,6,8,6,5,35,'70%','B',16,'35.7']
  ];
  const makeReferenceCsv = list => {
    const selectedIds = new Set(list.map(student => student.id));
    const header = ['Student ID','Name','Q1','Q2','Q3','Q4','Q5','Total (/50)','Percent','Grade','Rank','Class Average'];
    return '\uFEFF' + [header, ...referenceCsvRows.filter(row => selectedIds.has(row[0]))].map(row => row.map(csvValue).join(',')).join('\r\n');
  };
  function makeStyledPdf(list) {
    const esc = value => String(value).replace(/[\\()]/g, '\\$&').replace(/[^\x20-\x7E]/g, '?');
    const text = (x, y, size, value, bold = false, color = '0.12 0.12 0.22') => `BT /${bold ? 'F2' : 'F1'} ${size} Tf ${color} rg ${x} ${y} Td (${esc(value)}) Tj ET`;
    const rect = (x, y, width, height, color, stroke = '') => `${color} ${stroke ? 'RG' : 'rg'} ${x} ${y} ${width} ${height} re ${stroke ? 'S' : 'f'}`;
    const pageStream = student => {
      const marks = [9, 8, 7, 9, 8], total = 41, stream = [];
      stream.push(rect(0, 702, 595, 140, '0.427 0.361 0.91'));
      stream.push(text(45, 790, 27, 'SmartMark', true, '1 1 1'), text(45, 765, 16, 'Student Report Card', false, '1 1 1'));
      stream.push(text(45, 665, 21, 'Data Structures & Algorithms - Mid-Term', true), text(45, 643, 14, 'Mid-Term Examination', false, '0.42 0.46 0.54'));
      stream.push(rect(45, 520, 505, 96, '0.975 0.97 1'), '0.85 0.82 0.99 RG 1 w 45 520 505 96 re S');
      stream.push(text(60, 580, 24, student.name, true), text(60, 553, 15, `Student ID: ${student.id}`, false, '0.42 0.46 0.54'));
      stream.push(text(395, 576, 28, `${total} / 50`, true, '0.427 0.361 0.91'), text(395, 551, 15, '82%   Grade A', true));
      stream.push(text(45, 475, 20, 'Question-by-question breakdown', true));
      stream.push(rect(45, 430, 505, 32, '0.96 0.95 1'), text(60, 442, 12, 'Question', true, '0.42 0.46 0.54'), text(150, 442, 12, 'Marks', true, '0.42 0.46 0.54'), text(220, 442, 12, 'Max', true, '0.42 0.46 0.54'), text(275, 442, 12, 'Comments', true, '0.42 0.46 0.54'));
      marks.forEach((mark, index) => { const y = 405 - index * 34; stream.push(text(60, y, 13, `Q${index + 1}`, true), text(150, y, 13, String(mark)), text(220, y, 13, '10', false, '0.42 0.46 0.54'), text(275, y, 12, mark >= 8 ? 'Excellent answer, clear and correct.' : 'Good understanding; minor gaps in explanation.', false, '0.42 0.46 0.54'), '0.9 0.9 0.96 RG 0.5 w 45 ' + (y - 14) + ' m 550 ' + (y - 14) + ' l S'); });
      stream.push(text(45, 200, 20, 'Class comparison', true));
      [['Class average','35.7 / 50'],['Your rank','3 of 30'],['Highest score','43 / 50']].forEach((card, index) => { const x = 45 + index * 171; stream.push(rect(x, 118, 155, 58, '0.98 0.975 1'), '0.85 0.82 0.99 RG 1 w ' + x + ' 118 155 58 re S', text(x + 14, 151, 12, card[0], false, '0.42 0.46 0.54'), text(x + 14, 130, 18, card[1], true)); });
      stream.push(text(45, 78, 20, "Teacher's overall feedback", true), text(60, 52, 12, `${student.name.split(' ')[0]} has shown a strong grasp of the material. Answers were accurate and well structured.`), text(60, 35, 12, 'Keep practising complex problems on trees and graphs to stay ahead.'));
      return stream.join('\n');
    };
    const streams = list.map(pageStream), count = streams.length, objects = [];
    const kids = streams.map((_, index) => `${5 + index * 2} 0 R`).join(' ');
    objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'; objects[2] = `<< /Type /Pages /Kids [${kids}] /Count ${count} >>`; objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'; objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>';
    streams.forEach((stream, index) => { const page = 5 + index * 2, content = page + 1; objects[page] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${content} 0 R >>`; objects[content] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`; });
    let pdf = '%PDF-1.4\n', offsets = [0]; for (let index = 1; index < objects.length; index += 1) { offsets[index] = pdf.length; pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`; } const start = pdf.length; pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`; return pdf;
  }
  $('#preview-list').addEventListener('click', event => {
    if (!event.target.dataset.download) return;
    event.stopImmediatePropagation();
    const student = students.find(item => item.id === event.target.dataset.download);
    download(makeStyledPdf([student]), `${fileSafe(student)}.pdf`, 'application/pdf');
    say(`Downloaded ${fileSafe(student)}.pdf`);
  }, true);
  $('#generate').addEventListener('click', event => {
    event.stopImmediatePropagation();
    download(makeReferenceCsv(students), 'DSA_MidTerm_Results.csv', 'text/csv;charset=utf-8');
    say('Downloaded combined CSV results for all 30 students.');
  }, true);
  function openStyledPreview(student) {
    const marks = [9, 8, 7, 9, 8];
    const total = marks.reduce((sum, mark) => sum + mark, 0);
    const percentage = Math.round(total / 50 * 100);
    const comment = mark => mark >= 8 ? 'Excellent answer, clear and correct.' : 'Good understanding; minor gaps in explanation.';
    const popup = window.open('', '_blank', 'width=1120,height=860');
    if (!popup) { say('Please allow pop-ups to preview this report card.'); return; }
    popup.document.write(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${student.name} — SmartMark Report Card</title><style>*{box-sizing:border-box}body{margin:0;background:#e7e7e7;color:#202037;font-family:Arial,sans-serif}.viewer{min-height:100vh;padding:30px 20px}.paper{width:min(920px,100%);min-height:1160px;margin:auto;background:#fff;box-shadow:0 3px 18px #0002}.brand{height:140px;padding:34px 80px;background:#6d5ce8;color:#fff}.brand h1{margin:0;font-size:39px}.brand p{margin:9px 0;font-size:22px}.content{padding:34px 80px}.exam{margin:0;font-size:28px}.sub{margin:8px 0 28px;color:#6c7587;font-size:20px}.student{display:flex;justify-content:space-between;align-items:center;padding:24px 30px;border:2px solid #ddd7ff;background:#f8f7ff}.student h2{margin:0 0 14px;font-size:31px}.student p{margin:0;color:#6c7587;font-size:19px}.total{color:#6d5ce8;font-size:42px;font-weight:800}.total small{display:block;margin-top:9px;color:#202037;font-size:20px}h3{margin:38px 0 18px;font-size:25px}table{width:100%;border-collapse:collapse;font-size:18px}th{padding:14px 20px;background:#f5f3ff;color:#687386;text-align:left;font-size:16px}td{padding:15px 20px;border-bottom:1px solid #e6e6f4}td:first-child{font-weight:700}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.cards div,.feedback{border:2px solid #ddd7ff;background:#fbfaff;padding:22px 24px}.cards span{display:block;margin-bottom:16px;color:#6c7587;font-size:17px}.cards b{font-size:29px}.feedback{font-size:19px;line-height:1.55}@media print{body{background:#fff}.viewer{padding:0}.paper{box-shadow:none;width:100%}}</style></head><body><div class="viewer"><article class="paper"><header class="brand"><h1>SmartMark</h1><p>Student Report Card</p></header><main class="content"><h2 class="exam">Data Structures &amp; Algorithms - Mid-Term</h2><p class="sub">Mid-Term Examination</p><section class="student"><div><h2>${student.name}</h2><p>Student ID: ${student.id}</p></div><div class="total">${total} / 50<small>${percentage}% &nbsp; Grade A</small></div></section><h3>Question-by-question breakdown</h3><table><thead><tr><th>Question</th><th>Marks</th><th>Max</th><th>Comments</th></tr></thead><tbody>${marks.map((mark,index) => `<tr><td>Q${index + 1}</td><td>${mark}</td><td>10</td><td>${comment(mark)}</td></tr>`).join('')}</tbody></table><h3>Class comparison</h3><section class="cards"><div><span>Class average</span><b>35.7 / 50</b></div><div><span>Your rank</span><b>3 of 30</b></div><div><span>Highest score</span><b>43 / 50</b></div></section><h3>Teacher's overall feedback</h3><section class="feedback">${student.name.split(' ')[0]} has shown a strong grasp of the material. Answers were accurate and well structured. Keep practising complex problems on trees and graphs to stay ahead.</section></main></article></div></body></html>`);
    popup.document.close();
  }
  $('#preview-list').addEventListener('click', event => {
    if (!event.target.dataset.preview) return;
    event.stopImmediatePropagation();
    openStyledPreview(students.find(student => student.id === event.target.dataset.preview));
  }, true);
  render();
})();
