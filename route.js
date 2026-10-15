import { db } from "@/lib/db";
export const dynamic = "force-dynamic";

// GET /api/turnos?fecha=2026-10-20 -> horarios de ese día (sin datos personales)
export async function GET(req) {
  const fecha = new URL(req.url).searchParams.get("fecha");
  if (!fecha) return Response.json({ error: "Falta la fecha" }, { status: 400 });
  const { data, error } = await db.from("turnos").select("hora,estado").eq("fecha", fecha).order("hora");
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

// POST -> reservar { fecha, hora, nombre, telefono }
export async function POST(req) {
  const { fecha, hora, nombre, telefono } = await req.json();
  if (!fecha || !hora || !nombre?.trim() || !/^[0-9+\s()-]{6,20}$/.test(telefono || ""))
    return Response.json({ error: "Revisá el nombre y el teléfono." }, { status: 400 });
  // Solo reserva si sigue libre: evita que dos personas tomen el mismo horario
  const { data, error } = await db.from("turnos")
    .update({ estado: "reservado", nombre: nombre.trim(), telefono: telefono.trim() })
    .eq("fecha", fecha).eq("hora", hora).eq("estado", "libre").select();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!data.length) return Response.json({ error: "Ese horario ya fue tomado. Elegí otro." }, { status: 409 });
  return Response.json({ ok: true });
}
