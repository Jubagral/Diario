window.registerModule('pro_pipeline', {
  title: "Pipeline Comercial & Presupuestos",
  badge: "VENTAS",
  scope: "pro",
  span: 2,
  heightMm: 38,
  defaultRows: 3,
  render: (mod) => `
    <table class="print-table">
      <thead>
        <tr>
          <th style="width:35%;">Cliente / Proyecto</th>
          <th style="width:25%;">Alcance</th>
          <th style="width:18%; text-align:right;">Presupuesto (€)</th>
          <th style="width:22%; text-align:center;">Seguimiento</th>
        </tr>
      </thead>
      <tbody>
        ${Array.from({length: mod.rows || 3}).map(() => `
          <tr><td></td><td></td><td></td><td class="align-center"><span style="font-size:7px;">[ ] Contactar [ ] Cerrado</span></td></tr>
        `).join('')}
      </tbody>
    </table>
  `
});
