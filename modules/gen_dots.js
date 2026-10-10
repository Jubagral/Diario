window.registerModule('gen_dots', {
  title: "Trama de Puntos (Dot Grid 5mm)",
  badge: "PUNTOS",
  scope: "mix",
  span: 1,
  heightMm: 50,
  defaultRows: 6,
  render: (mod) => `<div class="paper-dots" style="height:${(mod.rows || 6) * 7.5}mm;"></div>`
});