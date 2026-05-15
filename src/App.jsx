import { useState, useEffect, useCallback, useRef } from "react";

const MILESTONES = [
  { id: "m1", date: "2026-07-01", label: "Depositar 5K → 30K base inversión 19%", area: "Finanzas", critical: true, phase: 0 },
  { id: "m1b", date: "2026-06-15", label: "Contactar broker hipotecario — primera consulta", area: "Hipoteca", critical: false, phase: 0 },
  { id: "m2", date: "2026-09-01", label: "Proponer rol híbrido a Design Director HP", area: "HP", critical: true, phase: 0 },
  { id: "m2b", date: "2026-09-15", label: "Primer evento internacional HP", area: "HP", critical: false, phase: 0 },
  { id: "m3", date: "2026-12-15", label: "Presentar deck tendencias HP. Capital ~38K", area: "HP", critical: false, phase: 0 },
  { id: "m4", date: "2027-01-15", label: "2do depósito 5K. Buscar pisos 160-170K", area: "Hipoteca", critical: true, phase: 0 },
  { id: "m5", date: "2027-03-01", label: "Ascenso HP Expert. Pre-aprobación broker", area: "HP", critical: true, phase: 0 },
  { id: "m6", date: "2027-05-01", label: "3er depósito 5K. Piso seleccionado", area: "Hipoteca", critical: true, phase: 0 },
  { id: "m7", date: "2027-06-01", label: "AVISAR RESCATE INVERSIÓN (3 meses)", area: "Hipoteca", critical: true, phase: 0 },
  { id: "m8", date: "2027-09-01", label: "FIRMAR HIPOTECA madre. Rescatar inversión ~57K", area: "Hipoteca", critical: true, phase: 0 },
  { id: "m9", date: "2027-10-01", label: "ARRANCAR Renovación Express + señal ferretería + madre pide paro", area: "Negocios", critical: true, phase: 1 },
  { id: "m10", date: "2027-11-01", label: "Tío en ferretería con Ángel mentor. Visitar inmobiliarias", area: "Negocios", critical: false, phase: 1 },
  { id: "m11", date: "2028-01-15", label: "Paro capitalizado madre → pagar traspaso ferretería", area: "Negocios", critical: true, phase: 1 },
  { id: "m12", date: "2028-06-01", label: "3-4 pisos reformados. Ferretería estabilizada. +5K inversión", area: "Negocios", critical: false, phase: 1 },
  { id: "m13", date: "2028-09-01", label: "Vender Citigo. Comprar Kia EV2", area: "Personal", critical: false, phase: 1 },
  { id: "m14", date: "2028-12-01", label: "+5K inversión. Capital ~30K. Ferretería break-even", area: "Negocios", critical: true, phase: 1 },
  { id: "m15", date: "2029-12-01", label: "2 negocios 83K combinados. +5K inversión", area: "Negocios", critical: false, phase: 1 },
  { id: "m16", date: "2030-06-01", label: "ABRIR SPECIALTY COFFEE Av. Barcelona", area: "Negocios", critical: true, phase: 2 },
  { id: "m17", date: "2030-12-01", label: "COMPRAR FINCA EL PERELLÓ 37.500€", area: "Personal", critical: true, phase: 2 },
  { id: "m18", date: "2031-06-01", label: "SALIR DE HP. Tomar ferretería. Abrir Franquicia Trasteros (self storage)", area: "Negocios", critical: true, phase: 2 },
  { id: "m19", date: "2031-09-01", label: "INICIO FARMACIA UB turno tarde", area: "Farmacia", critical: true, phase: 2 },
  { id: "m20", date: "2032-12-01", label: "ABRIR CHIQUIPARK LOW-COST Sant Just Desvern", area: "Negocios", critical: true, phase: 3 },
  { id: "m21", date: "2033-06-01", label: "ABRIR CO-ALIMENT (tía + suegros operan)", area: "Negocios", critical: true, phase: 3 },
  { id: "m22", date: "2034-04-01", label: "REVOLUT PAGADA. +402€/mes libres", area: "Finanzas", critical: true, phase: 4 },
  { id: "m23", date: "2036-04-01", label: "COFIDIS PAGADA. DEUDA CERO", area: "Finanzas", critical: true, phase: 4 },
  { id: "m24", date: "2036-06-01", label: "FIN FARMACIA UB. Colegiarse", area: "Farmacia", critical: true, phase: 4 },
  { id: "m25", date: "2037-06-01", label: "COMPRAR FARMACIA Baix Llobregat", area: "Farmacia", critical: true, phase: 4 },
];

