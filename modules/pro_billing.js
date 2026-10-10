window.registerModule('pro_billing', {
  title: "Horas Facturables & Hitos",
  badge: "PRO",
  scope: "pro",
  span: 2,
  heightMm: 44,
  defaultRows: 4,
  render: (mod) => `
    <table class="print-table">
      <thead>
        <tr>
          <th style="width:28%;">Cliente / Proyecto</th>
          <th style="width:34%;">Tarea / Hito</th>
          <th style="width:10%; text-align:center;">Horas</th>
          <th style="width:14%; text-align:right;">Tarifa/€</th>
          <th style="width:14%; text-align:center;">Cobro</th>
        </tr>
      </thead>
      <tbody>
        ${Array.from({length: mod.rows || 4}).map(() => `
          <tr><td></td><td></td><td></td><td></td><td class="align-center"><span style="font-size:7px;">[ ] COB [ ] PEND</span></td></tr>
        `).join('')}
      </tbody>
    </table>
  `
});
