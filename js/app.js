// Registro central de módulos nativos
window.MODULE_CATALOG = {};

function validateModuleSchema(id, def) {
  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new Error(`El ID del módulo debe ser una cadena no vacía.`);
  }
  if (!def || typeof def !== 'object') {
    throw new Error(`La definición del módulo '${id}' debe ser un objeto.`);
  }
  if (typeof def.title !== 'string' || def.title.trim().length === 0) {
    throw new Error(`El módulo '${id}' debe tener una propiedad 'title' válida.`);
  }
  if (typeof def.render !== 'function' && typeof def.type !== 'string') {
    throw new Error(`El módulo '${id}' debe proporcionar una función 'render' o un 'type' estructural.`);
  }
  if (def.span !== undefined && def.span !== 1 && def.span !== 2) {
    throw new Error(`El módulo '${id}' especifica un 'span' inválido (${def.span}). Debe ser 1 o 2.`);
  }
  return true;
}

window.registerModule = function(id, definition) {
  try {
    validateModuleSchema(id, definition);
    window.MODULE_CATALOG[id] = definition;
  } catch (err) {
    console.error(`[Module Boundary Error] Fallo al registrar módulo '${id}':`, err.message);
  }
};

const THEME_PALETTES = {
  mono: { inkDark: '#000000', inkMid: '#475569', inkLight: '#94a3b8', inkRule: '#cbd5e1', accent: '#000000' },
  laser_pure: { inkDark: '#000000', inkMid: '#000000', inkLight: '#000000', inkRule: '#000000', accent: '#000000' },
  nordic: { inkDark: '#1e293b', inkMid: '#475569', inkLight: '#94a3b8', inkRule: '#cbd5e1', accent: '#0284c7' },
  forest: { inkDark: '#14532d', inkMid: '#166534', inkLight: '#86efac', inkRule: '#bbf7d0', accent: '#15803d' },
  terracotta: { inkDark: '#292524', inkMid: '#57534e', inkLight: '#fed7aa', inkRule: '#ffedd5', accent: '#c2410c' },
  graphite: { inkDark: '#334155', inkMid: '#64748b', inkLight: '#94a3b8', inkRule: '#e2e8f0', accent: '#64748b' },
  technical: { inkDark: '#0f2744', inkMid: '#1e40af', inkLight: '#60a5fa', inkRule: '#bfdbfe', accent: '#1e40af' },
  editorial: { inkDark: '#292524', inkMid: '#57534e', inkLight: '#a8a29e', inkRule: '#e7e5e4', accent: '#57534e' }
};

const FONT_FAMILIES = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
  mono: '"Courier New", Courier, "Lucida Console", monospace'
};

const RULE_TONES = {
  standard: '#cbd5e1',
  faint: '#e2e8f0',
  strong: '#94a3b8'
};

const PAPER_SIM_COLORS = {
  white: '#ffffff',
  cream: '#faf7ee',
  kraft: '#f4efe6'
};

const CURRENT_SCHEMA_VERSION = 14;
const STORAGE_KEY = 'diary_state_workshop_v14';

// Estado canónico central
let appState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  activeTab: 'tabSheet',
  paperFormat: 'a4_portrait',
  duplexMode: 'duplex_mirror',
  gutter: 'rings',
  hardwareMargin: 0,
  activeFace: 'A',
  spreadView: false,
  punchHoles: 'iso_2',
  thumbTab: 'OCT',
  thumbTabPos: '1',
  thumbTabBg: '#0f172a',
  thumbTabColor: '#ffffff',

  zoomLevel: 1.0,
  soloFolio: false,

  activeStyleKey: 'mono',
  theme: 'mono',
  font: 'sans',
  ruleTone: 'standard',
  gridStepMm: 7.5,
  boxStyle: 'framed',
  boxRadius: 'sharp',
  paperTone: 'white',
  accentColor: '#2563eb',
  customInkDark: null,
  customInkRule: null,

  faceA: {
    presetKey: 'dual',
    footerKey: 'pro',
    footerHtml: '',
    modules: []
  },

  faceB: {
    presetKey: 'blank_notes',
    footerKey: 'personal',
    footerHtml: '',
    modules: []
  },

  activeHeaderKey: 'default',
  dailyTitle: 'DIARIO DE CONTROL DIARIO',
  dailySubtitle: 'Enfoque Operativo, Registro Analítico & Tesorería',
  metaDateLabel: 'FECHA:',
  metaDaySlots: 'L M X J V S D',
  footerBrand: 'FOLIO A4 | IMPRESO LOCALMENTE',

  customModules: {},
  customPresets: {},
  customFooters: {},
  customHeaders: {},
  customStyles: {},
  savedAgendas: {},
  snapshots: { A: null, B: null, C: null }
};

let stagedImportData = null;
let isBatchPrintingActive = false;

function loadAndMigrateState() {
  const legacyKeys = [
    STORAGE_KEY,
    'diary_state_workshop_v13',
    'diary_state_workshop_v12',
    'diary_state_workshop_v11',
    'diary_state_workshop_v10',
    'diary_state_workshop_v9',
    'diary_state_workshop_v8',
    'diary_state_workshop_v7'
  ];

  let rawData = null;
  for (const k of legacyKeys) {
    const val = localStorage.getItem(k);
    if (val) {
      try {
        rawData = JSON.parse(val);
        break;
      } catch (e) {
        console.warn(`[Storage Warning] Error al parsear clave '${k}':`, e);
      }
    }
  }

  if (!rawData) return;

  const currentVer = rawData.schemaVersion || 10;
  if (currentVer < 14) {
    rawData.schemaVersion = 14;
    if (rawData.hardwareMargin === undefined) rawData.hardwareMargin = 0;
    if (rawData.zoomLevel === undefined) rawData.zoomLevel = 1.0;
    if (rawData.soloFolio === undefined) rawData.soloFolio = false;
    if (!rawData.thumbTabBg) rawData.thumbTabBg = '#0f172a';
    if (!rawData.thumbTabColor) rawData.thumbTabColor = '#ffffff';

    if (rawData.gridStepMm === undefined) rawData.gridStepMm = 7.5;
    if (!rawData.boxStyle) rawData.boxStyle = 'framed';
    if (!rawData.boxRadius) rawData.boxRadius = 'sharp';
    if (!rawData.paperTone) rawData.paperTone = 'white';
    if (!rawData.accentColor) rawData.accentColor = '#2563eb';

    if (!rawData.savedAgendas) rawData.savedAgendas = {};
    if (!rawData.snapshots) rawData.snapshots = { A: null, B: null, C: null };

    if (!rawData.customStyles) rawData.customStyles = {};
    if (!rawData.customHeaders) rawData.customHeaders = {};
    if (!rawData.customFooters) rawData.customFooters = {};
    if (!rawData.customPresets) rawData.customPresets = {};
    if (!rawData.customModules) rawData.customModules = {};
  }

  appState = Object.assign({}, appState, rawData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

window.addEventListener('DOMContentLoaded', () => {
  loadAndMigrateState();

  if (!appState.faceA.modules || appState.faceA.modules.length === 0) {
    appState.faceA.modules = JSON.parse(JSON.stringify(window.BASE_PRESETS.dual.modules));
  }
  if (!appState.faceB.modules || appState.faceB.modules.length === 0) {
    appState.faceB.modules = JSON.parse(JSON.stringify(window.BASE_PRESETS.blank_notes.modules));
  }

  document.getElementById('paperFormatSelect').value = appState.paperFormat || 'a4_portrait';
  document.getElementById('duplexModeSelect').value = appState.duplexMode || 'duplex_mirror';
  document.getElementById('gutterSelect').value = appState.gutter || 'rings';
  document.getElementById('hardwareMarginSelect').value = (appState.hardwareMargin !== undefined) ? appState.hardwareMargin : 0;
  document.getElementById('punchHolesSelect').value = appState.punchHoles || 'iso_2';
  document.getElementById('thumbTabInput').value = appState.thumbTab || '';
  document.getElementById('thumbTabPos').value = appState.thumbTabPos || '1';

  if (document.getElementById('thumbTabBgInput')) document.getElementById('thumbTabBgInput').value = appState.thumbTabBg || '#0f172a';
  if (document.getElementById('thumbTabTextInput')) document.getElementById('thumbTabTextInput').value = appState.thumbTabColor || '#ffffff';

  document.getElementById('themeSelect').value = appState.theme || 'mono';
  document.getElementById('fontSelect').value = appState.font || 'sans';
  document.getElementById('ruleToneSelect').value = appState.ruleTone || 'standard';

  document.getElementById('gridStepSelect').value = (appState.gridStepMm || 7.5).toFixed(1);
  document.getElementById('boxStyleSelect').value = appState.boxStyle || 'framed';
  document.getElementById('boxRadiusSelect').value = appState.boxRadius || 'sharp';
  document.getElementById('paperToneSelect').value = appState.paperTone || 'white';

  window.addEventListener('keydown', handleGlobalKeydown);
  window.addEventListener('resize', handleWindowResize);

  // Ciclo de vida de impresión: orientación dinámica y restauración de lienzo
  window.addEventListener('beforeprint', () => {
    preparePrintOrientation();
  });

  window.addEventListener('afterprint', () => {
    if (isBatchPrintingActive) {
      isBatchPrintingActive = false;
      renderWorkspace();
    }
  });

  switchTab(appState.activeTab || 'tabSheet', false);
  applyThemeStyles();
  applyHardwareMarginStyles();
  applySoloFolioState();
  applyZoomStyles();
  populatePresetSelect();
  populateFooterSelect();
  populateHeaderSelect();
  populateStyleSelect();
  renderSavedAgendasList();
  renderSnapshotMetadata();
  updateStorageQuotaMonitor();
  syncFolioInputs();
  renderCatalogUI();
  renderCustomCatalogList();
  renderWorkspace();
});

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  updateBudget();
  updateStorageQuotaMonitor();
}

/**
 * Inyecta dinámicamente la orientación A4 correcta en el diálogo de impresión
 */
function preparePrintOrientation(forceLandscape = false) {
  let styleEl = document.getElementById('printOrientationStyle');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'printOrientationStyle';
    document.head.appendChild(styleEl);
  }

  const isLandscape = forceLandscape || (appState.paperFormat === 'a5_duo');
  styleEl.innerHTML = `@page { size: A4 ${isLandscape ? 'landscape' : 'portrait'}; margin: 0; }`;
}

function triggerSafePrint(forceLandscape = false) {
  preparePrintOrientation(forceLandscape);
  window.print();
}

/* =====================================================================
   BIBLIOTECA DE AGENDAS GUARDADAS
   ===================================================================== */
function saveCurrentBatchAsAgenda() {
  const name = document.getElementById('batchAgendaName').value.trim() || `Agenda ${new Date().toLocaleDateString('es-ES')}`;
  const startDate = document.getElementById('batchStartDate').value;
  const endDate = document.getElementById('batchEndDate').value;
  if (!startDate || !endDate) { alert("Indica fecha de inicio y fin."); return; }

  const id = 'agenda_' + Date.now();
  if (!appState.savedAgendas) appState.savedAgendas = {};

  appState.savedAgendas[id] = {
    name,
    startDate,
    endDate,
    presetMonThu: document.getElementById('batchPresetMonThu').value,
    presetFri: document.getElementById('batchPresetFri').value,
    presetWeekend: document.getElementById('batchPresetWeekend').value,
    holidays: document.getElementById('batchHolidays').value.trim(),
    outputMode: document.getElementById('batchOutputMode').value,
    paperFormat: appState.paperFormat,
    gutter: appState.gutter,
    hardwareMargin: appState.hardwareMargin,
    styleKey: appState.activeStyleKey,
    createdAt: new Date().toISOString()
  };

  saveState();
  renderSavedAgendasList();
  closeBatchModal();
  alert(`Agenda "${name}" guardada en la biblioteca.`);
}

