window.registerModule('prod_parking', {
  title: "Parking de Interrupciones",
  badge: "CAPTURA",
  scope: "psy",
  span: 1,
  heightMm: 46,
  defaultRows: 5,
  render: (mod) => `
    <div>
      ${Array.from({length: mod.rows || 5}).map(() => `
        <div class="checkbox-row"><div class="box-square"></div><div style="flex:1;"></div></div>
      `).join('')}
    </div>
  `
});
