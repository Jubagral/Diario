window.registerModule('psy_weekly_review', {
  title: "Cierre Semanal & Balance Dominical",
  badge: "BALANCE",
  scope: "psy",
  span: 2,
  heightMm: 62,
  render: () => `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; height:100%;">
      <!-- Columna 1: Balance de la semana terminada -->
      <div style="display:flex; flex-direction:column; gap:4px; border-right:1px solid var(--ink-rule); padding-right:5px;">
        <span style="font-size:7.5px; font-weight:800; text-transform:uppercase; color:var(--ink-mid);">1. Logros & Victorias Clave</span>
        <div class="checkbox-row" style="height:5.5mm;"><div class="box-square"></div><div style="flex:1;"></div></div>
        <div class="checkbox-row" style="height:5.5mm;"><div class="box-square"></div><div style="flex:1;"></div></div>
        
        <span style="font-size:7.5px; font-weight:800; text-transform:uppercase; color:var(--ink-mid); margin-top:3px;">2. Arqueo Operativo & Cierre</span>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:3px;">
          <div style="border:1px solid var(--ink-rule); padding:2px 4px; font-size:7px;">
            <strong>Horas Facturables:</strong> ____ h
          </div>
          <div style="border:1px solid var(--ink-rule); padding:2px 4px; font-size:7px;">
            <strong>Tickets / NIF:</strong> [ ] Revisados
          </div>
        </div>
        <div style="border:1px solid var(--ink-rule); padding:2px 4px; font-size:7px;">
          <strong>Desconexión & Salud:</strong> [ ] Cumplida [ ] Ajustar
        </div>
      </div>

      <!-- Columna 2: Foco para la semana entrante -->
      <div style="display:flex; flex-direction:column; gap:4px; padding-left:2px;">
        <span style="font-size:7.5px; font-weight:800; text-transform:uppercase; color:var(--ink-mid);">3. Fricciones & Lección Aprendida</span>
        <div style="height:11mm; border-bottom:1px solid var(--ink-rule); font-size:7.5px; color:var(--ink-light); padding:2px;">
          ¿Qué consumió tiempo sin aportar valor?
        </div>

        <span style="font-size:7.5px; font-weight:800; text-transform:uppercase; color:var(--ink-mid); margin-top:2px;">4. Focos MIT Innegociables Semana Próxima</span>
        <div class="checkbox-row" style="height:5.5mm;"><div class="box-square"></div><span style="font-size:7px; font-weight:700; color:var(--ink-mid);">1.</span><div style="flex:1;"></div></div>
        <div class="checkbox-row" style="height:5.5mm;"><div class="box-square"></div><span style="font-size:7px; font-weight:700; color:var(--ink-mid);">2.</span><div style="flex:1;"></div></div>
        <div class="checkbox-row" style="height:5.5mm;"><div class="box-square"></div><span style="font-size:7px; font-weight:700; color:var(--ink-mid);">3.</span><div style="flex:1;"></div></div>
      </div>
    </div>
  `
});
