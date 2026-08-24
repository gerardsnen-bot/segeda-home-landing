import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProductSku, toCatalogSlug } from "@/lib/adminUtils";
import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { BarChart3, Box, CheckCircle2, CircleAlert, FileText, FolderTree, ImagePlus, LayoutPanelLeft, Loader2, LogIn, Plus, Save, Settings2, ShieldCheck, Tag, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

type Role = "user" | "editor" | "admin" | "super_admin";
type PanelSection = "overview" | "products" | "categories" | "content" | "settings";
type AdminProductImage = { id: string; image_url: string; is_primary: boolean; sort_order: number };
type AdminProduct = { id: string; name: string; sku: string; status: "draft" | "active" | "hidden" | "archived"; stock: number | null; featured: boolean; category_id: string | null; categories: { id: string; name: string; slug: string } | null; product_images: AdminProductImage[] | null };
type AdminCategory = { id: string; name: string; slug: string; active: boolean; sort_order: number };
type SiteSection = { id: string; section_key: string; internal_name: string; title: string | null; subtitle: string | null; description: string | null; image_url: string | null; cta_label: string | null; cta_url: string | null; active: boolean; sort_order: number };
type SiteSettings = { business_name: string; whatsapp_number: string; email: string | null; phone: string | null; city: string | null; country: string | null };

const isStaff = (role: Role | null) => role === "editor" || role === "admin" || role === "super_admin";
const sectionFromPath = (path: string): PanelSection => {
  if (path.endsWith("/productos")) return "products";
  if (path.endsWith("/categorias")) return "categories";
  if (path.endsWith("/contenido")) return "content";
  if (path.endsWith("/configuracion")) return "settings";
  return "overview";
};
const sectionPath = (section: PanelSection) => section === "overview" ? "/admin" : `/admin/${({ products: "productos", categories: "categorias", content: "contenido", settings: "configuracion" } as const)[section]}`;

function SupabaseAccess() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const result = mode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: "Administración MDFantasy" } } });
    setBusy(false);
    if (result.error) return toast.error(result.error.message);
    toast.success(mode === "login" ? "Sesión iniciada" : "Cuenta creada. Si tu cuenta exige confirmación, revisa tu correo.");
    window.location.reload();
  };

  return <div className="mx-auto flex min-h-[75vh] max-w-md items-center px-4"><section className="w-full rounded-[28px] border border-[#B99137]/30 bg-white p-8 shadow-[0_18px_50px_rgba(0,0,0,.08)]"><span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#B99137] text-[#B99137]"><ShieldCheck size={20} /></span><p className="mt-4 text-xs font-bold uppercase tracking-[.18em] text-[#8B6A24]">MDFantasy Studio</p><h1 className="mt-2 font-serif text-4xl text-[#171717]">Acceso administrativo</h1><p className="mt-3 text-sm leading-6 text-[#6e665d]">Inicia sesión con la cuenta de Supabase que gestionará el catálogo y contenido de MDFantasy.</p><form onSubmit={submit} className="mt-7 space-y-4"><div className="space-y-2"><Label htmlFor="admin-email">Correo</Label><Input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="admin-password">Contraseña</Label><Input id="admin-password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /></div><Button className="w-full bg-[#171717] hover:bg-[#2b2b2b]" disabled={busy}>{busy ? <Loader2 className="mr-2 animate-spin" size={16} /> : <LogIn className="mr-2" size={16} />}{mode === "login" ? "Entrar al panel" : "Crear cuenta"}</Button></form><button className="mt-5 w-full text-center text-xs font-semibold text-[#8B6A24] underline" onClick={() => setMode((current) => current === "login" ? "signup" : "login")}>{mode === "login" ? "Crear la primera cuenta administrativa" : "Ya tengo una cuenta"}</button></section></div>;
}

