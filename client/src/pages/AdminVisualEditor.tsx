import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { getImageUploadError } from "@/lib/imageUploadValidation";
import { Eye, LayoutTemplate, Loader2, Save, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

type VisualSection = { id: string; section_key: string; internal_name: string; title: string | null; subtitle: string | null; description: string | null; image_url: string | null; cta_label: string | null; cta_url: string | null; active: boolean };

export default function AdminVisualEditor() {
  const [, setLocation] = useLocation();
  const [sections, setSections] = useState<VisualSection[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const selected = useMemo(() => sections.find((section) => section.id === selectedId) ?? null, [sections, selectedId]);

  const load = async () => {
    if (!supabase) return;
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) { setChecking(false); return; }
    const { data, error } = await supabase.from("site_sections").select("id,section_key,internal_name,title,subtitle,description,image_url,cta_label,cta_url,active").order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    const next = (data as VisualSection[] | null) ?? [];
    setSections(next); setSelectedId(next[0]?.id ?? ""); setChecking(false);
  };

  useEffect(() => { load().catch(() => setChecking(false)); }, []);
  const edit = (field: keyof VisualSection, value: string | boolean) => setSections((current) => current.map((section) => section.id === selectedId ? { ...section, [field]: value } : section));
  const uploadImage = async (file: File) => {
    if (!supabase || !selected) return;
    const validationError = getImageUploadError(file);
    if (validationError) return toast.error(validationError);
    setUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `secciones/${selected.id}/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("mdfantasy-media").upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) return toast.error(uploadError.message);
      const { data: urlData } = supabase.storage.from("mdfantasy-media").getPublicUrl(path);
      const { error: metadataError } = await supabase.from("media_library").insert({ storage_path: path, public_url: urlData.publicUrl, file_name: file.name, mime_type: file.type, size_bytes: file.size });
      if (metadataError) return toast.error(metadataError.message);
      edit("image_url", urlData.publicUrl);
      toast.success("Imagen cargada. La vista previa ya fue actualizada; guarda el bloque para publicarla.");
    } finally {
      setUploading(false);
    }
  };
  const save = async () => {
    if (!supabase || !selected) return;
    setSaving(true);
    const { error } = await supabase.from("site_sections").update({ title: selected.title, subtitle: selected.subtitle, description: selected.description, image_url: selected.image_url, cta_label: selected.cta_label, cta_url: selected.cta_url, active: selected.active }).eq("id", selected.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Sección guardada. La landing se actualizará al recargar.");
  };

  return <DashboardLayout><div className="mx-auto max-w-7xl space-y-6"><header className="rounded-[28px] bg-[#171717] px-7 py-8 text-white"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#F4D98A]">MDFantasy Studio</p><h1 className="mt-2 flex items-center gap-3 font-serif text-4xl"><LayoutTemplate className="text-[#F4D98A]" />Editor visual</h1><p className="mt-3 max-w-2xl text-sm text-white/70">Edita los slots de la landing con una vista previa antes de guardar los cambios.</p></header>{checking ? <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[#B99137]/25 bg-white"><Loader2 className="animate-spin text-[#B99137]" /></div> : !selected ? <section className="rounded-2xl border border-[#B99137]/25 bg-white p-8 text-center"><h2 className="font-serif text-3xl text-[#171717]">Inicia sesión en Supabase</h2><p className="mx-auto mt-3 max-w-md text-sm text-[#6e665d]">El editor visual usa la cuenta administradora de Supabase para guardar cambios. Entra desde el panel principal y vuelve a este editor.</p><Button className="mt-5 bg-[#171717]" onClick={() => setLocation("/admin")}>Ir al acceso administrativo</Button></section> : <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_330px]"><aside className="rounded-2xl border border-[#B99137]/25 bg-white p-4"><p className="px-2 pb-3 text-xs font-bold uppercase tracking-[.14em] text-[#8B6A24]">Secciones</p><div className="space-y-2">{sections.map((section) => <button key={section.id} onClick={() => setSelectedId(section.id)} className={`w-full rounded-xl border p-3 text-left transition ${section.id === selectedId ? "border-[#171717] bg-[#F5EFE3]" : "border-[#F5EFE3] bg-white hover:border-[#B99137]/50"}`}><strong className="block text-sm text-[#171717]">{section.internal_name}</strong><small className="mt-1 block text-xs text-[#806f60]">{section.section_key}</small></button>)}</div></aside><section className="overflow-hidden rounded-2xl border border-[#B99137]/25 bg-[#FAF8F3]"><div className="flex items-center justify-between border-b border-[#B99137]/20 bg-white px-5 py-3"><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#8B6A24]"><Eye size={15} />Vista previa</span><span className="text-xs text-[#766b61]">Slot activo: {selected.section_key}</span></div><div className="p-5"><article className="relative min-h-[460px] overflow-hidden rounded-[22px] bg-[#171717] p-8 text-white"><div className="relative z-10 max-w-md"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#F4D98A]">{selected.subtitle || "MDFantasy"}</p><h2 className="mt-4 font-serif text-5xl leading-[.95]">{selected.title || "Título de sección"}</h2><p className="mt-5 text-sm leading-6 text-white/75">{selected.description || "Escribe una descripción para esta sección."}</p>{selected.cta_label && <span className="mt-7 inline-block rounded-full bg-[#F4D98A] px-5 py-3 text-xs font-bold text-[#171717]">{selected.cta_label}</span>}</div>{selected.image_url && <img src={selected.image_url} alt="Vista previa del bloque" className="absolute bottom-0 right-0 h-[72%] w-[55%] object-cover opacity-65" />}<div className="absolute inset-0 bg-gradient-to-r from-[#171717] via-[#171717]/75 to-transparent" /></article></div></section><section className="h-fit rounded-2xl border border-[#B99137]/25 bg-white p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8B6A24]">Propiedades</p><h2 className="mt-2 font-serif text-2xl text-[#171717]">{selected.internal_name}</h2><div className="mt-5 space-y-4"><div className="space-y-2"><Label>Título</Label><Input value={selected.title ?? ""} onChange={(event) => edit("title", event.target.value)} /></div><div className="space-y-2"><Label>Antetítulo</Label><Input value={selected.subtitle ?? ""} onChange={(event) => edit("subtitle", event.target.value)} /></div><div className="space-y-2"><Label>Descripción</Label><textarea value={selected.description ?? ""} onChange={(event) => edit("description", event.target.value)} className="min-h-24 w-full rounded-md border border-input bg-background p-3 text-sm" /></div><div className="space-y-2"><Label>Texto del botón</Label><Input value={selected.cta_label ?? ""} onChange={(event) => edit("cta_label", event.target.value)} /></div><div className="space-y-2"><Label>Imagen</Label><Input value={selected.image_url ?? ""} onChange={(event) => edit("image_url", event.target.value)} placeholder="URL opcional; también puedes seleccionar un archivo abajo" /></div><div className="rounded-xl border border-dashed border-[#B99137]/45 bg-[#FAF8F3] p-3"><Label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-[#171717]"><UploadCloud size={16} className="text-[#B99137]" />{uploading ? "Subiendo imagen…" : "Seleccionar imagen desde mi dispositivo"}<input className="hidden" type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadImage(file); event.target.value = ""; }} /></Label><p className="mt-2 text-xs leading-5 text-[#746b62]">JPG, PNG, WEBP o SVG de hasta 10 MB. La vista previa se actualiza al cargarla; después guarda el bloque.</p></div><label className="flex items-center gap-2 text-sm text-[#171717]"><input type="checkbox" checked={selected.active} onChange={(event) => edit("active", event.target.checked)} />Mostrar esta sección</label></div><Button className="mt-6 w-full bg-[#171717] hover:bg-[#2b2b2b]" onClick={save} disabled={saving || uploading}>{saving ? <Loader2 className="mr-2 animate-spin" size={15} /> : <Save className="mr-2" size={15} />}Guardar cambios</Button></section></div>}</div></DashboardLayout>;
}
