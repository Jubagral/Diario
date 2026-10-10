window.registerModule('gen_schedule', {
  title: "Time-Blocking Diario (07:00 - 20:00)",
  badge: "HORARIO",
  scope: "mix",
  span: 1,
  heightMm: 95,
  render: () => {
    const hours = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];
    return `
      <div>
        ${hours.map(h => `
          <div style="display:flex; align-items:center; height:6.3mm; border-bottom:1px solid var(--ink-rule);">
            <span style="font-size:7.5px; font-weight:700; width:30px; color:var(--ink-mid);">${h}</span>
            <div style="flex:1;"></div>
          </div>
        `).join('')}
      </div>
    `;
  }
});