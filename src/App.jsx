import { useState, useEffect, useCallback, useRef } from "react";

const MILESTONES = [
  // ── FASE 0: PREPARACIÓN 2026-2027 ──────────────────────────
  { id:"m1",   date:"2026-07-01", label:"Depositar 5K → 30K base inversión 19%", area:"Finanzas", critical:true,  phase:0 },
  { id:"m3",   date:"2026-10-01", label:"Préstamo 24K madre: 8K Renovación + 15K inversión (→50K). Cuota 392€/mes", area:"Negocios", critical:true,  phase:0 },
  { id:"d1",   date:"2026-10-15", label:"Inversión salta a 50K (15K préstamo + depósitos buffer)", area:"Finanzas", critical:false, phase:0 },
  { id:"d2",   date:"2027-01-01", label:"Depósito 5K → 55K inversión", area:"Finanzas", critical:false, phase:0 },
  { id:"m4",   date:"2027-03-01", label:"Ascenso HP Expert +3% bruto", area:"HP", critical:true,  phase:0 },
  { id:"d3",   date:"2027-05-01", label:"Depósito 5K → 60K inversión", area:"Finanzas", critical:false, phase:0 },
  { id:"m5",   date:"2027-06-01", label:"Avisar rescate inversión 19% (3 meses). Fin reparaciones casa (19K pagados)", area:"Finanzas", critical:true,  phase:0 },
  { id:"d4",   date:"2027-07-01", label:"Depósito 5K → 65K inversión", area:"Finanzas", critical:false, phase:0 },
  { id:"m6",   date:"2027-09-01", label:"Último depósito → 67K. Todo listo para rescatar", area:"Finanzas", critical:false, phase:0 },
  // ── FASE 1: FERRETERÍA + HIPOTECA MADRE 2027-2028 ──────────
  { id:"m7",   date:"2027-10-01", label:"Rescatar 67.440€. COMPRAR FERRETERÍA 60K upfront. Quedan ~7.4K. Tío atiende", area:"Negocios", critical:true,  phase:1 },
  { id:"m10",  date:"2028-06-01", label:"Lanzar alquiler herramientas desde ferretería (10-15K inversión)", area:"Negocios", critical:false, phase:1 },
  { id:"m8b",  date:"2028-08-01", label:"HIPOTECA CONJUNTA madre+hijo. Cancelar préstamo 17.4K + entrada 28.900€ + arreglos piso madre 10K", area:"Finanzas", critical:true,  phase:1 },
  { id:"m11",  date:"2028-09-01", label:"Vender Citigo → comprar Hyundai Inster. Verificar negocios >4.500€/mes", area:"Personal", critical:false, phase:1 },
  { id:"m12",  date:"2028-10-01", label:"DEJAR HP. Tú llevas ferretería mañanas 8-14h. Excedente ~6.000-7.800€/mes", area:"Negocios", critical:true,  phase:2 },
  { id:"ef1",  date:"2028-11-01", label:"Mini fondo emergencia: 10K (3 meses gastos) en Revolut", area:"Finanzas", critical:false, phase:2 },
  // ── FASE 2: EXPANSIÓN 2029 ──────────────────────────────────
  { id:"m13",  date:"2029-01-01", label:"Punto recarga EV en ferretería (5-8K)", area:"Negocios", critical:false, phase:2 },
  { id:"ef2",  date:"2029-06-01", label:"FONDO EMERGENCIA completo: 21K (6 meses). Intocable en Revolut", area:"Finanzas", critical:true,  phase:2 },
  { id:"m14",  date:"2029-08-01", label:"Inversión 19% reconstruida a 95K. Fondo madre cubierto → 1.504€/mes para ella", area:"Finanzas", critical:true,  phase:2 },
  { id:"m15",  date:"2029-09-01", label:"INICIO FARMACIA UB turno tarde 14-19h (5 años, termina jun 2034)", area:"Farmacia", critical:true,  phase:2 },
  { id:"idx1", date:"2029-10-01", label:"Abrir FONDO INDEXADO MSCI World (Indexa/MyInvestor): 1.200€/mes automático", area:"Finanzas", critical:true,  phase:2 },
  // ── FASE 3: DIVERSIFICACIÓN + NEGOCIOS 2030-2033 ────────────
  { id:"m16",  date:"2030-06-01", label:"Abrir Specialty Coffee en Av. Barcelona SJD", area:"Negocios", critical:true,  phase:3 },
  { id:"m17",  date:"2030-12-01", label:"Comprar finca El Perelló (37.500€ tu 50%)", area:"Personal", critical:true,  phase:3 },
  { id:"idx2", date:"2030-01-01", label:"Capar 19% al 40-50% del capital: tu 19% propio (0€ ahora, hasta 60-80K máx)", area:"Finanzas", critical:false, phase:3 },
  { id:"own19",date:"2032-01-01", label:"Empezar TU propio 19% (~20K primeros). Separado de los 95K de tu madre", area:"Finanzas", critical:false, phase:3 },
  { id:"m18",  date:"2031-06-01", label:"Abrir Franquicia Trasteros + contratar empleada hogar", area:"Negocios", critical:true,  phase:3 },
  { id:"m19",  date:"2032-06-01", label:"Abrir Chiquipark Sant Just + Servicios Senior", area:"Negocios", critical:true,  phase:3 },
  { id:"div1", date:"2032-01-01", label:"Abrir CARTERA DIVIDENDOS ETF reparto: 1.500€/mes → renta pasiva mensual", area:"Finanzas", critical:true,  phase:3 },
  { id:"m20",  date:"2033-06-01", label:"Abrir Co-Aliment (tía + suegros)", area:"Negocios", critical:true,  phase:3 },
  // ── FASE 4: CONSOLIDACIÓN 2034-2041 ─────────────────────────
  { id:"m21",  date:"2034-04-01", label:"Revolut PAGADA. +402€/mes libres → indexado", area:"Finanzas", critical:true,  phase:4 },
  { id:"m22",  date:"2034-06-01", label:"FIN FARMACIA UB. Colegiarse como farmacéutico", area:"Farmacia", critical:true,  phase:4 },
  { id:"m23",  date:"2035-06-01", label:"COMPRAR FARMACIA Baix Llobregat (300-400K financiada)", area:"Farmacia", critical:true,  phase:4 },
  { id:"m24",  date:"2036-04-01", label:"Cofidis PAGADA. DEUDA DE CONSUMO CERO. +285€/mes libres", area:"Finanzas", critical:true,  phase:4 },
  { id:"m25",  date:"2037-06-01", label:"Casa nueva 700K+. Casa actual alquilada (2 pisos × 1.025€)", area:"Personal", critical:true,  phase:4 },
  { id:"m26",  date:"2039-06-01", label:"Propiedad Panamá AL CONTADO (130-165K€)", area:"Personal", critical:true,  phase:4 },
  { id:"m27",  date:"2040-06-01", label:"Propiedad Portugal AL CONTADO (100-150K€). Indexado ~514K", area:"Personal", critical:true,  phase:4 },
  { id:"m28",  date:"2041-05-01", label:"15 AÑOS. 9 negocios + farmacia + 5 propiedades + indexados ~607K", area:"Finanzas", critical:true,  phase:4 },
];

