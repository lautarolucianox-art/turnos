"use client";
import { useEffect, useState } from "react";

const hoy = () => new Date().toISOString().slice(0, 10);

export default function Reservar() {
  const [fecha, setFecha] = useState(hoy());
  const [horas, setHoras] = useState([]);
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [msg, setMsg] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function cargar() {
    const r = await fetch("/api/turnos?fecha=" + fecha);
    setHoras(r.ok ? await r.json() : []);
  }
  useEffect(() => { setHora(""); cargar(); }, [fecha]);

  async function reservar(e) {
    e.preventDefault();
    setEnviando(true); setMsg(null);
    const r = await fetch("/api/turnos", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fecha, hora, nombre, telefono }),
    });
    const j = await r.json();
    setEnviando(false);
    if (r.ok) { setMsg({ ok: true, t: `Turno reservado: ${fecha} a las ${hora}. ¡Te esperamos, ${nombre}!` }); setHora(""); setNombre(""); setTelefono(""); }
    else setMsg({ ok: false, t: j.error });
    cargar();
  }

  return (
    <main>
      <h1>Reservá tu turno</h1>
      <p className="sub">Elegí el día y un horario disponible.</p>
      <form onSubmit={reservar}>
        <label htmlFor="f">Día</label>
        <input id="f" type="date" min={hoy()} value={fecha} onChange={(e) => setFecha(e.target.value)} />

        <label>Horarios</label>
        {horas.length === 0 && <p className="sub">No hay horarios cargados para este día.</p>}
        <div className="horas">
          {horas.map((h) => (
            <button type="button" key={h.hora} disabled={h.estado !== "libre"}
              className={"hora" + (hora === h.hora ? " sel" : "")} onClick={() => setHora(h.hora)}>
              {h.hora}
            </button>
          ))}
        </div>

        <label htmlFor="n">Nombre</label>
        <input id="n" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" required />
        <label htmlFor="t">Teléfono</label>
        <input id="t" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} autoComplete="tel" required />

        <button className="btn" disabled={!hora || enviando}>{enviando ? "Reservando..." : "Reservar turno"}</button>
      </form>
      {msg && <div className={"msg " + (msg.ok ? "ok" : "err")} role="status">{msg.t}</div>}
    </main>
  );
}