const PHASE_NAMES = ["Preparación", "Lanzamiento", "Consolidación", "Expansión", "Farmacia"];
const PHASE_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#f97316", "#06b6d4"];
const AREA_COLORS = { Finanzas: "#10b981", HP: "#6366f1", Hipoteca: "#ef4444", Negocios: "#f59e0b", Personal: "#ec4899", Farmacia: "#06b6d4" };

const MONTHLY_SIM = [
  { m: "May 2026", inv: 25000, buf: 3996, total: 28996 },
  { m: "Jun 2026", inv: 25000, buf: 5992, total: 30992 },
  { m: "Jul 2026", inv: 30000, buf: 1538, total: 31538 },
  { m: "Ago 2026", inv: 30000, buf: 2163, total: 32163 },
  { m: "Sep 2026", inv: 30000, buf: 3638, total: 33638 },
  { m: "Oct 2026", inv: 35000, buf: 113, total: 35113 },
  { m: "Nov 2026", inv: 35000, buf: 1667, total: 36667 },
  { m: "Dic 2026", inv: 35000, buf: 3221, total: 38221 },
  { m: "Ene 2027", inv: 35000, buf: 4875, total: 39875 },
  { m: "Feb 2027", inv: 40000, buf: 1529, total: 41529 },
  { m: "Mar 2027", inv: 40000, buf: 3262, total: 43262 },
  { m: "Abr 2027", inv: 40000, buf: 4995, total: 44995 },
  { m: "May 2027", inv: 45000, buf: 1728, total: 46728 },
  { m: "Jun 2027", inv: 45000, buf: 3941, total: 48941 },
  { m: "Jul 2027", inv: 50000, buf: 1004, total: 51004 },
  { m: "Ago 2027", inv: 50000, buf: 3146, total: 53146 },
  { m: "Sep 2027", inv: 55000, buf: 1138, total: 56138 },
];

const INV19_PROJECTION = [
  { year: "Dic 2027", capital: 15724, monthly: 249 },
  { year: "Dic 2028", capital: 29646, monthly: 469 },
  { year: "Dic 2029", capital: 46457, monthly: 736 },
  { year: "Dic 2030", capital: 66754, monthly: 1057 },
  { year: "Dic 2031", capital: 91263, monthly: 1445 },
  { year: "Dic 2032", capital: 120856, monthly: 1914 },
  { year: "Dic 2033", capital: 156588, monthly: 2479 },
  { year: "Dic 2034", capital: 199733, monthly: 3162 },
  { year: "Dic 2035", capital: 251828, monthly: 3987 },
  { year: "May 2036", capital: 277485, monthly: 4394 },
];


const MADRE_FUND = [
  { year: 2028, capital: 17200, ret: 272, toMadre: 0, status: "Acumulando" },
  { year: 2029, capital: 32200, ret: 510, toMadre: 0, status: "Acumulando" },
  { year: 2030, capital: 52200, ret: 827, toMadre: 0, status: "Acumulando" },
  { year: 2031, capital: 77200, ret: 1222, toMadre: 1222, status: "Faltan 17.800€" },
  { year: 2032, capital: 107200, ret: 1697, toMadre: 1500, status: "✅ Cubierto" },
  { year: 2033, capital: 142200, ret: 2252, toMadre: 1500, status: "✅ Cubierto" },
  { year: 2034, capital: 182200, ret: 2885, toMadre: 1500, status: "✅ Cubierto" },
  { year: 2035, capital: 227200, ret: 3597, toMadre: 1500, status: "✅ Cubierto" },
  { year: 2036, capital: 277200, ret: 4389, toMadre: 1500, status: "✅ Cubierto" },
];
const MADRE_TARGET = 95000;

