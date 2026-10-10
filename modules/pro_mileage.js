window.registerModule('pro_mileage', {
  title: "Desplazamientos & Dietas (Afectos)",
  badge: "MOVILIDAD",
  scope: "pro",
  span: 2,
  heightMm: 38,
  defaultRows: 3,
  render: (mod) => `
    <table class="print-table">
      <thead>
        <tr>
          <th style="width:35%;">Origen - Destino</th>
          <th style="width:35%;">Cliente / Justificación</th>
          <th style="width:15%; text-align:right;">Km</th>
          <th style="width:15%; text-align:right;">Peaje/Park</th>
        </tr>
      </thead>
      <tbody>
        ${Array.from({length: mod.rows || 3}).map(() => `
          <tr><td></td><td></td><td></td><td></td></tr>
        `).join('')}
      </tbody>
    </table>
  `
});
