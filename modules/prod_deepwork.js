window.registerModule('prod_deepwork', {
  title: "Tracker de Deep Work (Bloques 50m)",
  badge: "ENFOQUE",
  scope: "psy",
  span: 1,
  heightMm: 32,
  render: () => `
    <div>
      <div style="font-size:8px; color:var(--ink-mid); margin-bottom:4px;">Bloques de 50 min sin distracciones:</div>
      <div style="display:flex; justify-content:space-between; align-items:center; height:12mm; border:1px solid var(--ink-mid); padding:0 8px;">
        ${Array.from({length: 6}).map((_, i) => `
          <div style="text-align:center;">
            <div class="box-square" style="width:5mm; height:5mm; margin:auto;"></div>
            <span style="font-size:7px; font-weight:700;">#${i+1}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `
});
