window.registerModule('pro_expenses', {
  title: "Gastos Deducibles (Actividad)",
  badge: "PRO",
  scope: "pro",
  span: 1,
  heightMm: 46,
  defaultRows: 5,
  render: (mod) => `
    <table class="print-table">
      <thead>
        <tr>
          <th style="width:50%;">Concepto / Proveedor</th>
          <th style="width:25%; text-align:right;">Base / Total</th>
          <th style="width:25%; text-align:center;">¿Fact NIF?</th>
        </tr>
      </thead>
      <tbody>
        ${Array.from({length: mod.rows || 5}).map(() => `
          <tr><td></td><td></td><td class="align-center"><div class="box-square" style="margin:auto;"></div></td></tr>
        `).join('')}
      </tbody>
    </table>
  `
});
