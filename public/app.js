const $ = (id) => document.getElementById(id);

async function api(path, options) {
  const res = await fetch(path, options);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

function cell(text) {
  const td = document.createElement('td');
  td.textContent = text;
  return td;
}

async function loadDashboard() {
  const [stats, docks, shipments] = await Promise.all([
    api('/api/stats'),
    api('/api/docks'),
    api('/api/shipments'),
  ]);

  $('kpi-trucks').textContent = stats.trucksToday;
  $('kpi-tonnes').textContent = stats.tonnesLoaded;
  $('kpi-ontime').textContent = `${stats.onTimeRate}%`;
  $('kpi-docks').textContent = stats.activeDocks;

  const docksEl = $('docks');
  docksEl.replaceChildren(...docks.map((d) => {
    const div = document.createElement('div');
    div.className = `dock ${d.status.toLowerCase()}`;
    div.textContent = `${d.name} - ${d.status} (${d.utilization}%)`;
    return div;
  }));

  $('shipments').replaceChildren(...shipments.map((s) => {
    const tr = document.createElement('tr');
    tr.append(
      cell(s.id), cell(s.carrier), cell(s.destination), cell(s.dock),
      cell(s.weightKg.toLocaleString()), cell(s.status),
      cell(new Date(s.eta).toLocaleString()),
    );
    return tr;
  }));
}

$('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('login-error').textContent = '';
  try {
    await api('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: $('username').value, password: $('password').value }),
    });
    $('login-view').hidden = true;
    $('dashboard-view').hidden = false;
    await loadDashboard();
  } catch {
    $('login-error').textContent = 'Invalid credentials';
  }
});

$('refresh').addEventListener('click', loadDashboard);
