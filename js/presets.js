// Plantillas base de distribución de módulos
window.BASE_PRESETS = {
  dual: {
    name: "Día Dual (Profesional + Personal)",
    modules: [
      { type: 'prod_mit', span: 2, rows: 0 },
      { type: 'pro_billing', span: 2, rows: 4 },
      { type: 'pro_expenses', span: 1, rows: 4 },
      { type: 'pers_expenses', span: 1, rows: 4 },
      { type: 'pro_tax', span: 1, rows: 0 },
      { type: 'psy_shutdown', span: 1, rows: 0 }
    ]
  },
  focus: {
    name: "Día Enfoque (Deep Work)",
    modules: [
      { type: 'prod_mit', span: 2, rows: 0 },
      { type: 'prod_deepwork', span: 1, rows: 0 },
      { type: 'prod_parking', span: 1, rows: 5 },
      { type: 'pro_billing', span: 2, rows: 5 },
      { type: 'psy_braindump', span: 1, rows: 5 },
      { type: 'psy_shutdown', span: 1, rows: 0 }
    ]
  },
  commercial: {
    name: "Día Comercial / Movilidad",
    modules: [
      { type: 'pro_pipeline', span: 2, rows: 4 },
      { type: 'pro_mileage', span: 2, rows: 4 },
      { type: 'pro_billing', span: 2, rows: 4 },
      { type: 'pro_expenses', span: 1, rows: 5 },
      { type: 'pro_tax', span: 1, rows: 0 }
    ]
  },
  personal: {
    name: "Día Personal & Finanzas Hogar",
    modules: [
      { type: 'pers_journal', span: 1, rows: 8 },
      { type: 'pers_expenses', span: 1, rows: 6 },
      { type: 'pers_cooldown', span: 1, rows: 4 },
      { type: 'pers_habits', span: 1, rows: 0 },
      { type: 'psy_braindump', span: 2, rows: 6 }
    ]
  },
  schedule: {
    name: "Día Planificado (Time-Blocking)",
    modules: [
      { type: 'prod_mit', span: 2, rows: 0 },
      { type: 'gen_schedule', span: 1, rows: 0 },
      { type: 'gen_tasks', span: 1, rows: 5 },
      { type: 'pro_billing', span: 2, rows: 4 },
      { type: 'pro_tax', span: 1, rows: 0 },
      { type: 'psy_shutdown', span: 1, rows: 0 }
    ]
  },
  weekly_review: {
    name: "Cierre Semanal (Balance & Planificación)",
    modules: [
      { type: 'psy_weekly_review', span: 2, rows: 0 },
      { type: 'pro_tax', span: 1, rows: 0 },
      { type: 'pro_aging', span: 1, rows: 4 },
      { type: 'psy_shutdown', span: 1, rows: 0 },
      { type: 'gen_dots', span: 1, rows: 6 }
    ]
  },
  blank_notes: {
    name: "Cara B / Cuaderno & Bocetos",
    modules: [
      { type: 'psy_braindump', span: 2, rows: 8 },
      { type: 'gen_dots', span: 2, rows: 12 }
    ]
  }
};

window.BASE_FOOTERS = {
  pro: {
    name: "Cierre Profesional (Horas, NIF, Agenda)",
    type: "checklist",
    items: ["Horas al registro", "Tickets y facturas NIF archivadas", "Agenda de mañana revisada"],
    html: `<div style="display:flex; gap:10px;">
             <div class="handoff-item"><div class="box-square"></div> Horas al registro</div>
             <div class="handoff-item"><div class="box-square"></div> Facturas NIF archivadas</div>
             <div class="handoff-item"><div class="box-square"></div> Agenda revisada</div>
           </div>`
  },
  personal: {
    name: "Cierre Personal (Desconexión, Hogar, Hábitos)",
    type: "checklist",
    items: ["Desconexión laboral", "Gastos del hogar anotados", "Rutina y bienestar"],
    html: `<div style="display:flex; gap:10px;">
             <div class="handoff-item"><div class="box-square"></div> Desconexión laboral</div>
             <div class="handoff-item"><div class="box-square"></div> Gastos hogar anotados</div>
             <div class="handoff-item"><div class="box-square"></div> Hábitos cumplidos</div>
           </div>`
  },
  mixed: {
    name: "Cierre Mixto (Fiscal, Particulares, Foco)",
    type: "checklist",
    items: ["Cierre administrativo", "Gastos registrados", "Foco de mañana"],
    html: `<div style="display:flex; gap:10px;">
             <div class="handoff-item"><div class="box-square"></div> Cierre administrativo</div>
             <div class="handoff-item"><div class="box-square"></div> Gastos registrados</div>
             <div class="handoff-item"><div class="box-square"></div> Foco mañana listo</div>
           </div>`
  },
  blank: {
    name: "En Blanco (Para rellenar a mano)",
    type: "blank",
    items: [],
    html: `<div style="flex:1; border-bottom:1px solid var(--ink-dark); height:4mm;"></div>`
  }
};