function AdminContent() {
  const [location, setLocation] = useLocation();
  const [role, setRole] = useState<Role | null>(null);
  const [sessionEmail, setSessionEmail] = useState("");
  const [checking, setChecking] = useState(true);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [siteSections, setSiteSections] = useState<SiteSection[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [productForm, setProductForm] = useState({ name: "", price: "", categoryId: "" });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const section = sectionFromPath(location);

  const loadData = async () => {
    if (!supabase) return;
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData.user?.id;
    setSessionEmail(authData.user?.email ?? "");
    if (!currentUserId) { setRole("user"); setChecking(false); return; }
    const [{ data: profile }, { data: productRows }, { data: categoryRows }, { data: sectionRows }, { data: settingRow }] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", currentUserId).maybeSingle(),
      supabase.from("products").select("id,name,sku,status,stock,featured,category_id,categories(id,name,slug),product_images(id,image_url,is_primary,sort_order)").is("deleted_at", null).order("created_at", { ascending: false }).limit(1000),
      supabase.from("categories").select("id,name,slug,active,sort_order").is("deleted_at", null).order("sort_order", { ascending: true }),
      supabase.from("site_sections").select("id,section_key,internal_name,title,subtitle,description,image_url,cta_label,cta_url,active,sort_order").order("sort_order", { ascending: true }),
      supabase.from("site_settings").select("business_name,whatsapp_number,email,phone,city,country").eq("singleton", true).maybeSingle(),
    ]);
    setRole((profile?.role as Role | undefined) ?? "user");
    setProducts((productRows as unknown as AdminProduct[] | null) ?? []);
    setCategories((categoryRows as AdminCategory[] | null) ?? []);
    setExpandedCategoryId((current) => current || categoryRows?.[0]?.id || null);
    const nextSections = (sectionRows as SiteSection[] | null) ?? [];
    setSiteSections(nextSections);
    setSelectedSectionId((current) => current || nextSections[0]?.id || "");
    setSettings((settingRow as SiteSettings | null) ?? null);
    setChecking(false);
  };

  useEffect(() => { loadData().catch(() => setChecking(false)); }, []);

  const createProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !productForm.name || !productForm.price || !productForm.categoryId) return;
    setBusy(true);
    const sku = createProductSku(productForm.name);
    const slug = `${toCatalogSlug(productForm.name)}-${sku.slice(-6).toLowerCase()}`;
    const { data: product, error } = await supabase.from("products").insert({ sku, slug, name: productForm.name, category_id: productForm.categoryId, status: "draft", stock: null }).select("id").single();
    if (!error && product) {
      const variant = await supabase.from("product_variants").insert({ product_id: product.id, label: "Medida por coordinar", price: Number(productForm.price), sort_order: 0 });
      if (variant.error) toast.error(variant.error.message);
    }
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Producto creado como borrador.");
    setProductForm({ name: "", price: "", categoryId: "" });
    await loadData();
  };

  const updateProductStatus = async (product: AdminProduct, status: AdminProduct["status"]) => {
    if (!supabase) return;
    const { error } = await supabase.from("products").update({ status }).eq("id", product.id);
    if (error) return toast.error(error.message);
    toast.success(`Estado actualizado: ${status}.`);
    await loadData();
  };

  const uploadProductImage = async (product: AdminProduct, file: File) => {
    if (!supabase) return;
    setUploadingProductId(product.id);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `productos/${product.id}/${Date.now()}-${safeName}`;
    const { error: storageError } = await supabase.storage.from("mdfantasy-media").upload(path, file, { contentType: file.type, upsert: false });
    if (storageError) { setUploadingProductId(null); return toast.error(storageError.message); }
    const { data: urlData } = supabase.storage.from("mdfantasy-media").getPublicUrl(path);
    const { data: media, error: mediaError } = await supabase.from("media_library").insert({ storage_path: path, public_url: urlData.publicUrl, file_name: file.name, mime_type: file.type, size_bytes: file.size }).select("id").single();
    if (mediaError || !media) { setUploadingProductId(null); return toast.error(mediaError?.message ?? "No se pudo registrar la imagen."); }
    const primaryImage = (product.product_images ?? []).find((image) => image.is_primary) ?? product.product_images?.[0];
    const imagePayload = { image_url: urlData.publicUrl, media_id: media.id, alt_text: product.name, is_primary: true, sort_order: 0 };
    const { error: relationError } = primaryImage
      ? await supabase.from("product_images").update(imagePayload).eq("id", primaryImage.id)
      : await supabase.from("product_images").insert({ ...imagePayload, product_id: product.id });
    setUploadingProductId(null);
    if (relationError) return toast.error(relationError.message);
    toast.success(primaryImage ? "Imagen principal reemplazada." : "Imagen principal agregada.");
    await loadData();
  };

  const removeProductImage = async (product: AdminProduct) => {
    if (!supabase) return;
    const primaryImage = (product.product_images ?? []).find((image) => image.is_primary) ?? product.product_images?.[0];
    if (!primaryImage) return;
    const { error } = await supabase.from("product_images").delete().eq("id", primaryImage.id);
    if (error) return toast.error(error.message);
    toast.success("Imagen retirada del producto.");
    await loadData();
  };

  const toggleCategory = async (category: AdminCategory) => {
    if (!supabase) return;
    const { error } = await supabase.from("categories").update({ active: !category.active }).eq("id", category.id);
    if (error) return toast.error(error.message);
    toast.success(category.active ? "Categoría ocultada." : "Categoría activada.");
    await loadData();
  };

  const selectedContent = siteSections.find((item) => item.id === selectedSectionId) ?? null;
  const updateSelectedContent = (field: keyof SiteSection, value: string | boolean) => setSiteSections((current) => current.map((item) => item.id === selectedSectionId ? { ...item, [field]: value } : item));
  const saveSelectedContent = async () => {
    if (!supabase || !selectedContent) return;
    setBusy(true);
    const { error } = await supabase.from("site_sections").update({ title: selectedContent.title, subtitle: selectedContent.subtitle, description: selectedContent.description, image_url: selectedContent.image_url, cta_label: selectedContent.cta_label, cta_url: selectedContent.cta_url, active: selectedContent.active }).eq("id", selectedContent.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Bloque de contenido guardado.");
    await loadData();
  };

  const saveSettings = async () => {
    if (!supabase || !settings) return;
    setBusy(true);
    const { error } = await supabase.from("site_settings").update(settings).eq("singleton", true);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Configuración comercial guardada.");
  };

  const uploadMedia = async (file: File) => {
    if (!supabase) return;
    setUploading(true);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `catalogo/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from("mdfantasy-media").upload(path, file, { contentType: file.type, upsert: false });
    if (error) { setUploading(false); return toast.error(error.message); }
    const { data: urlData } = supabase.storage.from("mdfantasy-media").getPublicUrl(path);
    const { error: metadataError } = await supabase.from("media_library").insert({ storage_path: path, public_url: urlData.publicUrl, file_name: file.name, mime_type: file.type, size_bytes: file.size });
    setUploading(false);
    if (metadataError) return toast.error(metadataError.message);
    if (selectedContent) updateSelectedContent("image_url", urlData.publicUrl);
    toast.success("Imagen subida. Guarda el bloque de contenido para usarla en la landing.");
  };

  const visibleProducts = useMemo(() => products.filter((product) => product.status === "active").length, [products]);
  const productsByCategory = useMemo(() => categories.map((category) => ({ ...category, products: products.filter((product) => product.category_id === category.id) })), [categories, products]);
  const dashboardTabs = [{ id: "overview", label: "Resumen", icon: BarChart3 }, { id: "products", label: "Productos", icon: Box }, { id: "categories", label: "Categorías", icon: FolderTree }, { id: "content", label: "Contenido", icon: LayoutPanelLeft }, { id: "settings", label: "Configuración", icon: Settings2 }];
  const overviewStats = [{ label: "Productos", value: products.length, icon: <Box className="text-[#B99137]" size={18} /> }, { label: "Publicados", value: visibleProducts, icon: <CheckCircle2 className="text-[#B99137]" size={18} /> }, { label: "Categorías", value: categories.length, icon: <FolderTree className="text-[#B99137]" size={18} /> }, { label: "Borradores", value: products.filter((product) => product.status === "draft").length, icon: <Tag className="text-[#B99137]" size={18} /> }];

  if (checking) return <DashboardLayout><div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-[#B99137]" /></div></DashboardLayout>;
  if (!isStaff(role)) return <DashboardLayout><section className="mx-auto max-w-2xl rounded-[28px] border border-[#B99137]/30 bg-white p-8 shadow-sm"><CircleAlert className="text-[#B99137]" size={28} /><p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-[#8B6A24]">Permiso administrativo</p><h1 className="mt-2 font-serif text-4xl text-[#171717]">Acceso pendiente de autorización</h1><p className="mt-4 max-w-xl text-sm leading-6 text-[#6e665d]">La administración inicial de MDFantasy ya fue activada. Solicita a una persona administradora que asigne tu rol antes de gestionar contenido o catálogo.</p>{sessionEmail && <p className="mt-4 rounded-xl bg-[#F5EFE3] px-4 py-3 text-xs text-[#6e665d]">Sesión Supabase detectada: <b>{sessionEmail}</b></p>}</section></DashboardLayout>;

  return <DashboardLayout><div className="mx-auto max-w-7xl space-y-7"><header className="flex flex-col justify-between gap-5 rounded-[28px] bg-[#171717] px-7 py-8 text-white sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#F4D98A]">MDFantasy Studio</p><h1 className="mt-2 font-serif text-4xl">Gestiona tu landing</h1><p className="mt-3 max-w-xl text-sm text-white/70">Los cambios de productos, categorías y contenido se guardan en Supabase y quedan listos para reflejarse en el catálogo público.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold"><CheckCircle2 size={14} className="text-[#F4D98A]" />Acceso {role}</span></header><nav className="flex flex-wrap gap-2">{dashboardTabs.map((tab) => <button key={tab.id} onClick={() => setLocation(sectionPath(tab.id as PanelSection))} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${section === tab.id ? "border-[#171717] bg-[#171717] text-white" : "border-[#B99137]/35 bg-white text-[#171717]"}`}><tab.icon size={14} />{tab.label}</button>)}</nav>{section === "overview" && <><section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{overviewStats.map((stat) => <article key={stat.label} className="rounded-2xl border border-[#B99137]/25 bg-white p-5">{stat.icon}<p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-[#8B6A24]">{stat.label}</p><strong className="mt-1 block font-serif text-4xl text-[#171717]">{stat.value}</strong></article>)}</section><section className="rounded-2xl border border-[#B99137]/25 bg-white p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8B6A24]">Siguiente acción</p><h2 className="mt-2 font-serif text-3xl text-[#171717]">Completa tus productos antes de publicarlos</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6e665d]">Crea borradores con una categoría y precio inicial. Después podrás completar imágenes, variantes y descripción desde esta misma administración.</p><Button className="mt-5 bg-[#171717] hover:bg-[#2b2b2b]" onClick={() => setLocation("/admin/productos")}><Plus className="mr-2" size={15} />Crear producto</Button></section></>}{section === "products" && <div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]"><form onSubmit={createProduct} className="h-fit rounded-2xl border border-[#B99137]/25 bg-white p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8B6A24]">Nuevo borrador</p><h2 className="mt-2 font-serif text-3xl text-[#171717]">Añadir producto</h2><div className="mt-5 space-y-4"><div className="space-y-2"><Label>Nombre</Label><Input value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} placeholder="Ej. Nube de safari" required /></div><div className="space-y-2"><Label>Precio inicial (S/)</Label><Input type="number" min="0" step="0.01" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} required /></div><div className="space-y-2"><Label>Categoría</Label><select value={productForm.categoryId} onChange={(event) => setProductForm({ ...productForm, categoryId: event.target.value })} required className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Selecciona una categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><Button className="w-full bg-[#171717] hover:bg-[#2b2b2b]" disabled={busy}>{busy ? <Loader2 className="mr-2 animate-spin" size={15} /> : <Plus className="mr-2" size={15} />}Guardar borrador</Button></div></form><section className="rounded-2xl border border-[#B99137]/25 bg-white p-6"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8B6A24]">Catálogo</p><h2 className="mt-2 font-serif text-3xl text-[#171717]">Productos recientes</h2></div><span className="text-xs text-[#6e665d]">{products.length} visibles en este panel</span></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b text-xs uppercase tracking-[.11em] text-[#8B6A24]"><tr><th className="pb-3 font-bold">Producto</th><th className="pb-3 font-bold">Categoría</th><th className="pb-3 font-bold">Estado</th><th className="pb-3 font-bold text-right">Acción</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-b border-[#F5EFE3]"><td className="py-4"><strong className="block text-[#171717]">{product.name}</strong><small className="text-[#8a8177]">{product.sku}</small></td><td className="py-4 text-[#6e665d]">{product.categories?.name ?? "Sin categoría"}</td><td className="py-4"><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${product.status === "active" ? "bg-[#edf6ec] text-[#3f7846]" : "bg-[#F5EFE3] text-[#8B6A24]"}`}>{product.status}</span></td><td className="py-4 text-right"><Button variant="outline" size="sm" onClick={() => updateProductStatus(product, product.status === "active" ? "draft" : "active")}>{product.status === "active" ? "Pasar a borrador" : "Publicar"}</Button></td></tr>)}</tbody></table></div></section></div>}{section === "categories" && <section className="rounded-2xl border border-[#B99137]/25 bg-white p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8B6A24]">Estructura pública</p><h2 className="mt-2 font-serif text-3xl text-[#171717]">Categorías activas</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{categories.map((category) => <article key={category.id} className="flex items-center justify-between rounded-xl border border-[#F5EFE3] p-4"><div><strong className="text-[#171717]">{category.name}</strong><p className="mt-1 text-xs text-[#7f756b]">/{category.slug}</p></div><Button variant="outline" size="sm" onClick={() => toggleCategory(category)}>{category.active ? "Ocultar" : "Activar"}</Button></article>)}</div></section>}{section === "content" && <div className="grid gap-6 xl:grid-cols-[.72fr_1.28fr]"><section className="rounded-2xl border border-[#B99137]/25 bg-white p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8B6A24]">Bloques editables</p><div className="mt-4 space-y-2">{siteSections.map((item) => <button key={item.id} onClick={() => setSelectedSectionId(item.id)} className={`w-full rounded-xl border p-3 text-left ${item.id === selectedSectionId ? "border-[#171717] bg-[#F5EFE3]" : "border-[#F5EFE3] bg-white"}`}><strong className="block text-sm text-[#171717]">{item.internal_name}</strong><small className="text-xs text-[#7f756b]">{item.section_key}</small></button>)}</div></section>{selectedContent && <section className="rounded-2xl border border-[#B99137]/25 bg-white p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8B6A24]">Editor de contenido</p><h2 className="mt-2 font-serif text-3xl text-[#171717]">{selectedContent.internal_name}</h2></div><label className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-[#8B6A24]"><input type="checkbox" checked={selectedContent.active} onChange={(event) => updateSelectedContent("active", event.target.checked)} />Activo</label></div><div className="mt-5 grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Título</Label><Input value={selectedContent.title ?? ""} onChange={(event) => updateSelectedContent("title", event.target.value)} /></div><div className="space-y-2"><Label>Subtítulo</Label><Input value={selectedContent.subtitle ?? ""} onChange={(event) => updateSelectedContent("subtitle", event.target.value)} /></div><div className="space-y-2 md:col-span-2"><Label>Descripción</Label><textarea value={selectedContent.description ?? ""} onChange={(event) => updateSelectedContent("description", event.target.value)} className="min-h-24 w-full rounded-md border border-input bg-background p-3 text-sm" /></div><div className="space-y-2"><Label>Texto CTA</Label><Input value={selectedContent.cta_label ?? ""} onChange={(event) => updateSelectedContent("cta_label", event.target.value)} /></div><div className="space-y-2"><Label>URL CTA</Label><Input value={selectedContent.cta_url ?? ""} onChange={(event) => updateSelectedContent("cta_url", event.target.value)} /></div><div className="space-y-2 md:col-span-2"><Label>Imagen</Label><Input value={selectedContent.image_url ?? ""} onChange={(event) => updateSelectedContent("image_url", event.target.value)} placeholder="URL de imagen o súbela desde abajo" /></div></div><div className="mt-5 rounded-xl border border-dashed border-[#B99137]/45 bg-[#FAF8F3] p-4"><Label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-[#171717]"><UploadCloud size={16} className="text-[#B99137]" />{uploading ? "Subiendo imagen…" : "Subir imagen a la biblioteca"}<input className="hidden" type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadMedia(file); }} /></Label><p className="mt-2 text-xs text-[#746b62]">JPG, PNG, WEBP o SVG de hasta 10 MB. La URL se colocará en este bloque automáticamente.</p></div><Button className="mt-5 bg-[#171717] hover:bg-[#2b2b2b]" disabled={busy} onClick={saveSelectedContent}>{busy ? <Loader2 className="mr-2 animate-spin" size={15} /> : <Save className="mr-2" size={15} />}Guardar bloque</Button></section>}</div>}{section === "settings" && settings && <section className="max-w-3xl rounded-2xl border border-[#B99137]/25 bg-white p-6"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#8B6A24]">Configuración comercial</p><h2 className="mt-2 font-serif text-3xl text-[#171717]">Datos de contacto</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Nombre comercial</Label><Input value={settings.business_name} onChange={(event) => setSettings({ ...settings, business_name: event.target.value })} /></div><div className="space-y-2"><Label>WhatsApp</Label><Input value={settings.whatsapp_number} onChange={(event) => setSettings({ ...settings, whatsapp_number: event.target.value })} /></div><div className="space-y-2"><Label>Correo</Label><Input value={settings.email ?? ""} onChange={(event) => setSettings({ ...settings, email: event.target.value || null })} /></div><div className="space-y-2"><Label>Teléfono</Label><Input value={settings.phone ?? ""} onChange={(event) => setSettings({ ...settings, phone: event.target.value || null })} /></div><div className="space-y-2"><Label>Ciudad</Label><Input value={settings.city ?? ""} onChange={(event) => setSettings({ ...settings, city: event.target.value || null })} /></div><div className="space-y-2"><Label>País</Label><Input value={settings.country ?? ""} onChange={(event) => setSettings({ ...settings, country: event.target.value || null })} /></div></div><Button className="mt-5 bg-[#171717] hover:bg-[#2b2b2b]" disabled={busy} onClick={saveSettings}><Save className="mr-2" size={15} />Guardar configuración</Button></section>}</div></DashboardLayout>;
}

export default function AdminDashboard() {
  const [sessionReady, setSessionReady] = useState<boolean | null>(null);
  useEffect(() => {
    if (!supabase) return setSessionReady(false);
    supabase.auth.getSession().then(({ data }) => setSessionReady(Boolean(data.session)));
  }, []);
  if (sessionReady === null) return <div className="flex min-h-screen items-center justify-center bg-[#FAF8F3]"><Loader2 className="animate-spin text-[#B99137]" /></div>;
  return sessionReady ? <AdminContent /> : <SupabaseAccess />;
}
