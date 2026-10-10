window.registerModule('pers_cooldown', {
  title: "Enfriamiento de Compras (48h)",
  badge: "AHORRO",
  scope: "pers",
  span: 1,
  heightMm: 44,
  defaultRows: 4,
  render: (mod) => `
    <table class="print-table">
      <thead>
        <tr>
          <th style="width:50%;">Artículo Deseado</th>
          <th style="width:25%; text-align:right;">Precio €</th>
          <th style="width:25%; text-align:center;">¿Tras 48h?</th>
        </tr>
      </thead>
      <tbody>
        ${Array.from({length: mod.rows || 4}).map(() => `
          <tr><td></td><td></td><td class="align-center"><span style="font-size:7px;">[ ] SÍ [ ] NO</span></td></tr>
        `).join('')}
      </tbody>
    </table>
  `
});