const MILESTONE_TASKS = {
  m1: {
    when: "Hazlo en: julio 2026 (un solo día)",
    amount: "Mueves 5.000€ de golpe",
    result: "Tendrás 30.000€ en la inversión 19%",
    steps: [
      "Coge 5.000€ que ya tienes ahorrados (el buffer)",
      "Transfiérelos a la cuenta de la inversión 19%",
      "Comprueba que el total invertido sea 30.000€",
    ],
  },
  m3: {
    when: "Hazlo en: octubre 2026 (ese mes)",
    amount: "Préstamo de 24.000€ que pide tu madre",
    result: "Renovación Express arrancada + inversión 19% en ~50.000€",
    steps: [
      "Tu madre va al banco y firma el préstamo preaprobado de 24.000€",
      "De esos 24.000€: separa 8.000€ para Renovación Express",
      "Mete 15.000€ a la inversión 19% (sube de 35K a 50K)",
      "Deja 1.000€ en la cuenta de ahorro (buffer)",
      "Firma con el paleta un papel del reparto 70% tú / 30% él",
      "La cuota del préstamo (392€/mes) se paga desde Revolut",
    ],
  },
  m4: {
    when: "Hazlo en: marzo 2027",
    amount: "Subida del 3% en tu sueldo bruto",
    result: "Más nómina cada mes",
    steps: [
      "Pide formalmente el ascenso a HP Expert en tu trabajo",
      "Cuando te lo confirmen, actualiza tu nómina en la app (pestaña Budget)",
    ],
  },
  m5: {
    when: "Hazlo en: junio 2027",
    amount: "Sin coste, son gestiones",
    result: "Todo listo para rescatar la inversión y comprar la ferretería",
    steps: [
      "Avisa a quien gestiona tu inversión 19% que en octubre sacarás el dinero (piden 3 meses de aviso)",
      "Confirma que ya terminaste de pagar las reparaciones de tu casa (19.000€)",
      "Habla con el vendedor de la ferretería para cerrar el precio (60.000€) y la fecha",
    ],
  },
  m7: {
    when: "Hazlo en: octubre 2027",
    amount: "Sacas ~67.440€ y pagas 60.000€",
    result: "Ferretería comprada y tuya. Te quedan ~7.440€",
    steps: [
      "Saca TODO el dinero de la inversión 19% (unos 67.440€)",
      "Paga la ferretería entera: 60.000€ al vendedor de una vez",
      "Firma el traspaso con un gestor o notario",
      "Habla con tu tío para que atienda la ferretería este primer año",
      "Los ~7.440€ que sobran déjalos en el ahorro",
      "OJO: de ese dinero, ~9.666€ eran de tu madre (su parte sigue siendo suya)",
    ],
  },
  ef1: {
    when: "EMPIEZA: sept 2028 · TERMINA: nov 2028 (cuando juntes 10K)",
    amount: "Aparta unos 3.300€/mes durante 3 meses",
    result: "10.000€ guardados como primer colchón de seguridad",
    steps: [
      "A partir de septiembre 2028 (ya tienes la ferretería dando dinero), cada mes aparta ~3.300€ en una cuenta de ahorro Revolut SEPARADA",
      "Repite 3 meses hasta juntar 10.000€",
      "Este dinero NO se invierte ni se gasta: es para imprevistos",
      "Cuando llegues a 10.000€, deja de aportar a esto (sigues con el siguiente paso)",
    ],
  },
  m10: {
    when: "Hazlo en: junio 2028",
    amount: "Inviertes 10.000-15.000€ en herramientas",
    result: "Nuevo ingreso por alquiler de herramientas",
    steps: [
      "Compra un stock de herramientas para alquilar (10.000-15.000€) con lo ahorrado",
      "Ponlo en marcha desde la ferretería",
      "Define precios de alquiler por día y por semana",
      "Vende el coche Citigo",
    ],
  },
  m8b: {
    when: "Hazlo en: agosto 2028",
    amount: "Pagas ~56.300€ en total ese mes",
    result: "Tu madre tiene piso propio. Préstamo cancelado. Quedan ~3.635€",
    steps: [
      "Cancela del todo el préstamo de tu madre (quedan ~17.400€ por pagar)",
      "Vais juntos al banco a pedir la HIPOTECA CONJUNTA (tu madre y tú firmáis los dos)",
      "Pon la entrada del piso: 28.900€",
      "Paga los arreglos del piso de tu madre: 10.000€",
      "Tu madre deja de pagar alquiler (796€) y empieza a pagar la hipoteca (806€) de su cuenta",
    ],
  },
  m11: {
    when: "Hazlo en: septiembre 2028",
    amount: "Coche nuevo 16.000-25.000€",
    result: "Coche eléctrico nuevo + decisión de dejar HP confirmada",
    steps: [
      "Vende el Citigo si no lo hiciste antes",
      "Compra el Hyundai Inster (eléctrico)",
      "IMPORTANTE: comprueba que tus negocios ganan más de 4.500€/mes limpios antes de dejar HP",
    ],
  },
  m12: {
    when: "Hazlo en: octubre 2028",
    amount: "Sin coste — es un cambio de vida",
    result: "Dejas el trabajo fijo. La ferretería es tu trabajo de mañanas",
    steps: [
      "Presenta la baja voluntaria en HP",
      "Empieza a atender la ferretería tú mismo de 8h a 14h",
      "Confirma que te sobran 6.000-7.800€/mes con los negocios",
    ],
  },
  ef2: {
    when: "EMPIEZA: dic 2028 · TERMINA: jun 2029 (cuando juntes 21K)",
    amount: "Aparta ~1.800€/mes durante ~6 meses",
    result: "21.000€ guardados (6 meses de tus gastos), intactos para siempre",
    steps: [
      "Ya tienes 10.000€ del primer colchón (del paso de nov 2028)",
      "Desde diciembre 2028, cada mes añade ~1.800€ más a esa misma cuenta de ahorro",
      "Sigue hasta que la cuenta tenga 21.000€ en total (hacia junio 2029)",
      "Cuando llegues a 21.000€, PARA. Ya está completo",
      "Este dinero solo se toca en una emergencia real (te quedas sin ingresos, falla un negocio). Nunca para gastos normales ni inversión",
      "Tenlo en una cuenta remunerada de Revolut (te da ~2-3% al año sin riesgo)",
    ],
  },
  m13: {
    when: "Hazlo en: enero 2029",
    amount: "Inviertes 5.000-8.000€",
    result: "Punto de recarga eléctrica dando ingresos en la ferretería",
    steps: [
      "Instala un punto de recarga de coches eléctricos en la ferretería",
      "Da de alta el servicio y pon las tarifas",
    ],
  },
  m14: {
    when: "Se cumple en: agosto 2029 (resultado de ir ahorrando antes)",
    amount: "La inversión 19% vuelve a tener 95.000€",
    result: "El fondo de tu madre está completo y le genera 1.504€/mes",
    steps: [
      "Desde que pagaste la ferretería (oct 2027), has ido metiendo dinero al 19% poco a poco",
      "En agosto 2029 ese fondo llega a 95.000€",
      "A partir de aquí, los 1.504€/mes que genera se los das a tu madre como complemento de su pensión",
      "Estos 95.000€ ya no se tocan: son su jubilación",
    ],
  },
  idx1: {
    when: "EMPIEZA: octubre 2029 · Es PARA SIEMPRE (no termina)",
    amount: "1.200€/mes automáticos",
    result: "Una segunda inversión más segura que crece sola durante años",
    steps: [
      "Abre una cuenta en Indexa Capital o MyInvestor (por internet, gratis)",
      "Elige un 'fondo indexado mundial' (se llama MSCI World) — es de bajo coste y muy seguro a largo plazo",
      "Configura que te saquen 1.200€/mes automáticamente para meterlos ahí",
      "NO mires si sube o baja cada día. Esto es para dentro de 10-15 años",
      "Cada año sube un poco la aportación si te sobra más dinero",
    ],
  },
  idx2: {
    when: "EMPIEZA: 2030 · Revisa una vez AL AÑO",
    amount: "Sin coste — es una revisión",
    result: "Tu dinero repartido para no tener todo en lo arriesgado",
    steps: [
      "El 19% son los 95.000€ del fondo de tu madre y se quedan fijos ahí",
      "Una vez al año, suma: 95.000€ (del 19%) + lo que tengas en el fondo indexado",
      "Mira qué porcentaje es el 19% del total (al principio será alto, ej. 80% — es NORMAL)",
      "Mientras el 19% sea más de la mitad: TODO el dinero nuevo que inviertas va al fondo indexado, nada al 19%",
      "Hacia 2033-2034 el indexado llega a 95.000€ y ya tienes mitad y mitad: objetivo cumplido",
      "Nunca saques dinero del 19%, solo alimenta más el indexado",
    ],
  },
  m15: {
    when: "EMPIEZA: septiembre 2029 · TERMINA: junio 2034 (5 años de carrera)",
    amount: "Matrícula ~170€/mes",
    result: "Te conviertes en farmacéutico titulado",
    steps: [
      "Matricúlate en el grado de Farmacia en la Universidad de Barcelona",
      "Organiza las clases en turno de tarde (14h-19h) para poder llevar la ferretería por la mañana",
      "Presupuesta unos 170€/mes de matrícula",
    ],
  },
  m16: {
    when: "Hazlo en: junio 2030",
    amount: "Inversión del negocio (variable)",
    result: "Cafetería de especialidad abierta",
    steps: [
      "Abre la cafetería de especialidad en Avenida Barcelona, Sant Joan Despí",
      "Contrata baristas",
      "Antes de abrir, confirma que los negocios anteriores siguen dando beneficios",
    ],
  },
  m17: {
    when: "Hazlo en: diciembre 2030",
    amount: "Tu mitad: 37.500€",
    result: "Finca en El Perelló (copropiedad)",
    steps: [
      "Compra la finca de El Perelló (tu parte son 37.500€)",
      "Pon por escrito quién es dueño de qué parte",
    ],
  },
  m18: {
    when: "Hazlo en: junio 2031",
    amount: "Inversión de franquicia + sueldo empleada",
    result: "Negocio de trasteros + ayuda en casa",
    steps: [
      "Abre la franquicia de alquiler de trasteros",
      "Contrata una empleada de hogar a jornada completa (tú pagas 3/4 partes)",
    ],
  },
  m19: {
    when: "Hazlo en: junio 2032",
    amount: "Inversión de los negocios",
    result: "Chiquipark + Servicios Senior abiertos",
    steps: [
      "Abre el Chiquipark en Sant Just",
      "Lanza el negocio de Servicios Senior",
      "Instala otro punto de recarga eléctrica",
    ],
  },
  m20: {
    when: "Hazlo en: junio 2033",
    amount: "Inversión del negocio (con tía y suegros)",
    result: "Negocio Co-Aliment abierto",
    steps: [
      "Abre Co-Aliment junto a tu tía y tus suegros",
      "Instala otro punto de recarga eléctrica",
    ],
  },
  m21: {
    when: "Se cumple en: abril 2034",
    amount: "Liberas 402€/mes",
    result: "Préstamo Revolut pagado del todo",
    steps: [
      "Confirma que terminaste de pagar el préstamo de Revolut",
      "Esos 402€/mes que ya no pagas, mételos al fondo indexado",
    ],
  },
  m22: {
    when: "Se cumple en: junio 2034",
    amount: "Sin coste",
    result: "Eres farmacéutico colegiado",
    steps: [
      "Termina el grado de Farmacia",
      "Date de alta en el Colegio de Farmacéuticos",
    ],
  },
  m23: {
    when: "Hazlo en: 2035",
    amount: "Farmacia 300.000-400.000€ (con financiación)",
    result: "Farmacia propia",
    steps: [
      "Compra una farmacia en el Baix Llobregat",
      "Negocia el traspaso y la financiación con el banco",
    ],
  },
  m24: {
    when: "Se cumple en: abril 2036",
    amount: "Liberas 285€/mes",
    result: "Cofidis pagado. Ya no debes nada de consumo",
    steps: [
      "Confirma que terminaste de pagar Cofidis",
      "Ya no tienes deudas de consumo: mete esos 285€/mes al fondo indexado",
    ],
  },
  m25: {
    when: "Hazlo en: 2037",
    amount: "Casa 700.000€+",
    result: "Casa nueva. La actual te da alquiler",
    steps: [
      "Compra la casa nueva",
      "Pon tu casa actual en alquiler (2 pisos a ~1.025€ cada uno)",
    ],
  },
  m26: {
    when: "Hazlo en: 2039",
    amount: "130.000-165.000€ al contado",
    result: "Propiedad en Panamá pagada entera",
    steps: [
      "Compra la propiedad en Panamá pagando todo de una vez (sin hipoteca)",
      "Nunca pidas hipoteca fuera de España",
    ],
  },
  m27: {
    when: "Hazlo en: 2040",
    amount: "100.000-150.000€ al contado",
    result: "Propiedad en Portugal pagada entera",
    steps: [
      "Compra la propiedad en Portugal pagando todo de una vez",
      "Revisa tu fondo indexado (debería rondar 250.000-290.000€)",
    ],
  },
  m28: {
    when: "Meta final: mayo 2041",
    amount: "Patrimonio completo",
    result: "9 negocios + farmacia + 5 propiedades + ~607.000€ en indexados",
    steps: [
      "Revisa todo el patrimonio construido en 15 años",
      "Celebra que lo lograste 🎉",
    ],
  },
  own19: {
    when: "EMPIEZA: marzo 2030 · continúo según sobre dinero",
    amount: "Lo que quieras por encima de los 95K (respetando el tope 40-50%)",
    result: "Tu propio dinero al 19% generándote renta a TI",
    steps: [
      "Los primeros 95.000€ del 19% son de tu madre (su pensión, no se tocan)",
      "Todo lo que metas POR ENCIMA de 95.000€ es tuyo",
      "Antes de meter más, comprueba que el 19% total no pase del 50% de tu dinero invertido",
      "El retorno de TU parte (ej. 50K → ~792€/mes) es ingreso tuyo gastable",
    ],
  },
  div1: {
    when: "EMPIEZA: enero 2032 · Es PARA SIEMPRE",
    amount: "1.500€/mes automáticos",
    result: "Una cartera que te paga dividendos cada mes/trimestre sin vender nada",
    steps: [
      "Abre cuenta para comprar ETFs (MyInvestor, DEGIRO, IBKR)",
      "Elige un ETF de dividendos DE REPARTO ('distributing'), ej: Vanguard FTSE All-World High Dividend Yield",
      "Configura aportación de 1.500€/mes",
      "Los dividendos (~4%/año) te los pagan cada 3 meses a tu cuenta",
      "Para renta MENSUAL: combina con un ETF de dividendo mensual (covered-call) en pequeña parte",
      "En 2041 esta cartera (~221K) te pagará ~736€/mes sin tocar el capital",
    ],
  },
  d1: { when: "octubre 2026", amount: "Parte del préstamo", result: "Inversión a 50K", steps: ["Al entrar el préstamo, mete 15K al 19% (sube a 50K) y deja 1K de ahorro"] },
  d2: { when: "enero 2027", amount: "5.000€", result: "Inversión a 55K", steps: ["Mete 5.000€ al 19% cuando tengas el ahorro juntado"] },
  d3: { when: "mayo 2027", amount: "5.000€", result: "Inversión a 60K", steps: ["Mete 5.000€ al 19%"] },
  d4: { when: "julio 2027", amount: "5.000€", result: "Inversión a 65K", steps: ["Mete 5.000€ al 19%"] },
  m6: { when: "septiembre 2027", amount: "5.000€", result: "Inversión a ~70K, lista para rescatar", steps: ["Último depósito de 5.000€", "Confirma con el vendedor de la ferretería el precio y la fecha de traspaso"] },
};


const PHASE_NAMES = ["Preparación", "Lanzamiento", "Consolidación", "Expansión", "Farmacia"];
const PHASE_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#f97316", "#06b6d4"];
const AREA_COLORS = { Finanzas: "#10b981", HP: "#6366f1", Hipoteca: "#ef4444", Negocios: "#f59e0b", Personal: "#ec4899", Farmacia: "#06b6d4" };

const MONTHLY_SIM = [
  { m: "May 2026", inv: 25000, buf: 3629, total: 28629 },
  { m: "Jun 2026", inv: 25000, buf: 5766, total: 30766 },
  { m: "Jul 2026", inv: 30000, buf: 1469, total: 31469 },
  { m: "Ago 2026", inv: 30000, buf: 2258, total: 32258 },
  { m: "Sep 2026", inv: 30000, buf: 3407, total: 33407 },
  { m: "Oct 2026", inv: 50000, buf: 417, total: 50417 },
  { m: "Nov 2026", inv: 50000, buf: 1516, total: 51516 },
  { m: "Dic 2026", inv: 50000, buf: 2624, total: 52624 },
  { m: "Ene 2027", inv: 50000, buf: 4349, total: 54349 },
  { m: "Feb 2027", inv: 55000, buf: 662, total: 55662 },
  { m: "Mar 2027", inv: 55000, buf: 1983, total: 56983 },
  { m: "Abr 2027", inv: 55000, buf: 3315, total: 58315 },
  { m: "May 2027", inv: 55000, buf: 4656, total: 59656 },
  { m: "Jun 2027", inv: 60000, buf: 1586, total: 61586 },
  { m: "Jul 2027", inv: 60000, buf: 3541, total: 63541 },
  { m: "Ago 2027", inv: 65000, buf: 506, total: 65506 },
  { m: "Sep 2027", inv: 65000, buf: 2440, total: 67440 },
];

const INV19_PROJECTION = [
  { year: "2027", madre: 0, tuyo: 0, nota: "Rescatado para ferretería" },
  { year: "2029", madre: 95000, tuyo: 0, nota: "Fondo madre completo" },
  { year: "2030", madre: 95000, tuyo: 0, nota: "Tu dinero → al indexado aún" },
  { year: "2031", madre: 95000, tuyo: 0, nota: "Sigue al indexado" },
  { year: "2032", madre: 95000, tuyo: 20000, nota: "Empieza tu 19%: ~317€/mes" },
  { year: "2033", madre: 95000, tuyo: 30000, nota: "~475€/mes tuyos" },
  { year: "2034", madre: 95000, tuyo: 50000, nota: "~792€/mes tuyos" },
  { year: "2035", madre: 95000, tuyo: 60000, nota: "~950€/mes tuyos" },
  { year: "2036", madre: 95000, tuyo: 70000, nota: "~1.108€/mes tuyos" },
  { year: "2037+", madre: 95000, tuyo: 80000, nota: "Tope sensato: ~1.267€/mes tuyos" },
];


const MADRE_FUND = [
  { year: 2028, capital: 20000, ret: 317, toMadre: 0, status: "Reconstruyendo (rescate oct 2027 → ferretería)" },
  { year: 2029, capital: 95000, ret: 1504, toMadre: 1504, status: "✅ 95K alcanzado ago 2029" },
  { year: 2030, capital: 95000, ret: 1504, toMadre: 1504, status: "✅ Cubierto" },
  { year: 2031, capital: 95000, ret: 1504, toMadre: 1504, status: "✅ Cubierto" },
  { year: 2032, capital: 95000, ret: 1504, toMadre: 1504, status: "✅ Cubierto" },
  { year: 2033, capital: 95000, ret: 1504, toMadre: 1504, status: "✅ Cubierto" },
  { year: 2034, capital: 95000, ret: 1504, toMadre: 1504, status: "✅ Cubierto" },
];


const MADRE_TARGET = 95000;