const POST_HP = [
  { year: 2031, income: 12945, expenses: 4170, surplus: 8775 },
  { year: 2032, income: 16414, expenses: 4170, surplus: 12244 },
  { year: 2033, income: 20479, expenses: 4170, surplus: 16309 },
  { year: 2034, income: 27662, expenses: 4170, surplus: 23492 },
  { year: 2035, income: 31187, expenses: 3770, surplus: 27417 },
  { year: 2036, income: 32594, expenses: 3500, surplus: 29094 },
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
  const [editNote, setEditNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [calUrl, setCalUrl] = useState("");
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const c = localStorage.getItem("plan-completed");
      if (c) setCompleted(JSON.parse(c));
    } catch {}
    try {
      const n = localStorage.getItem("plan-notes");
      if (n) setNotes(JSON.parse(n));
    } catch {}
    setLoading(false);
  }, []);

  const saveCompleted = useCallback((next) => {
    setCompleted(next);
    try { localStorage.setItem("plan-completed", JSON.stringify(next)); } catch {}
  }, []);

  const saveNote = useCallback((id, text) => {
    const next = { ...notes, [id]: text };
    setNotes(next);
    try { localStorage.setItem("plan-notes", JSON.stringify(next)); } catch {}
  }, [notes]);

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
      <div style={{ background: "linear-gradient(135deg, #1a1a3e 0%, #0a0a1a 100%)", borderBottom: "1px solid #2a2a4a", padding: "16px 20px" }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
          <span style={{ color: "#6366f1" }}>PLAN</span> <span style={{ color: "#f59e0b" }}>MAESTRO</span> <span style={{ fontSize: 13, color: "#666", fontWeight: 400 }}>v6.0</span>
        </div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Holding Baix Llobregat · 10 años · {completedCount}/{totalMilestones} hitos</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a1a3e", background: "#0d0d20" }}>
        {["dashboard", "hitos", "finanzas", "post-hp", "madre", "calendario"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "10px 0", background: "transparent", border: "none", color: tab === t ? "#6366f1" : "#666",
            fontSize: 12, fontWeight: tab === t ? 600 : 400, cursor: "pointer", borderBottom: tab === t ? "2px solid #6366f1" : "2px solid transparent",
            fontFamily: "Outfit", textTransform: "uppercase", letterSpacing: 1
          }}>
            {t === "dashboard" ? "📊" : t === "hitos" ? "🎯" : t === "finanzas" ? "💰" : t === "post-hp" ? "🚀" : t === "madre" ? "👩" : "📅"} {t}
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
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>LAS 4 REGLAS DE ORO</div>
            {[
              "No abrir siguiente negocio sin que el anterior sea rentable",
              "Hipoteca madre va primero, siempre",
              "No dejar HP hasta 2031 y negocios > salario",
              "Inversión 19%: depósitos 5K, NUNCA tocar para deuda"
            ].map((r, i) => (
              <div key={i} style={{ fontSize: 13, padding: "6px 0", color: "#bbb", borderBottom: i < 3 ? "1px solid #1a1a2e" : "none" }}>
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
                    </div>
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
          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Simulación mes a mes (May 2026 — Sep 2027)</div>
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
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Inversión 19% — Proyección con interés compuesto</div>
            <MiniChart data={INV19_PROJECTION} dataKey="capital" color="#10b981" height={80} />
            <div style={{ overflowX: "auto", marginTop: 10 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "JetBrains Mono" }}>
                <thead>
                  <tr>{["Fecha", "Capital", "€/mes pasivos"].map(h => (
                    <th key={h} style={{ padding: "5px 8px", textAlign: "right", color: "#888", borderBottom: "1px solid #2a2a4a" }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {INV19_PROJECTION.map((s, i) => (
                    <tr key={i} style={{ background: i % 2 ? "transparent" : "#0a0a1a" }}>
                      <td style={{ padding: "5px 8px", textAlign: "left", color: "#bbb" }}>{s.year}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", color: "#10b981", fontWeight: 600 }}>{formatEur(s.capital)}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", color: "#f59e0b" }}>{formatEur(s.monthly)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 12, color: "#10b981", marginTop: 10, fontWeight: 600 }}>Meta 2036: 277.485 € → 4.394 €/mes pasivos</div>
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
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Viabilidad post-HP (desde julio 2031)</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Al dejar HP pierdes 3.450 €/mes. Tus negocios + inversión ya generan 3-9× más.</div>
            <MiniChart data={POST_HP} dataKey="surplus" color="#10b981" height={70} />
            <div style={{ overflowX: "auto", marginTop: 10 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, fontFamily: "JetBrains Mono" }}>
                <thead>
                  <tr>{["Año", "Ingresos", "Gastos", "Excedente"].map(h => (
                    <th key={h} style={{ padding: "5px 8px", textAlign: "right", color: "#888", borderBottom: "1px solid #2a2a4a" }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {POST_HP.map((s, i) => (
                    <tr key={i} style={{ background: i % 2 ? "transparent" : "#0a0a1a" }}>
                      <td style={{ padding: "5px 8px", textAlign: "left", color: "#bbb" }}>{s.year}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", color: "#10b981" }}>{formatEur(s.income)}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", color: "#ef4444" }}>{formatEur(s.expenses)}</td>
                      <td style={{ padding: "5px 8px", textAlign: "right", color: "#f59e0b", fontWeight: 700 }}>+{formatEur(s.surplus)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 12, color: "#10b981", marginTop: 10, fontWeight: 600 }}>
              Matrícula Farmacia UB: 170 €/mes = 1,3% del excedente. Cubierta sobradamente.
            </div>
          </div>

          <div style={{ background: "#12122a", borderRadius: 12, padding: 16, border: "1px solid #2a2a4a" }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Negocios activos por año</div>
            {[
              { year: 2031, biz: ["Renov Express ✓", "Ferretería ✓", "Coffee ✓", "Lav#1 ✓", "Trast ⬆"] },
              { year: 2032, biz: ["Renov Express ✓", "Ferretería ✓", "Coffee ✓", "Lav#1 ✓", "Trast ✓", "Chiquipark ⬆"] },
              { year: 2033, biz: ["Renov Express ✓", "Ferretería ✓", "Coffee ✓", "Lav#1 ✓", "Trast ✓", "Chiquipark ✓", "Co-Aliment ⬆"] },
              { year: 2036, biz: ["Renov ✓", "Ferr ✓", "Coffee ✓", "Lav#1 ✓", "Trast ✓", "Chiq ✓", "CoAl ✓", "Inv19% ✓"] },
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
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Fondo madre — Objetivo: 2.000€/mes</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>
              Pensión no contributiva: ~500€/mes. Gap: 1.500€/mes del retorno 19%.
              Capital necesario: 95.000€ reservados permanentemente.
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
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Desglose ingreso madre (desde 2031)</div>
            {[
              { year: 2031, pension: 500, retorno: 1222, complement: 278, total: 2000 },
              { year: 2032, pension: 500, retorno: 1500, complement: 0, total: 2000 },
              { year: 2033, pension: 500, retorno: 1500, complement: 0, total: 2000 },
              { year: 2036, pension: 500, retorno: 1500, complement: 0, total: 2000 },
            ].map((y, i) => (
              <div key={i} style={{ fontSize: 12, padding: "6px 0", borderBottom: "1px solid #1a1a2e", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#bbb" }}>{y.year}:</span>
                <span>
                  <span style={{ color: "#6366f1" }}>{y.pension}€ pensión</span>
                  {" + "}
                  <span style={{ color: "#10b981" }}>{y.retorno}€ retorno</span>
                  {y.complement > 0 && <span style={{ color: "#f59e0b" }}> + {y.complement}€ tú</span>}
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

        {/* CALENDARIO */}
        {tab === "calendario" && (<>
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
