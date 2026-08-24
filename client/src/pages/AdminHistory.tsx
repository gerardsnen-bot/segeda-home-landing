import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { History, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

type AuditLog = { id: string; action: "create" | "update" | "delete"; entity_type: string; created_at: string; after_state: Record<string, unknown> | null; before_state: Record<string, unknown> | null };

const actionLabel = { create: "Creación", update: "Edición", delete: "Eliminación" } as const;

export default function AdminHistory() {
  const [, setLocation] = useLocation();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    if (!supabase) return;
    setLoading(true); setError("");
    const { data, error: queryError } = await supabase.from("audit_logs").select("id,action,entity_type,created_at,after_state,before_state").order("created_at", { ascending: false }).limit(100);
    if (queryError) setError(queryError.message);
    setLogs((data as AuditLog[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => { load().catch(() => setLoading(false)); }, []);

  return <DashboardLayout><div className="mx-auto max-w-6xl space-y-6"><header className="flex flex-col justify-between gap-4 rounded-[28px] bg-[#171717] px-7 py-8 text-white sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#F4D98A]">MDFantasy Studio</p><h1 className="mt-2 flex items-center gap-3 font-serif text-4xl"><History className="text-[#F4D98A]" />Historial de cambios</h1><p className="mt-3 max-w-2xl text-sm text-white/70">Cada cambio administrativo de productos, categorías, imágenes y bloques públicos queda registrado aquí.</p></div><Button className="bg-white text-[#171717] hover:bg-[#F5EFE3]" onClick={load}><RefreshCw className="mr-2" size={15} />Actualizar</Button></header><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setLocation("/admin")}>Volver al resumen</Button><Badge variant="outline" className="border-[#B99137]/40 bg-[#F5EFE3] px-3 py-2 text-[#8B6A24]"><ShieldCheck className="mr-1" size={14} />Auditoría protegida</Badge></div>{loading ? <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[#B99137]/25 bg-white"><Loader2 className="animate-spin text-[#B99137]" /></div> : error ? <div className="rounded-2xl border border-[#B99137]/25 bg-white p-6 text-sm text-[#6e665d]">No se pudo consultar el historial: {error}</div> : <section className="overflow-hidden rounded-2xl border border-[#B99137]/25 bg-white"><div className="border-b border-[#F5EFE3] p-5"><strong className="font-serif text-2xl text-[#171717]">Últimos cambios</strong><p className="mt-1 text-sm text-[#6e665d]">{logs.length} eventos disponibles</p></div><div className="divide-y divide-[#F5EFE3]">{logs.length ? logs.map((log) => <article key={log.id} className="grid gap-3 p-5 sm:grid-cols-[120px_1fr_auto]"><Badge className={log.action === "delete" ? "w-fit bg-red-50 text-red-700 hover:bg-red-50" : log.action === "create" ? "w-fit bg-[#edf6ec] text-[#3f7846] hover:bg-[#edf6ec]" : "w-fit bg-[#F5EFE3] text-[#8B6A24] hover:bg-[#F5EFE3]"}>{actionLabel[log.action]}</Badge><div><strong className="block text-sm capitalize text-[#171717]">{log.entity_type.replaceAll("_", " ")}</strong><p className="mt-1 text-xs text-[#766b61]">{typeof (log.after_state?.name ?? log.before_state?.name) === "string" ? String(log.after_state?.name ?? log.before_state?.name) : "Cambio administrativo registrado"}</p></div><time className="text-xs text-[#8B6A24]">{new Date(log.created_at).toLocaleString("es-PE")}</time></article>) : <div className="p-10 text-center text-sm text-[#6e665d]">Aún no existen cambios administrativos registrados.</div>}</div></section>}</div></DashboardLayout>;
}