const POST_HP = [
  { year: 2028, hp: 3100, negocios: 5500, otros: 1850, pasivo: 0, nota: "Aún en HP parte del año. 19% creciendo (no se cobra)" },
  { year: 2029, hp: 0, negocios: 8700, otros: 1850, pasivo: 0, nota: "19% llega a 95K → 1.504€/mes para tu madre" },
  { year: 2030, hp: 0, negocios: 11000, otros: 1850, pasivo: 317, nota: "Empiezas tu propio 19% (~20K → 317€/mes tuyos)" },
  { year: 2031, hp: 0, negocios: 13500, otros: 1850, pasivo: 475, nota: "Tu 19% propio ~30K. Indexado ~39K" },
  { year: 2032, hp: 0, negocios: 17000, otros: 1850, pasivo: 694, nota: "Abres cartera dividendos. Tu 19% ~40K + div 61€" },
  { year: 2033, hp: 0, negocios: 22000, otros: 1850, pasivo: 837, nota: "Tu 19% ~45K (792€) + dividendos 125€" },
  { year: 2034, hp: 0, negocios: 28500, otros: 1850, pasivo: 983, nota: "Tu 19% ~50K (792€) + dividendos 191€" },
  { year: 2035, hp: 0, negocios: 32000, otros: 1850, pasivo: 1210, nota: "Farmacia abre. Tu 19% (950€) + dividendos 260€" },
  { year: 2036, hp: 0, negocios: 38000, otros: 1850, pasivo: 1281, nota: "Deuda CERO. Dividendos 331€/mes" },
  { year: 2037, hp: 0, negocios: 42000, otros: 1850, pasivo: 1356, nota: "Dividendos 406€/mes" },
  { year: 2038, hp: 0, negocios: 46000, otros: 1850, pasivo: 1434, nota: "Dividendos 484€/mes" },
  { year: 2039, hp: 0, negocios: 50000, otros: 1850, pasivo: 1515, nota: "Dividendos 565€/mes" },
  { year: 2040, hp: 0, negocios: 54000, otros: 1850, pasivo: 1599, nota: "Dividendos 649€/mes" },
  { year: 2041, hp: 0, negocios: 58000, otros: 1850, pasivo: 1686, nota: "Dividendos 736€/mes. Indexado ~607K" },
];

function daysBetween(a, b) {
  return Math.ceil((new Date(b) - new Date(a)) / 86400000);
}

function formatEur(n) {
  return n.toLocaleString("es-ES", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";
}

function ProgressBar({ value, max, color, height = 8 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ width: "100%", background: "#1a1a2e", borderRadius: height / 2, height, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: height / 2, transition: "width 0.6s ease" }} />
    </div>
  );
}

function MiniChart({ data, dataKey, color, height = 60 }) {
  const max = Math.max(...data.map(d => d[dataKey]));
  const w = 100 / data.length;
  return (
    <svg viewBox={`0 0 100 ${height}`} style={{ width: "100%", height }}>
      <polyline
        fill="none" stroke={color} strokeWidth="1.5"
        points={data.map((d, i) => `${i * w + w / 2},${height - (d[dataKey] / max) * (height - 10) - 5}`).join(" ")}
      />
      {data.map((d, i) => (
        <circle key={i} cx={i * w + w / 2} cy={height - (d[dataKey] / max) * (height - 10) - 5} r="2" fill={color} />
      ))}
    </svg>
  );
}

