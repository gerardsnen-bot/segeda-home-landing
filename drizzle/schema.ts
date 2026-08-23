import {
  boolean,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/** Identidad de Manus OAuth y roles internos de administración. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "super_admin", "admin", "editor"]).default("user").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const mediaLibrary = mysqlTable("media_library", {
  id: int("id").autoincrement().primaryKey(),
  storagePath: varchar("storagePath", { length: 1024 }).notNull().unique(),
  publicUrl: varchar("publicUrl", { length: 2048 }).notNull(),
  fileName: varchar("fileName", { length: 512 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull(),
  sizeBytes: int("sizeBytes"),
  width: int("width"),
  height: int("height"),
  altText: varchar("altText", { length: 512 }),
  usageCount: int("usageCount").default(0).notNull(),
  createdBy: int("createdBy").references(() => users.id, { onDelete: "set null" }),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("media_library_deleted_at_idx").on(table.deletedAt)]);

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  description: text("description"),
  imageMediaId: int("imageMediaId").references(() => mediaLibrary.id, { onDelete: "set null" }),
  imageUrl: varchar("imageUrl", { length: 2048 }),
  icon: varchar("icon", { length: 48 }),
  active: boolean("active").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  seoTitle: varchar("seoTitle", { length: 180 }),
  seoDescription: varchar("seoDescription", { length: 320 }),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("categories_public_order_idx").on(table.active, table.sortOrder), index("categories_deleted_at_idx").on(table.deletedAt)]);

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  sku: varchar("sku", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 260 }).notNull(),
  slug: varchar("slug", { length: 300 }).notNull().unique(),
  shortDescription: text("shortDescription"),
  description: text("description"),
  categoryId: int("categoryId").references(() => categories.id, { onDelete: "set null" }),
  audience: varchar("audience", { length: 40 }),
  themeGroup: varchar("themeGroup", { length: 100 }),
  estimatedDays: varchar("estimatedDays", { length: 80 }),
  status: mysqlEnum("status", ["draft", "active", "hidden", "archived"]).default("draft").notNull(),
  stock: int("stock"),
  featured: boolean("featured").default(false).notNull(),
  isNew: boolean("isNew").default(false).notNull(),
  isOffer: boolean("isOffer").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  seoTitle: varchar("seoTitle", { length: 180 }),
  seoDescription: varchar("seoDescription", { length: 320 }),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("products_catalog_idx").on(table.categoryId, table.status, table.sortOrder),
  index("products_featured_idx").on(table.featured, table.status),
  index("products_deleted_at_idx").on(table.deletedAt),
  index("products_name_idx").on(table.name),
]);

export const productVariants = mysqlTable("product_variants", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull().references(() => products.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 160 }).notNull(),
  skuSuffix: varchar("skuSuffix", { length: 80 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compareAtPrice", { precision: 10, scale: 2 }),
  salePrice: decimal("salePrice", { precision: 10, scale: 2 }),
  stock: int("stock"),
  active: boolean("active").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("product_variants_product_idx").on(table.productId, table.active, table.sortOrder)]);

export const productImages = mysqlTable("product_images", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull().references(() => products.id, { onDelete: "cascade" }),
  mediaId: int("mediaId").references(() => mediaLibrary.id, { onDelete: "set null" }),
  imageUrl: varchar("imageUrl", { length: 2048 }).notNull(),
  altText: varchar("altText", { length: 512 }),
  isPrimary: boolean("isPrimary").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("product_images_product_idx").on(table.productId, table.sortOrder)]);

export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const productTags = mysqlTable("product_tags", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull().references(() => products.id, { onDelete: "cascade" }),
  tagId: int("tagId").notNull().references(() => tags.id, { onDelete: "cascade" }),
}, (table) => [uniqueIndex("product_tags_unique").on(table.productId, table.tagId)]);

export const collections = mysqlTable("collections", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  description: text("description"),
  collectionType: varchar("collectionType", { length: 80 }).default("manual").notNull(),
  active: boolean("active").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const collectionProducts = mysqlTable("collection_products", {
  id: int("id").autoincrement().primaryKey(),
  collectionId: int("collectionId").notNull().references(() => collections.id, { onDelete: "cascade" }),
  productId: int("productId").notNull().references(() => products.id, { onDelete: "cascade" }),
  sortOrder: int("sortOrder").default(0).notNull(),
}, (table) => [uniqueIndex("collection_products_unique").on(table.collectionId, table.productId)]);

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").primaryKey(),
  businessName: varchar("businessName", { length: 160 }).notNull(),
  whatsappNumber: varchar("whatsappNumber", { length: 40 }).notNull(),
  defaultWhatsappMessage: text("defaultWhatsappMessage"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 40 }),
  address: text("address"),
  city: varchar("city", { length: 120 }),
  country: varchar("country", { length: 120 }),
  businessHours: text("businessHours"),
  logoMediaId: int("logoMediaId").references(() => mediaLibrary.id, { onDelete: "set null" }),
  faviconMediaId: int("faviconMediaId").references(() => mediaLibrary.id, { onDelete: "set null" }),
  socialLinks: json("socialLinks"),
  seoDefaults: json("seoDefaults"),
  analyticsSettings: json("analyticsSettings"),
  updatedBy: int("updatedBy").references(() => users.id, { onDelete: "set null" }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const heroSlides = mysqlTable("hero_slides", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  desktopImageUrl: varchar("desktopImageUrl", { length: 2048 }),
  mobileImageUrl: varchar("mobileImageUrl", { length: 2048 }),
  primaryCtaLabel: varchar("primaryCtaLabel", { length: 160 }),
  primaryCtaUrl: varchar("primaryCtaUrl", { length: 1024 }),
  secondaryCtaLabel: varchar("secondaryCtaLabel", { length: 160 }),
  secondaryCtaUrl: varchar("secondaryCtaUrl", { length: 1024 }),
  contentAlignment: mysqlEnum("contentAlignment", ["left", "center", "right"]).default("left").notNull(),
  active: boolean("active").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  startsAt: timestamp("startsAt"),
  endsAt: timestamp("endsAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const siteSections = mysqlTable("site_sections", {
  id: int("id").autoincrement().primaryKey(),
  sectionKey: varchar("sectionKey", { length: 120 }).notNull().unique(),
  internalName: varchar("internalName", { length: 160 }).notNull(),
  title: text("title"),
  subtitle: text("subtitle"),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 2048 }),
  ctaLabel: varchar("ctaLabel", { length: 160 }),
  ctaUrl: varchar("ctaUrl", { length: 1024 }),
  payload: json("payload"),
  active: boolean("active").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  updatedBy: int("updatedBy").references(() => users.id, { onDelete: "set null" }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const imports = mysqlTable("imports", {
  id: int("id").autoincrement().primaryKey(),
  sourceFileName: varchar("sourceFileName", { length: 512 }).notNull(),
  storagePath: varchar("storagePath", { length: 1024 }),
  mode: mysqlEnum("mode", ["create", "update", "upsert"]).notNull(),
  status: mysqlEnum("status", ["draft", "validating", "completed", "completed_with_errors", "failed"]).default("draft").notNull(),
  foundCount: int("foundCount").default(0).notNull(),
  createdCount: int("createdCount").default(0).notNull(),
  updatedCount: int("updatedCount").default(0).notNull(),
  errorCount: int("errorCount").default(0).notNull(),
  summary: json("summary"),
  createdBy: int("createdBy").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const importRows = mysqlTable("import_rows", {
  id: int("id").autoincrement().primaryKey(),
  importId: int("importId").notNull().references(() => imports.id, { onDelete: "cascade" }),
  rowNumber: int("rowNumber").notNull(),
  payload: json("payload").notNull(),
  status: mysqlEnum("status", ["valid", "warning", "error", "imported"]).notNull(),
  errors: json("errors"),
  productId: int("productId").references(() => products.id, { onDelete: "set null" }),
});

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  actorId: int("actorId").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 120 }).notNull(),
  entityType: varchar("entityType", { length: 120 }).notNull(),
  entityId: varchar("entityId", { length: 120 }),
  beforeState: json("beforeState"),
  afterState: json("afterState"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("audit_logs_entity_idx").on(table.entityType, table.entityId), index("audit_logs_actor_idx").on(table.actorId, table.createdAt)]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
