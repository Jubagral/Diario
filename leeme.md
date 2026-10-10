# 📓 Folio Workshop — Modular Print Agenda Engine

> Entorno *local-first*, modular y sin dependencias para el diseño, maquetación e imposición editorial de agendas y cuadernos de productividad física (A4 y A5).

![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES6+-F7DF1E?logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Paged_Media-1572B6?logo=css3&logoColor=white)
![Storage](https://img.shields.io/badge/Storage-localStorage_v14-success)
![Network](https://img.shields.io/badge/Network-100%25_Offline-blueviolet)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🧭 Visión General

**Folio Workshop** es un sistema de taller gráfico web diseñado para eliminar la rigidez de las agendas comerciales y la complejidad de los entornos de maquetación DTP pesados (InDesign, Quark). Permite componer pliegos físicos adaptados a rutinas reales de trabajo, equilibrando la productividad analítica y la desconexión mental.

Funciona de forma **100% autónoma en el navegador** a través del protocolo `file://`, sin servidores, sin llamadas a CDN externas y con persistencia atómica local.

---

## ✨ Características Principales

### 📐 Imposición Editorial y Mecánica de Taller
* **Pliegos Dúplex Reales (*Mirror Gutter*):** Alternancia automática del margen de encuadernación en páginas pares e impares (lomo interior).
* **Formato 2x A5 en A4 Apaisado:** Maquetación horizontal con marcas perimetrales discretas de corte para guillotina a 148,5 mm en los márgenes de sangre (sin líneas centrales impresas).
* **Motor de Imposición Cuadernillo (*Booklet*):** Algoritmo de signatura matemática para pliegos de $N/4$ hojas A4 dobladas por la mitad, con marcas de hendido central (`▾ PLEGADO`) y compensación de lomo hacia el pliegue.
* **Perforaciones Normalizadas ISO 838:** Cruces micrométricas de taladro a 9–12 mm del lomo para carpetas de 2 anillas (80 mm) y 4 anillas (80-80-80 mm).
* **Pestañas de Uñero (*Thumb Tabs*):** Bloques exteriores en el canto de corte con rotación tipográfica vertical, posición en 5 alturas y configuración cromática personalizada por categoría.

### 🧩 Arquitectura Modular Desacoplada
* **Catálogo Extensible:** Registro dinámico mediante API declarativa sin compilación.
* **Presupuesto Vertical en Milímetros:** Monitor métrico continuo que previene desbordamientos de página sobre el límite físico imprimible (270 mm en A4; 180 mm en A5).
* **Control de Densidad Cognitiva:** Cálculo de fricción analógica en tiempo real que previene el abandono de la agenda por exceso de microacciones abiertas por cara.
* **Reordenación Híbrida:** Drag & Drop nativo HTML5 + controles directos de subida/bajada (`▲` / `▼`) y cambio de ancho (`½` / `Full`).

### 🖨️ Calibración de Tinta y Preimpresión
* **Perfil Ahorro Láser Puro (1-bit):** Conversión de todos los grises tramados a microtrazos vectoriales discontinuos de 0.25 pt (`stroke-dasharray: 1, 2`). Elimina el *dithering*, ahorra hasta un 40% de tóner y maximiza la nitidez tipográfica en impresoras monocromo.
* **Pautas Dinámicas:** Ajuste paramétrico del paso de renglón (`5.0 mm`, `6.0 mm` japonesa, `7.0 mm`, `7.5 mm` estándar y `8.5 mm`).
* **Tratamiento de Módulos:** Selector de acabado geométrico (Marco cerrado, Minimalista abierto, Cabecera invertida en tinta sólida o Banda lateral de acento).
* **Compensación de Hardware:** Ajuste de área segura de tracción mecánica (de 0 mm a +5 mm) según impresora.

### 📅 Automatización de Lotes y Biblioteca de Agendas
* **Generador de Fechas Continuo:** Datación automática en castellano con cálculo de semana ISO y asignación condicional de plantillas según el día de la semana.
* **Gestor de Excepciones y Festivos:** Lista de fechas en formato ISO para aplicar automáticamente plantillas de descanso en jornadas no laborables intersemanales.
* **Biblioteca de Agendas:** Guardado de tiradas completas con reimpresión en un solo clic y pre-auditoría física de hojas necesarias y grosor estimado de lomo.

---

## 📁 Estructura del Proyecto

```text
folio-workshop/
├── index.html              # Interfaz de usuario (Tabs, Toolbar de Zoom y Lienzo)
├── css/
│   └── styles.css          # Paged Media CSS, variables tipográficas y temas
├── js/
│   ├── presets.js          # Definición de plantillas base, pies, encabezados y estilos
│   └── app.js              # Controlador de estado, motor de imposición y persistencia
└── modules/                # Componentes autocontenidos de la agenda
    ├── prod_mit.js         # Prioridades Críticas (Most Important Tasks)
    ├── prod_deepwork.js    # Bloques de trabajo profundo sin distracción
    ├── prod_parking.js     # Parking lot para ideas intrusivas
    ├── psy_shutdown.js     # Protocolo de cierre mental y victoria del día
    ├── psy_braindump.js    # Vaciado mental libre / Cuaderno de notas
    ├── psy_weekly_review.js# Cierre Semanal & Balance Dominical
    ├── pro_billing.js      # Registro diario de facturación devengada
    ├── pro_expenses.js     # Justificantes, tickets deducibles y control NIF
    ├── pro_tax.js          # Hucha fiscal analítica (IVA 21% / IRPF 20%)
    ├── pro_pipeline.js     # Pipeline de prospección y propuestas activas
    ├── pro_mileage.js      # Dietas y kilometraje fiscal computable
    ├── pro_ratio.js        # Indicadores de conversión y rendimiento
    ├── pro_aging.js        # Antigüedad de deuda y vencimientos de cobro
    ├── pers_expenses.js    # Desglose de tesorería del hogar
    ├── pers_cooldown.js    # Protocolo de descompresión vespertina
    ├── pers_journal.js     # Diario de reflexión personal
    ├── pers_habits.js      # Cuadrícula de hábitos y rutinas
    ├── gen_schedule.js     # Time-blocking horario (07:00 - 20:00)
    ├── gen_tasks.js        # Lista de tareas generales con casillas
    ├── gen_dots.js         # Cuadrícula de puntos isométrica (Bullet Journal)
    └── gen_eisenhower.js   # Matriz Urgente vs. Importante