export default function PlanMaestroApp() {
  const [completed, setCompleted] = useState({});
  const [notes, setNotes] = useState({});
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  
  // Upstash Redis sync
  const UPSTASH_URL = typeof import.meta !== "undefined" ? import.meta.env?.VITE_UPSTASH_URL : "";
  const UPSTASH_TOKEN = typeof import.meta !== "undefined" ? import.meta.env?.VITE_UPSTASH_TOKEN : "";
  const hasUpstash = !!(UPSTASH_URL && UPSTASH_TOKEN);
  
  const upstashGet = async (key) => {
    if (!hasUpstash) return null;
    try {
      const res = await fetch(UPSTASH_URL + "/get/" + key, { headers: { Authorization: "Bearer " + UPSTASH_TOKEN } });
      const data = await res.json();
      return data.result ? JSON.parse(data.result) : null;
    } catch { return null; }
  };
  
  const upstashSet = async (key, value) => {
    if (!hasUpstash) return;
    try {
      await fetch(UPSTASH_URL + "/set/" + key, {
        method: "POST", headers: { Authorization: "Bearer " + UPSTASH_TOKEN, "Content-Type": "application/json" },
        body: JSON.stringify([key, JSON.stringify(value)])
      });
    } catch {}
  };
  
  // PWA: detect standalone mode
  const isStandalone = typeof window !== "undefined" && (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true);
  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  
  const handleInstall = async () => {
    if (installPrompt) {
      // Android / Desktop Chrome — native install
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") setInstallPrompt(null);
    } else {
      // iOS or no native prompt — show instructions
      setShowInstallModal(true);
    }
  };
  
  // Request notification permission and schedule local notifications for upcoming milestones
  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      alert("Tu navegador no soporta notificaciones. Usa la exportación de calendario (.ics) para recordatorios fiables en iOS.");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      new Notification("Plan Maestro", { body: "✅ Notificaciones activadas. Te avisaremos de los hitos próximos.", icon: "/icon-192.png" });
      scheduleNotifications();
      localStorage.setItem("plan-notif-enabled", "true");
    } else {
      alert("Permiso denegado. Para recordatorios fiables en iPhone, usa la exportación de calendario (.ics) en la pestaña Calendario.");
    }
  };
  
  const scheduleNotifications = () => {
    // Schedule notifications for milestones in the next 30 days (best-effort, works while app is open)
    const today = new Date();
    MILESTONES.forEach(m => {
      if (completed[m.id]) return;
      const md = new Date(m.date);
      const days = Math.ceil((md - today) / 86400000);
      if (days >= 0 && days <= 30) {
        const ms = md - today;
        if (ms > 0 && ms < 2147483647) {
          setTimeout(() => {
            if (Notification.permission === "granted") {
              new Notification("🎯 Hito Plan Maestro", { body: m.label, icon: "/icon-192.png" });
            }
          }, ms);
        }
      }
    });
  };
  const [trips, setTrips] = useState([]);
  const [travelSaved, setTravelSaved] = useState(1000);
  const [customExpenses, setCustomExpenses] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState({});
  const [editingIncome, setEditingIncome] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expandedMilestone, setExpandedMilestone] = useState(null);
  const [subtaskDone, setSubtaskDone] = useState({});
  const [editValue, setEditValue] = useState("");
  const [extras, setExtras] = useState([]);
  const [newTrip, setNewTrip] = useState({ name: "", cost: "", month: new Date().toISOString().slice(0,7) });
  const [newExtra, setNewExtra] = useState({ name: "", cost: "", month: new Date().toISOString().slice(0,7) });
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [showAddExtra, setShowAddExtra] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [calUrl, setCalUrl] = useState("");
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    // Load all data from localStorage
    try { const c = localStorage.getItem("plan-completed"); if (c) setCompleted(JSON.parse(c)); } catch {}
    try { const n = localStorage.getItem("plan-notes"); if (n) setNotes(JSON.parse(n)); } catch {}
    try { const t = localStorage.getItem("plan-trips"); if (t) setTrips(JSON.parse(t)); } catch {}
    try { const e = localStorage.getItem("plan-extras"); if (e) setExtras(JSON.parse(e)); } catch {}
    try { const ce = localStorage.getItem("plan-custom-expenses"); if (ce) setCustomExpenses(JSON.parse(ce)); } catch {}
    try { const st = localStorage.getItem("plan-subtasks"); if (st) setSubtaskDone(JSON.parse(st)); } catch {}
    try { const mi = localStorage.getItem("plan-monthly-income"); if (mi) setMonthlyIncome(JSON.parse(mi)); } catch {}
    try { const inc = localStorage.getItem("plan-income"); if (inc) setIncome(JSON.parse(inc)); } catch {}
    try { const mr = localStorage.getItem("plan-monthly-record"); if (mr) setMonthlyRecord(JSON.parse(mr)); } catch {}
    try { const ts = localStorage.getItem("plan-travel-saved"); if (ts) setTravelSaved(JSON.parse(ts)); } catch {}
    // Try Upstash cloud sync
    if (hasUpstash) {
      Promise.all([
        upstashGet("plan-completed"),
        upstashGet("plan-trips"),
        upstashGet("plan-extras"),
        upstashGet("plan-notes"),
        upstashGet("plan-income"),
        upstashGet("plan-monthly-record"),
      ]).then(([c, t, e, n, inc, mr]) => {
        if (inc) { setIncome(inc); localStorage.setItem("plan-income", JSON.stringify(inc)); }
        if (mr) { setMonthlyRecord(mr); localStorage.setItem("plan-monthly-record", JSON.stringify(mr)); }
        if (c) { setCompleted(c); localStorage.setItem("plan-completed", JSON.stringify(c)); }
        if (t) { setTrips(t); localStorage.setItem("plan-trips", JSON.stringify(t)); }
        if (e) { setExtras(e); localStorage.setItem("plan-extras", JSON.stringify(e)); }
        if (n) { setNotes(n); localStorage.setItem("plan-notes", JSON.stringify(n)); }
        if (mi) { setMonthlyIncome(mi); localStorage.setItem("plan-monthly-income", JSON.stringify(mi)); }
        setLastSync(new Date().toLocaleTimeString());
      }).catch(() => {});
    }
    setLoading(false);
  }, []);

  const saveCompleted = useCallback((next) => {
    setCompleted(next);
    try { localStorage.setItem("plan-completed", JSON.stringify(next)); } catch {}
    upstashSet("plan-completed", next);
  }, []);

  const saveNote = useCallback((id, text) => {
    const next = { ...notes, [id]: text };
    setNotes(next);
    try { localStorage.setItem("plan-notes", JSON.stringify(next)); } catch {}
    upstashSet("plan-notes", next);
  }, [notes]);

  const toggleSubtask = (key) => {
    const next = { ...subtaskDone, [key]: !subtaskDone[key] };
    setSubtaskDone(next);
    localStorage.setItem("plan-subtasks", JSON.stringify(next));
    if (hasUpstash) upstashSet("plan-subtasks", next);
  };
  const toggleComplete = (id) => {
    const next = { ...completed, [id]: !completed[id] };
    saveCompleted(next);
  };

  const today = new Date().toISOString().split("T")[0];
  const totalMilestones = MILESTONES.length;
  const completedCount = Object.values(completed).filter(Boolean).length;
  const overallPct = (completedCount / totalMilestones) * 100;

  const nextMilestone = MILESTONES.find(m => !completed[m.id] && m.date >= today) || MILESTONES.find(m => !completed[m.id]);
  const daysToNext = nextMilestone ? daysBetween(today, nextMilestone.date) : 0;

  const currentPhase = nextMilestone ? nextMilestone.phase : 4;

  // Current month sim
  const now = new Date();
  const monthLabel = now.toLocaleDateString("es-ES", { month: "short", year: "numeric" });
  const currentSim = MONTHLY_SIM.find(s => {
    const parts = s.m.split(" ");
    const mMap = { Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5, Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11 };
    return mMap[parts[0]] === now.getMonth() && parseInt(parts[1]) === now.getFullYear();
  }) || MONTHLY_SIM[0];

  // Generate .ics for next milestone
  const generateICS = (m) => {
    const d = m.date.replace(/-/g, "");
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${d}T090000
DTEND:${d}T100000
SUMMARY:${m.critical ? "★ " : ""}${m.label}
DESCRIPTION:Plan Maestro - Area: ${m.area}${m.critical ? " - HITO CRITICO" : ""}
BEGIN:VALARM
TRIGGER:-P7D
ACTION:DISPLAY
DESCRIPTION:Recordatorio: ${m.label} en 7 dias
END:VALARM
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:MAÑANA: ${m.label}
END:VALARM
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar" });
    return URL.createObjectURL(blob);
  };

  const exportAllCal = () => {
    const events = MILESTONES.map(m => {
      const d = m.date.replace(/-/g, "");
      return `BEGIN:VEVENT
DTSTART:${d}T090000
DTEND:${d}T100000
SUMMARY:${m.critical ? "★ " : ""}${m.label}
DESCRIPTION:Plan Maestro - Area: ${m.area}
BEGIN:VALARM
TRIGGER:-P7D
ACTION:DISPLAY
DESCRIPTION:Recordatorio: ${m.label} en 7 dias
END:VALARM
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:MAÑANA: ${m.label}
END:VALARM
END:VEVENT`;
    }).join("\n");
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//PlanMaestro//ES\n${events}\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "plan_maestro_hitos.ics"; a.click();
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0a0a1a", color: "#e0e0e0", fontFamily: "'JetBrains Mono', monospace" }}>Cargando plan...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#e0e0e0", fontFamily: "'Outfit', sans-serif", padding: 0 }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a3e 0%, #0a0a1a 100%)", borderBottom: "1px solid #2a2a4a", padding: "16px 20px", paddingTop: "calc(16px + env(safe-area-inset-top, 0px))" }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
          <span style={{ color: "#6366f1" }}>PLAN</span> <span style={{ color: "#f59e0b" }}>MAESTRO</span> <span style={{ fontSize: 13, color: "#666", fontWeight: 400 }}>v13.0</span>
        </div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Holding Baix Llobregat · 15 años · {completedCount}/58 hitos{hasUpstash && lastSync ? ` · ☁️` : ""}</div>
        {!isStandalone && (
          <button onClick={handleInstall} style={{ marginTop: 10, padding: "8px 14px", borderRadius: 8, border: "1px solid #00B4D8", background: "#00B4D822", color: "#00B4D8", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            📱 Instalar app en {isIOS ? "iPhone" : "este dispositivo"}
          </button>
        )}
        {isStandalone && (
          <div style={{ marginTop: 8, fontSize: 11, color: "#10b981" }}>✅ App instalada</div>
        )}
      </div>

      {/* Install Modal */}
      {showInstallModal && (
        <div onClick={() => setShowInstallModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#12122a", borderRadius: 16, padding: 24, maxWidth: 360, border: "1px solid #00B4D844" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#00B4D8", marginBottom: 16 }}>📱 Instalar en iPhone</div>
            {isIOS ? (
              <div style={{ fontSize: 14, color: "#ddd", lineHeight: 1.8 }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                  <span style={{ background: "#00B4D8", color: "#000", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0, fontSize: 13 }}>1</span>
                  <span>Toca el botón <strong style={{ color: "#fff" }}>Compartir</strong> abajo en Safari (el cuadrado con flecha ↑)</span>
                </div>
                <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                  <span style={{ background: "#00B4D8", color: "#000", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0, fontSize: 13 }}>2</span>
                  <span>Desliza y toca <strong style={{ color: "#fff" }}>"Añadir a pantalla de inicio"</strong></span>
                </div>
                <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                  <span style={{ background: "#00B4D8", color: "#000", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0, fontSize: 13 }}>3</span>
                  <span>Toca <strong style={{ color: "#fff" }}>"Añadir"</strong>. ¡Listo! El icono aparece en tu pantalla</span>
                </div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 12, padding: 10, background: "#0a0a1a", borderRadius: 8 }}>
                  💡 Debe ser en <strong>Safari</strong>, no en Chrome. La app abrirá a pantalla completa sin barra del navegador.
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 14, color: "#ddd", lineHeight: 1.8 }}>
                Abre el menú del navegador (⋮) y selecciona <strong style={{ color: "#fff" }}>"Instalar app"</strong> o <strong style={{ color: "#fff" }}>"Añadir a pantalla de inicio"</strong>.
              </div>
            )}
            <button onClick={() => setShowInstallModal(false)} style={{ width: "100%", marginTop: 18, padding: "10px", borderRadius: 8, border: "none", background: "#00B4D8", color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Entendido</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a1a3e", background: "#0d0d20", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", position: "sticky", top: 0, zIndex: 50 }}>
        {[
          { id: "dashboard", icon: "📊", label: "Inicio" },
          { id: "hitos", icon: "🎯", label: "Hitos" },
          { id: "finanzas", icon: "💰", label: "Finanzas" },
          { id: "post-hp", icon: "🚀", label: "Post-HP" },
          { id: "madre", icon: "👩", label: "Madre" },
          { id: "budget", icon: "💳", label: "Budget" },
          { id: "cuentas", icon: "🏦", label: "Cuentas" },
          { id: "calendario", icon: "📅", label: "Calend." },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "10px 16px", background: "transparent", border: "none",
            color: tab === t.id ? "#6366f1" : "#777", cursor: "pointer",
            borderBottom: tab === t.id ? "2px solid #6366f1" : "2px solid transparent",
            fontFamily: "Outfit", flexShrink: 0, whiteSpace: "nowrap", minWidth: 64
          }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 11, fontWeight: tab === t.id ? 700 : 500 }}>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 20px", maxWidth: 800, margin: "0 auto" }}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (<>
          {/* Overall progress */}
          <div style={{ background: "#12122a", borderRadius: 12, padding: 20, marginBottom: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#888" }}>PROGRESO GENERAL</span>
              <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "JetBrains Mono", color: "#6366f1" }}>{overallPct.toFixed(0)}%</span>
            </div>
            <ProgressBar value={completedCount} max={totalMilestones} color="linear-gradient(90deg, #6366f1, #f59e0b)" height={10} />
            <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>{completedCount} de {totalMilestones} hitos completados</div>
          </div>

          {/* Phase */}
          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>FASE ACTUAL</div>
            <div style={{ display: "flex", gap: 6 }}>
              {PHASE_NAMES.map((name, i) => (
                <div key={i} style={{
                  flex: 1, padding: "8px 4px", borderRadius: 6, textAlign: "center", fontSize: 10, fontWeight: i === currentPhase ? 700 : 400,
                  background: i === currentPhase ? PHASE_COLORS[i] + "22" : "#1a1a2e",
                  color: i === currentPhase ? PHASE_COLORS[i] : "#555",
                  border: i === currentPhase ? `1px solid ${PHASE_COLORS[i]}44` : "1px solid transparent"
                }}>
                  {i}. {name}
                </div>
              ))}
            </div>
          </div>

          {/* Next milestone */}
          {nextMilestone && (
            <div style={{ background: nextMilestone.critical ? "#1a0a0a" : "#12122a", borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${nextMilestone.critical ? "#ef444444" : "#2a2a4a"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: nextMilestone.critical ? "#ef4444" : "#888" }}>
                  {nextMilestone.critical ? "★ PRÓXIMO HITO CRÍTICO" : "PRÓXIMO HITO"}
                </span>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 4,
                  background: AREA_COLORS[nextMilestone.area] + "22", color: AREA_COLORS[nextMilestone.area]
                }}>{nextMilestone.area}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6, lineHeight: 1.4 }}>{nextMilestone.label}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
                📅 {new Date(nextMilestone.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                {daysToNext > 0 && <span style={{ color: daysToNext < 30 ? "#f59e0b" : "#666" }}> · {daysToNext} días</span>}
                {daysToNext < 0 && <span style={{ color: "#ef4444" }}> · ⚠️ {Math.abs(daysToNext)} días de retraso</span>}
              </div>
            </div>
          )}

          {/* Financial snapshot */}
          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>SIMULACIÓN FINANCIERA ACTUAL</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: "#666" }}>INVERTIDO</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "JetBrains Mono", color: "#10b981" }}>{formatEur(currentSim.inv)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#666" }}>BUFFER</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "JetBrains Mono", color: "#f59e0b" }}>{formatEur(currentSim.buf)}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#666" }}>TOTAL</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "JetBrains Mono", color: "#6366f1" }}>{formatEur(currentSim.total)}</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <MiniChart data={MONTHLY_SIM} dataKey="total" color="#6366f1" />
            </div>
          </div>

          {/* Rules */}
          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>LAS 6 REGLAS DE ORO</div>
            {[
              "No abrir siguiente negocio sin que el anterior sea rentable",
              "Hipoteca madre va primero, siempre",
              "No dejar HP hasta octubre 2028 y negocios > 4.500€/mes netos",
              "Inversión 19%: depósitos 5K, NUNCA tocar para deuda. Meta >500K en 2041",
              "Propiedades internacionales solo AL CONTADO y post-2038",
              "Diversificar: fondo emergencia 6 meses SIEMPRE intacto + nunca más del 40-50% en el 19%. Resto en indexados"
            ].map((r, i) => (
              <div key={i} style={{ fontSize: 13, padding: "6px 0", color: "#bbb", borderBottom: i < 5 ? "1px solid #1a1a2e" : "none" }}>
                <span style={{ color: "#f59e0b", fontWeight: 700 }}>{i + 1}.</span> {r}
              </div>
            ))}
          </div>
        </>)}

        {/* HITOS */}
        {tab === "hitos" && (<>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Marca los hitos completados. Se guardan automáticamente.</div>
          {MILESTONES.map((m, i) => {
            const done = completed[m.id];
            const isPast = m.date < today && !done;
            const isSoon = !done && daysBetween(today, m.date) >= 0 && daysBetween(today, m.date) <= 30;
            return (
              <div key={m.id} style={{
                background: done ? "#0a1a0a" : isPast ? "#1a0a0a" : "#12122a",
                borderRadius: 10, padding: "12px 14px", marginBottom: 8,
                border: `1px solid ${done ? "#10b98133" : isPast ? "#ef444433" : isSoon ? "#f59e0b33" : "#2a2a4a"}`,
                opacity: done ? 0.7 : 1
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <button onClick={() => toggleComplete(m.id)} style={{
                    width: 22, height: 22, borderRadius: 6, border: `2px solid ${done ? "#10b981" : "#444"}`,
                    background: done ? "#10b981" : "transparent", cursor: "pointer", flexShrink: 0, marginTop: 1,
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12
                  }}>
                    {done && "✓"}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, textDecoration: done ? "line-through" : "none", color: done ? "#666" : "#e0e0e0" }}>
                        {m.critical && <span style={{ color: "#ef4444" }}>★ </span>}{m.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#666", marginTop: 3, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span>📅 {new Date(m.date).toLocaleDateString("es-ES", { month: "short", year: "numeric" })}</span>
                      <span style={{ color: AREA_COLORS[m.area] }}>{m.area}</span>
                      <span>Fase {m.phase}</span>
                      {isPast && <span style={{ color: "#ef4444" }}>⚠️ Vencido</span>}
                      {isSoon && <span style={{ color: "#f59e0b" }}>⏰ Próximo</span>}
                    </div>
                    {notes[m.id] && <div style={{ fontSize: 11, color: "#888", marginTop: 4, fontStyle: "italic" }}>📝 {notes[m.id]}</div>}
                    <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
                      <button onClick={() => { setEditNote(m.id); setNoteText(notes[m.id] || ""); }} style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 4, border: "1px solid #333", background: "#1a1a2e", color: "#888", cursor: "pointer"
                      }}>📝 Nota</button>
                      <a href={generateICS(m)} download={`hito_${m.id}.ics`} style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 4, border: "1px solid #333", background: "#1a1a2e", color: "#888", textDecoration: "none"
                      }}>📅 Calendario</a>
                      {MILESTONE_TASKS[m.id] && (
                        <button onClick={() => setExpandedMilestone(expandedMilestone === m.id ? null : m.id)} style={{
                          fontSize: 10, padding: "2px 8px", borderRadius: 4, border: "1px solid #6366f155", background: "#6366f111", color: "#8b8bf5", cursor: "pointer"
                        }}>{expandedMilestone === m.id ? "▲ Pasos" : "▼ Pasos"} ({MILESTONE_TASKS[m.id].steps.filter((_,ti) => subtaskDone[m.id+"-"+ti]).length}/{MILESTONE_TASKS[m.id].steps.length})</button>
                      )}
                    </div>
                    {expandedMilestone === m.id && MILESTONE_TASKS[m.id] && (
                      <div style={{ marginTop: 10, padding: "12px 14px", background: "#0a0a1a", borderRadius: 8, border: "1px solid #6366f122" }}>
                        {/* Info header: cuándo, cuánto, resultado */}
                        <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #1a1a2e" }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                            <span style={{ fontSize: 13 }}>📅</span>
                            <div><span style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>Cuándo</span><div style={{ fontSize: 12, color: "#e0e0e0", fontWeight: 600 }}>{MILESTONE_TASKS[m.id].when}</div></div>
                          </div>
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                            <span style={{ fontSize: 13 }}>💰</span>
                            <div><span style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>Cuánto</span><div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600 }}>{MILESTONE_TASKS[m.id].amount}</div></div>
                          </div>
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <span style={{ fontSize: 13 }}>🎯</span>
                            <div><span style={{ fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>Resultado</span><div style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>{MILESTONE_TASKS[m.id].result}</div></div>
                          </div>
                        </div>
                        <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Pasos a seguir</div>
                        {MILESTONE_TASKS[m.id].steps.map((task, ti) => {
                          const sk = m.id + "-" + ti;
                          const sdone = subtaskDone[sk];
                          return (
                            <div key={ti} onClick={() => toggleSubtask(sk)} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", cursor: "pointer" }}>
                              <span style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${sdone ? "#10b981" : "#555"}`, background: sdone ? "#10b981" : "transparent", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff" }}>{sdone && "✓"}</span>
                              <span style={{ fontSize: 12, color: sdone ? "#666" : "#ccc", textDecoration: sdone ? "line-through" : "none", lineHeight: 1.4 }}>{task}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                {editNote === m.id && (
                  <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                    <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Añadir nota..."
                      style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: "1px solid #333", background: "#0a0a1a", color: "#e0e0e0", fontSize: 12, fontFamily: "Outfit" }} />
                    <button onClick={() => { saveNote(m.id, noteText); setEditNote(null); }} style={{
                      padding: "6px 12px", borderRadius: 6, background: "#6366f1", color: "#fff", border: "none", fontSize: 12, cursor: "pointer"
                    }}>OK</button>
                  </div>
                )}
              </div>
            );
          })}
        </>)}

        {/* FINANZAS */}
        {tab === "finanzas" && (<>
          {/* DIVERSIFICACIÓN — 3 capas de seguridad */}
          <div style={{ background: "linear-gradient(135deg,#1a1a3a,#12122a)", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #00B4D844" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#00B4D8", marginBottom: 4 }}>🛡️ DIVERSIFICACIÓN — 3 capas de seguridad</div>
            <div style={{ fontSize: 10, color: "#f59e0b", marginBottom: 12, padding: 8, background: "#1a1400", borderRadius: 6 }}>⚠️ El 19% anual es altísimo (la bolsa da 7-9%). No tener todo ahí es vital. Si el 19% fallara, estas capas evitan que el plan se derrumbe.</div>
            {[
              { c: "#10b981", icon: "🟢", t: "Fondo emergencia", d: "21K (6 meses gastos). Líquido en Revolut/monetario. NUNCA se invierte. Desde 2028 (mini 10K) → 2029 completo." },
              { c: "#00B4D8", icon: "🔵", t: "Fondos indexados", d: "MSCI World vía Indexa/MyInvestor. Aportación creciente 1.200→4.000€/mes. ~7-9%/año. En 2041: ~607K (red segura independiente)." },
              { c: "#a855f7", icon: "🟣", t: "ETF dividendos (renta mensual)", d: "Desde 2032, 1.500€/mes. Paga ~4%/año de dividendos. En 2041: ~221K → ~736€/mes SIN vender. Ingreso pasivo real." },
              { c: "#f59e0b", icon: "🟡", t: "Inversión 19% (capada)", d: "95K de tu madre (su pensión) + TU parte por encima. Máx 40-50% del total. Tu parte te renta ~792€/mes." },
              { c: "#ec4899", icon: "🟠", t: "Inmuebles + negocios", d: "5 propiedades + 9 negocios + farmacia. Diversificación real, ingresos activos y pasivos." },
            ].map((x,i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i<3?"1px solid #1a1a2e":"none" }}>
                <span style={{ fontSize: 16 }}>{x.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: x.c }}>{x.t}</div>
                  <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{x.d}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Proyección indexado */}
          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #00B4D833" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>📈 Fondo indexado — proyección (aportación creciente, 8%)</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "JetBrains Mono" }}>
                <thead><tr>{["Año","Aportado","Valor"].map(h => <th key={h} style={{ textAlign: h==="Año"?"left":"right", padding: "4px 8px", color: "#666", fontWeight: 600 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {[["2030","18.000€","18.865€"],["2032","60.000€","67.251€"],["2035","144.000€","179.462€"],["2038","258.000€","355.791€"],["2041","396.000€","606.781€"]].map((r,i) => (
                    <tr key={i} style={{ borderTop: "1px solid #1a1a2e" }}>
                      <td style={{ padding: "5px 8px", color: "#bbb" }}>{r[0]}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", color: "#888" }}>{r[1]}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", color: "#00B4D8", fontWeight: 700 }}>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 10, color: "#888", marginTop: 8 }}>Aportación creciente: 1.200€/mes (2029-30) → 1.500 (2031) → 2.000-2.500 (2032-35) → 3.000-4.000 (2036+). En 2041: ~607K. (Coincide con la tabla de equilibrio de abajo.)</div>
          </div>

          {/* Equilibrio 19% vs indexados año por año */}
          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #f59e0b33" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>⚖️ Equilibrio 19% vs indexados (año por año)</div>
            <div style={{ fontSize: 10, color: "#888", marginBottom: 10, padding: 8, background: "#0a0a1a", borderRadius: 6 }}>
              El 19% se queda fijo en 95K (fondo de tu madre, su retorno va para ella). Los indexados crecen hasta superarlo. Cuando el % del 19% baje del 50% (~2033), el riesgo está equilibrado. El fondo emergencia (21K) va aparte.
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "JetBrains Mono" }}>
                <thead><tr>{["Año","19% madre","Indexados","% en 19%"].map(h => <th key={h} style={{ textAlign: h==="Año"?"left":"right", padding: "4px 6px", color: "#666", fontWeight: 600 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ["2029","95.000€","3.600€","96%","#ef4444"],
                    ["2031","95.000€","39.100€","71%","#ef4444"],
                    ["2033","95.000€","97.700€","49%","#10b981"],
                    ["2035","95.000€","179.500€","35%","#10b981"],
                    ["2038","95.000€","355.800€","21%","#10b981"],
                    ["2041","95.000€","606.800€","14%","#10b981"],
                  ].map((r,i) => (
                    <tr key={i} style={{ borderTop: "1px solid #1a1a2e" }}>
                      <td style={{ padding: "5px 6px", color: "#bbb" }}>{r[0]}</td>
                      <td style={{ padding: "5px 6px", textAlign: "right", color: "#f59e0b" }}>{r[1]}</td>
                      <td style={{ padding: "5px 6px", textAlign: "right", color: "#00B4D8" }}>{r[2]}</td>
                      <td style={{ padding: "5px 6px", textAlign: "right", color: r[4], fontWeight: 700 }}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 10, color: "#999", marginTop: 10, lineHeight: 1.5 }}>
              <strong style={{ color: "#f59e0b" }}>Qué hacer:</strong> 2029-2031 mete 1.200-1.500€/mes a indexados (el 19% ya tiene sus 95K, no le metas más). 2032-2035 sube a 2.000-2.500€/mes. 2036+ a 3.000-4.000€/mes. El % alto al principio es normal.
            </div>
          </div>

          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Simulación mes a mes (May 2026 — Sep 2027) · reparaciones 19K</div>
            <div style={{ fontSize: 10, color: "#888", marginBottom: 10, padding: 8, background: "#0a1a0a", borderRadius: 6 }}>💡 Cascada de alivios de caja: fin arreglos casa (jun 2027, +1.100€/mes) → fin préstamo madre (jun 2028, +392€/mes) → ferretería propia (oct 2028). Cada uno acelera la reconstrucción del 19%.</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "JetBrains Mono" }}>
                <thead>
                  <tr>{["Mes", "Invertido", "Buffer", "Total"].map(h => (
                    <th key={h} style={{ padding: "6px 8px", textAlign: "right", color: "#888", borderBottom: "1px solid #2a2a4a", fontWeight: 600 }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {MONTHLY_SIM.map((s, i) => (
                    <tr key={i} style={{ background: i % 2 ? "transparent" : "#0a0a1a" }}>
                      <td style={{ padding: "5px 8px", textAlign: "left", color: "#bbb" }}>{s.m}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", color: "#10b981" }}>{formatEur(s.inv)}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", color: "#f59e0b" }}>{formatEur(s.buf)}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", color: "#6366f1", fontWeight: 600 }}>{formatEur(s.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Inversión 19% — Las 2 bolsas (madre + tú)</div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 12 }}>Los 95K de tu madre son su pensión (no se tocan). Tu parte propia empieza en 2032 y tiene un tope sensato de ~80K para no exponerte demasiado al riesgo del 19%.</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, fontFamily: "JetBrains Mono" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "5px 4px", textAlign: "left", color: "#888", borderBottom: "1px solid #2a2a4a" }}>Año</th>
                    <th style={{ padding: "5px 4px", textAlign: "right", color: "#ec4899", borderBottom: "1px solid #2a2a4a" }}>👩 Madre</th>
                    <th style={{ padding: "5px 4px", textAlign: "right", color: "#10b981", borderBottom: "1px solid #2a2a4a" }}>🧑 Tuyo</th>
                    <th style={{ padding: "5px 4px", textAlign: "right", color: "#f59e0b", borderBottom: "1px solid #2a2a4a" }}>Tu renta/mes</th>
                  </tr>
                </thead>
                <tbody>
                  {INV19_PROJECTION.map((s, i) => (
                    <tr key={i} style={{ background: i % 2 ? "transparent" : "#0a0a1a" }}>
                      <td style={{ padding: "5px 4px", textAlign: "left", color: "#bbb" }}>{s.year}</td>
                      <td style={{ padding: "5px 4px", textAlign: "right", color: "#ec4899" }}>{s.madre>0?formatEur(s.madre):"—"}</td>
                      <td style={{ padding: "5px 4px", textAlign: "right", color: "#10b981", fontWeight: 600 }}>{s.tuyo>0?formatEur(s.tuyo):"—"}</td>
                      <td style={{ padding: "5px 4px", textAlign: "right", color: "#f59e0b" }}>{s.tuyo>0?formatEur(Math.round(s.tuyo*0.19/12)):"—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 11, marginTop: 12, padding: 10, background: "#0a0a1a", borderRadius: 6, lineHeight: 1.6 }}>
              <div style={{ color: "#ec4899", fontWeight: 700, marginBottom: 4 }}>👩 95.000€ de tu madre</div>
              <div style={{ color: "#999", marginBottom: 8 }}>Su pensión. Genera 1.504€/mes que son para ella. No los tocas nunca.</div>
              <div style={{ color: "#10b981", fontWeight: 700, marginBottom: 4 }}>🧑 Tu parte (0 → tope ~80K)</div>
              <div style={{ color: "#999" }}>2030-31: nada (mete al indexado). 2032: empieza con 20-30K. 2034-35: 50-60K. 2036+: tope ~80K. Más que eso te expone demasiado al 19%.</div>
            </div>
          </div>

          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Préstamos</div>
            <div style={{ fontSize: 12, color: "#bbb", marginBottom: 4 }}>
              <span style={{ color: "#ef4444" }}>●</span> Revolut: 402 €/mes → <span style={{ fontFamily: "JetBrains Mono" }}>FIN ABR 2034</span>
            </div>
            <div style={{ fontSize: 12, color: "#bbb" }}>
              <span style={{ color: "#f59e0b" }}>●</span> Cofidis: 285 €/mes → <span style={{ fontFamily: "JetBrains Mono" }}>FIN ABR 2036</span>
            </div>
            <ProgressBar value={daysBetween("2026-04-01", today)} max={daysBetween("2026-04-01", "2034-04-01")} color="#ef4444" height={6} />
            <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>Revolut: {Math.round(daysBetween("2026-04-01", today) / daysBetween("2026-04-01", "2034-04-01") * 100)}% pagada</div>
            <ProgressBar value={daysBetween("2026-04-01", today)} max={daysBetween("2026-04-01", "2036-04-01")} color="#f59e0b" height={6} />
            <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>Cofidis: {Math.round(daysBetween("2026-04-01", today) / daysBetween("2026-04-01", "2036-04-01") * 100)}% pagada</div>
          </div>
        </>)}

        {/* POST-HP */}
        {tab === "post-hp" && (<>
          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Ingreso mensual año a año (sin alquileres)</div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 12 }}>💼 Negocios + 💵 Lavandería + 📈 Pasivo (dividendos + tu 19% propio). El indexado y los 95K de tu madre NO se cuentan aquí (crecen aparte).</div>
            <div style={{ overflowX: "auto", marginTop: 6 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10, fontFamily: "JetBrains Mono" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "5px 4px", textAlign: "left", color: "#888", borderBottom: "1px solid #2a2a4a" }}>Año</th>
                    <th style={{ padding: "5px 4px", textAlign: "right", color: "#f59e0b", borderBottom: "1px solid #2a2a4a" }}>💼Neg</th>
                    <th style={{ padding: "5px 4px", textAlign: "right", color: "#888", borderBottom: "1px solid #2a2a4a" }}>💵Otros</th>
                    <th style={{ padding: "5px 4px", textAlign: "right", color: "#00B4D8", borderBottom: "1px solid #2a2a4a" }}>📈Pasivo</th>
                    <th style={{ padding: "5px 4px", textAlign: "right", color: "#10b981", borderBottom: "1px solid #2a2a4a" }}>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {POST_HP.map((s, i) => {
                    const total = s.hp + s.negocios + s.otros + s.pasivo;
                    return (
                      <tr key={i} style={{ background: i % 2 ? "transparent" : "#0a0a1a" }}>
                        <td style={{ padding: "5px 4px", textAlign: "left", color: "#bbb" }}>{s.year}{s.hp>0?"*":""}</td>
                        <td style={{ padding: "5px 4px", textAlign: "right", color: "#f59e0b" }}>{(s.negocios+s.hp).toLocaleString("es-ES")}</td>
                        <td style={{ padding: "5px 4px", textAlign: "right", color: "#888" }}>{s.otros.toLocaleString("es-ES")}</td>
                        <td style={{ padding: "5px 4px", textAlign: "right", color: "#00B4D8" }}>{s.pasivo>0?s.pasivo.toLocaleString("es-ES"):"—"}</td>
                        <td style={{ padding: "5px 4px", textAlign: "right", color: "#10b981", fontWeight: 700 }}>{total.toLocaleString("es-ES")}€</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 10, color: "#666", marginTop: 8 }}>* 2028 incluye nómina HP (dejas HP en oct 2028)</div>
            <div style={{ fontSize: 11, color: "#00B4D8", marginTop: 10, padding: 8, background: "#0a0a1a", borderRadius: 6, lineHeight: 1.5 }}>
              📈 <strong>Pasivo</strong> = tu 19% propio (lo que pasa de los 95K de tu madre) + dividendos del ETF de reparto. Es dinero que entra cada mes SIN trabajar. En 2041: ~1.686€/mes solo de pasivo.
            </div>
          </div>

          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Negocios activos por año</div>
            {[
              { year: 2029, biz: ["Renov ✓", "Ferr+Herr ✓", "Lav ✓", "EV ✓", "Farmacia UB ⬆"] },
              { year: 2030, biz: ["Renov ✓", "Ferr+Herr ✓", "Coffee ⬆", "Lav ✓", "EV ✓", "Finca ✓", "Farmacia UB 2°"] },
              { year: 2032, biz: ["Renov ✓", "Ferr+Herr ✓", "Coffee ✓", "Lav ✓", "Trast ✓", "Chiq ⬆", "EV ✓", "Senior ⬆", "Farmacia UB"] },
              { year: 2034, biz: ["Renov ✓", "Ferr ✓", "Coffee ✓", "Lav ✓", "Trast ✓", "Chiq ✓", "CoAl ✓", "EV ✓", "Senior ✓", "Farmacia ✓"] },
            ].map(y => (
              <div key={y.year} style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6366f1" }}>{y.year}: </span>
                {y.biz.map((b, i) => (
                  <span key={i} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: b.includes("⬆") ? "#f59e0b22" : "#10b98122", color: b.includes("⬆") ? "#f59e0b" : "#10b981", marginRight: 4, display: "inline-block", marginBottom: 2 }}>{b}</span>
                ))}
              </div>
            ))}
          </div>
        </>)}

        
        {/* MADRE */}
        {tab === "madre" && (<>
          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Fondo madre — Objetivo: 2.470€/mes</div>
            {(() => {
              // Track mother's own contribution to the 19% across all months recorded
              let madreContrib = 0;
              Object.keys(monthlyIncome).forEach(mk => {
                const mi = monthlyIncome[mk];
                if (mi && typeof mi.madre === "number") madreContrib += mi.madre;
              });
              return madreContrib > 0 ? (
                <div style={{ background: "#1a0a1a", borderRadius: 10, padding: 12, marginBottom: 10, border: "1px solid #ec489944" }}>
                  <div style={{ fontSize: 11, color: "#ec4899", fontWeight: 700, marginBottom: 4 }}>👩 APORTE PROPIO DE TU MADRE AL 19%</div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                    <span style={{ color: "#bbb" }}>Aportado por ella (acumulado)</span>
                    <span style={{ fontFamily: "JetBrains Mono", color: "#ec4899" }}>{formatEur(madreContrib)}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#888", marginTop: 4 }}>
                    Sus 500€/mes crecen al 19% dentro del fondo. Esta parte es suya — diferenciada de tu aporte. Puede quedarse para su pensión o devolvérsela cuando quiera.
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 10, color: "#666", marginBottom: 8, fontStyle: "italic" }}>
                  El aporte de tu madre (500€/mes) se rastrea en el récord mensual del Budget y crece al 19% por separado.
                </div>
              );
            })()}
            <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>
              Pensión con convenio bilateral España-Venezuela + complemento a mínimos: 966€/mes.
              Retorno 19% sobre 95K (a tu cuenta, le transfieres): 1.504€/mes. Total: 2.470€/mes.
              Retorno va a TU nombre para que ella cualifique el complemento a mínimos.
              HIPOTECA CONJUNTA (madre+tú) en jun 2028: resuelve el límite de edad (nació 1958).
              El banco usa tu edad para el plazo de 25 años. Cuota 806€/mes (= lo que pagaba de alquiler).
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 4 }}>
                <span>Progreso fondo madre</span>
                <span style={{ fontFamily: "JetBrains Mono" }}>{formatEur(MADRE_FUND.find(m => m.year >= new Date().getFullYear())?.capital || 0)} / {formatEur(MADRE_TARGET)}</span>
              </div>
              <ProgressBar value={MADRE_FUND.find(m => m.year >= new Date().getFullYear())?.capital || 0} max={MADRE_TARGET} color="linear-gradient(90deg, #ec4899, #f59e0b)" height={10} />
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "JetBrains Mono" }}>
                <thead>
                  <tr>{["Año", "Capital", "Ret/mes", "→Madre", "Estado"].map(h => (
                    <th key={h} style={{ padding: "5px 6px", textAlign: "right", color: "#888", borderBottom: "1px solid #2a2a4a", fontSize: 10 }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {MADRE_FUND.map((s, i) => (
                    <tr key={i} style={{ background: i % 2 ? "transparent" : "#0a0a1a" }}>
                      <td style={{ padding: "5px 6px", textAlign: "left", color: "#bbb" }}>{s.year}</td>
                      <td style={{ padding: "5px 6px", textAlign: "right", color: "#6366f1" }}>{formatEur(s.capital)}</td>
                      <td style={{ padding: "5px 6px", textAlign: "right", color: "#10b981" }}>{formatEur(s.ret)}</td>
                      <td style={{ padding: "5px 6px", textAlign: "right", color: s.toMadre > 0 ? "#ec4899" : "#555" }}>{s.toMadre > 0 ? formatEur(s.toMadre) : "—"}</td>
                      <td style={{ padding: "5px 6px", textAlign: "right", color: s.status.includes("✅") ? "#10b981" : s.toMadre > 0 ? "#f59e0b" : "#666", fontSize: 10 }}>{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Desglose ingreso madre (desde 2029)</div>
            {[
              { year: 2029, pension: 966, retorno: 0, complement: 1034, total: 2000 },
              { year: 2030, pension: 966, retorno: 1504, complement: 0, total: 2470 },
              { year: 2032, pension: 966, retorno: 1504, complement: 0, total: 2470 },
              { year: 2036, pension: 966, retorno: 1504, complement: 0, total: 2470 },
            ].map((y, i) => (
              <div key={i} style={{ fontSize: 12, padding: "6px 0", borderBottom: "1px solid #1a1a2e", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#bbb" }}>{y.year}:</span>
                <span>
                  <span style={{ color: "#6366f1" }}>{y.pension}€ pensión</span>
                  {" + "}
                  <span style={{ color: "#10b981" }}>{y.retorno}€ retorno</span>
                  {y.complement > 0 && <span style={{ color: "#f59e0b" }}> + {y.complement}€ tú (hasta 95K)</span>}
                  {" = "}
                  <span style={{ color: "#ec4899", fontWeight: 700 }}>{formatEur(y.total)}</span>
                </span>
              </div>
            ))}
          </div>

          <div style={{ background: "#0a1a0a", borderRadius: 12, padding: 16, border: "1px solid #10b98133" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#10b981", marginBottom: 6 }}>Tu madre está cubierta</div>
            <div style={{ fontSize: 12, color: "#888" }}>
              Desde 2032 el retorno del 19% cubre automáticamente los 1.500€/mes sin que pongas nada de tu bolsillo. 
              En 2031 (año de transición) complementas ~278€/mes de tus negocios — irrelevante con 8.775€/mes de excedente.
              Los 95.000€ quedan reservados permanentemente como su fondo de jubilación.
            </div>
          </div>
        </>)}

        
        {/* BUDGET */}
        {tab === "budget" && (<>
          {(() => {
            const now = new Date();
            const curKey = now.toISOString().slice(0,7);
            const monthName = now.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
            const isJulAgo = now.getMonth() === 6 || now.getMonth() === 7;

            // Income sources — defaults, editable, with monthly override
            const _y = now.getFullYear(), _m = now.getMonth(); // _m: 0=ene
            const beforeSept2026 = _y < 2026 || (_y === 2026 && _m < 8);  // guardería desde 1 sept
            const beforeOct2026 = _y < 2026 || (_y === 2026 && _m < 9);   // 711 (45K) desde oct
            const DEFAULT_INCOME = {
              revolut: beforeSept2026 ? 3300 : 3000,  // guardería pre-IRPF reduce desde sept
              efectivo: 1000,     // lavandería (mínimo, editable)
              wiseDeuda: isJulAgo ? 0 : 850,  // cobro deuda (no jul/ago)
              wise19: beforeOct2026 ? 395 : 711,  // 711 necesita 45K invertidos (desde oct)
              madre: 500,         // aporte madre fijo 500/mes
            };
            const curIncome = { ...DEFAULT_INCOME, ...(monthlyIncome[curKey] || {}) };
            // jul/ago force deuda 0 unless manually set
            if (isJulAgo && !(monthlyIncome[curKey] && "wiseDeuda" in monthlyIncome[curKey])) curIncome.wiseDeuda = 0;

            const resetMonth = () => {
              const next = { ...monthlyIncome };
              delete next[curKey];
              setMonthlyIncome(next);
              localStorage.setItem("plan-monthly-income", JSON.stringify(next));
              if (hasUpstash) upstashSet("plan-monthly-income", next);
            };
            const saveIncome = (field, val) => {
              const num = parseFloat(val);
              if (isNaN(num) || num < 0) return;
              // Only store the edited field, not the whole snapshot (so unedited fields follow defaults)
              const next = { ...monthlyIncome, [curKey]: { ...(monthlyIncome[curKey] || {}), [field]: num } };
              setMonthlyIncome(next);
              localStorage.setItem("plan-monthly-income", JSON.stringify(next));
              if (hasUpstash) upstashSet("plan-monthly-income", next);
              setEditingIncome(null);
            };

            // Expenses by account (editable, stored in customExpenses)
            const DEF_REVOLUT = [
              { id: "hipoteca", name: "Hipoteca (tu 50%)", amount: 813 },
              { id: "revolut", name: "Préstamo Revolut", amount: 402 },
              { id: "cofidis", name: "Préstamo Cofidis", amount: 285 },
              { id: "prestamoMadre", name: "Préstamo madre", amount: 384 },
              { id: "servicios", name: "Servicios (luz/agua/gas)", amount: 460 },
              { id: "telefonoRev", name: "Teléfono (parte)", amount: 22 },
            ];
            const DEF_EFECTIVO = [
              { id: "super", name: "Supermercado", amount: 300 },
              { id: "combustible", name: "Combustible", amount: 60 },
              { id: "cenas", name: "Cenas fuera", amount: 100 },
              { id: "batucada", name: "Batucada", amount: 94 },
              { id: "ocio", name: "Ocio + copas", amount: 55 },
            ];
            const DEF_WISE = [
              { id: "tomas", name: "Tomás (resto guardería)", amount: 150 },
              { id: "seguros", name: "Seguros coche/moto", amount: 80 },
              { id: "suscripciones", name: "Suscripciones", amount: 39 },
            ];
            const ce = customExpenses || {};
            const REVOLUT_BILLS = DEF_REVOLUT.map(b => ({...b, amount: ce[b.id] ?? b.amount}));
            const EFECTIVO_SPEND = DEF_EFECTIVO.map(b => ({...b, amount: ce[b.id] ?? b.amount}));
            const WISE_SPEND = DEF_WISE.map(b => ({...b, amount: ce[b.id] ?? b.amount}));
            const TRAVEL_FUND = ce["travelFund"] ?? 500;

            const saveExp = (id, val) => {
              const num = parseFloat(val);
              if (isNaN(num) || num < 0) return;
              const next = { ...(customExpenses || {}), [id]: num };
              setCustomExpenses(next);
              localStorage.setItem("plan-custom-expenses", JSON.stringify(next));
              if (hasUpstash) upstashSet("plan-custom-expenses", next);
              setEditingExpense(null);
            };

            const totalRevolutBills = REVOLUT_BILLS.reduce((s,b) => s+b.amount, 0);
            const totalEfectivo = EFECTIVO_SPEND.reduce((s,b) => s+b.amount, 0);
            const totalWiseSpend = WISE_SPEND.reduce((s,b) => s+b.amount, 0);

            const revolutSaved = curIncome.revolut - totalRevolutBills;
            const efectivoLeft = curIncome.efectivo - totalEfectivo;
            const wiseLeft = curIncome.wiseDeuda - totalWiseSpend;
            // Travel fund covered from efectivo leftover + wise leftover
            const towardsTravel = Math.min(TRAVEL_FUND, Math.max(0, efectivoLeft) + Math.max(0, wiseLeft));
            const realSavings = revolutSaved + Math.max(0, efectivoLeft) + Math.max(0, wiseLeft) - TRAVEL_FUND;

            const fmt = (n) => formatEur(n);

            return (<>
              {/* Month header */}
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e0e0e0", marginBottom: 4, textTransform: "capitalize" }}>{monthName}</div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 14 }}>Toca cualquier ingreso o gasto (✎) para editarlo. Guardería desde sept 2026, préstamo madre desde oct 2026, retorno 711€ desde oct (45K invertidos).</div>

              {/* INGRESOS EDITABLES */}
              <div style={{ background: "#0a1a0a", borderRadius: 12, padding: 16, marginBottom: 14, border: "1px solid #10b98133" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>💰 INGRESOS ESTE MES</span>
                  {monthlyIncome[curKey] && <button onClick={resetMonth} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 6, border: "1px solid #ef444433", background: "#ef444411", color: "#ef4444", cursor: "pointer" }}>↺ Restablecer</button>}
                </div>
                {[
                  { f: "revolut", icon: "💳", label: "Nómina HP (Revolut)", v: curIncome.revolut },
                  { f: "efectivo", icon: "💵", label: "Lavandería efectivo", v: curIncome.efectivo },
                  { f: "wiseDeuda", icon: "🌐", label: "Cobro deuda (Wise)", v: curIncome.wiseDeuda },
                  { f: "wise19", icon: "📈", label: "Retorno 19% (Wise)", v: curIncome.wise19 },
                  { f: "madre", icon: "👩", label: "Aporte madre al 19% (separado)", v: curIncome.madre },
                ].map(item => (
                  <div key={item.f} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #1a1a2e", fontSize: 13 }}>
                    <span style={{ color: "#ccc" }}>{item.icon} {item.label}</span>
                    {editingIncome === item.f ? (
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <input type="number" defaultValue={item.v} autoFocus
                          onKeyDown={e => { if(e.key==="Enter") saveIncome(item.f, e.target.value); if(e.key==="Escape") setEditingIncome(null); }}
                          id={"inc-"+item.f}
                          style={{ width: 70, padding: "3px 6px", borderRadius: 4, border: "1px solid #10b981", background: "#0a0a1a", color: "#fff", fontSize: 12, textAlign: "right" }} />
                        <button onClick={() => saveIncome(item.f, document.getElementById("inc-"+item.f).value)} style={{ fontSize: 10, padding: "3px 7px", borderRadius: 4, border: "none", background: "#10b981", color: "#000", cursor: "pointer", fontWeight: 700 }}>✓</button>
                      </div>
                    ) : (
                      <span onClick={() => setEditingIncome(item.f)} style={{ fontFamily: "JetBrains Mono", color: "#10b981", cursor: "pointer", padding: "2px 8px", borderRadius: 4, border: "1px solid #10b98133" }}>
                        {fmt(item.v)} ✎
                      </span>
                    )}
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", fontSize: 14, fontWeight: 700 }}>
                  <span style={{ color: "#10b981" }}>TOTAL ENTRADA (tuya)</span>
                  <span style={{ fontFamily: "JetBrains Mono", color: "#10b981" }}>{fmt(curIncome.revolut + curIncome.efectivo + curIncome.wiseDeuda + curIncome.wise19)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0 0", fontSize: 11 }}>
                  <span style={{ color: "#ec4899" }}>👩 + Aporte madre (va al 19%, separado)</span>
                  <span style={{ fontFamily: "JetBrains Mono", color: "#ec4899" }}>{fmt(curIncome.madre)}</span>
                </div>
                {isJulAgo && <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 6 }}>⚠️ Julio/Agosto: normalmente no entra el cobro de deuda (850€)</div>}
              </div>

              {/* 💳 REVOLUT */}
              <div style={{ background: "#12122a", borderRadius: 12, padding: 14, marginBottom: 12, border: "1px solid #6366f133" }}>
                <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 700, marginBottom: 8 }}>💳 REVOLUT — domiciliar pagos grandes</div>
                {REVOLUT_BILLS.map((b,i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid #1a1a2e", fontSize: 12 }}>
                    <span style={{ color: "#bbb" }}>{b.name}</span>
                    {editingExpense === b.id ? (
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <input type="number" defaultValue={b.amount} autoFocus id={"exp-"+b.id}
                          onKeyDown={e => { if(e.key==="Enter") saveExp(b.id, e.target.value); if(e.key==="Escape") setEditingExpense(null); }}
                          style={{ width: 60, padding: "2px 5px", borderRadius: 4, border: "1px solid #ef4444", background: "#0a0a1a", color: "#fff", fontSize: 11, textAlign: "right" }} />
                        <button onClick={() => saveExp(b.id, document.getElementById("exp-"+b.id).value)} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, border: "none", background: "#10b981", color: "#000", cursor: "pointer" }}>✓</button>
                      </div>
                    ) : (
                      <span onClick={() => setEditingExpense(b.id)} style={{ fontFamily: "JetBrains Mono", color: "#ef4444", cursor: "pointer", padding: "1px 6px", borderRadius: 4 }}>-{b.amount}€ ✎</span>
                    )}
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", fontSize: 13, fontWeight: 700 }}>
                  <span style={{ color: "#10b981" }}>✅ Ahorro Revolut</span>
                  <span style={{ fontFamily: "JetBrains Mono", color: revolutSaved >= 0 ? "#10b981" : "#ef4444" }}>{fmt(revolutSaved)}</span>
                </div>
              </div>

              {/* 💵 EFECTIVO */}
              <div style={{ background: "#12122a", borderRadius: 12, padding: 14, marginBottom: 12, border: "1px solid #f59e0b33" }}>
                <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, marginBottom: 8 }}>💵 EFECTIVO LAVANDERÍA — día a día</div>
                <div style={{ fontSize: 10, color: "#888", marginBottom: 6 }}>Renta madre 795€ (te la devuelve por cuenta conjunta) → dispones del total</div>
                {EFECTIVO_SPEND.map((b,i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid #1a1a2e", fontSize: 12 }}>
                    <span style={{ color: "#bbb" }}>{b.name}</span>
                    {editingExpense === b.id ? (
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <input type="number" defaultValue={b.amount} autoFocus id={"exp-"+b.id}
                          onKeyDown={e => { if(e.key==="Enter") saveExp(b.id, e.target.value); if(e.key==="Escape") setEditingExpense(null); }}
                          style={{ width: 60, padding: "2px 5px", borderRadius: 4, border: "1px solid #f59e0b", background: "#0a0a1a", color: "#fff", fontSize: 11, textAlign: "right" }} />
                        <button onClick={() => saveExp(b.id, document.getElementById("exp-"+b.id).value)} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, border: "none", background: "#10b981", color: "#000", cursor: "pointer" }}>✓</button>
                      </div>
                    ) : (
                      <span onClick={() => setEditingExpense(b.id)} style={{ fontFamily: "JetBrains Mono", color: "#f59e0b", cursor: "pointer", padding: "1px 6px", borderRadius: 4 }}>-{b.amount}€ ✎</span>
                    )}
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", fontSize: 13, fontWeight: 700 }}>
                  <span style={{ color: efectivoLeft >= 0 ? "#10b981" : "#ef4444" }}>Sobra → fondo viajes</span>
                  <span style={{ fontFamily: "JetBrains Mono", color: efectivoLeft >= 0 ? "#10b981" : "#ef4444" }}>{fmt(efectivoLeft)}</span>
                </div>
              </div>

              {/* 🌐 WISE */}
              <div style={{ background: "#12122a", borderRadius: 12, padding: 14, marginBottom: 12, border: "1px solid #00B4D833" }}>
                <div style={{ fontSize: 12, color: "#00B4D8", fontWeight: 700, marginBottom: 8 }}>🌐 WISE</div>
                <div style={{ fontSize: 11, color: "#10b981", padding: "4px 0", marginBottom: 4 }}>📈 {fmt(curIncome.wise19)} del 19% → NO TOCAR (reinvertir)</div>
                {curIncome.wiseDeuda > 0 ? (
                  <>
                    <div style={{ fontSize: 10, color: "#888", marginBottom: 4 }}>De los {fmt(curIncome.wiseDeuda)} del cobro de deuda:</div>
                    {WISE_SPEND.map((b,i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid #1a1a2e", fontSize: 12 }}>
                        <span style={{ color: "#bbb" }}>{b.name}</span>
                        {editingExpense === b.id ? (
                          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                            <input type="number" defaultValue={b.amount} autoFocus id={"exp-"+b.id}
                              onKeyDown={e => { if(e.key==="Enter") saveExp(b.id, e.target.value); if(e.key==="Escape") setEditingExpense(null); }}
                              style={{ width: 60, padding: "2px 5px", borderRadius: 4, border: "1px solid #00B4D8", background: "#0a0a1a", color: "#fff", fontSize: 11, textAlign: "right" }} />
                            <button onClick={() => saveExp(b.id, document.getElementById("exp-"+b.id).value)} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, border: "none", background: "#10b981", color: "#000", cursor: "pointer" }}>✓</button>
                          </div>
                        ) : (
                          <span onClick={() => setEditingExpense(b.id)} style={{ fontFamily: "JetBrains Mono", color: "#00B4D8", cursor: "pointer", padding: "1px 6px", borderRadius: 4 }}>-{b.amount}€ ✎</span>
                        )}
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", fontSize: 13, fontWeight: 700 }}>
                      <span style={{ color: "#10b981" }}>Sobra Wise</span>
                      <span style={{ fontFamily: "JetBrains Mono", color: "#10b981" }}>{fmt(wiseLeft)}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 11, color: "#f59e0b", padding: 8, background: "#f59e0b11", borderRadius: 6 }}>
                    ⚠️ Sin cobro de deuda este mes. Paga Tomás+seguros+suscripciones ({totalWiseSpend}€) desde el sobrante del efectivo o ahorro.
                  </div>
                )}
              </div>

              {/* RESUMEN AHORRO */}
              <div style={{ background: realSavings >= 0 ? "#0a1a0a" : "#1a0a0a", borderRadius: 12, padding: 16, marginBottom: 14, border: `1px solid ${realSavings >= 0 ? "#10b98144" : "#ef444444"}` }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>RESUMEN DEL MES</div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 12 }}>
                  <span style={{ color: "#6366f1" }}>Ahorro Revolut</span>
                  <span style={{ fontFamily: "JetBrains Mono", color: "#6366f1" }}>{fmt(revolutSaved)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 12 }}>
                  <span style={{ color: "#00B4D8" }}>Sobra Wise (tras viajes)</span>
                  <span style={{ fontFamily: "JetBrains Mono", color: "#00B4D8" }}>{fmt(Math.max(0, wiseLeft) - Math.max(0, TRAVEL_FUND - Math.max(0, efectivoLeft)))}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 12 }}>
                  <span style={{ color: "#6366f1" }}>✈️ Fondo viajes</span>
                  <span style={{ fontFamily: "JetBrains Mono", color: "#6366f1" }}>{fmt(towardsTravel)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", fontSize: 16, fontWeight: 700, borderTop: "1px solid #333", marginTop: 4 }}>
                  <span style={{ color: realSavings >= 0 ? "#10b981" : "#ef4444" }}>AHORRO REAL</span>
                  <span style={{ fontFamily: "JetBrains Mono", color: realSavings >= 0 ? "#10b981" : "#ef4444", fontSize: 20 }}>{realSavings >= 0 ? "+" : ""}{fmt(realSavings)}</span>
                </div>
                <div style={{ fontSize: 11, color: "#10b981", marginTop: 6 }}>+ {fmt(curIncome.wise19)} reinvertido al 19% (en Wise)</div>
                {realSavings >= 5000 && <div style={{ fontSize: 11, color: "#10b981", marginTop: 4 }}>✅ ¡Puedes hacer un depósito de 5K al 19%!</div>}
              </div>

              {/* FONDO VIAJES + PLANIFICACIÓN */}
              <div style={{ background: "#12122a", borderRadius: 12, padding: 14, marginBottom: 12, border: "1px solid #6366f133" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 700 }}>✈️ VIAJES (fondo {fmt(TRAVEL_FUND)}/mes)</span>
                  <button onClick={() => setShowAddTrip(!showAddTrip)} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, border: "1px solid #6366f133", background: "#6366f111", color: "#6366f1", cursor: "pointer" }}>+ Planificar</button>
                </div>
                {(() => {
                  const totalTrips = trips.reduce((s,t) => s + (parseFloat(t.cost)||0), 0);
                  const monthsLeft = 12 - now.getMonth();
                  const fund = 1000 + TRAVEL_FUND * monthsLeft;
                  const balance = fund - totalTrips;
                  const pct = Math.min(100, (totalTrips/fund)*100);
                  return (
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                        <span style={{ color: "#888" }}>Planificado / Fondo anual</span>
                        <span style={{ fontFamily: "JetBrains Mono", color: balance >= 0 ? "#10b981" : "#ef4444" }}>{fmt(totalTrips)} / {fmt(fund)}</span>
                      </div>
                      <div style={{ width: "100%", background: "#1a1a2e", borderRadius: 4, height: 7 }}>
                        <div style={{ width: pct+"%", background: pct>90?"#ef4444":pct>70?"#f59e0b":"#6366f1", height: "100%", borderRadius: 4 }} />
                      </div>
                      <div style={{ fontSize: 10, color: balance >= 0 ? "#10b981" : "#ef4444", marginTop: 3 }}>{balance >= 0 ? "Sobran "+fmt(balance) : "Te pasas "+fmt(Math.abs(balance))}</div>
                    </div>
                  );
                })()}
                {trips.map(t => {
                  const d = new Date(t.month+"-01");
                  const lbl = d.toLocaleDateString("es-ES",{month:"short",year:"numeric"});
                  return (
                    <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: "1px solid #1a1a2e", fontSize: 12 }}>
                      <span style={{ color: "#bbb" }}>✈️ {t.name} <span style={{ fontSize: 9, color: "#666", background: "#1a1a2e", padding: "1px 5px", borderRadius: 4 }}>{lbl}</span></span>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontFamily: "JetBrains Mono", color: "#6366f1" }}>-{parseFloat(t.cost)}€</span>
                        <button onClick={() => { const u = trips.filter(x=>x.id!==t.id); setTrips(u); localStorage.setItem("plan-trips", JSON.stringify(u)); upstashSet("plan-trips", u); }} style={{ fontSize: 10, color: "#ef4444", background: "transparent", border: "none", cursor: "pointer" }}>✕</button>
                      </div>
                    </div>
                  );
                })}
                {trips.length === 0 && <div style={{ fontSize: 11, color: "#555", padding: "4px 0" }}>Sin viajes planificados</div>}
                {showAddTrip && (
                  <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                    <input value={newTrip.name} onChange={e => setNewTrip({...newTrip, name: e.target.value})} placeholder="Destino" style={{ flex: 2, minWidth: 90, padding: "6px 8px", borderRadius: 6, border: "1px solid #333", background: "#0a0a1a", color: "#e0e0e0", fontSize: 11 }} />
                    <input value={newTrip.cost} onChange={e => setNewTrip({...newTrip, cost: e.target.value})} placeholder="€" type="number" style={{ flex: 1, minWidth: 55, padding: "6px 8px", borderRadius: 6, border: "1px solid #333", background: "#0a0a1a", color: "#e0e0e0", fontSize: 11 }} />
                    <input value={newTrip.month} onChange={e => setNewTrip({...newTrip, month: e.target.value})} type="month" style={{ flex: 1, minWidth: 110, padding: "6px 8px", borderRadius: 6, border: "1px solid #333", background: "#0a0a1a", color: "#e0e0e0", fontSize: 11 }} />
                    <button onClick={() => { if(!newTrip.name||!newTrip.cost) return; const u = [...trips, {...newTrip, id: Date.now()}].sort((a,b)=>(a.month||'').localeCompare(b.month||'')); setTrips(u); localStorage.setItem("plan-trips", JSON.stringify(u)); upstashSet("plan-trips", u); setNewTrip({name:"",cost:"",month: now.toISOString().slice(0,7)}); setShowAddTrip(false); }} style={{ padding: "6px 10px", borderRadius: 6, background: "#6366f1", color: "#fff", border: "none", fontSize: 11, cursor: "pointer" }}>OK</button>
                  </div>
                )}
              </div>

              {/* RÉCORD MENSUAL */}
              <div style={{ background: "#12122a", borderRadius: 12, padding: 14, marginBottom: 12, border: "1px solid #2a2a4a" }}>
                <div style={{ fontSize: 12, color: "#888", fontWeight: 700, marginBottom: 8 }}>📊 RÉCORD MENSUAL DE INGRESOS</div>
                {Object.keys(monthlyIncome).length === 0 ? (
                  <div style={{ fontSize: 11, color: "#555" }}>Aún no hay meses guardados. Edita un ingreso arriba para empezar el récord.</div>
                ) : (
                  Object.keys(monthlyIncome).sort().reverse().map(mk => {
                    const mi = { ...DEFAULT_INCOME, ...monthlyIncome[mk] };
                    const total = mi.revolut + mi.efectivo + mi.wiseDeuda + mi.wise19 + (mi.madre||0);
                    const lbl = new Date(mk + "-01").toLocaleDateString("es-ES", { month: "short", year: "numeric" });
                    return (
                      <div key={mk} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #1a1a2e", fontSize: 12 }}>
                        <span style={{ color: "#bbb", textTransform: "capitalize" }}>{lbl}</span>
                        <span style={{ fontSize: 10, color: "#888" }}>💳{mi.revolut} 💵{mi.efectivo} 🌐{mi.wiseDeuda} 📈{mi.wise19} 👩{mi.madre||0}</span>
                        <span style={{ fontFamily: "JetBrains Mono", color: "#10b981" }}>{fmt(total)}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </>);
          })()}
        </>)}

        {/* CUENTAS — Distribución por cuenta */}
        {tab === "cuentas" && (() => {
          const C2 = {
            bg:"#0f0f0f", card:"#161616", border:"#222",
            revolut:"#818cf8", conjunta:"#a78bfa", abanca:"#34d399",
            wise:"#38bdf8", efectivo:"#fbbf24", green:"#5eca5e",
            red:"#ef4444", muted:"#555", text:"#e8e8e8",
          };
          const Row = ({dot, name, tag, tagColor, amount, amtColor}) => (
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 14px",borderBottom:`1px solid ${C2.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:dot,flexShrink:0}}/>
                <span style={{fontSize:12,color:C2.text}}>{name}
                  {tag&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:20,marginLeft:5,background:tagColor+"22",color:tagColor}}>{tag}</span>}
                </span>
              </div>
              <span style={{fontSize:12,fontWeight:600,color:amtColor||C2.red}}>{amount}</span>
            </div>
          );
          const Account = ({icon, title, sub, incomeColor, income, saveLabel, saveAmt, saveColor, saveBg, children}) => (
            <div style={{background:C2.card,borderRadius:14,border:`1px solid ${C2.border}`,marginBottom:10,overflow:"hidden"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px 10px",borderBottom:`1px solid #1e1e1e`}}>
                <div style={{display:"flex",gap:9,alignItems:"center"}}>
                  <div style={{width:34,height:34,borderRadius:10,background:"#0a0a1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{icon}</div>
                  <div><div style={{fontSize:13,fontWeight:700}}>{title}</div><div style={{fontSize:10,color:C2.muted,marginTop:1}}>{sub}</div></div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:15,fontWeight:800,color:incomeColor}}>{income}</div>
                  <div style={{fontSize:9,color:C2.muted,textTransform:"uppercase"}}>entra</div>
                </div>
              </div>
              {children}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",background:saveBg||"#0d1a0d"}}>
                <span style={{fontSize:11,fontWeight:700,color:saveColor||C2.green}}>{saveLabel}</span>
                <span style={{fontSize:17,fontWeight:800,color:saveColor||C2.green}}>{saveAmt}</span>
              </div>
            </div>
          );
          return (
            <div>
              {/* HERO */}
              <div style={{background:"linear-gradient(135deg,#1a2a1a,#0f1f0f)",border:"1px solid #2a4a2a",borderRadius:16,padding:20,marginBottom:20,textAlign:"center"}}>
                <div style={{fontSize:10,color:"#4a8a4a",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Ahorro líquido automático/mes</div>
                <div style={{fontSize:46,fontWeight:800,color:C2.green,letterSpacing:-2,lineHeight:1}}>649€</div>
                <div style={{fontSize:11,color:"#3a6a3a",marginTop:5}}>Ocurre solo — sin mover nada manualmente</div>
                <div style={{display:"flex",gap:8,marginTop:14}}>
                  {[["Revolut","154€","#818cf8"],["Conjunta","495€","#a78bfa"],["Buffer 19%","289€","#38bdf8"]].map(([l,v,c])=>(
                    <div key={l} style={{flex:1,background:"#0a150a",borderRadius:10,padding:10,textAlign:"center"}}>
                      <div style={{fontSize:9,color:"#4a7a4a",textTransform:"uppercase",marginBottom:3}}>{l}</div>
                      <div style={{fontSize:15,fontWeight:700,color:c}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* REVOLUT */}
              <Account icon="💳" title="Revolut personal" sub="Recibe nómina HP" incomeColor={C2.revolut} income="3.200€"
                saveLabel="✅ Ahorro (incl. 26€ efectivo)" saveAmt="154€">
                <Row dot="#444" name="→ Santander (hipoteca + servicios)" tag="auto" tagColor="#555" amount="-1.273€"/>
                <Row dot="#444" name="Revolut loan" tag="auto" tagColor="#555" amount="-402€"/>
                <Row dot="#444" name="→ ING (Cofidis + Tomás)" tag="auto" tagColor="#555" amount="-785€"/>
                <Row dot="#444" name="Bóveda viajes" tag="auto" tagColor="#555" amount="-500€"/>
                <Row dot="#444" name="→ Abanca (teléfono + seguros)" tag="auto" tagColor="#555" amount="-102€"/>
                <Row dot="#444" name="Metal Revolut" tag="auto" tagColor="#555" amount="-9.58€"/>
                <Row dot={C2.blue||"#3b82f6"} name="+ Efectivo sobrante fin de mes" tag="manual" tagColor="#3b82f6" amount="+26€" amtColor="#3b82f6"/>
              </Account>

              {/* CONJUNTA */}
              <Account icon="🏦" title="Conjunta (Revolut)" sub="Recibe exactamente 795€ de tu madre" incomeColor={C2.conjunta} income="795€"
                saveLabel="✅ Ahorro automático" saveAmt="495€" saveBg="#0d0d1a" saveColor={C2.conjunta}>
                <Row dot="#666" name="Supermercado" tag="tarjeta" tagColor="#7777cc" amount="-300€"/>
              </Account>

              {/* ABANCA */}
              <Account icon="🏛️" title="Abanca" sub="Recibe transferencia de Revolut" incomeColor={C2.abanca} income="102€"
                saveLabel="Balance" saveAmt="0€" saveBg="#0a1515" saveColor="#444">
                <Row dot="#444" name="Teléfono" tag="auto" tagColor="#555" amount="-22€"/>
                <Row dot="#444" name="Seguros carro + moto" tag="auto" tagColor="#555" amount="-80€"/>
              </Account>

              {/* WISE */}
              <Account icon="🌐" title="Wise" sub="Retorno inversión 19%" incomeColor={C2.wise} income="400€"
                saveLabel="📈 Buffer inversión 19% (reinvertir)" saveAmt="289€" saveBg="#0a1520" saveColor={C2.wise}>
                <Row dot="#444" name="Suscripciones (Netflix/Spotify...)" tag="auto" tagColor="#555" amount="-52.21€"/>
                <Row dot="#444" name="Audible" tag="auto" tagColor="#555" amount="-14.17€"/>
                <Row dot="#444" name="Cinesa Unlimited" tag="auto" tagColor="#555" amount="-14.92€"/>
                <Row dot="#444" name="Entretenimiento" tag="tarjeta" tagColor="#7777cc" amount="-30€"/>
              </Account>

              {/* EFECTIVO */}
              <div style={{background:C2.card,borderRadius:14,border:`1px solid ${C2.border}`,overflow:"hidden"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px 10px",borderBottom:`1px solid #1e1e1e`}}>
                  <div style={{display:"flex",gap:9,alignItems:"center"}}>
                    <div style={{width:34,height:34,borderRadius:10,background:"#1c160a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💵</div>
                    <div><div style={{fontSize:13,fontWeight:700}}>Efectivo</div><div style={{fontSize:10,color:C2.muted,marginTop:1}}>305€ tras pagar renta madre</div></div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:15,fontWeight:800,color:C2.efectivo}}>305€</div>
                    <div style={{fontSize:9,color:C2.muted,textTransform:"uppercase"}}>disponible</div>
                  </div>
                </div>
                <Row dot="#c89a30" name="Combustible" tag="efectivo" tagColor="#aa8820" amount="-60€" amtColor="#f59e0b"/>
                <Row dot="#c89a30" name="Batucada" tag="efectivo" tagColor="#aa8820" amount="-94€" amtColor="#f59e0b"/>
                <Row dot="#c89a30" name="Cenas fuera" tag="efectivo" tagColor="#aa8820" amount="-100€" amtColor="#f59e0b"/>
                <Row dot="#c89a30" name="Copas" tag="efectivo" tagColor="#aa8820" amount="-25€" amtColor="#f59e0b"/>
                <Row dot="#3b82f6" name="→ Ingresar en Revolut fin de mes" tag="manual" tagColor="#3b82f6" amount="-26€" amtColor="#3b82f6"/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",background:"#0a0d0a"}}>
                  <span style={{fontSize:11,fontWeight:700,color:C2.green}}>✅ Efectivo al final del mes</span>
                  <span style={{fontSize:17,fontWeight:800,color:C2.green}}>0€</span>
                </div>
              </div>

              {/* CONFIG instrucciones */}
              <div style={{background:C2.card,border:`1px solid ${C2.border}`,borderRadius:14,padding:16,marginTop:12}}>
                <div style={{fontSize:11,fontWeight:700,color:"#555",textTransform:"uppercase",letterSpacing:0.5,marginBottom:12}}>Configuración (una sola vez)</div>
                {[
                  ["1","Santander","Domicilia hipoteca (813€) y servicios (460€) desde Revolut"],
                  ["2","Revolut → ING","Orden permanente el día 1 por 785€"],
                  ["3","Revolut → Abanca","Orden permanente por 102€ (teléfono 22 + seguros 80)"],
                  ["4","Bóveda viajes","500€/mes automáticos en Revolut"],
                  ["5","Suscripciones","Domicilia Netflix, Audible, Cinesa en Wise"],
                  ["6","Supermercado","Siempre tarjeta de la cuenta conjunta"],
                  ["7","Efectivo sobrante","Ingresar los 26€ en Revolut al fin de mes"],
                ].map(([n,t,d])=>(
                  <div key={n} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
                    <div style={{width:22,height:22,borderRadius:6,background:"#222",color:"#666",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{n}</div>
                    <div><span style={{fontSize:12,fontWeight:600,color:"#bbb"}}>{t}: </span><span style={{fontSize:12,color:"#888"}}>{d}</span></div>
                  </div>
                ))}
                <div style={{marginTop:10,padding:10,background:"#1a1500",borderRadius:8,border:"1px solid #3a3000",fontSize:11,color:"#aa9020",lineHeight:1.6}}>
                  💡 <strong style={{color:"#ccb030"}}>Retribución flexible Tomás:</strong> actívala en RRHH de HP. 350€ de guardería salen antes del IRPF. Solo pagas 150€ de bolsillo y ahorras ~60-80€/mes en impuestos.
                </div>
              </div>
            </div>
          );
        })()}

        {/* CALENDARIO */}
        {tab === "calendario" && (<>
          {/* PWA Install + Notifications banner */}
          <div style={{ background: "linear-gradient(135deg, #1a1a3a, #12122a)", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #00B4D844" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#00B4D8", marginBottom: 10 }}>📱 Instalar como app + notificaciones</div>
            {!isStandalone && isIOS && (
              <div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.6, marginBottom: 10 }}>
                <strong style={{ color: "#fff" }}>Para instalar en iPhone:</strong><br/>
                1. Toca el botón Compartir (cuadrado con flecha ↑) abajo en Safari<br/>
                2. Desliza y toca "Añadir a pantalla de inicio"<br/>
                3. La app aparecerá como un icono nativo
              </div>
            )}
            {!isStandalone && !isIOS && (
              <div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.6, marginBottom: 10 }}>
                <strong style={{ color: "#fff" }}>Para instalar:</strong> menú del navegador → "Instalar app" o "Añadir a pantalla de inicio".
              </div>
            )}
            {isStandalone && (
              <div style={{ fontSize: 12, color: "#10b981", marginBottom: 10 }}>✅ App instalada en modo standalone</div>
            )}
            <div style={{ fontSize: 11, color: "#888", marginBottom: 10, padding: 10, background: "#0a0a1a", borderRadius: 8 }}>
              ⚠️ <strong style={{ color: "#f59e0b" }}>Notificaciones en iPhone (España):</strong> Apple bloquea las push de PWA en la UE. El método 100% fiable es exportar los hitos al Calendario de iOS (abajo) — recibes alarmas nativas 7 días y 1 día antes de cada hito.
            </div>
            <button onClick={enableNotifications} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #00B4D8", background: "#00B4D822", color: "#00B4D8", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>
              🔔 Intentar activar notificaciones del navegador
            </button>
          </div>
          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Exportar todos los hitos al calendario</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Descarga un archivo .ics con los 27 hitos. Cada uno incluye alarmas 7 días antes y 1 día antes. Compatible con Google Calendar, Apple Calendar, Outlook.</div>
            <button onClick={exportAllCal} style={{
              width: "100%", padding: "12px", borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Outfit"
            }}>
              📅 Descargar todos los hitos (.ics)
            </button>
          </div>

          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Próximos hitos pendientes</div>
            {MILESTONES.filter(m => !completed[m.id]).slice(0, 5).map(m => (
              <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1a1a2e" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: m.critical ? 600 : 400 }}>
                    {m.critical && <span style={{ color: "#ef4444" }}>★ </span>}{m.label.slice(0, 50)}{m.label.length > 50 ? "..." : ""}
                  </div>
                  <div style={{ fontSize: 10, color: "#666" }}>{new Date(m.date).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}</div>
                </div>
                <a href={generateICS(m)} download={`hito_${m.id}.ics`} style={{
                  fontSize: 10, padding: "4px 10px", borderRadius: 6, background: "#6366f122", color: "#6366f1", textDecoration: "none", whiteSpace: "nowrap"
                }}>+ Cal</a>
              </div>
            ))}
          </div>

          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Notificaciones por email</div>
            <div style={{ fontSize: 12, color: "#888" }}>
              Al importar el .ics en Google Calendar, las alarmas (7 días y 1 día antes) se activan automáticamente como notificaciones push en tu móvil y email si tienes notificaciones de calendario activadas. No necesitas configurar nada adicional.
            </div>
          </div>
        </>)}
      </div>
    </div>
  );
}
