window.registerModule('pers_expenses', {
  title: "Gastos Domésticos / Personales",
  badge: "HOGAR",
  scope: "pers",
  span: 1,
  heightMm: 46,
  defaultRows: 5,
  render: (mod) => `
    <table class="print-table">
      <thead>
        <tr>
          <th style="width:65%;">Concepto / Compra</th>
          <th style="width:35%; text-align:right;">Importe (€)</th>
        </tr>
      </thead>
      <tbody>
        ${Array.from({length: mod.rows || 5}).map(() => `
          <tr><td></td><td></td></tr>
        `).join('')}
      </tbody>
    </table>
  `
});
