window.registerModule('psy_braindump', {
  title: "Vaciado Mental (Brain Dump)",
  badge: "NOTAS",
  scope: "psy",
  span: 1,
  heightMm: 50,
  defaultRows: 5,
  render: (mod) => `<div class="paper-lines" style="height:${(mod.rows || 5) * 7.5}mm;"></div>`
});
