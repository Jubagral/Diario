window.registerModule('gen_tasks', {
  title: "Checklist de Tareas",
  badge: "TAREAS",
  scope: "mix",
  span: 1,
  heightMm: 50,
  defaultRows: 6,
  render: (mod) => `
    <div>
      ${Array.from({length: mod.rows || 6}).map(() => `
        <div class="checkbox-row"><div class="box-square"></div><div style="flex:1;"></div></div>
      `).join('')}
    </div>
  `
});