function renderSavedAgendasList() {
  const container = document.getElementById('savedAgendasContainer');
  if (!container) return;
  container.innerHTML = '';

  const keys = Object.keys(appState.savedAgendas || {});
  if (keys.length === 0) {
    container.innerHTML = '<div style="font-size:10px; color:var(--text-muted); padding:6px; text-align:center;">No hay agendas guardadas todavía.</div>';
    return;
  }

  keys.forEach(id => {
    const a = appState.savedAgendas[id];
    const modeBadge = a.outputMode === 'booklet' ? '📖 Booklet' : a.outputMode === 'duplex_sequence' ? '📄 Dúplex' : '📄 Simple';
    const card = document.createElement('div');
    card.className = 'agenda-item-card';
    card.innerHTML = `
      <div>
        <strong style="font-size:11px;">${a.name}</strong>
        <div class="agenda-meta">${a.startDate} al ${a.endDate} \vert{}${modeBadge}</div>
      </div>
      <div style="display:flex; gap:3px;">
        <button class="btn btn-primary" style="padding:3px 6px; font-size:10px;" title="Reimprimir directamente" onclick="reprintSavedAgenda('${id}')">🖨️</button>
        <button class="btn" style="padding:3px 6px; font-size:10px;" title="Cargar configuración en editor" onclick="loadSavedAgendaToEditor('${id}')">📂</button>
        <button class="btn btn-danger" style="padding:3px 6px; font-size:10px;" title="Eliminar agenda" onclick="deleteSavedAgenda('${id}')">🗑️</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function loadSavedAgendaToEditor(id) {
  const a = appState.savedAgendas[id];
  if (!a) return;

  openBatchModal();
  document.getElementById('batchAgendaName').value = a.name;
  document.getElementById('batchStartDate').value = a.startDate;
  document.getElementById('batchEndDate').value = a.endDate;
  document.getElementById('batchPresetMonThu').value = a.presetMonThu;
  document.getElementById('batchPresetFri').value = a.presetFri;
  document.getElementById('batchPresetWeekend').value = a.presetWeekend;
  document.getElementById('batchHolidays').value = a.holidays || '';
  document.getElementById('batchOutputMode').value = a.outputMode;

  if (a.paperFormat) changePaperFormat(a.paperFormat);
  if (a.gutter) changeGutter(a.gutter);
  if (a.hardwareMargin !== undefined) changeHardwareMargin(a.hardwareMargin);
  if (a.styleKey) loadStylePreset(a.styleKey);

  updateBatchAuditCalculator();
}

function reprintSavedAgenda(id) {
  const a = appState.savedAgendas[id];
  if (!a) return;

  loadSavedAgendaToEditor(id);
  setTimeout(() => {
    generateAndPrintBatch();
  }, 250);
}

function deleteSavedAgenda(id) {
  if (confirm(`¿Eliminar agenda "${appState.savedAgendas[id].name}" de la biblioteca?`)) {
    delete appState.savedAgendas[id];
    saveState();
    renderSavedAgendasList();
  }
}

/* =====================================================================
   AUDITORÍA FÍSICA PRE-PRINT
   ===================================================================== */
function updateBatchAuditCalculator() {
  const banner = document.getElementById('batchAuditBanner');
  if (!banner) return;

  const startStr = document.getElementById('batchStartDate').value;
  const endStr = document.getElementById('batchEndDate').value;
  if (!startStr || !endStr) {
    banner.innerText = "Selecciona fecha de inicio y fin para calcular la tirada física.";
    banner.className = "audit-banner";
    return;
  }

  const dStart = new Date(startStr);
  const dEnd = new Date(endStr);
  if (dStart > dEnd) {
    banner.innerText = "La fecha de inicio debe ser anterior a la de fin.";
    banner.className = "audit-banner warning";
    return;
  }

  const totalDays = Math.round((dEnd - dStart) / (1000 * 60 * 60 * 24)) + 1;
  const mode = document.getElementById('batchOutputMode').value;
  const holidays = document.getElementById('batchHolidays').value.split(',').map(s => s.trim()).filter(Boolean);

  let logicalPages = totalDays;
  if (mode === 'duplex_sequence') logicalPages = totalDays * 2;
  if (mode === 'booklet') {
    while (logicalPages % 4 !== 0) logicalPages++;
  }

  let sheetsA4 = logicalPages;
  if (mode === 'duplex_sequence') sheetsA4 = Math.ceil(logicalPages / 2);
  if (mode === 'booklet') sheetsA4 = logicalPages / 4;

  const spineThicknessMm = (sheetsA4 * 0.1).toFixed(1);

  let warningNote = "";
  if (mode === 'booklet' && logicalPages > 32) {
    warningNote = ` ⚠️ Atención: Cuadernillo con ${logicalPages} carillas (${sheetsA4} hojas dobladas). Se recomienda usar prensa de doblado o dividir la tirada.`;
    banner.className = "audit-banner warning";
  } else {
    banner.className = "audit-banner";
  }

  banner.innerHTML = `
    <strong>Tirada:</strong> ${totalDays} días (${holidays.length} festivos) | 
    <strong>${logicalPages} carillas</strong> | 
    <strong>${sheetsA4} hojas A4 físicas</strong> | 
    <strong>Lomo est.: ~${spineThicknessMm} mm</strong>${warningNote ? `<div style="margin-top:4px; font-weight:700;">${warningNote}</div>` : ''}
  `;
}

/* =====================================================================
   SNAPSHOTS (A, B, C)
   ===================================================================== */
function takeSnapshot(slot) {
  if (!appState.snapshots) appState.snapshots = {};
  appState.snapshots[slot] = {
    data: JSON.parse(JSON.stringify(appState)),
    time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  };
  saveState();
  renderSnapshotMetadata();
  alert(`Instantánea guardada en Slot ${slot}.`);
}

function restoreSnapshot(slot) {
  if (!appState.snapshots || !appState.snapshots[slot]) {
    alert(`El Slot ${slot} está vacío.`);
    return;
  }
  if (confirm(`¿Restaurar instantánea del Slot ${slot} (${appState.snapshots[slot].time})?`)) {
    const snap = appState.snapshots[slot].data;
    appState = Object.assign({}, appState, snap);
    saveState();
    location.reload();
  }
}

function renderSnapshotMetadata() {
  ['A', 'B', 'C'].forEach(s => {
    const el = document.getElementById(`snapMeta${s}`);
    if (el) {
      if (appState.snapshots && appState.snapshots[s]) {
        el.innerText = `Guardado: ${appState.snapshots[s].time}`;
        el.style.color = '#15803d';
      } else {
        el.innerText = 'Vacío';
        el.style.color = 'var(--text-muted)';
      }
    }
  });
}

/* =====================================================================
   INSPECCIÓN PREVIA A LA IMPORTACIÓN
   ===================================================================== */
function handleFileSelectPreflight(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      stagedImportData = parsed;
      openPreflightModal(file.name, file.size, parsed);
    } catch (err) {
      alert("Error: El archivo seleccionado no es un JSON válido.");
    }
  };
  reader.readAsText(file);
}

function openPreflightModal(fileName, fileSize, data) {
  const details = document.getElementById('preflightDetails');
  const modCount = Object.keys(data.customModules || {}).length;
  const presCount = Object.keys(data.customPresets || {}).length;
  const footCount = Object.keys(data.customFooters || {}).length;
  const headCount = Object.keys(data.customHeaders || {}).length;
  const styCount = Object.keys(data.customStyles || {}).length;
  const agCount = Object.keys(data.savedAgendas || {}).length;

  details.innerHTML = `
    <strong>Archivo:</strong> ${fileName} (${(fileSize / 1024).toFixed(1)} KB)<br>
    <strong>Versión Esquema:</strong> v${data.schemaVersion || 'Legacy'}<br>
    <strong>Contenido detectado:</strong><br>
    • ${modCount} módulos personalizados<br>
    • ${presCount} plantillas de cara<br>
    • ${footCount} pies de página | ${headCount} encabezados<br>
    • ${styCount} estilos gráficos | ${agCount} agendas guardadas
  `;

  document.getElementById('preflightImportModal').classList.add('active');
}

function closePreflightModal() {
  document.getElementById('preflightImportModal').classList.remove('active');
  stagedImportData = null;
  document.getElementById('importInput').value = '';
}

function executePreflightImport(mode) {
  if (!stagedImportData) return;

  if (mode === 'replace') {
    appState = Object.assign({}, appState, stagedImportData);
  } else if (mode === 'merge') {
    ['customModules', 'customPresets', 'customFooters', 'customHeaders', 'customStyles', 'savedAgendas'].forEach(prop => {
      if (stagedImportData[prop]) {
        appState[prop] = Object.assign({}, appState[prop] || {}, stagedImportData[prop]);
      }
    });
  }

  saveState();
  alert(mode === 'replace' ? "Configuración reemplazada por completo." : "Contenidos fusionados con éxito.");
  closePreflightModal();
  location.reload();
}

/* =====================================================================
   MANTENIMIENTO, CUOTA Y RESTAURACIÓN SEGURA
   ===================================================================== */
function updateStorageQuotaMonitor() {
  let totalBytes = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      totalBytes += (localStorage[key].length + key.length) * 2;
    }
  }

  const kbUsed = (totalBytes / 1024).toFixed(1);
  const maxKb = 5120;
  const pct = Math.min(100, Math.round((kbUsed / maxKb) * 100));

  const lbl = document.getElementById('storageUsageLabel');
  const bar = document.getElementById('storageUsageBar');
  if (lbl) lbl.innerText = `${kbUsed} KB / 5 MB (${pct}%)`;
  if (bar) bar.style.width = `${pct}%`;

  const health = document.getElementById('systemHealthBadge');
  if (health) {
    const custModCount = Object.keys(appState.customModules || {}).length;
    health.innerText = `Módulos: 20 nativos + ${custModCount} creados (v${CURRENT_SCHEMA_VERSION})`;
  }
}

function purgeLegacyKeys() {
  const legacyKeys = [
    'diary_state_workshop_v13',
    'diary_state_workshop_v12',
    'diary_state_workshop_v11',
    'diary_state_workshop_v10',
    'diary_state_workshop_v9',
    'diary_state_workshop_v8',
    'diary_state_workshop_v7'
  ];

  let purgedCount = 0;
  legacyKeys.forEach(k => {
    if (localStorage.getItem(k)) {
      localStorage.removeItem(k);
      purgedCount++;
    }
  });

  updateStorageQuotaMonitor();
  alert(`Limpieza completada: se han purgado ${purgedCount} claves heredadas.`);
}

function safeResetWithAutoBackup() {
  if (confirm("¿Restaurar configuración de fábrica? Se descargará una copia de seguridad automática antes de reiniciar.")) {
    const blob = new Blob([JSON.stringify(appState, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `backup_seguridad_pre_reset_${new Date().toISOString().slice(0,10)}.json`);

    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }, 400);
  }
}

/* =====================================================================
   ZOOM VISUAL Y MODO SOLO FOLIO (CON BOTONES + / -)
   ===================================================================== */
function adjustZoom(delta) {
  let current = appState.zoomLevel;
  if (current === 'fit') {
    current = calculateFitZoomScale();
  } else {
    current = parseFloat(current) || 1.0;
  }
  let next = Math.round((current + delta) * 10) / 10;
  next = Math.max(0.3, Math.min(2.0, next));
  setZoom(next);
}

function setZoom(level) {
  appState.zoomLevel = level;
  applyZoomStyles();
  saveState();
}

function applyZoomStyles() {
  const root = document.documentElement;
  let scale = 1.0;

  if (appState.zoomLevel === 'fit') {
    scale = calculateFitZoomScale();
  } else {
    scale = parseFloat(appState.zoomLevel) || 1.0;
  }

  root.style.setProperty('--zoom-scale', scale);

  document.querySelectorAll('.zoom-btn').forEach(btn => {
    btn.classList.remove('active');
    if (appState.zoomLevel === 'fit' && btn.id === 'btnZoomFit') {
      btn.classList.add('active');
    } else if (parseFloat(btn.innerText) / 100 === scale) {
      btn.classList.add('active');
    }
  });
}

function calculateFitZoomScale() {
  const viewport = document.getElementById('viewportMain');
  if (!viewport) return 1.0;

  const availHeight = viewport.clientHeight - 80;
  const isA5Duo = appState.paperFormat === 'a5_duo';
  const baseTargetHeight = isA5Duo ? 794 : 1123;
  const calculated = availHeight / baseTargetHeight;

  return Math.max(0.35, Math.min(1.2, parseFloat(calculated.toFixed(2))));
}

function handleWindowResize() {
  if (appState.zoomLevel === 'fit') {
    applyZoomStyles();
  }
}

function toggleSoloFolio(forceState = null) {
  if (forceState !== null) {
    appState.soloFolio = forceState;
  } else {
    appState.soloFolio = !appState.soloFolio;
  }
  applySoloFolioState();
  if (appState.zoomLevel === 'fit') applyZoomStyles();
  saveState();
}

function applySoloFolioState() {
  const body = document.body;
  const btn = document.getElementById('btnSoloFolio');
  if (appState.soloFolio) {
    body.classList.add('solo-folio-active');
    if (btn) btn.innerHTML = '📋 Mostrar Panel <kbd class="kbd-hint">Esc</kbd>';
  } else {
    body.classList.remove('solo-folio-active');
    if (btn) btn.innerHTML = '👁️ Solo Folio <kbd class="kbd-hint">F</kbd>';
  }
}

function handleGlobalKeydown(e) {
  const tag = (e.target.tagName || '').toLowerCase();
  const isEditable = e.target.isContentEditable || tag === 'input' || tag === 'textarea' || tag === 'select';
  if (isEditable) return;

  if (e.key === 'f' || e.key === 'F') {
    e.preventDefault();
    toggleSoloFolio();
  } else if (e.key === 'Escape' && appState.soloFolio) {
    e.preventDefault();
    toggleSoloFolio(false);
  }
}

/* =====================================================================
   MONITOR DE DENSIDAD COGNITIVA
   ===================================================================== */
function updateCognitiveDensity() {
  const badge = document.getElementById('densityBadge');
  if (!badge) return;

  const currentFace = getActiveFaceData();
  let totalActions = 0;

  currentFace.modules.forEach(mod => {
    const def = window.MODULE_CATALOG[mod.type] || appState.customModules[mod.type];
    if (!def) return;

    totalActions += 1;
    const rows = mod.rows || def.defaultRows || 4;

    switch (mod.type) {
      case 'prod_mit': totalActions += 3; break;
      case 'prod_deepwork': totalActions += 6; break;
      case 'psy_shutdown': totalActions += 2; break;
      case 'pers_habits': totalActions += 4; break;
      case 'psy_weekly_review': totalActions += 12; break;
      case 'pro_tax':
      case 'pro_ratio': totalActions += 4; break;
      case 'gen_schedule': totalActions += 14; break;
      case 'gen_eisenhower': totalActions += 4; break;
      case 'psy_braindump':
      case 'pers_journal':
      case 'gen_dots': totalActions += 1; break;
      case 'pro_billing':
      case 'pro_expenses':
      case 'pro_aging':
      case 'pro_pipeline':
      case 'pro_mileage':
      case 'pers_expenses':
      case 'pers_cooldown': totalActions += (rows * 2); break;
      default: totalActions += rows; break;
    }
  });

  badge.className = 'density-badge';
  if (totalActions <= 15) {
    badge.classList.add('density-low');
    badge.innerText = `${totalActions} acciones (Ligera)`;
  } else if (totalActions <= 28) {
    badge.classList.add('density-optimal');
    badge.innerText = `${totalActions} acciones (Óptima)`;
  } else if (totalActions <= 42) {
    badge.classList.add('density-moderate');
    badge.innerText = `${totalActions} acciones (Moderada)`;
  } else {
    badge.classList.add('density-high');
    badge.innerText = `${totalActions} acciones (Saturada ⚠️)`;
  }
}

/* =====================================================================
   NAVEGACIÓN POR PESTAÑAS
   ===================================================================== */
function switchTab(tabId, save = true) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === tabId);
  });
  appState.activeTab = tabId;
  if (save) saveState();
}

/* =====================================================================
   MANEJO DE CARAS Y ENCUADERNACIÓN
   ===================================================================== */
function switchActiveFace(face) {
  appState.activeFace = face;
  appState.spreadView = false;
  updateFaceToggleButtons();
  populatePresetSelect();
  populateFooterSelect();
  renderWorkspace();
}

function toggleSpreadView() {
  appState.spreadView = !appState.spreadView;
  updateFaceToggleButtons();
  renderWorkspace();
}

function updateFaceToggleButtons() {
  document.getElementById('btnFaceA').classList.toggle('active', appState.activeFace === 'A' && !appState.spreadView);
  document.getElementById('btnFaceB').classList.toggle('active', appState.activeFace === 'B' && !appState.spreadView);
  document.getElementById('btnFaceSpread').classList.toggle('active', appState.spreadView);
}

function getActiveFaceData() {
  return appState.activeFace === 'B' ? appState.faceB : appState.faceA;
}

function changePaperFormat(val) {
  appState.paperFormat = val;
  if (appState.zoomLevel === 'fit') applyZoomStyles();
  saveState();
  renderWorkspace();
}

function changeDuplexMode(val) { appState.duplexMode = val; saveState(); renderWorkspace(); }
function changeGutter(val) { appState.gutter = val; saveState(); renderWorkspace(); }

function changeHardwareMargin(val) {
  appState.hardwareMargin = parseFloat(val) || 0;
  applyHardwareMarginStyles();
  saveState();
  renderWorkspace();
}

function applyHardwareMarginStyles() {
  const root = document.documentElement;
  root.style.setProperty('--hw-margin', `${appState.hardwareMargin || 0}mm`);
}

function changePunchHoles(val) { appState.punchHoles = val; saveState(); renderWorkspace(); }
function updateThumbTab(val) { appState.thumbTab = val; saveState(); renderWorkspace(); }
function updateThumbTabPos(val) { appState.thumbTabPos = val; saveState(); renderWorkspace(); }

function updateThumbTabColors(bgColor, textColor) {
  if (bgColor) {
    appState.thumbTabBg = bgColor;
    const bgIn = document.getElementById('thumbTabBgInput');
    if (bgIn) bgIn.value = bgColor;
  }
  if (textColor) {
    appState.thumbTabColor = textColor;
    const textIn = document.getElementById('thumbTabTextInput');
    if (textIn) textIn.value = textColor;
  }
  saveState();
  renderWorkspace();
}

/* =====================================================================
   AJUSTES DE ESTILO, PAUTA Y GEOMETRÍA
   ===================================================================== */
function changeGridStep(val) {
  appState.gridStepMm = parseFloat(val) || 7.5;
  applyThemeStyles();
  saveState();
  renderWorkspace();
}

function changeBoxStyle(val) {
  appState.boxStyle = val;
  applyThemeStyles();
  saveState();
  renderWorkspace();
}

function changeBoxRadius(val) {
  appState.boxRadius = val;
  applyThemeStyles();
  saveState();
  renderWorkspace();
}

function changePaperTone(val) {
  appState.paperTone = val;
  applyThemeStyles();
  saveState();
}

function applyThemeStyles() {
  const root = document.documentElement;
  const isLaser = appState.theme === 'laser_pure';
  const palette = THEME_PALETTES[appState.theme] || THEME_PALETTES.mono;
  const font = FONT_FAMILIES[appState.font] || FONT_FAMILIES.sans;

  const inkDark = isLaser ? '#000000' : (appState.customInkDark || palette.inkDark);
  const inkRule = isLaser ? '#000000' : (appState.customInkRule || RULE_TONES[appState.ruleTone] || palette.inkRule);
  const accent = isLaser ? '#000000' : (appState.accentColor || palette.accent || '#2563eb');

  root.style.setProperty('--ink-dark', inkDark);
  root.style.setProperty('--ink-mid', palette.inkMid);
  root.style.setProperty('--ink-light', palette.inkLight);
  root.style.setProperty('--ink-rule', inkRule);
  root.style.setProperty('--accent-color', accent);
  root.style.setProperty('--paper-font', font);

  root.style.setProperty('--grid-step-mm', appState.gridStepMm || 7.5);
  root.style.setProperty('--card-radius', appState.boxRadius === 'rounded' ? '2.5mm' : '0px');

  const simColor = PAPER_SIM_COLORS[appState.paperTone] || '#ffffff';
  root.style.setProperty('--paper-bg-sim', simColor);

  document.body.classList.toggle('theme-laser-pure', isLaser);

  const container = document.getElementById('printSheetContainer');
  if (container) {
    container.classList.remove('card-box-framed', 'card-box-open', 'card-box-inverted', 'card-box-stripe');
    container.classList.add(`card-box-${appState.boxStyle || 'framed'}`);
  }
}

function changeTheme(k) {
  appState.theme = k;
  appState.customInkDark = null;
  appState.customInkRule = null;
  const pal = THEME_PALETTES[k];
  if (pal && pal.accent) appState.accentColor = pal.accent;
  applyThemeStyles();
  saveState();
  renderWorkspace();
}

function changeFont(k) { appState.font = k; applyThemeStyles(); saveState(); }
function changeRuleTone(k) {
  appState.ruleTone = k;
  appState.customInkRule = null;
  applyThemeStyles();
  saveState();
}

function populateStyleSelect() {
  const select = document.getElementById('stylePresetSelect');
  if (!select) return;
  select.innerHTML = '';

  const optGroupBase = document.createElement('optgroup');
  optGroupBase.label = 'Modelos Base';
  Object.keys(window.BASE_STYLES || {}).forEach(k => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.innerText = window.BASE_STYLES[k].name;
    optGroupBase.appendChild(opt);
  });
  select.appendChild(optGroupBase);

  const customKeys = Object.keys(appState.customStyles || {});
  if (customKeys.length > 0) {
    const optGroupCust = document.createElement('optgroup');
    optGroupCust.label = 'Mis Estilos Guardados';
    customKeys.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.innerText = appState.customStyles[k].name;
      optGroupCust.appendChild(opt);
    });
    select.appendChild(optGroupCust);
  }

  select.value = appState.activeStyleKey || 'mono';
}

function loadStylePreset(key) {
  appState.activeStyleKey = key;
  const sData = (window.BASE_STYLES && window.BASE_STYLES[key]) || (appState.customStyles && appState.customStyles[key]);
  if (sData) {
    appState.theme = sData.themePalette || 'mono';
    appState.font = sData.font || 'sans';
    appState.ruleTone = sData.ruleTone || 'standard';
    appState.gridStepMm = sData.gridStepMm || 7.5;
    appState.boxStyle = sData.boxStyle || 'framed';
    appState.boxRadius = sData.boxRadius || 'sharp';
    appState.paperTone = sData.paperTone || 'white';
    appState.accentColor = sData.accentColor || '#2563eb';
    appState.customInkDark = sData.inkDark || null;
    appState.customInkRule = sData.inkRule || null;

    if (sData.thumbTabBg) {
      appState.thumbTabBg = sData.thumbTabBg;
      const bgIn = document.getElementById('thumbTabBgInput');
      if (bgIn) bgIn.value = sData.thumbTabBg;
    }
    if (sData.thumbTabColor) {
      appState.thumbTabColor = sData.thumbTabColor;
      const textIn = document.getElementById('thumbTabTextInput');
      if (textIn) textIn.value = sData.thumbTabColor;
    }

    document.getElementById('themeSelect').value = appState.theme;
    document.getElementById('fontSelect').value = appState.font;
    document.getElementById('ruleToneSelect').value = appState.ruleTone;
    document.getElementById('gridStepSelect').value = (appState.gridStepMm).toFixed(1);
    document.getElementById('boxStyleSelect').value = appState.boxStyle;
    document.getElementById('boxRadiusSelect').value = appState.boxRadius;
    document.getElementById('paperToneSelect').value = appState.paperTone;

    applyThemeStyles();
    saveState();
    renderWorkspace();
  }
}

function openStyleModal(editKey = null) {
  document.getElementById('editingStyleKey').value = editKey || '';
  if (editKey) {
    const s = (appState.customStyles && appState.customStyles[editKey]) || (window.BASE_STYLES && window.BASE_STYLES[editKey]);
    document.getElementById('styleModalHeading').innerText = `Editar Estilo: ${s.name}`;
    document.getElementById('styleModelName').value = s.name + (window.BASE_STYLES[editKey] ? ' (Copia)' : '');
    document.getElementById('styleModelInkDark').value = s.inkDark || appState.customInkDark || '#000000';
    document.getElementById('styleModelInkRule').value = s.inkRule || appState.customInkRule || '#cbd5e1';
    document.getElementById('styleModelAccent').value = s.accentColor || appState.accentColor || '#2563eb';
    document.getElementById('styleModelGridStep').value = (s.gridStepMm || 7.5).toFixed(1);
    document.getElementById('styleModelBoxStyle').value = s.boxStyle || 'framed';
    document.getElementById('styleModelBoxRadius').value = s.boxRadius || 'sharp';
    document.getElementById('styleModelFont').value = s.font || 'sans';
    document.getElementById('styleModelThumbBg').value = s.thumbTabBg || appState.thumbTabBg || '#0f172a';
    document.getElementById('styleModelThumbColor').value = s.thumbTabColor || appState.thumbTabColor || '#ffffff';
  } else {
    document.getElementById('styleModalHeading').innerText = 'Crear Nuevo Estilo Visual';
    document.getElementById('styleModelName').value = '';
    document.getElementById('styleModelInkDark').value = '#000000';
    document.getElementById('styleModelInkRule').value = '#cbd5e1';
    document.getElementById('styleModelAccent').value = '#2563eb';
    document.getElementById('styleModelGridStep').value = (appState.gridStepMm || 7.5).toFixed(1);
    document.getElementById('styleModelBoxStyle').value = appState.boxStyle || 'framed';
    document.getElementById('styleModelBoxRadius').value = appState.boxRadius || 'sharp';
    document.getElementById('styleModelFont').value = appState.font || 'sans';
    document.getElementById('styleModelThumbBg').value = appState.thumbTabBg || '#0f172a';
    document.getElementById('styleModelThumbColor').value = appState.thumbTabColor || '#ffffff';
  }
  document.getElementById('styleModal').classList.add('active');
}

function closeStyleModal() { document.getElementById('styleModal').classList.remove('active'); }

function saveStyleFromModal() {
  const editKey = document.getElementById('editingStyleKey').value;
  const isBase = window.BASE_STYLES && window.BASE_STYLES[editKey];
  const key = (editKey && !isBase) ? editKey : 'style_' + Date.now();

  const name = document.getElementById('styleModelName').value.trim() || 'Estilo Personalizado';
  const inkDark = document.getElementById('styleModelInkDark').value;
  const inkRule = document.getElementById('styleModelInkRule').value;
  const accentColor = document.getElementById('styleModelAccent').value;
  const gridStepMm = parseFloat(document.getElementById('styleModelGridStep').value) || 7.5;
  const boxStyle = document.getElementById('styleModelBoxStyle').value;
  const boxRadius = document.getElementById('styleModelBoxRadius').value;
  const font = document.getElementById('styleModelFont').value;
  const thumbTabBg = document.getElementById('styleModelThumbBg').value;
  const thumbTabColor = document.getElementById('styleModelThumbColor').value;

  if (!appState.customStyles) appState.customStyles = {};
  appState.customStyles[key] = {
    name,
    themePalette: 'mono',
    font,
    ruleTone: 'standard',
    inkDark,
    inkRule,
    accentColor,
    gridStepMm,
    boxStyle,
    boxRadius,
    paperTone: appState.paperTone || 'white',
    thumbTabBg,
    thumbTabColor
  };

  appState.activeStyleKey = key;
  appState.font = font;
  appState.customInkDark = inkDark;
  appState.customInkRule = inkRule;
  appState.accentColor = accentColor;
  appState.gridStepMm = gridStepMm;
  appState.boxStyle = boxStyle;
  appState.boxRadius = boxRadius;
  appState.thumbTabBg = thumbTabBg;
  appState.thumbTabColor = thumbTabColor;

  document.getElementById('fontSelect').value = font;
  document.getElementById('gridStepSelect').value = gridStepMm.toFixed(1);
  document.getElementById('boxStyleSelect').value = boxStyle;
  document.getElementById('boxRadiusSelect').value = boxRadius;
  if (document.getElementById('thumbTabBgInput')) document.getElementById('thumbTabBgInput').value = thumbTabBg;
  if (document.getElementById('thumbTabTextInput')) document.getElementById('thumbTabTextInput').value = thumbTabColor;

  applyThemeStyles();
  saveState();
  populateStyleSelect();
  closeStyleModal();
  renderWorkspace();
}

function editCurrentStyle() {
  const currentKey = document.getElementById('stylePresetSelect').value;
  openStyleModal(currentKey);
}

function quickSaveCurrentStyle() {
  const name = prompt("Nombre para guardar la combinación visual actual:", "Mi Paleta");
  if (!name || !name.trim()) return;

  const key = "style_" + Date.now();
  if (!appState.customStyles) appState.customStyles = {};
  appState.customStyles[key] = {
    name: name.trim(),
    themePalette: appState.theme,
    font: appState.font,
    ruleTone: appState.ruleTone,
    inkDark: appState.customInkDark,
    inkRule: appState.customInkRule,
    accentColor: appState.accentColor,
    gridStepMm: appState.gridStepMm,
    boxStyle: appState.boxStyle,
    boxRadius: appState.boxRadius,
    paperTone: appState.paperTone,
    thumbTabBg: appState.thumbTabBg,
    thumbTabColor: appState.thumbTabColor
  };
  appState.activeStyleKey = key;

  saveState();
  populateStyleSelect();
  alert(`Estilo visual "${name}" guardado.`);
}

function deleteCurrentStyle() {
  const currentKey = document.getElementById('stylePresetSelect').value;
  if (window.BASE_STYLES && window.BASE_STYLES[currentKey]) {
    alert("Los modelos base de estilo no se pueden eliminar. Puedes modificarlos guardando una copia.");
    return;
  }
  if (confirm(`¿Eliminar definitivamente el estilo "${appState.customStyles[currentKey].name}"?`)) {
    delete appState.customStyles[currentKey];
    appState.activeStyleKey = 'mono';
    saveState();
    populateStyleSelect();
    loadStylePreset('mono');
  }
}

/* =====================================================================
   CRUD COMPLETO DE ENCABEZADOS Y LEYENDAS (HEADERS)
   ===================================================================== */
function populateHeaderSelect() {
  const select = document.getElementById('headerPresetSelect');
  if (!select) return;
  select.innerHTML = '';

  const optGroupBase = document.createElement('optgroup');
  optGroupBase.label = 'Modelos Base';
  Object.keys(window.BASE_HEADERS || {}).forEach(k => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.innerText = window.BASE_HEADERS[k].name;
    optGroupBase.appendChild(opt);
  });
  select.appendChild(optGroupBase);

  const customKeys = Object.keys(appState.customHeaders || {});
  if (customKeys.length > 0) {
    const optGroupCust = document.createElement('optgroup');
    optGroupCust.label = 'Mis Modelos Guardados';
    customKeys.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.innerText = appState.customHeaders[k].name;
      optGroupCust.appendChild(opt);
    });
    select.appendChild(optGroupCust);
  }

  select.value = appState.activeHeaderKey || 'default';
}

function loadHeaderPreset(key) {
  appState.activeHeaderKey = key;
  const hData = (window.BASE_HEADERS && window.BASE_HEADERS[key]) || (appState.customHeaders && appState.customHeaders[key]);
  if (hData) {
    appState.dailyTitle = hData.dailyTitle !== undefined ? hData.dailyTitle : appState.dailyTitle;
    appState.dailySubtitle = hData.dailySubtitle !== undefined ? hData.dailySubtitle : appState.dailySubtitle;
    appState.metaDateLabel = hData.metaDateLabel !== undefined ? hData.metaDateLabel : appState.metaDateLabel;
    appState.metaDaySlots = hData.metaDaySlots !== undefined ? hData.metaDaySlots : appState.metaDaySlots;
    appState.footerBrand = hData.footerBrand !== undefined ? hData.footerBrand : appState.footerBrand;

    syncFolioInputs();
    saveState();
    renderWorkspace();
  }
}

function openHeaderModal(editKey = null) {
  document.getElementById('editingHeaderKey').value = editKey || '';
  if (editKey) {
    const h = (appState.customHeaders && appState.customHeaders[editKey]) || (window.BASE_HEADERS && window.BASE_HEADERS[editKey]);
    document.getElementById('headerModalHeading').innerText = `Editar Modelo: ${h.name}`;
    document.getElementById('headerModelName').value = h.name + (window.BASE_HEADERS[editKey] ? ' (Copia)' : '');
    document.getElementById('headerModelTitle').value = h.dailyTitle || '';
    document.getElementById('headerModelSubtitle').value = h.dailySubtitle || '';
    document.getElementById('headerModelDateLabel').value = h.metaDateLabel || 'FECHA:';
    document.getElementById('headerModelDaySlots').value = h.metaDaySlots || 'L M X J V S D';
    document.getElementById('headerModelFooterBrand').value = h.footerBrand || 'FOLIO A4 | IMPRESO LOCALMENTE';
  } else {
    document.getElementById('headerModalHeading').innerText = 'Crear Nuevo Modelo de Encabezado';
    document.getElementById('headerModelName').value = '';
    document.getElementById('headerModelTitle').value = appState.dailyTitle || '';
    document.getElementById('headerModelSubtitle').value = appState.dailySubtitle || '';
    document.getElementById('headerModelDateLabel').value = appState.metaDateLabel || 'FECHA:';
    document.getElementById('headerModelDaySlots').value = appState.metaDaySlots || 'L M X J V S D';
    document.getElementById('headerModelFooterBrand').value = appState.footerBrand || 'FOLIO A4 | IMPRESO LOCALMENTE';
  }
  document.getElementById('headerModal').classList.add('active');
}

function closeHeaderModal() { document.getElementById('headerModal').classList.remove('active'); }

function saveHeaderFromModal() {
  const editKey = document.getElementById('editingHeaderKey').value;
  const isBase = window.BASE_HEADERS && window.BASE_HEADERS[editKey];
  const key = (editKey && !isBase) ? editKey : 'header_' + Date.now();

  const name = document.getElementById('headerModelName').value.trim() || 'Modelo de Encabezado';
  const dailyTitle = document.getElementById('headerModelTitle').value.trim() || 'DIARIO DE CONTROL DIARIO';
  const dailySubtitle = document.getElementById('headerModelSubtitle').value.trim();
  const metaDateLabel = document.getElementById('headerModelDateLabel').value.trim() || 'FECHA:';
  const metaDaySlots = document.getElementById('headerModelDaySlots').value.trim() || 'L M X J V S D';
  const footerBrand = document.getElementById('headerModelFooterBrand').value.trim() || 'FOLIO A4 | IMPRESO LOCALMENTE';

  if (!appState.customHeaders) appState.customHeaders = {};
  appState.customHeaders[key] = { name, dailyTitle, dailySubtitle, metaDateLabel, metaDaySlots, footerBrand };

  appState.activeHeaderKey = key;
  appState.dailyTitle = dailyTitle;
  appState.dailySubtitle = dailySubtitle;
  appState.metaDateLabel = metaDateLabel;
  appState.metaDaySlots = metaDaySlots;
  appState.footerBrand = footerBrand;

  syncFolioInputs();
  saveState();
  populateHeaderSelect();
  closeHeaderModal();
  renderWorkspace();
}

function editCurrentHeaderPreset() {
  const currentKey = document.getElementById('headerPresetSelect').value;
  openHeaderModal(currentKey);
}

function quickSaveCurrentHeaderPreset() {
  const name = prompt("Nombre para guardar la cabecera y leyendas actuales:", "Mi Estilo de Cabecera");
  if (!name || !name.trim()) return;

  const key = "header_" + Date.now();
  if (!appState.customHeaders) appState.customHeaders = {};
  appState.customHeaders[key] = {
    name: name.trim(),
    dailyTitle: appState.dailyTitle,
    dailySubtitle: appState.dailySubtitle,
    metaDateLabel: appState.metaDateLabel,
    metaDaySlots: appState.metaDaySlots,
    footerBrand: appState.footerBrand
  };
  appState.activeHeaderKey = key;

  saveState();
  populateHeaderSelect();
  alert(`Modelo de encabezado "${name}" guardado con éxito.`);
}

function deleteCurrentHeaderPreset() {
  const currentKey = document.getElementById('headerPresetSelect').value;
  if (window.BASE_HEADERS && window.BASE_HEADERS[currentKey]) {
    alert("Los modelos base del sistema no se pueden eliminar. Puedes modificarlos guardando una copia.");
    return;
  }
  if (confirm(`¿Eliminar definitivamente el modelo "${appState.customHeaders[currentKey].name}"?`)) {
    delete appState.customHeaders[currentKey];
    appState.activeHeaderKey = 'default';
    saveState();
    populateHeaderSelect();
    loadHeaderPreset('default');
  }
}

function syncFolioInputs() {
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setVal('cfgTitle', appState.dailyTitle || '');
  setVal('cfgSubtitle', appState.dailySubtitle || '');
  setVal('cfgDateLabel', appState.metaDateLabel || '');
  setVal('cfgDaySlots', appState.metaDaySlots || '');
  setVal('cfgFooterBrand', appState.footerBrand || '');
}

function updateFolioMeta(field, val) {
  if (field === 'title') appState.dailyTitle = val;
  if (field === 'subtitle') appState.dailySubtitle = val;
  if (field === 'dateLabel') appState.metaDateLabel = val;
  if (field === 'daySlots') appState.metaDaySlots = val;
  if (field === 'footerBrand') appState.footerBrand = val;
  saveState();
  renderWorkspace();
}

function handleDirectEdit(field, textVal) {
  const clean = textVal.trim();
  if (field === 'title') { appState.dailyTitle = clean; document.getElementById('cfgTitle').value = clean; }
  if (field === 'subtitle') { appState.dailySubtitle = clean; document.getElementById('cfgSubtitle').value = clean; }
  if (field === 'dateLabel') { appState.metaDateLabel = clean; document.getElementById('cfgDateLabel').value = clean; }
  if (field === 'daySlots') { appState.metaDaySlots = clean; document.getElementById('cfgDaySlots').value = clean; }
  if (field === 'footerBrand') { appState.footerBrand = clean; document.getElementById('cfgFooterBrand').value = clean; }
  saveState();
}

/* =====================================================================
   CRUD COMPLETO DE PLANTILLAS DE CARA ACTIVA (PRESETS)
   ===================================================================== */
function populatePresetSelect() {
  const select = document.getElementById('presetSelect');
  select.innerHTML = '';
  const currentFace = getActiveFaceData();

  const optGroupBase = document.createElement('optgroup');
  optGroupBase.label = 'Plantillas Base';
  Object.keys(window.BASE_PRESETS).forEach(k => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.innerText = window.BASE_PRESETS[k].name;
    optGroupBase.appendChild(opt);
  });
  select.appendChild(optGroupBase);

  const customKeys = Object.keys(appState.customPresets || {});
  if (customKeys.length > 0) {
    const optGroupCust = document.createElement('optgroup');
    optGroupCust.label = 'Mis Plantillas Guardadas';
    customKeys.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.innerText = appState.customPresets[k].name;
      optGroupCust.appendChild(opt);
    });
    select.appendChild(optGroupCust);
  }

  select.value = currentFace.presetKey || 'dual';
}

function loadPreset(key) {
  const currentFace = getActiveFaceData();
  currentFace.presetKey = key;
  let presetData = window.BASE_PRESETS[key] || appState.customPresets[key];
  if (presetData) {
    currentFace.modules = JSON.parse(JSON.stringify(presetData.modules));
    saveState();
    renderWorkspace();
  }
}

function openPresetModal(editKey = null) {
  document.getElementById('editingPresetKey').value = editKey || '';
  const cloneSel = document.getElementById('presetCloneSelect');
  cloneSel.innerHTML = '';
  Object.keys(window.BASE_PRESETS).forEach(k => {
    cloneSel.innerHTML += `<option value="${k}">${window.BASE_PRESETS[k].name}</option>`;
  });
  Object.keys(appState.customPresets || {}).forEach(k => {
    cloneSel.innerHTML += `<option value="${k}">${appState.customPresets[k].name}</option>`;
  });

  if (editKey) {
    const p = appState.customPresets[editKey] || window.BASE_PRESETS[editKey];
    document.getElementById('presetModalHeading').innerText = `Editar Plantilla: ${p.name}`;
    document.getElementById('presetModelName').value = p.name + (window.BASE_PRESETS[editKey] ? ' (Copia)' : '');
    document.getElementById('presetSourceType').value = 'select';
    togglePresetSourceType('select');
    populatePresetModuleChecklist(p.modules || []);
  } else {
    document.getElementById('presetModalHeading').innerText = 'Crear Nueva Plantilla';
    document.getElementById('presetModelName').value = '';
    document.getElementById('presetSourceType').value = 'current';
    togglePresetSourceType('current');
    const currentFace = getActiveFaceData();
    populatePresetModuleChecklist(currentFace.modules || []);
  }
  document.getElementById('presetModal').classList.add('active');
}

function closePresetModal() { document.getElementById('presetModal').classList.remove('active'); }

function togglePresetSourceType(val) {
  document.getElementById('presetOptClone').style.display = val === 'clone' ? 'block' : 'none';
  document.getElementById('presetOptSelect').style.display = val === 'select' ? 'block' : 'none';
}

function populatePresetModuleChecklist(activeModules = []) {
  const container = document.getElementById('presetModuleChecklist');
  container.innerHTML = '';
  const activeTypes = activeModules.map(m => m.type);

  const allModules = Object.assign({}, window.MODULE_CATALOG, appState.customModules);
  Object.keys(allModules).forEach(key => {
    const def = allModules[key];
    const isChecked = activeTypes.includes(key) ? 'checked' : '';
    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.gap = '6px';
    label.style.marginBottom = '4px';
    label.style.cursor = 'pointer';
    label.innerHTML = `
      <input type="checkbox" value="${key}" ${isChecked} style="width:auto; margin:0;">
      <span><strong>${def.title}</strong> <span style="font-size:9px; color:var(--text-muted);">[${def.badge || 'MOD'}]</span></span>
    `;
    container.appendChild(label);
  });
}

function savePresetFromModal() {
  const editKey = document.getElementById('editingPresetKey').value;
  const key = (editKey && !window.BASE_PRESETS[editKey]) ? editKey : 'preset_' + Date.now();
  const name = document.getElementById('presetModelName').value.trim() || 'Mi Plantilla Personalizada';
  const sourceType = document.getElementById('presetSourceType').value;

  let modules = [];
  if (sourceType === 'current') {
    const currentFace = getActiveFaceData();
    modules = JSON.parse(JSON.stringify(currentFace.modules));
  } else if (sourceType === 'clone') {
    const cloneKey = document.getElementById('presetCloneSelect').value;
    const source = window.BASE_PRESETS[cloneKey] || appState.customPresets[cloneKey];
    modules = source ? JSON.parse(JSON.stringify(source.modules)) : [];
  } else if (sourceType === 'select') {
    const checkedBoxes = document.querySelectorAll('#presetModuleChecklist input[type="checkbox"]:checked');
    checkedBoxes.forEach(cb => {
      const typeKey = cb.value;
      const def = window.MODULE_CATALOG[typeKey] || appState.customModules[typeKey];
      if (def) {
        modules.push({
          type: typeKey,
          span: def.span || 1,
          rows: def.defaultRows || (def.heightMm ? 0 : 4)
        });
      }
    });
  }

  if (!appState.customPresets) appState.customPresets = {};
  appState.customPresets[key] = { name, modules };

  const currentFace = getActiveFaceData();
  currentFace.presetKey = key;
  currentFace.modules = modules;

  saveState();
  populatePresetSelect();
  closePresetModal();
  renderWorkspace();
}

function editCurrentPreset() {
  const currentFace = getActiveFaceData();
  const currentKey = currentFace.presetKey || document.getElementById('presetSelect').value;
  openPresetModal(currentKey);
}

function quickSaveCurrentPreset() {
  const name = prompt("Nombre para guardar la cara actual como plantilla:", "Mi Distribución");
  if (!name || !name.trim()) return;

  const key = "preset_" + Date.now();
  if (!appState.customPresets) appState.customPresets = {};

  const currentFace = getActiveFaceData();
  appState.customPresets[key] = {
    name: name.trim(),
    modules: JSON.parse(JSON.stringify(currentFace.modules))
  };
  currentFace.presetKey = key;

  saveState();
  populatePresetSelect();
  alert(`Plantilla "${name}" guardada con éxito.`);
}

function deleteCurrentPreset() {
  const currentFace = getActiveFaceData();
  const currentKey = document.getElementById('presetSelect').value;
  if (window.BASE_PRESETS[currentKey]) {
    alert("Las plantillas base del sistema no se pueden eliminar. Puedes modificarlas creando una copia.");
    return;
  }
  if (confirm(`¿Eliminar definitivamente la plantilla "${appState.customPresets[currentKey].name}"?`)) {
    delete appState.customPresets[currentKey];
    currentFace.presetKey = 'dual';
    currentFace.modules = JSON.parse(JSON.stringify(window.BASE_PRESETS.dual.modules));
    saveState();
    populatePresetSelect();
    renderWorkspace();
  }
}

/* =====================================================================
   CRUD COMPLETO DE PIES DE PÁGINA (FOOTERS)
   ===================================================================== */
function populateFooterSelect() {
  const select = document.getElementById('footerPresetSelect');
  select.innerHTML = '';
  const currentFace = getActiveFaceData();

  const optGroupBase = document.createElement('optgroup');
  optGroupBase.label = 'Pies de Página Base';
  Object.keys(window.BASE_FOOTERS).forEach(k => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.innerText = window.BASE_FOOTERS[k].name;
    optGroupBase.appendChild(opt);
  });
  select.appendChild(optGroupBase);

  const customKeys = Object.keys(appState.customFooters || {});
  if (customKeys.length > 0) {
    const optGroupCust = document.createElement('optgroup');
    optGroupCust.label = 'Mis Modelos de Pie';
    customKeys.forEach(k => {
      const opt = document.createElement('option');
      opt.value = k;
      opt.innerText = appState.customFooters[k].name;
      optGroupCust.appendChild(opt);
    });
    select.appendChild(optGroupCust);
  }

  select.value = currentFace.footerKey || 'pro';
}

function setFooterPreset(key) {
  const currentFace = getActiveFaceData();
  currentFace.footerKey = key;
  const fData = window.BASE_FOOTERS[key] || appState.customFooters[key];
  if (fData) {
    currentFace.footerHtml = fData.html;
    saveState();
    renderWorkspace();
  }
}

function openFooterModal(editKey = null) {
  document.getElementById('editingFooterKey').value = editKey || '';
  if (editKey) {
    const f = appState.customFooters[editKey] || window.BASE_FOOTERS[editKey];
    document.getElementById('footerModalHeading').innerText = `Editar Modelo de Pie: ${f.name}`;
    document.getElementById('footerModelName').value = f.name + (window.BASE_FOOTERS[editKey] ? ' (Copia)' : '');
    document.getElementById('footerModelType').value = f.type || 'custom';
    document.getElementById('footerChecklistItems').value = (f.items || []).join(', ');
    document.getElementById('footerCustomRaw').value = f.html || '';
    document.getElementById('footerBrandInput').value = f.brand || appState.footerBrand;
    toggleFooterModalType(f.type || 'custom');
  } else {
    document.getElementById('footerModalHeading').innerText = 'Crear Nuevo Modelo de Pie';
    document.getElementById('footerModelName').value = '';
    document.getElementById('footerModelType').value = 'checklist';
    document.getElementById('footerChecklistItems').value = 'Horas al registro, Tickets archivados, Agenda revisada';
    document.getElementById('footerCustomRaw').value = '';
    document.getElementById('footerBrandInput').value = appState.footerBrand;
    toggleFooterModalType('checklist');
  }
  document.getElementById('footerModal').classList.add('active');
}

function closeFooterModal() { document.getElementById('footerModal').classList.remove('active'); }
function toggleFooterModalType(t) {
  document.getElementById('footerOptChecklist').style.display = t === 'checklist' ? 'block' : 'none';
  document.getElementById('footerOptCustom').style.display = t === 'custom' ? 'block' : 'none';
}

function saveFooterFromModal() {
  const editKey = document.getElementById('editingFooterKey').value;
  const key = (editKey && !window.BASE_FOOTERS[editKey]) ? editKey : 'footer_' + Date.now();
  const name = document.getElementById('footerModelName').value.trim() || 'Pie Personalizado';
  const type = document.getElementById('footerModelType').value;
  const brand = document.getElementById('footerBrandInput').value.trim() || 'FOLIO A4 | IMPRESO LOCALMENTE';
  const rawItems = document.getElementById('footerChecklistItems').value.split(',').map(s => s.trim()).filter(Boolean);

  let html = '';
  if (type === 'checklist') {
    html = `<div style="display:flex; gap:10px;">${rawItems.map(item => `<div class="handoff-item"><div class="box-square"></div> ${item}</div>`).join('')}</div>`;
  } else if (type === 'blank') {
    html = `<div style="flex:1; border-bottom:1px solid var(--ink-dark); height:4mm;"></div>`;
  } else {
    html = document.getElementById('footerCustomRaw').value;
  }

  if (!appState.customFooters) appState.customFooters = {};
  appState.customFooters[key] = { name, type, items: rawItems, html, brand };
  
  const currentFace = getActiveFaceData();
  currentFace.footerKey = key;
  currentFace.footerHtml = html;
  appState.footerBrand = brand;

  saveState();
  populateFooterSelect();
  closeFooterModal();
  renderWorkspace();
}

function editCurrentFooter() {
  const currentFace = getActiveFaceData();
  openFooterModal(currentFace.footerKey || 'pro');
}

function quickSaveCurrentFooter() {
  const name = prompt("Nombre para guardar este pie:", "Cierre Rápido");
  if (!name || !name.trim()) return;

  const key = "footer_" + Date.now();
  if (!appState.customFooters) appState.customFooters = {};
  const currentFace = getActiveFaceData();

  appState.customFooters[key] = {
    name: name.trim(),
    type: 'custom',
    items: [],
    html: currentFace.footerHtml || window.BASE_FOOTERS.pro.html,
    brand: appState.footerBrand
  };
  currentFace.footerKey = key;

  saveState();
  populateFooterSelect();
  renderWorkspace();
  alert(`Pie "${name}" guardado.`);
}

function deleteCurrentFooter() {
  const currentFace = getActiveFaceData();
  const k = currentFace.footerKey;
  if (window.BASE_FOOTERS[k]) { alert("Los pies base no se pueden eliminar."); return; }
  if (confirm(`¿Eliminar pie "${appState.customFooters[k].name}"?`)) {
    delete appState.customFooters[k];
    currentFace.footerKey = 'pro';
    currentFace.footerHtml = window.BASE_FOOTERS.pro.html;
    saveState();
    populateFooterSelect();
    renderWorkspace();
  }
}

/* =====================================================================
   CÁLCULO EXACTO DEL MARGEN DE LOMO (GUTTER)
   ===================================================================== */
function getGutterClass(side) {
  if (appState.gutter === 'clipboard') return 'gutter-clipboard';
  if (appState.gutter === 'rings') {
    return side === 'left' ? 'gutter-spine-right' : 'gutter-spine-left';
  }
  return 'gutter-standard';
}

/* =====================================================================
   MOTOR DE RENDERIZADO DEL ESPACIO DE TRABAJO (WORKSPACE)
   ===================================================================== */
function renderWorkspace() {
  const container = document.getElementById('printSheetContainer');
  container.innerHTML = '';
  container.className = 'print-container' + (appState.spreadView ? ' spread-view' : '');

  container.classList.remove('card-box-framed', 'card-box-open', 'card-box-inverted', 'card-box-stripe');
  container.classList.add(`card-box-${appState.boxStyle || 'framed'}`);

  if (appState.paperFormat === 'a4_portrait') {
    if (appState.spreadView) {
      container.appendChild(buildSingleA4Element(appState.faceB, 'B', 'left'));
      container.appendChild(buildSingleA4Element(appState.faceA, 'A', 'right'));
    } else if (appState.duplexMode === 'duplex_mirror') {
      container.appendChild(buildSingleA4Element(appState.faceA, 'A', 'right'));
      container.appendChild(buildSingleA4Element(appState.faceB, 'B', 'left'));
    } else {
      const faceData = getActiveFaceData();
      const side = appState.activeFace === 'B' ? 'left' : 'right';
      container.appendChild(buildSingleA4Element(faceData, appState.activeFace, side));
    }
  } else if (appState.paperFormat === 'a5_duo') {
    if (appState.spreadView || appState.duplexMode === 'duplex_mirror') {
      container.appendChild(buildA5DuoElement(appState.faceB, appState.faceA));
    } else {
      const faceData = getActiveFaceData();
      container.appendChild(buildA5DuoElement(faceData, faceData));
    }
  }

  updateBudget();
  updateCognitiveDensity();
}

function buildSingleA4Element(faceData, faceTag, side) {
  const sheet = document.createElement('div');
  const gutterCls = getGutterClass(side);
  sheet.className = `sheet-page format-a4 ${gutterCls}`;
  
  appendPhysicalMarks(sheet, side, 297);

  sheet.insertAdjacentHTML('beforeend', `
    <header class="page-header">
      <div>
        <div class="header-main-title" contenteditable="true" onblur="handleDirectEdit('title', this.innerText)">${appState.dailyTitle}</div>
        <div class="header-subtitle" contenteditable="true" onblur="handleDirectEdit('subtitle', this.innerText)">${appState.dailySubtitle} (${faceTag === 'A' ? 'ANVERSO' : 'REVERSO'})</div>
      </div>
      <div class="header-meta-slots">
        <div class="meta-slot">
          <strong contenteditable="true" onblur="handleDirectEdit('dateLabel', this.innerText)">${appState.metaDateLabel}</strong>
          <div class="meta-line"></div>
        </div>
        <div class="meta-slot">
          <span style="letter-spacing:1px; font-size:8.5px;" contenteditable="true" onblur="handleDirectEdit('daySlots', this.innerText)">${appState.metaDaySlots}</span>
        </div>
      </div>
    </header>
  `);

  const grid = document.createElement('div');
  grid.className = 'sheet-grid';
  populateModulesToGrid(grid, faceData.modules, faceTag);
  sheet.appendChild(grid);

  const footerHtml = faceData.footerHtml || window.BASE_FOOTERS[faceData.footerKey || 'pro'].html;
  const footerWrap = document.createElement('footer');
  footerWrap.className = 'page-footer';
  footerWrap.innerHTML = `
    <div class="footer-custom-content" contenteditable="true">${footerHtml}</div>
    <div class="footer-brand" contenteditable="true" onblur="handleDirectEdit('footerBrand', this.innerText)">${appState.footerBrand}</div>
  `;
  const footerContent = footerWrap.querySelector('.footer-custom-content');
  footerContent.addEventListener('blur', function() {
    faceData.footerHtml = this.innerHTML;
    saveState();
  });
  sheet.appendChild(footerWrap);

  return sheet;
}

function buildA5DuoElement(leftFaceData, rightFaceData) {
  const sheet = document.createElement('div');
  sheet.className = 'sheet-page format-a5-duo';

  sheet.insertAdjacentHTML('beforeend', `
    <div class="cut-mark-top"></div>
    <div class="cut-mark-bottom"></div>
  `);

  const leftA5 = document.createElement('div');
  leftA5.className = `a5-subpage ${getGutterClass('left')}`;
  appendPhysicalMarks(leftA5, 'left', 210);
  buildA5Content(leftA5, leftFaceData, 'B', 'REVERSO');

  const rightA5 = document.createElement('div');
  rightA5.className = `a5-subpage ${getGutterClass('right')}`;
  appendPhysicalMarks(rightA5, 'right', 210);
  buildA5Content(rightA5, rightFaceData, 'A', 'ANVERSO');

  sheet.appendChild(leftA5);
  sheet.appendChild(rightA5);
  return sheet;
}

function buildA5Content(container, faceData, faceTag, labelTag) {
  container.insertAdjacentHTML('beforeend', `
    <header class="page-header" style="margin-bottom:4px; padding-bottom:3px;">
      <div>
        <div class="header-main-title" style="font-size:12px;">${appState.dailyTitle}</div>
        <div class="header-subtitle" style="font-size:7px;">${labelTag}</div>
      </div>
      <div class="header-meta-slots" style="font-size:8px;">
        <div class="meta-slot">
          <strong>${appState.metaDateLabel}</strong>
          <div class="meta-line" style="width:35px;"></div>
        </div>
      </div>
    </header>
  `);

  const grid = document.createElement('div');
  grid.className = 'sheet-grid';
  populateModulesToGrid(grid, faceData.modules, faceTag);
  container.appendChild(grid);

  const footerHtml = faceData.footerHtml || window.BASE_FOOTERS[faceData.footerKey || 'pro'].html;
  container.insertAdjacentHTML('beforeend', `
    <footer class="page-footer" style="font-size:7px;">
      <div class="footer-custom-content">${footerHtml}</div>
      <div class="footer-brand" style="font-size:6.5px;">${appState.footerBrand}</div>
    </footer>
  `);
}

function appendPhysicalMarks(pageEl, side, heightMm = 297) {
  if (appState.punchHoles !== 'none') {
    let edgeDist = '8mm';
    let isVertical = true;

    if (appState.gutter === 'clipboard') {
      isVertical = false;
    } else if (appState.gutter === 'rings') {
      edgeDist = side === 'left' ? 'calc(100% - 9mm)' : '9mm';
    }

    const centerMm = isVertical ? (heightMm / 2) : (210 / 2);

    if (isVertical) {
      if (appState.punchHoles === 'iso_2') {
        createPunchEl(pageEl, edgeDist, `${centerMm - 40}mm`);
        createPunchEl(pageEl, edgeDist, `${centerMm + 40}mm`);
      } else if (appState.punchHoles === 'iso_4') {
        createPunchEl(pageEl, edgeDist, `${centerMm - 120}mm`);
        createPunchEl(pageEl, edgeDist, `${centerMm - 40}mm`);
        createPunchEl(pageEl, edgeDist, `${centerMm + 40}mm`);
        createPunchEl(pageEl, edgeDist, `${centerMm + 120}mm`);
      }
    } else {
      createPunchEl(pageEl, `${centerMm - 40}mm`, '8mm');
      createPunchEl(pageEl, `${centerMm + 40}mm`, '8mm');
    }
  }

  if (appState.thumbTab && appState.thumbTab.trim()) {
    const tab = document.createElement('div');
    const edgeClass = (side === 'left') ? 'edge-left' : 'edge-right';
    tab.className = `thumb-tab-badge ${edgeClass} thumb-pos-${appState.thumbTabPos || '1'}`;
    tab.innerText = appState.thumbTab.trim().toUpperCase();
    tab.style.setProperty('--thumb-bg', appState.thumbTabBg || '#0f172a');
    tab.style.setProperty('--thumb-color', appState.thumbTabColor || '#ffffff');
    pageEl.appendChild(tab);
  }
}

function createPunchEl(parent, leftVal, topVal) {
  const p = document.createElement('div');
  p.className = 'punch-marker';
  p.style.left = leftVal;
  p.style.top = topVal;
  parent.appendChild(p);
}

/* =====================================================================
   RENDERIZADO DE MÓDULOS EN REJILLA
   ===================================================================== */
function populateModulesToGrid(gridContainer, moduleList, faceTag) {
  moduleList.forEach((mod, idx) => {
    const def = window.MODULE_CATALOG[mod.type] || appState.customModules[mod.type];
    if (!def) return;

    const div = document.createElement('div');
    div.className = 'page-module ' + (mod.span === 2 ? 'span-2' : '');
    div.draggable = true;
    div.dataset.index = idx;
    div.dataset.face = faceTag;

    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragover', handleDragOver);
    div.addEventListener('drop', handleDrop);
    div.addEventListener('dragend', handleDragEnd);

    div.innerHTML = `
      <div class="module-head">
        <div style="display:flex; align-items:center;">
          <span class="drag-handle no-print" title="Arrastrar para mover">⠿</span>
          <span contenteditable="true" onblur="updateModuleTitle('${faceTag}', ${idx}, this.innerText)">${mod.customTitle || def.title}</span>
          <span class="module-badge">${def.badge || 'MOD'}</span>
        </div>
        <div class="module-controls no-print">
          <button class="ctrl-btn" title="Subir posición" onclick="moveModule('${faceTag}',${idx}, -1)">▲</button>
          <button class="ctrl-btn" title="Bajar posición" onclick="moveModule('${faceTag}',${idx}, 1)">▼</button>
          <button class="ctrl-btn" title="Cambiar Ancho" onclick="toggleSpan('${faceTag}', ${idx})">${mod.span === 2 ? '½' : 'Full'}</button>
          ${mod.rows !== undefined && mod.rows > 0 ? `
            <button class="ctrl-btn" title="Menos filas" onclick="adjustRows('${faceTag}', ${idx}, -1)">-</button>
            <button class="ctrl-btn" title="Más filas" onclick="adjustRows('${faceTag}', ${idx}, 1)">+</button>
          ` : ''}
          <button class="ctrl-btn" title="Eliminar de esta cara" onclick="removeModule('${faceTag}',${idx})">✕</button>
        </div>
      </div>
      <div class="module-body">${def.render ? def.render(mod) : renderCustomModuleBody(def, mod)}</div>
    `;
    gridContainer.appendChild(div);
  });
}

function moveModule(faceTag, idx, delta) {
  const faceList = faceTag === 'B' ? appState.faceB.modules : appState.faceA.modules;
  const newIdx = idx + delta;
  if (newIdx < 0 || newIdx >= faceList.length) return;
  const item = faceList.splice(idx, 1)[0];
  faceList.splice(newIdx, 0, item);
  saveState();
  renderWorkspace();
}

function updateBudget() {
  const maxLimitMm = appState.paperFormat === 'a5_duo' ? 180 : 270;
  const currentFace = getActiveFaceData();
  const stepMm = appState.gridStepMm || 7.5;
  let left = 0, right = 0;

  currentFace.modules.forEach(mod => {
    const def = window.MODULE_CATALOG[mod.type] || appState.customModules[mod.type];
    if (!def) return;
    let h = def.heightMm || 40;
    if (mod.rows > 0) h = (mod.rows * stepMm) + 12;

    if (mod.span === 2) { left += h; right += h; }
    else { if (left <= right) left += h; else right += h; }
  });

  const maxUsed = Math.max(left, right);
  const percent = Math.min(Math.round((maxUsed / maxLimitMm) * 100), 100);

  const titleEl = document.getElementById('budgetTitleLabel');
  if (titleEl) titleEl.innerText = `Capacidad (Cara ${appState.activeFace})`;
  
  const lbl = document.getElementById('budgetLabel');
  if (lbl) lbl.innerText = `${Math.round(maxUsed)} mm / ${maxLimitMm} mm`;

  const bar = document.getElementById('budgetBar');
  if (bar) {
    bar.style.width = `${percent}%`;
    bar.className = 'budget-bar-fill' + (maxUsed > maxLimitMm ? ' overflow' : maxUsed > maxLimitMm - 20 ? ' warning' : '');
  }
}

function autoAdjustModules() {
  const currentFace = getActiveFaceData();
  let loops = 0;
  while (loops < 15) {
    let needsAdjust = false;
    currentFace.modules.forEach(mod => {
      if (mod.rows && mod.rows > 3) {
        mod.rows -= 1;
        needsAdjust = true;
      }
    });
    if (!needsAdjust) break;
    loops++;
  }
  saveState();
  renderWorkspace();
}

/* =====================================================================
   GESTIÓN DE MÓDULOS DE LA CARA
   ===================================================================== */
function addModule(key) {
  const def = window.MODULE_CATALOG[key] || appState.customModules[key];
  if (!def) return;
  const currentFace = getActiveFaceData();
  currentFace.modules.push({
    type: key,
    span: def.span || 1,
    rows: def.defaultRows || (def.heightMm ? 0 : 4)
  });
  saveState();
  renderWorkspace();
}

function removeModule(faceTag, idx) {
  const faceList = faceTag === 'B' ? appState.faceB.modules : appState.faceA.modules;
  faceList.splice(idx, 1);
  saveState();
  renderWorkspace();
}

function toggleSpan(faceTag, idx) {
  const faceList = faceTag === 'B' ? appState.faceB.modules : appState.faceA.modules;
  faceList[idx].span = faceList[idx].span === 1 ? 2 : 1;
  saveState();
  renderWorkspace();
}

function adjustRows(faceTag, idx, delta) {
  const faceList = faceTag === 'B' ? appState.faceB.modules : appState.faceA.modules;
  const mod = faceList[idx];
  if (!mod.rows) mod.rows = 4;
  mod.rows = Math.max(2, Math.min(14, mod.rows + delta));
  saveState();
  renderWorkspace();
}

function updateModuleTitle(faceTag, idx, title) {
  const faceList = faceTag === 'B' ? appState.faceB.modules : appState.faceA.modules;
  faceList[idx].customTitle = title.trim();
  saveState();
}

/* =====================================================================
   DRAG & DROP NATIVO
   ===================================================================== */
let draggedIndex = null;
let draggedFace = null;

function handleDragStart(e) {
  draggedIndex = +this.dataset.index;
  draggedFace = this.dataset.face;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedIndex);
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  const targetModule = this.closest('.page-module');
  if (!targetModule) return;

  const targetIndex = +targetModule.dataset.index;
  const targetFace = targetModule.dataset.face;

  if (draggedFace === targetFace && draggedIndex !== null && draggedIndex !== targetIndex) {
    const faceList = draggedFace === 'B' ? appState.faceB.modules : appState.faceA.modules;
    const item = faceList.splice(draggedIndex, 1)[0];
    faceList.splice(targetIndex, 0, item);
    saveState();
    renderWorkspace();
  }
}

function handleDragEnd() {
  this.classList.remove('dragging');
  draggedIndex = null;
  draggedFace = null;
}

/* =====================================================================
   CATÁLOGO Y CREADOR DE MÓDULOS
   ===================================================================== */
function renderCatalogUI() {
  const cat = window.MODULE_CATALOG;
  const groups = {
    pro: document.getElementById('cat-pro'),
    pers: document.getElementById('cat-pers'),
    psy: document.getElementById('cat-psy'),
    mix: document.getElementById('cat-mix')
  };
  Object.keys(groups).forEach(k => { if (groups[k]) groups[k].innerHTML = ''; });

  Object.keys(cat).forEach(key => {
    const m = cat[key];
    const target = groups[m.scope] || groups.pro;
    if (!target) return;
    const el = document.createElement('div');
    el.className = 'catalog-item';
    el.innerHTML = `
      <div><strong>${m.title}</strong></div>
      <div class="catalog-actions">
        <button class="btn" title="Añadir a cara activa" onclick="addModule('${key}')">+</button>
        <button class="btn" title="Personalizar copia" onclick="cloneNativeModule('${key}')">📋</button>
      </div>
    `;
    target.appendChild(el);
  });
}

function cloneNativeModule(nativeKey) {
  const def = window.MODULE_CATALOG[nativeKey];
  if (!def) return;
  document.getElementById('creatorModalHeading').innerText = `Personalizar copia de "${def.title}"`;
  document.getElementById('editingModuleId').value = "";
  document.getElementById('custTitle').value = `${def.title} (Adaptado)`;
  document.getElementById('custScope').value = def.scope || 'pro';
  document.getElementById('custType').value = def.type || 'table';
  document.getElementById('custRows').value = def.defaultRows || 5;
  document.getElementById('custSpan').value = def.span || 1;
  document.getElementById('custCols').value = def.columns ? def.columns.map(c => c.label || c).join(', ') : 'Concepto, Importe, Estado';
  toggleCreatorOptions(def.type || 'table');
  openModuleCreator();
}

function openModuleCreator() { document.getElementById('creatorModal').classList.add('active'); }
function closeModuleCreator() { document.getElementById('creatorModal').classList.remove('active'); }
function toggleCreatorOptions(val) {
  document.getElementById('custOptTable').style.display = val === 'table' ? 'block' : 'none';
  document.getElementById('custOptPattern').style.display = val === 'pattern' ? 'block' : 'none';
}

function renderCustomModuleBody(def, mod) {
  const rows = mod.rows || def.rows || 5;
  if (def.type === 'table') {
    const cols = def.columns || ['Columna 1', 'Columna 2'];
    return `
      <table class="print-table">
        <thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
        <tbody>${Array.from({length: rows}).map(() => `<tr>${cols.map(() => `<td></td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    `;
  } else if (def.type === 'checklist') {
    return `<div>${Array.from({length: rows}).map(() => `<div class="checkbox-row"><div class="box-square"></div><div style="flex:1;"></div></div>`).join('')}</div>`;
  } else if (def.type === 'pattern') {
    const pType = def.patternType || 'lines';
    const cssClass = pType === 'dots' ? 'paper-dots' : pType === 'graph' ? 'paper-graph' : 'paper-lines';
    return `<div class="${cssClass}" style="height:${rows * (appState.gridStepMm || 7.5)}mm;"></div>`;
  } else if (def.type === 'kpi') {
    const cols = def.columns || ['Dato 1', 'Dato 2'];
    return `<div class="kpi-row">${cols.map(c => `<div class="kpi-cell"><span class="kpi-label">${c}</span><div></div></div>`).join('')}</div>`;
  }
  return '';
}

function editCustomModule(id) {
  const mod = appState.customModules[id];
  if (!mod) return;
  document.getElementById('creatorModalHeading').innerText = `Editar Módulo: ${mod.title}`;
  document.getElementById('editingModuleId').value = id;
  document.getElementById('custTitle').value = mod.title;
  document.getElementById('custScope').value = mod.scope;
  document.getElementById('custType').value = mod.type;
  document.getElementById('custRows').value = mod.rows;
  document.getElementById('custSpan').value = mod.span;
  document.getElementById('custCols').value = (mod.columns || []).join(', ');
  document.getElementById('custPatternType').value = mod.patternType || 'lines';
  toggleCreatorOptions(mod.type);
  openModuleCreator();
}

function saveCustomModule() {
  const editId = document.getElementById('editingModuleId').value;
  const id = editId ? editId : 'cust_' + Date.now();
  const title = document.getElementById('custTitle').value.trim() || 'Módulo Personalizado';
  const scope = document.getElementById('custScope').value;
  const type = document.getElementById('custType').value;
  const rows = parseInt(document.getElementById('custRows').value, 10) || 5;
  const span = parseInt(document.getElementById('custSpan').value, 10) || 1;
  const cols = document.getElementById('custCols').value.split(',').map(c => c.trim()).filter(Boolean);
  const patternType = document.getElementById('custPatternType').value;

  appState.customModules[id] = {
    title,
    badge: scope.toUpperCase(),
    scope,
    type,
    span,
    rows,
    columns: cols,
    patternType,
    heightMm: (rows * (appState.gridStepMm || 7.5)) + 12
  };

  saveState();
  renderCustomCatalogList();
  closeModuleCreator();

  if (!editId) addModule(id);
  else renderWorkspace();
}

function renderCustomCatalogList() {
  const container = document.getElementById('customModulesList');
  const group = document.getElementById('customModulesGroup');
  if (!container || !group) return;
  container.innerHTML = '';
  const keys = Object.keys(appState.customModules || {});
  if (keys.length === 0) { group.style.display = 'none'; return; }
  group.style.display = 'block';

  keys.forEach(k => {
    const item = appState.customModules[k];
    const el = document.createElement('div');
    el.className = 'catalog-item';
    el.innerHTML = `
      <div>
        <strong>${item.title}</strong>
        <div style="font-size:9.5px; color:var(--text-muted);">${item.scope} \vert{}${item.rows} filas</div>
      </div>
      <div class="catalog-actions">
        <button class="btn" onclick="addModule('${k}')">+</button>
        <button class="btn" onclick="editCustomModule('${k}')">✎</button>
        <button class="btn" style="color:var(--danger);" onclick="deleteCustomModule('${k}')">✕</button>
      </div>
    `;
    container.appendChild(el);
  });
}

function deleteCustomModule(id) {
  if (confirm(`¿Eliminar módulo "${appState.customModules[id].title}"?`)) {
    delete appState.customModules[id];
    appState.faceA.modules = appState.faceA.modules.filter(m => m.type !== id);
    appState.faceB.modules = appState.faceB.modules.filter(m => m.type !== id);
    saveState();
    renderCustomCatalogList();
    renderWorkspace();
  }
}

/* =====================================================================
   IMPRESIÓN POR LOTES & MOTOR BOOKLET
   ===================================================================== */
function openBatchModal() {
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('batchStartDate').value = today;
  const d = new Date();
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().slice(0, 10);
  document.getElementById('batchEndDate').value = lastDay;

  const populate = (selId, defaultVal) => {
    const sel = document.getElementById(selId);
    sel.innerHTML = '';
    Object.keys(window.BASE_PRESETS).forEach(k => {
      sel.innerHTML += `<option value="${k}">${window.BASE_PRESETS[k].name}</option>`;
    });
    Object.keys(appState.customPresets || {}).forEach(k => {
      sel.innerHTML += `<option value="${k}">${appState.customPresets[k].name}</option>`;
    });
    sel.value = defaultVal;
  };

  populate('batchPresetMonThu', 'focus');
  populate('batchPresetFri', 'commercial');
  populate('batchPresetWeekend', 'weekly_review');

  updateBatchAuditCalculator();
  document.getElementById('batchModal').classList.add('active');
}

function openBookletBatchModal() {
  openBatchModal();
  document.getElementById('batchOutputMode').value = 'booklet';
  updateBatchAuditCalculator();
}

function closeBatchModal() { document.getElementById('batchModal').classList.remove('active'); }

function generateAndPrintBatch() {
  const startStr = document.getElementById('batchStartDate').value;
  const endStr = document.getElementById('batchEndDate').value;
  if (!startStr || !endStr) { alert("Selecciona fecha de inicio y fin."); return; }

  const dStart = new Date(startStr);
  const dEnd = new Date(endStr);
  if (dStart > dEnd) { alert("La fecha inicial debe ser anterior a la final."); return; }

  const pMonThu = document.getElementById('batchPresetMonThu').value;
  const pFri = document.getElementById('batchPresetFri').value;
  const pWeekend = document.getElementById('batchPresetWeekend').value;
  const outputMode = document.getElementById('batchOutputMode').value;
  const holidays = document.getElementById('batchHolidays').value.split(',').map(s => s.trim()).filter(Boolean);

  const container = document.getElementById('printSheetContainer');
  container.innerHTML = '';
  container.className = 'print-container';
  container.classList.add(`card-box-${appState.boxStyle || 'framed'}`);

  const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
  const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

  const logicalPages = [];
  let curr = new Date(dStart);
  let pageNumber = 1;

  while (curr <= dEnd) {
    const currIso = curr.toISOString().slice(0, 10);
    const dayOfWeek = curr.getDay();
    const isHoliday = holidays.includes(currIso);

    let chosenPresetKey = pMonThu;
    if (dayOfWeek === 5) chosenPresetKey = pFri;
    if (dayOfWeek === 0 || dayOfWeek === 6 || isHoliday) chosenPresetKey = pWeekend;

    const presetData = window.BASE_PRESETS[chosenPresetKey] || appState.customPresets[chosenPresetKey] || window.BASE_PRESETS.dual;
    const dateFormatted = `${dayNames[dayOfWeek]}, ${curr.getDate()} DE${monthNames[curr.getMonth()]} DE ${curr.getFullYear()}${isHoliday ? ' (FESTIVO)' : ''}`;
    const weekNum = getISOWeek(curr);

    logicalPages.push({
      modules: presetData.modules,
      footerHtml: window.BASE_FOOTERS.pro.html,
      dateTitle: dateFormatted,
      weekLabel: `SEM ${weekNum}`,
      pageNum: pageNumber++
    });

    if (outputMode === 'duplex_sequence') {
      logicalPages.push({
        modules: window.BASE_PRESETS.blank_notes.modules,
        footerHtml: window.BASE_FOOTERS.personal.html,
        dateTitle: `${dateFormatted} (NOTAS)`,
        weekLabel: `SEM ${weekNum}`,
        pageNum: pageNumber++
      });
    }

    curr.setDate(curr.getDate() + 1);
  }

  isBatchPrintingActive = true;

  if (outputMode === 'booklet') {
    while (logicalPages.length % 4 !== 0) {
      logicalPages.push({
        modules: window.BASE_PRESETS.blank_notes.modules,
        footerHtml: window.BASE_FOOTERS.personal.html,
        dateTitle: "NOTAS & BALANCE COMPLEMENTARIO",
        weekLabel: "CUADERNILLO",
        pageNum: pageNumber++
      });
    }

    const N = logicalPages.length;
    const totalSheets = N / 4;

    for (let s = 0; s < totalSheets; s++) {
      const leftIndexRecto = (N - 2 * s) - 1;
      const rightIndexRecto = (2 * s + 1) - 1;
      container.appendChild(buildBookletSheetElement(logicalPages[leftIndexRecto], logicalPages[rightIndexRecto], 'RECTO', s + 1, totalSheets));

      const leftIndexVerso = (2 * s + 2) - 1;
      const rightIndexVerso = (N - 2 * s - 1) - 1;
      container.appendChild(buildBookletSheetElement(logicalPages[leftIndexVerso], logicalPages[rightIndexVerso], 'VERSO', s + 1, totalSheets));
    }

    closeBatchModal();
    setTimeout(() => { triggerSafePrint(true); }, 250);
  } else {
    logicalPages.forEach(p => {
      const side = (p.pageNum % 2 === 0) ? 'left' : 'right';
      container.appendChild(buildBatchSheetElement(p, p.dateTitle, p.weekLabel, side, p.pageNum));
    });

    closeBatchModal();
    setTimeout(() => { triggerSafePrint(false); }, 250);
  }
}

function buildBatchSheetElement(faceData, dateTitle, weekLabel, side, pageNum) {
  const sheet = document.createElement('div');
  sheet.className = `sheet-page format-a4 ${getGutterClass(side)}`;
  appendPhysicalMarks(sheet, side, 297);

  sheet.insertAdjacentHTML('beforeend', `
    <header class="page-header">
      <div>
        <div class="header-main-title">${dateTitle}</div>
        <div class="header-subtitle">${appState.dailySubtitle} \vert{}${weekLabel}</div>
      </div>
      <div class="header-meta-slots">
        <div class="meta-slot">
          <strong>PÁG.</strong>
          <span style="font-weight:700;">#${pageNum}</span>
        </div>
      </div>
    </header>
  `);

  const grid = document.createElement('div');
  grid.className = 'sheet-grid';
  populateModulesToGrid(grid, faceData.modules, 'BATCH');
  sheet.appendChild(grid);

  sheet.insertAdjacentHTML('beforeend', `
    <footer class="page-footer">
      <div class="footer-custom-content">${faceData.footerHtml}</div>
      <div class="footer-brand">${appState.footerBrand}</div>
    </footer>
  `);

  return sheet;
}

function buildBookletSheetElement(leftPageData, rightPageData, faceName, sheetNum, totalSheets) {
  const sheet = document.createElement('div');
  sheet.className = 'sheet-page format-a5-duo';

  sheet.insertAdjacentHTML('beforeend', `
    <div class="fold-mark-top"></div>
    <div class="fold-mark-bottom"></div>
  `);

  const leftA5 = document.createElement('div');
  leftA5.className = 'a5-subpage booklet-left';
  buildBookletSubpageContent(leftA5, leftPageData, `Pliego ${sheetNum}/${totalSheets} [${faceName}]`);

  const rightA5 = document.createElement('div');
  rightA5.className = 'a5-subpage booklet-right';
  buildBookletSubpageContent(rightA5, rightPageData, `Pliego ${sheetNum}/${totalSheets} [${faceName}]`);

  sheet.appendChild(leftA5);
  sheet.appendChild(rightA5);
  return sheet;
}

function buildBookletSubpageContent(container, pageData, sheetMeta) {
  container.insertAdjacentHTML('beforeend', `
    <header class="page-header" style="margin-bottom:4px; padding-bottom:3px;">
      <div>
        <div class="header-main-title" style="font-size:11px;">${pageData.dateTitle}</div>
        <div class="header-subtitle" style="font-size:7px;">${pageData.weekLabel} \vert{}${sheetMeta}</div>
      </div>
      <div class="header-meta-slots" style="font-size:8px;">
        <div class="meta-slot">
          <strong>PÁG.</strong>
          <span style="font-weight:700;">#${pageData.pageNum}</span>
        </div>
      </div>
    </header>
  `);

  const grid = document.createElement('div');
  grid.className = 'sheet-grid';
  populateModulesToGrid(grid, pageData.modules, 'BOOKLET');
  container.appendChild(grid);

  container.insertAdjacentHTML('beforeend', `
    <footer class="page-footer" style="font-size:7px;">
      <div class="footer-custom-content">${pageData.footerHtml}</div>
      <div class="footer-brand" style="font-size:6.5px;">${appState.footerBrand}</div>
    </footer>
  `);
}

function getISOWeek(d) {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

/* =====================================================================
   RESPALDO JSON Y ARCHIVOS
   ===================================================================== */
function exportConfigJson() {
  saveState();
  const blob = new Blob([JSON.stringify(appState, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `agenda_config_${new Date().toISOString().slice(0,10)}.json`);
}

function triggerImportJson() { document.getElementById('importInput').click(); }

function exportModulePackJson() {
  saveState();
  const pack = {
    customModules: appState.customModules,
    customPresets: appState.customPresets,
    customFooters: appState.customFooters,
    customHeaders: appState.customHeaders,
    customStyles: appState.customStyles,
    savedAgendas: appState.savedAgendas
  };
  const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `pack_taller_${new Date().toISOString().slice(0,10)}.json`);
}

function triggerImportModulePack() { document.getElementById('modulePackInput').click(); }

function importModulePackFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const pack = JSON.parse(event.target.result);
      ['customModules', 'customPresets', 'customFooters', 'customHeaders', 'customStyles', 'savedAgendas'].forEach(prop => {
        if (pack[prop]) appState[prop] = Object.assign({}, appState[prop] || {}, pack[prop]);
      });
      saveState();
      populatePresetSelect();
      populateFooterSelect();
      populateHeaderSelect();
      populateStyleSelect();
      renderSavedAgendasList();
      renderCustomCatalogList();
      renderWorkspace();
      alert("Paquete de taller cargado con éxito.");
    } catch (err) { alert("Error al importar el paquete."); }
  };
  reader.readAsText(file);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

