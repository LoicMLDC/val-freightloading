function cell(text, className) {
  const td = document.createElement('td');
  if (className) {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text;
    td.append(span);
  } else {
    td.textContent = text;
  }
  return td;
}

async function loadSchedule() {
  const res = await fetch('/api/schedule');
  const data = await res.json();

  document.getElementById('subtitle').textContent = `${data.terminal} \u2014 ${data.gate}`;
  document.getElementById('schedule').replaceChildren(...data.slots.map((s) => {
    const tr = document.createElement('tr');
    tr.append(
      cell(s.slot),
      cell(s.carrier),
      cell(s.commodity),
      cell(s.status, `badge ${s.status.toLowerCase()}`),
    );
    return tr;
  }));
}

loadSchedule();
