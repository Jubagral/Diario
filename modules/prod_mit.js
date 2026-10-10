window.registerModule('prod_mit', {
  title: "Regla 1-3: Foco Crítico Innegociable",
  badge: "FOCO",
  scope: "psy",
  span: 2,
  heightMm: 34,
  render: () => `
    <div>
      <div style="display:flex; align-items:center; gap:6px; height:8mm; border-bottom:1.5px solid #000;">
        <span style="font-size:8px; font-weight:800; background:#000; color:#fff; padding:1px 4px; border-radius:2px;">1. CRÍTICO</span>
        <div class="box-square"></div>
        <div style="flex:1;"></div>
      </div>
      <div style="display:flex; align-items:center; gap:6px; height:7mm; border-bottom:1px solid var(--ink-rule);">
        <span style="font-size:7.5px; font-weight:700; color:var(--ink-mid);">2. SECUNDARIO</span>
        <div class="box-square"></div>
        <div style="flex:1;"></div>
      </div>
      <div style="display:flex; align-items:center; gap:6px; height:7mm; border-bottom:1px solid var(--ink-rule);">
        <span style="font-size:7.5px; font-weight:700; color:var(--ink-mid);">3. SECUNDARIO</span>
        <div class="box-square"></div>
        <div style="flex:1;"></div>
      </div>
    </div>
  `
});
