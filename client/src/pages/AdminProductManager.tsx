import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProductSku, toCatalogSlug } from "@/lib/adminUtils";
import { supabase } from "@/lib/supabase";
import { ChevronDown, CircleAlert, ImagePlus, Loader2, Plus, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Role = "user" | "editor" | "admin" | "super_admin";
type Category = { id: string; name: string; slug: string; active: boolean; sort_order: number };
type ProductImage = { id: string; image_url: string; is_primary: boolean; sort_order: number };
type GenderTarget = "girl" | "boy" | "unisex";
type GenderChoice = "auto" | GenderTarget;
type Product = {
  id: string;
  category_id: string | null;
  theme_group: string | null;
  name: string;
  sku: string;
  status: "draft" | "active" | "hidden" | "archived";
  gender_target: GenderTarget;
  gender_source: "auto" | "manual";
  gender_review_status: "classified" | "pending_review" | "mix";
  gender_auto_target: GenderTarget | null;
  gender_auto_confidence: number | null;
  gender_auto_analysis: Record<string, unknown> | null;
  product_images: ProductImage[] | null;
};

const isStaff = (role: Role | null) => role === "editor" || role === "admin" || role === "super_admin";

export default function AdminProductManager() {
  const [checking, setChecking] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState({ name: "", price: "", categoryId: "" });

  const load = async () => {
    if (!supabase) return;
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) { setRole("user"); setChecking(false); return; }
    const [{ data: profile }, { data: categoryRows }, { data: productRows }] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", authData.user.id).maybeSingle(),
      supabase.from("categories").select("id,name,slug,active,sort_order").is("deleted_at", null).order("sort_order"),
      supabase.from("products").select("id,category_id,theme_group,name,sku,status,gender_target,gender_source,gender_review_status,gender_auto_target,gender_auto_confidence,gender_auto_analysis,product_images(id,image_url,is_primary,sort_order)").is("deleted_at", null).order("created_at", { ascending: false }).limit(1000),
    ]);
    setRole((profile?.role as Role | undefined) ?? "user");
    const nextCategories = (categoryRows as Category[] | null) ?? [];
    setCategories(nextCategories);
    setProducts((productRows as unknown as Product[] | null) ?? []);
    setExpandedId((current) => current || nextCategories[0]?.id || null);
    setChecking(false);
  };

  useEffect(() => { load().catch(() => setChecking(false)); }, []);

  useEffect(() => {
    if (typeof window === "undefined" || checking || !products.length) return;
    const targetId = window.location.hash.slice(1);
    if (!targetId.startsWith("placement-")) return;
    const productId = targetId.replace(/^placement-(?:category|section)-/, "");
    const targetProduct = products.find((product) => product.id === productId);
    if (targetProduct?.category_id && expandedId !== targetProduct.category_id) {
      setExpandedId(targetProduct.category_id);
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId);
      if (!target) return;
      target.scrollIntoView({ block: "center" });
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        target.focus({ preventScroll: true });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [checking, expandedId, products]);

  const grouped = useMemo(() => categories.map((category) => ({ ...category, products: products.filter((product) => product.category_id === category.id) })), [categories, products]);
  const sectionOptions = useMemo(() => Array.from(new Set(products.map((product) => product.theme_group?.trim()).filter((section): section is string => Boolean(section)))).sort((a, b) => a.localeCompare(b, "es")), [products]);

  const createProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !draft.name || !draft.price || !draft.categoryId) return;
    setBusy(true);
    const sku = createProductSku(draft.name);
    const slug = `${toCatalogSlug(draft.name)}-${sku.slice(-6).toLowerCase()}`;
    const { data: product, error } = await supabase.from("products").insert({ sku, slug, name: draft.name, category_id: draft.categoryId, status: "draft" }).select("id").single();
    if (!error && product) await supabase.from("product_variants").insert({ product_id: product.id, label: "Medida por coordinar", price: Number(draft.price), sort_order: 0 });
    setBusy(false);
    if (error) return toast.error(error.message);
    setDraft({ name: "", price: "", categoryId: "" });
    toast.success("Producto creado como borrador.");
    await load();
  };

  const updateStatus = async (product: Product) => {
    if (!supabase) return;
    const status = product.status === "active" ? "draft" : "active";
    const { error } = await supabase.from("products").update({ status }).eq("id", product.id);
    if (error) return toast.error(error.message);
    toast.success(status === "active" ? "Producto publicado." : "Producto movido a borrador.");
    await load();
  };

  const replaceImage = async (product: Product, file: File) => {
    if (!supabase) return;
    setUploadingId(product.id);
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const storagePath = `productos/${product.id}/${crypto.randomUUID()}-${cleanName}`;
    const { error: uploadError } = await supabase.storage.from("mdfantasy-media").upload(storagePath, file, { contentType: file.type, upsert: false });
    if (uploadError) { setUploadingId(null); return toast.error(uploadError.message); }
    const { data: publicUrl } = supabase.storage.from("mdfantasy-media").getPublicUrl(storagePath);
    const { data: media, error: mediaError } = await supabase.from("media_library").insert({ storage_path: storagePath, public_url: publicUrl.publicUrl, file_name: file.name, mime_type: file.type, size_bytes: file.size }).select("id").single();
    if (mediaError || !media) { setUploadingId(null); return toast.error(mediaError?.message ?? "No se pudo registrar el archivo."); }
    const currentImage = (product.product_images ?? []).find((image) => image.is_primary) ?? product.product_images?.[0];
    const payload = { image_url: publicUrl.publicUrl, media_id: media.id, alt_text: product.name, is_primary: true, sort_order: 0 };
    const { error: imageError } = currentImage
      ? await supabase.from("product_images").update(payload).eq("id", currentImage.id)
      : await supabase.from("product_images").insert({ ...payload, product_id: product.id });
    setUploadingId(null);
    if (imageError) return toast.error(imageError.message);
    toast.success(currentImage ? "Imagen principal reemplazada." : "Imagen principal agregada.");
    await load();
  };

  const removeImage = async (product: Product) => {
    if (!supabase) return;
    const currentImage = (product.product_images ?? []).find((image) => image.is_primary) ?? product.product_images?.[0];
    if (!currentImage) return;
    const { error } = await supabase.from("product_images").delete().eq("id", currentImage.id);
    if (error) return toast.error(error.message);
    toast.success("Imagen retirada del producto.");
    await load();
  };

  const archiveProduct = async (product: Product) => {
    if (!supabase || !window.confirm(`¿Archivar ${product.name}?`)) return;
    const { error } = await supabase.from("products").update({ deleted_at: new Date().toISOString(), status: "archived" }).eq("id", product.id);
    if (error) return toast.error(error.message);
    toast.success("Producto archivado.");
    await load();
  };

  const updateGender = async (product: Product, choice: GenderChoice) => {
    if (!supabase) return;
    if (choice === "auto" && !product.gender_auto_target) {
      toast.message(product.gender_review_status === "mix" ? "Este producto se publica en Mix hasta recibir una clasificación manual." : "Este producto sigue pendiente de revisión visual.");
      return;
    }
    const payload = choice === "auto"
      ? {
          gender_target: product.gender_auto_target,
          gender_confidence: product.gender_auto_confidence,
          gender_analysis: product.gender_auto_analysis ?? {},
          gender_source: "auto" as const,
          gender_review_status: "classified" as const,
        }
      : {
          gender_target: choice,
          gender_source: "manual" as const,
          gender_review_status: "classified" as const,
        };
    const { error } = await supabase.from("products").update(payload).eq("id", product.id);
    if (error) return toast.error(error.message);
    toast.success(choice === "auto" ? "Clasificación automática restaurada." : "Clasificación manual guardada.");
    await load();
  };

  const updatePlacement = async (product: Product, payload: { category_id?: string | null; theme_group?: string | null }) => {
    if (!supabase) return;
    const { error } = await supabase.from("products").update(payload).eq("id", product.id);
    if (error) return toast.error(error.message);
    toast.success("Ubicación del producto guardada.");
    await load();
  };

  if (checking) return <DashboardLayout><div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-[#B99137]" /></div></DashboardLayout>;
  if (!isStaff(role)) return <DashboardLayout><section className="mx-auto max-w-2xl rounded-[28px] border border-[#B99137]/30 bg-white p-8"><CircleAlert className="text-[#B99137]" size={28} /><h1 className="mt-4 font-serif text-4xl text-[#171717]">Acceso administrativo requerido</h1><p className="mt-3 text-sm leading-6 text-[#6e665d]">Inicia sesión con una cuenta administradora para organizar y editar el catálogo.</p></section></DashboardLayout>;

  return <DashboardLayout><main className="mx-auto max-w-7xl space-y-7"><header className="rounded-[28px] bg-[#171717] px-7 py-8 text-white"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#F4D98A]">MDFantasy Studio</p><h1 className="mt-2 font-serif text-4xl">Productos por categoría</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Abre una categoría para revisar sus productos. En cada tarjeta puedes subir, reemplazar o retirar la imagen principal sin perder el orden del catálogo.</p></header>
    <form onSubmit={createProduct} className="grid gap-3 rounded-2xl border border-[#B99137]/25 bg-white p-5 md:grid-cols-[1.4fr_.7fr_1fr_auto] md:items-end"><div className="space-y-2"><Label>Nuevo producto</Label><Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Nombre del producto" required /></div><div className="space-y-2"><Label>Precio inicial</Label><Input type="number" min="0" step="0.01" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} placeholder="S/" required /></div><div className="space-y-2"><Label>Categoría</Label><select value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" required><option value="">Selecciona una categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><Button className="bg-[#171717] hover:bg-[#2b2b2b]" disabled={busy}><Plus className="mr-2" size={15} />Crear</Button></form>
    <datalist id="section-options">{sectionOptions.map((section) => <option key={section} value={section} />)}</datalist><section className="space-y-3">{grouped.map((category) => <details key={category.id} open={expandedId === category.id} onToggle={(event) => setExpandedId((event.currentTarget as HTMLDetailsElement).open ? category.id : null)} className="overflow-hidden rounded-2xl border border-[#B99137]/25 bg-white"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:content-none"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8B6A24]">/{category.slug}</p><h2 className="mt-1 font-serif text-2xl text-[#171717]">{category.name}</h2></div><div className="flex items-center gap-3"><span className="rounded-full bg-[#F5EFE3] px-3 py-1 text-xs font-bold text-[#8B6A24]">{category.products.length} productos</span><ChevronDown className="text-[#B99137] transition-transform [[open]_&]:rotate-180" size={19} /></div></summary><div className="border-t border-[#F5EFE3] p-4"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{category.products.map((product) => { const image = (product.product_images ?? []).find((item) => item.is_primary) ?? product.product_images?.[0]; const currentChoice: GenderChoice = product.gender_source === "manual" ? product.gender_target : "auto"; const automaticLabel = product.gender_auto_target ? `Automático · ${product.gender_auto_target === "girl" ? "Niña" : product.gender_auto_target === "boy" ? "Niño" : "Unisex"}` : product.gender_review_status === "mix" ? "Automático · Mix" : "Automático · Pendiente"; const placementNote = product.gender_review_status === "mix" ? "Disponible en Mix; puedes asignar una categoría o sección cuando lo decidas." : product.gender_review_status === "pending_review" ? "Pendiente de análisis visual" : product.gender_source === "manual" ? "Override manual" : "Clasificación visual"; return <article key={product.id} className="overflow-hidden rounded-xl border border-[#F5EFE3] bg-[#FFFEFB]"><div className="relative aspect-[4/3] bg-[#F5EFE3]">{image ? <img src={image.image_url} alt={product.name} className="h-full w-full object-contain" /> : <div className="flex h-full flex-col items-center justify-center gap-2 text-[#8B6A24]"><ImagePlus size={24} /><span className="text-xs font-bold">Sin imagen</span></div>}<label className="absolute bottom-3 left-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#171717] px-3 py-2 text-xs font-bold text-white shadow-lg"><UploadCloud size={14} />{uploadingId === product.id ? "Subiendo…" : image ? "Reemplazar" : "Subir imagen"}<input className="hidden" type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" disabled={uploadingId === product.id} onChange={(event) => { const file = event.target.files?.[0]; if (file) replaceImage(product, file); }} /></label>{image && <Button type="button" size="sm" variant="secondary" className="absolute right-3 top-3 z-10 bg-white/95 text-[#9e3f3a] shadow-md hover:bg-white" onClick={() => removeImage(product)}><ImagePlus className="mr-1" size={13} />Quitar</Button>}</div><div className="p-4"><p className="text-[10px] font-bold uppercase tracking-[.12em] text-[#8B6A24]">{product.sku}</p><h3 className="mt-1 min-h-11 font-serif text-xl text-[#171717]">{product.name}</h3><div className="mt-3 grid gap-2 rounded-lg border border-[#B99137]/20 bg-[#FAF8F3] p-2"><div><Label htmlFor={`placement-category-${product.id}`} className="text-[10px] font-bold uppercase tracking-[.12em] text-[#8B6A24]">Categoría</Label><select id={`placement-category-${product.id}`} value={product.category_id ?? ""} onChange={(event) => updatePlacement(product, { category_id: event.target.value || null })} className="mt-1 h-9 w-full rounded-md border border-[#B99137]/30 bg-white px-2 text-xs text-[#171717]"><option value="">Sin categoría</option>{categories.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}</select></div><div><Label htmlFor={`placement-section-${product.id}`} className="text-[10px] font-bold uppercase tracking-[.12em] text-[#8B6A24]">Sección</Label><Input id={`placement-section-${product.id}`} list="section-options" defaultValue={product.theme_group ?? ""} placeholder="Ej. Nubes bebé" className="mt-1 h-9 text-xs" onBlur={(event) => { const nextSection = event.currentTarget.value.trim(); if (nextSection !== (product.theme_group ?? "")) updatePlacement(product, { theme_group: nextSection || null }); }} /></div></div><div className="mt-3 rounded-lg border border-[#B99137]/20 bg-[#FAF8F3] p-2"><Label htmlFor={`gender-${product.id}`} className="text-[10px] font-bold uppercase tracking-[.12em] text-[#8B6A24]">Público</Label><select id={`gender-${product.id}`} value={currentChoice} onChange={(event) => updateGender(product, event.target.value as GenderChoice)} className="mt-1 h-9 w-full rounded-md border border-[#B99137]/30 bg-white px-2 text-xs text-[#171717]"><option value="auto">{automaticLabel}</option><option value="girl">Niña</option><option value="boy">Niño</option><option value="unisex">Unisex</option></select><p className="mt-1 text-[10px] text-[#746b62]">{placementNote}</p></div><div className="mt-4 flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => updateStatus(product)}>{product.status === "active" ? "Pasar a borrador" : "Publicar"}</Button><Button variant="ghost" size="sm" className="text-red-700 hover:bg-red-50 hover:text-red-700" onClick={() => archiveProduct(product)}><Trash2 size={14} /></Button></div></div></article>; })}</div>{!category.products.length && <div className="rounded-xl border border-dashed border-[#B99137]/35 bg-[#FAF8F3] p-8 text-center text-sm text-[#746b62]">Esta categoría aún no tiene productos.</div>}</div></details>)}</section>
  </main></DashboardLayout>;
}