window.BASE_HEADERS = {
  default: {
    name: "Control y Operativa Estándar",
    dailyTitle: "DIARIO DE CONTROL DIARIO",
    dailySubtitle: "Enfoque Operativo, Registro Analítico & Tesorería",
    metaDateLabel: "FECHA:",
    metaDaySlots: "L M X J V S D",
    footerBrand: "FOLIO A4 | IMPRESO LOCALMENTE"
  },
  personal: {
    name: "Bitácora & Reflexión Personal",
    dailyTitle: "BITÁCORA PERSONAL",
    dailySubtitle: "Reflexión, Hábitos & Bienestar",
    metaDateLabel: "DÍA:",
    metaDaySlots: "L M X J V S D | ☀️ ⛅ 🌧️",
    footerBrand: "USO PERSONAL / HOGAR"
  },
  technical: {
    name: "Planificador Técnico & Proyectos",
    dailyTitle: "CUADERNO TÉCNICO DE PROYECTO",
    dailySubtitle: "Arquitectura, Desarrollo & Tareas",
    metaDateLabel: "FECHA / SPRINT:",
    metaDaySlots: "L M X J V S D",
    footerBrand: "PROYECTO NX | REGISTRO"
  },
  minimal: {
    name: "Minimalista Limpio",
    dailyTitle: "REGISTRO DIARIO",
    dailySubtitle: "",
    metaDateLabel: "FECHA:",
    metaDaySlots: "L M X J V S D",
    footerBrand: ""
  }
};

window.BASE_STYLES = {
  mono: {
    name: "Monocromo Puro (Contraste Máximo)",
    themePalette: "mono",
    font: "sans",
    ruleTone: "standard",
    gridStepMm: 7.5,
    boxStyle: "framed",
    boxRadius: "sharp",
    paperTone: "white",
    inkDark: "#000000",
    inkRule: "#cbd5e1",
    accentColor: "#000000",
    thumbTabBg: "#0f172a",
    thumbTabColor: "#ffffff"
  },
  laser_pure: {
    name: "Ahorro Láser Puro (Microtrama 0.25pt)",
    themePalette: "laser_pure",
    font: "mono",
    ruleTone: "faint",
    gridStepMm: 7.5,
    boxStyle: "open",
    boxRadius: "sharp",
    paperTone: "white",
    inkDark: "#000000",
    inkRule: "#000000",
    accentColor: "#000000",
    thumbTabBg: "#000000",
    thumbTabColor: "#ffffff"
  },
  nordic: {
    name: "Nordic Slate (Pizarra & Hielo)",
    themePalette: "nordic",
    font: "sans",
    ruleTone: "standard",
    gridStepMm: 7.0,
    boxStyle: "stripe",
    boxRadius: "rounded",
    paperTone: "white",
    inkDark: "#1e293b",
    inkRule: "#cbd5e1",
    accentColor: "#0284c7",
    thumbTabBg: "#0284c7",
    thumbTabColor: "#ffffff"
  },
  forest: {
    name: "Forest / Botánico (Salvia & Verde)",
    themePalette: "forest",
    font: "sans",
    ruleTone: "faint",
    gridStepMm: 6.0,
    boxStyle: "open",
    boxRadius: "sharp",
    paperTone: "cream",
    inkDark: "#14532d",
    inkRule: "#bbf7d0",
    accentColor: "#15803d",
    thumbTabBg: "#15803d",
    thumbTabColor: "#ffffff"
  },
  terracotta: {
    name: "Terracota / Cuero (Cálido)",
    themePalette: "terracotta",
    font: "serif",
    ruleTone: "faint",
    gridStepMm: 7.5,
    boxStyle: "inverted",
    boxRadius: "rounded",
    paperTone: "cream",
    inkDark: "#292524",
    inkRule: "#fed7aa",
    accentColor: "#c2410c",
    thumbTabBg: "#c2410c",
    thumbTabColor: "#ffffff"
  },
  graphite: {
    name: "Grafito Suave (Ahorro Tinta)",
    themePalette: "graphite",
    font: "sans",
    ruleTone: "faint",
    gridStepMm: 7.5,
    boxStyle: "framed",
    boxRadius: "sharp",
    paperTone: "white",
    inkDark: "#334155",
    inkRule: "#e2e8f0",
    accentColor: "#64748b",
    thumbTabBg: "#334155",
    thumbTabColor: "#ffffff"
  },
  technical: {
    name: "Azul Técnico (Blueprint / Código)",
    themePalette: "technical",
    font: "mono",
    ruleTone: "standard",
    gridStepMm: 5.0,
    boxStyle: "framed",
    boxRadius: "sharp",
    paperTone: "white",
    inkDark: "#0f2744",
    inkRule: "#bfdbfe",
    accentColor: "#1e40af",
    thumbTabBg: "#1e40af",
    thumbTabColor: "#ffffff"
  },
  editorial: {
    name: "Sepia Editorial (Lectura Libro)",
    themePalette: "editorial",
    font: "serif",
    ruleTone: "faint",
    gridStepMm: 7.5,
    boxStyle: "open",
    boxRadius: "rounded",
    paperTone: "cream",
    inkDark: "#292524",
    inkRule: "#e7e5e4",
    accentColor: "#57534e",
    thumbTabBg: "#57534e",
    thumbTabColor: "#ffffff"
  }
};
