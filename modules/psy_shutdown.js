window.registerModule('psy_shutdown', {
  title: "Cierre Cognitivo & Desconexión",
  badge: "CIERRE",
  scope: "psy",
  span: 1,
  heightMm: 42,
  render: () => `
    <div>
      <div class="checkbox-row"><div class="box-square"></div> <span style="font-size:8px;">1 victoria lograda hoy:</span></div>
      <div style="height:6mm; border-bottom:1px solid var(--ink-rule);"></div>
      <div class="checkbox-row" style="margin-top:2px;"><div class="box-square"></div> <span style="font-size:8px;">Primera acción de mañana:</span></div>
      <div style="height:6mm; border-bottom:1px solid var(--ink-rule);"></div>
    </div>
  `
});
