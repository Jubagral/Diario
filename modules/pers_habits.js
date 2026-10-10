window.registerModule('pers_habits', {
  title: "Hábitos, Bienestar & Rutina",
  badge: "SALUD",
  scope: "pers",
  span: 1,
  heightMm: 40,
  render: () => `
    <div>
      ${['Agua (2L) / Hidratación', 'Caminata / Ejercicio', 'Lectura / Estudio', 'Desconexión digital 22:00'].map(h => `
        <div class="checkbox-row"><div class="box-circle"></div><span style="font-size:8.5px;">${h}</span></div>
      `).join('')}
    </div>
  `
});
