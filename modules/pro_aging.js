window.registerModule('pro_aging', {
  title: "Vencimiento de Cobros & Antigüedad de Deuda",
  badge: "COBROS",
  scope: "pro",
  span: 2,
  heightMm: 44,
  defaultRows: 4,
  render: (mod) => `
    <table class="print-table">
      <thead>
        <tr>
          <th style="width:26%;">Cliente / Factura Nº</th>
          <th style="width:14%; text-align:center;">Emisión</th>
          <th style="width:18%; text-align:center;">Vto. / Crédito</th>
          <th style="width:14%; text-align:right;">Importe (€)</th>
          <th style="width:28%; text-align:center;">Gestión de Cobro</th>
        </tr>
      </thead>
      <tbody>
        ${Array.from({length: mod.rows || 4}).map(() => `
          <tr>
            <td></td>
            <td class="align-center"></td>
            <td class="align-center"><span style="font-size:7px; color:var(--ink-mid);">[ ] 30d [ ] 60d</span></td>
            <td></td>
            <td class="align-center"><span style="font-size:7px;">[ ] 1ª Avis [ ] Reclam [ ] Cobrado</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `
});
