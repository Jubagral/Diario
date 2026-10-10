window.registerModule('pro_tax', {
  title: "Previsión Fiscal & Tesorería Diaria",
  badge: "FISCAL",
  scope: "pro",
  span: 1,
  heightMm: 46,
  render: () => `
    <div class="kpi-row" style="grid-template-columns:1fr 1fr;">
      <div class="kpi-cell"><span class="kpi-label">Facturado Hoy</span><div style="font-size:10px; text-align:right; font-weight:700;">€</div></div>
      <div class="kpi-cell"><span class="kpi-label">Reserva IVA (21%)</span><div style="font-size:10px; text-align:right; color:#b91c1c; font-weight:700;">€</div></div>
      <div class="kpi-cell"><span class="kpi-label">Reserva IRPF (20%)</span><div style="font-size:10px; text-align:right; color:#b91c1c; font-weight:700;">€</div></div>
      <div class="kpi-cell" style="border:1.5px solid #000;"><span class="kpi-label">Líquido Propio</span><div style="font-size:10px; text-align:right; font-weight:800;">€</div></div>
    </div>
  `
});
