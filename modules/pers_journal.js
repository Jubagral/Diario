window.registerModule('pers_journal', {
  title: "Diario Personal & Reflexión",
  badge: "DIARIO",
  scope: "pers",
  span: 1,
  heightMm: 55,
  defaultRows: 6,
  render: (mod) => `<div class="paper-lines" style="height:${(mod.rows || 6) * 7.5}mm;"></div>`
});
