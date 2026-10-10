window.registerModule('gen_eisenhower', {
  title: "Matriz Eisenhower (Urgente / Importante)",
  badge: "MATRIZ",
  scope: "mix",
  span: 2,
  heightMm: 48,
  render: () => `
    <div style="display:grid; grid-template-columns:1fr 1fr; grid-template-rows:1fr 1fr; gap:4px; height:38mm;">
      <div style="border:1px solid var(--ink-dark); padding:3px;">
        <span style="font-size:7px; font-weight:800; text-transform:uppercase;">1. Urgente & Importante (Hacer Ya)</span>
      </div>
      <div style="border:1px solid var(--ink-dark); padding:3px;">
        <span style="font-size:7px; font-weight:800; text-transform:uppercase;">2. No Urgente & Importante (Planificar)</span>
      </div>
      <div style="border:1px solid var(--ink-rule); padding:3px;">
        <span style="font-size:7px; font-weight:700; color:var(--ink-mid); text-transform:uppercase;">3. Urgente & No Importante (Delegar)</span>
      </div>
      <div style="border:1px solid var(--ink-rule); padding:3px;">
        <span style="font-size:7px; font-weight:700; color:var(--ink-mid); text-transform:uppercase;">4. Ni Urgente Ni Importante (Eliminar)</span>
      </div>
    </div>
  `
});