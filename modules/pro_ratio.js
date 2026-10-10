window.registerModule('pro_ratio', {
  title: "Eficiencia: Facturable vs. Interno",
  badge: "RATIO",
  scope: "pro",
  span: 1,
  heightMm: 36,
  render: () => `
    <div class="kpi-row" style="grid-template-columns:1fr 1fr;">
      <div class="kpi-cell">
        <span class="kpi-label">Horas Facturables (Proyectos)</span>
        <div style="font-size:10px; text-align:right; font-weight:700;">h</div>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Horas Internas (Admin/Ventas)</span>
        <div style="font-size:10px; text-align:right; font-weight:700;">h</div>
      </div>
    </div>
  `
});