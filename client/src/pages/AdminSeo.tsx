import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, SearchCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SeoValues = { title: string; description: string; keywords: string; image: string };
const empty: SeoValues = { title: "MDFantasy | Diseño personalizado en MDF", description: "Detalles personalizados en MDF para habitaciones, hogares y momentos especiales.", keywords: "MDF, decoración infantil, letreros personalizados, Perú", image: "" };

export default function AdminSeo() {
  const [values, setValues] = useState<SeoValues>(empty);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;
    supabase.from("site_settings").select("seo_defaults").eq("singleton", true).maybeSingle().then(({ data }) => {
      const seo = (data?.seo_defaults as Partial<SeoValues> | null) ?? {};
      setValues({ ...empty, ...seo }); setLoading(false);
    });
  }, []);

  const save = async () => {
    if (!supabase) return;
    setSaving(true);
    const { error } = await supabase.from("site_settings").update({ seo_defaults: values }).eq("singleton", true);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Configuración SEO guardada.");
  };

  return <DashboardLayout><div className="mx-auto max-w-4xl space-y-6"><header className="rounded-[28px] bg-[#171717] px-7 py-8 text-white"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#F4D98A]">MDFantasy Studio</p><h1 className="mt-2 flex items-center gap-3 font-serif text-4xl"><SearchCheck className="text-[#F4D98A]" />SEO y enlaces sociales</h1><p className="mt-3 max-w-2xl text-sm text-white/70">Define cómo aparece la landing en buscadores, WhatsApp y redes sociales.</p></header>{loading ? <div className="flex min-h-48 items-center justify-center rounded-2xl border border-[#B99137]/25 bg-white"><Loader2 className="animate-spin text-[#B99137]" /></div> : <section className="rounded-2xl border border-[#B99137]/25 bg-white p-6"><div className="grid gap-5"><div className="space-y-2"><Label>Título SEO</Label><Input value={values.title} maxLength={70} onChange={(event) => setValues({ ...values, title: event.target.value })} /><p className="text-xs text-[#766b61]">{values.title.length}/70 caracteres recomendados.</p></div><div className="space-y-2"><Label>Descripción SEO</Label><textarea value={values.description} maxLength={170} onChange={(event) => setValues({ ...values, description: event.target.value })} className="min-h-28 w-full rounded-md border border-input bg-background p-3 text-sm" /><p className="text-xs text-[#766b61]">{values.description.length}/170 caracteres recomendados.</p></div><div className="space-y-2"><Label>Palabras clave</Label><Input value={values.keywords} onChange={(event) => setValues({ ...values, keywords: event.target.value })} placeholder="Separadas por comas" /></div><div className="space-y-2"><Label>URL de imagen para compartir</Label><Input value={values.image} onChange={(event) => setValues({ ...values, image: event.target.value })} placeholder="https://…" /></div></div><Button className="mt-6 bg-[#171717] hover:bg-[#2b2b2b]" onClick={save} disabled={saving}>{saving ? <Loader2 className="mr-2 animate-spin" size={15} /> : <Save className="mr-2" size={15} />}Guardar SEO</Button></section>}</div></DashboardLayout>;
}
