import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, SearchCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

type SeoValues = { title: string; description: string; keywords: string; image: string };
type Role = "user" | "editor" | "admin" | "super_admin";
const empty: SeoValues = { title: "MDFantasy | Diseño personalizado en MDF", description: "Detalles personalizados en MDF para habitaciones, hogares y momentos especiales.", keywords: "MDF, decoración infantil, letreros personalizados, Perú", image: "" };

export default function AdminSeo() {
  const [, setLocation] = useLocation();
  const [values, setValues] = useState<SeoValues>(empty);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!supabase) { setChecking(false); setLoading(false); return; }
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) { setChecking(false); setLoading(false); return; }
      const { data: profile } = await supabase.from("profiles").select("role,active").eq("id", userId).maybeSingle();
      const role = profile?.role as Role | undefined;
      const canManageSeo = Boolean(profile?.active && (role === "admin" || role === "super_admin"));
      setAuthorized(canManageSeo);
      if (!canManageSeo) { setChecking(false); setLoading(false); return; }
      const { data } = await supabase.from("site_settings").select("seo_defaults").eq("singleton", true).maybeSingle();
      const seo = (data?.seo_defaults as Partial<SeoValues> | null) ?? {};
      setValues({ ...empty, ...seo }); setLoading(false); setChecking(false);
    };
    load().catch(() => { setLoading(false); setChecking(false); });
  }, []);

  const save = async () => {
    if (!supabase) return;
    setSaving(true);
    const { error } = await supabase.from("site_settings").update({ seo_defaults: values }).eq("singleton", true);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Configuración SEO guardada.");
  };

  return <DashboardLayout><div className="mx-auto max-w-4xl space-y-6"><header className="rounded-[28px] bg-[#171717] px-7 py-8 text-white"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#F4D98A]">MDFantasy Studio</p><h1 className="mt-2 flex items-center gap-3 font-serif text-4xl"><SearchCheck className="text-[#F4D98A]" />SEO y enlaces sociales</h1><p className="mt-3 max-w-2xl text-sm text-white/70">Define cómo aparece la landing en buscadores, WhatsApp y redes sociales.</p></header>{checking || loading ? <div className="flex min-h-48 items-center justify-center rounded-2xl border border-[#B99137]/25 bg-white"><Loader2 className="animate-spin text-[#B99137]" /></div> : !authorized ? <section className="rounded-2xl border border-[#B99137]/25 bg-white p-8 text-center"><h2 className="font-serif text-3xl text-[#171717]">Acceso administrativo requerido</h2><p className="mx-auto mt-3 max-w-md text-sm text-[#6e665d]">Inicia sesión con una cuenta administradora para editar la configuración SEO.</p><Button className="mt-5 bg-[#171717]" onClick={() => setLocation("/admin")}>Ir al acceso administrativo</Button></section> : <section className="rounded-2xl border border-[#B99137]/25 bg-white p-6"><div className="grid gap-5"><div className="space-y-2"><Label>Título SEO</Label><Input value={values.title} maxLength={70} onChange={(event) => setValues({ ...values, title: event.target.value })} /><p className="text-xs text-[#766b61]">{values.title.length}/70 caracteres recomendados.</p></div><div className="space-y-2"><Label>Descripción SEO</Label><textarea value={values.description} maxLength={170} onChange={(event) => setValues({ ...values, description: event.target.value })} className="min-h-28 w-full rounded-md border border-input bg-background p-3 text-sm" /><p className="text-xs text-[#766b61]">{values.description.length}/170 caracteres recomendados.</p></div><div className="space-y-2"><Label>Palabras clave</Label><Input value={values.keywords} onChange={(event) => setValues({ ...values, keywords: event.target.value })} placeholder="Separadas por comas" /></div><div className="space-y-2"><Label>URL de imagen para compartir</Label><Input value={values.image} onChange={(event) => setValues({ ...values, image: event.target.value })} placeholder="https://…" /></div></div><Button className="mt-6 bg-[#171717] hover:bg-[#2b2b2b]" onClick={save} disabled={saving}>{saving ? <Loader2 className="mr-2 animate-spin" size={15} /> : <Save className="mr-2" size={15} />}Guardar SEO</Button></section>}</div></DashboardLayout>;
}
