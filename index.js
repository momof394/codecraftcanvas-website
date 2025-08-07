var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var projects, productTemplates, designElements, aiContent, storefrontTemplates, workflows, userProgress, brandKits, digitalAssets, designStudioTools, contentTemplates, marketplaceProducts, printOnDemandProducts, collaborationSessions, aiGenerationHistory, users, userSessions, assets, insertProjectSchema, insertProductTemplateSchema, insertDesignElementSchema, insertAiContentSchema, insertStorefrontTemplateSchema, insertWorkflowSchema, insertUserProgressSchema, insertBrandKitSchema, insertAssetSchema, insertUserSchema, insertUserSessionSchema, SUBSCRIPTION_LIMITS;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    projects = pgTable("projects", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      sellerType: text("seller_type").notNull(),
      // 'planner_creator', 'journal_seller', 'course_creator', 'artist_stickers', 'ebook_seller', 'kids_content_creator'
      templateId: varchar("template_id").references(() => productTemplates.id),
      data: jsonb("data").notNull(),
      // Canvas elements and layout
      settings: jsonb("settings").notNull(),
      // Export settings, branding, etc.
      storefront: jsonb("storefront"),
      // Storefront page data
      published: boolean("published").default(false),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    productTemplates = pgTable("product_templates", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      sellerType: text("seller_type").notNull(),
      // 'planner_creator', 'journal_seller', 'course_creator', 'artist_stickers', 'ebook_seller', 'kids_content_creator'
      subCategory: text("sub_category").notNull(),
      // 'daily', 'weekly', 'adhd', 'fitness', etc.
      preview: text("preview").notNull(),
      // Preview image URL
      data: jsonb("data").notNull(),
      // Template structure with logic blocks
      mockupImages: text("mockup_images").array(),
      // Promotional images
      description: text("description").notNull(),
      suggestedPrice: integer("suggested_price"),
      // In cents
      tags: text("tags").array(),
      // For filtering and search
      tier: text("tier").notNull().default("free"),
      // 'free', 'pro', 'agency'
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    designElements = pgTable("design_elements", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      category: text("category").notNull(),
      // 'stickers', 'widgets', 'icons', 'brushes', 'layouts'
      subCategory: text("sub_category"),
      // 'wellness', 'business', 'lifestyle', etc.
      type: text("type").notNull(),
      // 'svg', 'png', 'brush', 'widget'
      url: text("url").notNull(),
      metadata: jsonb("metadata"),
      // Size, colors, interactive properties
      tags: text("tags").array(),
      tier: text("tier").notNull().default("free"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    aiContent = pgTable("ai_content", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      contentType: text("content_type").notNull(),
      // 'product_description', 'product_title', 'hashtags', 'social_captions', 'email_templates', 'pricing_suggestions'
      sellerType: text("seller_type").notNull(),
      title: text("title").notNull(),
      content: text("content").notNull(),
      metadata: jsonb("metadata"),
      // Additional AI parameters
      tier: text("tier").notNull().default("free"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    storefrontTemplates = pgTable("storefront_templates", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      type: text("type").notNull(),
      // 'simple_sales', 'bundle_sales', 'freebie_funnel'
      preview: text("preview").notNull(),
      data: jsonb("data").notNull(),
      // Template structure
      features: text("features").array(),
      // 'pay_what_you_want', 'one_time', 'email_capture'
      tier: text("tier").notNull().default("free"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    workflows = pgTable("workflows", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      type: text("type").notNull(),
      // 'quick_launch', '7_day_launch', 'brain_dump', 'monetization_tracker'
      description: text("description").notNull(),
      steps: jsonb("steps").notNull(),
      // Array of workflow steps with instructions
      estimatedTime: integer("estimated_time"),
      // In minutes
      difficulty: text("difficulty").notNull(),
      // 'beginner', 'intermediate', 'advanced'
      tier: text("tier").notNull().default("free"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    userProgress = pgTable("user_progress", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id).notNull(),
      workflowId: varchar("workflow_id").references(() => workflows.id),
      projectId: varchar("project_id").references(() => projects.id),
      currentStep: integer("current_step").default(0),
      completedSteps: text("completed_steps").array(),
      status: text("status").notNull().default("in_progress"),
      // 'in_progress', 'completed', 'paused'
      updatedAt: timestamp("updated_at").defaultNow().notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    brandKits = pgTable("brand_kits", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id).notNull(),
      name: text("name").notNull(),
      colorPalette: text("color_palette").array(),
      // Hex color codes
      fonts: text("fonts").array(),
      logos: text("logos").array(),
      // URLs to logo files
      designElements: text("design_elements").array(),
      // IDs of saved design elements
      isDefault: boolean("is_default").default(false),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    digitalAssets = pgTable("digital_assets", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      category: text("category").notNull(),
      // 'icons', 'photos', 'illustrations', 'shapes', 'patterns', 'textures', 'fonts', 'audio'
      subCategory: text("sub_category"),
      // 'business', 'lifestyle', 'tech', 'nature', etc.
      type: text("type").notNull(),
      // 'svg', 'png', 'jpg', 'mp3', 'ttf', 'otf', 'lottie', 'gif'
      url: text("url").notNull(),
      thumbnailUrl: text("thumbnail_url"),
      license: text("license").notNull().default("commercial"),
      // 'commercial', 'personal', 'royalty_free'
      metadata: jsonb("metadata"),
      // Size, dimensions, duration, colors, keywords
      tags: text("tags").array(),
      downloadCount: integer("download_count").default(0),
      tier: text("tier").notNull().default("free"),
      // 'free', 'pro', 'premium'
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    designStudioTools = pgTable("design_studio_tools", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      category: text("category").notNull(),
      // 'brush', 'filter', 'effect', 'animation', 'ai_tool'
      type: text("type").notNull(),
      // 'vector_brush', 'raster_brush', 'ai_style_transfer', 'background_remover', etc.
      properties: jsonb("properties").notNull(),
      // Tool-specific properties and settings
      aiModelId: text("ai_model_id"),
      // For AI-powered tools
      tier: text("tier").notNull().default("free"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    contentTemplates = pgTable("content_templates", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: text("name").notNull(),
      category: text("category").notNull(),
      // 'business_card', 'social_media', 'presentation', 'ebook', 'course', 'marketing'
      industry: text("industry").notNull(),
      // 'health', 'business', 'education', 'lifestyle', 'tech', 'creative', etc.
      format: text("format").notNull(),
      // 'instagram_post', 'facebook_cover', 'business_card', 'pdf', 'epub', etc.
      dimensions: jsonb("dimensions"),
      // Width, height, pages, etc.
      templateData: jsonb("template_data").notNull(),
      // Complete template structure with layers
      previewImages: text("preview_images").array(),
      description: text("description").notNull(),
      tags: text("tags").array(),
      popularity: integer("popularity").default(0),
      tier: text("tier").notNull().default("free"),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    marketplaceProducts = pgTable("marketplace_products", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      creatorId: varchar("creator_id").references(() => users.id).notNull(),
      title: text("title").notNull(),
      description: text("description").notNull(),
      category: text("category").notNull(),
      price: decimal("price", { precision: 10, scale: 2 }).notNull(),
      currency: text("currency").notNull().default("USD"),
      previewImages: text("preview_images").array(),
      downloadFiles: text("download_files").array(),
      tags: text("tags").array(),
      rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
      reviewCount: integer("review_count").default(0),
      salesCount: integer("sales_count").default(0),
      isActive: boolean("is_active").default(true),
      featured: boolean("featured").default(false),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    printOnDemandProducts = pgTable("print_on_demand_products", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id).notNull(),
      provider: text("provider").notNull(),
      // 'printful', 'gooten', 'teespring', etc.
      productType: text("product_type").notNull(),
      // 't_shirt', 'mug', 'poster', 'sticker', etc.
      designFiles: text("design_files").array(),
      variants: jsonb("variants"),
      // Colors, sizes, materials
      pricing: jsonb("pricing"),
      providerProductId: text("provider_product_id"),
      status: text("status").notNull().default("draft"),
      // 'draft', 'published', 'synced'
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    collaborationSessions = pgTable("collaboration_sessions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      projectId: varchar("project_id").references(() => projects.id).notNull(),
      ownerId: varchar("owner_id").references(() => users.id).notNull(),
      collaborators: text("collaborators").array(),
      // User IDs
      permissions: jsonb("permissions"),
      // Edit, view, comment permissions per user
      isActive: boolean("is_active").default(true),
      lastActivity: timestamp("last_activity").defaultNow().notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    aiGenerationHistory = pgTable("ai_generation_history", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id).notNull(),
      generationType: text("generation_type").notNull(),
      // 'image', 'text', 'style_transfer', 'background_removal'
      prompt: text("prompt"),
      inputData: jsonb("input_data"),
      outputData: jsonb("output_data"),
      aiModel: text("ai_model"),
      processingTime: integer("processing_time"),
      // In milliseconds
      cost: decimal("cost", { precision: 8, scale: 4 }),
      // API cost in credits/dollars
      status: text("status").notNull(),
      // 'processing', 'completed', 'failed'
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    users = pgTable("users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      email: text("email").notNull().unique(),
      name: text("name").notNull(),
      sellerType: text("seller_type"),
      // Selected during onboarding
      subscriptionTier: text("subscription_tier").notNull().default("free"),
      // 'free', 'pro', 'agency'
      subscriptionStatus: text("subscription_status").notNull().default("active"),
      // 'active', 'cancelled', 'expired'
      exportsThisMonth: integer("exports_this_month").notNull().default(0),
      lastExportReset: timestamp("last_export_reset").defaultNow().notNull(),
      onboardingCompleted: boolean("onboarding_completed").default(false),
      defaultBrandKitId: varchar("default_brand_kit_id"),
      aiCredits: integer("ai_credits").default(100),
      // Monthly AI generation credits
      storageUsed: integer("storage_used").default(0),
      // In MB
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().notNull()
    });
    userSessions = pgTable("user_sessions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id).notNull(),
      sessionToken: text("session_token").notNull().unique(),
      expiresAt: timestamp("expires_at").notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    assets = pgTable("assets", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").references(() => users.id),
      projectId: varchar("project_id").references(() => projects.id),
      name: text("name").notNull(),
      type: text("type").notNull(),
      // 'text', 'image', 'audio', 'video', 'svg', 'brush'
      url: text("url").notNull(),
      metadata: jsonb("metadata"),
      // Size, duration, etc.
      isPublic: boolean("is_public").default(false),
      createdAt: timestamp("created_at").defaultNow().notNull()
    });
    insertProjectSchema = createInsertSchema(projects).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertProductTemplateSchema = createInsertSchema(productTemplates).omit({
      id: true,
      createdAt: true
    });
    insertDesignElementSchema = createInsertSchema(designElements).omit({
      id: true,
      createdAt: true
    });
    insertAiContentSchema = createInsertSchema(aiContent).omit({
      id: true,
      createdAt: true
    });
    insertStorefrontTemplateSchema = createInsertSchema(storefrontTemplates).omit({
      id: true,
      createdAt: true
    });
    insertWorkflowSchema = createInsertSchema(workflows).omit({
      id: true,
      createdAt: true
    });
    insertUserProgressSchema = createInsertSchema(userProgress).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertBrandKitSchema = createInsertSchema(brandKits).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertAssetSchema = createInsertSchema(assets).omit({
      id: true,
      createdAt: true
    });
    insertUserSchema = createInsertSchema(users).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertUserSessionSchema = createInsertSchema(userSessions).omit({
      id: true,
      createdAt: true
    });
    SUBSCRIPTION_LIMITS = {
      free: {
        exportsPerMonth: 10,
        templatesAccess: "all",
        whiteLabeling: false,
        teamLicenses: false,
        bulkExport: false,
        apiAccess: false,
        prioritySupport: false,
        aiGenerationsPerDay: 5,
        storefrontPages: 1,
        brandKits: 1
      },
      pro: {
        exportsPerMonth: -1,
        // unlimited
        templatesAccess: "all",
        whiteLabeling: false,
        teamLicenses: true,
        bulkExport: false,
        apiAccess: false,
        prioritySupport: true,
        aiGenerationsPerDay: 50,
        storefrontPages: 5,
        brandKits: 5
      },
      agency: {
        exportsPerMonth: -1,
        // unlimited
        templatesAccess: "all",
        whiteLabeling: true,
        teamLicenses: true,
        bulkExport: true,
        apiAccess: true,
        prioritySupport: true,
        aiGenerationsPerDay: -1,
        // unlimited
        storefrontPages: -1,
        // unlimited
        brandKits: -1
        // unlimited
      }
    };
  }
});

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    MemStorage = class {
      projects;
      assets;
      productTemplates;
      designElements;
      aiContent;
      storefrontTemplates;
      workflows;
      userProgress;
      brandKits;
      users;
      userSessions;
      constructor() {
        this.projects = /* @__PURE__ */ new Map();
        this.assets = /* @__PURE__ */ new Map();
        this.productTemplates = /* @__PURE__ */ new Map();
        this.designElements = /* @__PURE__ */ new Map();
        this.aiContent = /* @__PURE__ */ new Map();
        this.storefrontTemplates = /* @__PURE__ */ new Map();
        this.workflows = /* @__PURE__ */ new Map();
        this.userProgress = /* @__PURE__ */ new Map();
        this.brandKits = /* @__PURE__ */ new Map();
        this.users = /* @__PURE__ */ new Map();
        this.userSessions = /* @__PURE__ */ new Map();
        this.initializeCreatorCoreData();
        this.initializeDemoUser();
      }
      initializeCreatorCoreData() {
        this.initializeProductTemplates();
        this.initializeDesignElements();
        this.initializeAiContent();
        this.initializeStorefrontTemplates();
        this.initializeWorkflows();
      }
      initializeProductTemplates() {
        const templates = [
          // Planner Creator Templates
          {
            id: "template-planner-daily",
            name: "Daily Reset ADHD Planner",
            sellerType: "planner_creator",
            subCategory: "daily",
            preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=300&h=400&fit=crop",
            description: "ADHD-friendly daily planner with brain dump sections, priority focus, and dopamine tracking",
            suggestedPrice: 1200,
            tags: ["adhd", "daily", "focus", "productivity"],
            tier: "free",
            mockupImages: ["https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&w=500"],
            data: {
              pages: [
                {
                  id: "daily-page",
                  elements: [
                    { id: "title", type: "text", content: "Daily Focus", style: { fontSize: 24, fontWeight: "bold" }, position: { x: 50, y: 50 } },
                    { id: "brain-dump", type: "text", content: "Brain Dump Section", style: { fontSize: 16 }, position: { x: 50, y: 100 } },
                    { id: "priorities", type: "text", content: "Top 3 Priorities", style: { fontSize: 16 }, position: { x: 50, y: 150 } }
                  ]
                }
              ],
              widgets: [
                { type: "checkbox", properties: { label: "Task completed" } },
                { type: "mood_slider", properties: { min: 1, max: 10 } }
              ]
            },
            createdAt: /* @__PURE__ */ new Date()
          },
          // Journal Seller Templates
          {
            id: "template-journal-selfLove",
            name: "Mindful Glow: 30-Day Self Love Journal",
            sellerType: "journal_seller",
            subCategory: "self_love",
            preview: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&w=300&h=400&fit=crop",
            description: "30-day guided self-love journey with affirmations, reflection prompts, and gratitude practices",
            suggestedPrice: 1500,
            tags: ["self_love", "affirmations", "mindfulness", "30_day"],
            tier: "free",
            mockupImages: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&w=500"],
            data: {
              pages: [
                {
                  id: "journal-day",
                  elements: [
                    { id: "date", type: "text", content: "Day __", style: { fontSize: 20, fontWeight: "bold" }, position: { x: 50, y: 50 } },
                    { id: "affirmation", type: "text", content: "Today's Affirmation:", style: { fontSize: 16 }, position: { x: 50, y: 100 } },
                    { id: "gratitude", type: "text", content: "I am grateful for:", style: { fontSize: 16 }, position: { x: 50, y: 150 } }
                  ]
                }
              ]
            },
            createdAt: /* @__PURE__ */ new Date()
          },
          // Course Creator Templates
          {
            id: "template-course-slides",
            name: "Modern Course Slide Deck",
            sellerType: "course_creator",
            subCategory: "slide_decks",
            preview: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&w=300&h=400&fit=crop",
            description: "Professional slide deck template with interactive elements and modern design",
            suggestedPrice: 4900,
            tags: ["course", "slides", "education", "professional"],
            tier: "pro",
            mockupImages: ["https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&w=500"],
            data: {
              pages: [
                {
                  id: "title-slide",
                  elements: [
                    { id: "course-title", type: "text", content: "Course Title", style: { fontSize: 32, fontWeight: "bold", textAlign: "center" }, position: { x: 50, y: 100 } },
                    { id: "subtitle", type: "text", content: "Module 1: Introduction", style: { fontSize: 18 }, position: { x: 50, y: 150 } }
                  ]
                }
              ]
            },
            createdAt: /* @__PURE__ */ new Date()
          },
          // Artist (Stickers) Templates
          {
            id: "template-stickers-wellness",
            name: "Wellness Sticker Pack",
            sellerType: "artist_stickers",
            subCategory: "sticker_sheets",
            preview: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&w=300&h=400&fit=crop",
            description: "Printable wellness sticker sheet with cut lines and motivational quotes",
            suggestedPrice: 800,
            tags: ["stickers", "wellness", "printable", "motivational"],
            tier: "free",
            mockupImages: ["https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-4.0.3&w=500"],
            data: {
              pages: [
                {
                  id: "sticker-sheet",
                  elements: [
                    { id: "sticker-1", type: "svg", content: "<circle cx='50' cy='50' r='40' fill='#ff6b6b'/>", position: { x: 50, y: 50 } },
                    { id: "sticker-2", type: "svg", content: "<rect x='10' y='10' width='80' height='80' fill='#4ecdc4'/>", position: { x: 150, y: 50 } }
                  ]
                }
              ],
              cutLines: true,
              format: "svg"
            },
            createdAt: /* @__PURE__ */ new Date()
          },
          // eBook Seller Templates
          {
            id: "template-ebook-guide",
            name: "Complete Guide eBook Template",
            sellerType: "ebook_seller",
            subCategory: "ebook_layout",
            preview: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&w=300&h=400&fit=crop",
            description: "Professional eBook layout with table of contents, chapters, and modern typography",
            suggestedPrice: 2500,
            tags: ["ebook", "guide", "professional", "layout"],
            tier: "free",
            mockupImages: ["https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&w=500"],
            data: {
              pages: [
                {
                  id: "cover",
                  elements: [
                    { id: "book-title", type: "text", content: "Your eBook Title", style: { fontSize: 28, fontWeight: "bold", textAlign: "center" }, position: { x: 50, y: 100 } },
                    { id: "author", type: "text", content: "By Your Name", style: { fontSize: 16 }, position: { x: 50, y: 200 } }
                  ]
                },
                {
                  id: "toc",
                  elements: [
                    { id: "toc-title", type: "text", content: "Table of Contents", style: { fontSize: 24, fontWeight: "bold" }, position: { x: 50, y: 50 } }
                  ]
                }
              ]
            },
            createdAt: /* @__PURE__ */ new Date()
          },
          // Kids Content Creator Templates
          {
            id: "template-kids-coloring",
            name: "Animal Coloring Book Pages",
            sellerType: "kids_content_creator",
            subCategory: "coloring_books",
            preview: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&w=300&h=400&fit=crop",
            description: "Cute animal coloring pages with simple lines perfect for kids",
            suggestedPrice: 1e3,
            tags: ["kids", "coloring", "animals", "printable"],
            tier: "free",
            mockupImages: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&w=500"],
            data: {
              pages: [
                {
                  id: "coloring-page",
                  elements: [
                    { id: "animal-outline", type: "svg", content: "<path d='M50,50 Q100,25 150,50 Q100,75 50,50' stroke='black' fill='none'/>", position: { x: 100, y: 100 } }
                  ]
                }
              ]
            },
            createdAt: /* @__PURE__ */ new Date()
          }
        ];
        templates.forEach((template) => {
          this.productTemplates.set(template.id, template);
        });
      }
      initializeDesignElements() {
        const elements = [
          // Stickers
          { id: "sticker-heart", name: "Heart Sticker", category: "stickers", subCategory: "love", type: "svg", url: "/elements/heart.svg", metadata: { size: "24x24", colors: ["#ff6b6b"] }, tags: ["love", "heart"], tier: "free", createdAt: /* @__PURE__ */ new Date() },
          { id: "sticker-star", name: "Star Sticker", category: "stickers", subCategory: "motivation", type: "svg", url: "/elements/star.svg", metadata: { size: "24x24", colors: ["#ffd93d"] }, tags: ["star", "achievement"], tier: "free", createdAt: /* @__PURE__ */ new Date() },
          // Widgets
          { id: "widget-checkbox", name: "Interactive Checkbox", category: "widgets", subCategory: "productivity", type: "widget", url: "/widgets/checkbox.js", metadata: { interactive: true }, tags: ["checkbox", "task"], tier: "free", createdAt: /* @__PURE__ */ new Date() },
          { id: "widget-mood-slider", name: "Mood Slider", category: "widgets", subCategory: "wellness", type: "widget", url: "/widgets/mood-slider.js", metadata: { interactive: true, range: "1-10" }, tags: ["mood", "tracking"], tier: "pro", createdAt: /* @__PURE__ */ new Date() },
          // Icons
          { id: "icon-wellness", name: "Wellness Icon Set", category: "icons", subCategory: "wellness", type: "svg", url: "/icons/wellness-set.svg", metadata: { count: 50, style: "minimalist" }, tags: ["wellness", "health"], tier: "free", createdAt: /* @__PURE__ */ new Date() },
          { id: "icon-business", name: "Business Icon Set", category: "icons", subCategory: "business", type: "svg", url: "/icons/business-set.svg", metadata: { count: 75, style: "professional" }, tags: ["business", "professional"], tier: "pro", createdAt: /* @__PURE__ */ new Date() },
          // Brushes
          { id: "brush-watercolor", name: "Watercolor Brush Pack", category: "brushes", subCategory: "artistic", type: "brush", url: "/brushes/watercolor.brushpack", metadata: { count: 12, style: "watercolor" }, tags: ["watercolor", "artistic"], tier: "pro", createdAt: /* @__PURE__ */ new Date() },
          { id: "brush-calligraphy", name: "Calligraphy Brush Pack", category: "brushes", subCategory: "text", type: "brush", url: "/brushes/calligraphy.brushpack", metadata: { count: 8, style: "calligraphy" }, tags: ["calligraphy", "text"], tier: "agency", createdAt: /* @__PURE__ */ new Date() },
          // Layouts
          { id: "layout-planner-grid", name: "Planner Grid Layout", category: "layouts", subCategory: "planner", type: "svg", url: "/layouts/planner-grid.svg", metadata: { format: "A4", orientation: "portrait" }, tags: ["planner", "grid"], tier: "free", createdAt: /* @__PURE__ */ new Date() },
          { id: "layout-ebook-modern", name: "Modern eBook Layout", category: "layouts", subCategory: "ebook", type: "svg", url: "/layouts/ebook-modern.svg", metadata: { format: "6x9", chapters: true }, tags: ["ebook", "modern"], tier: "pro", createdAt: /* @__PURE__ */ new Date() }
        ];
        elements.forEach((element) => {
          this.designElements.set(element.id, element);
        });
      }
      initializeAiContent() {
        const content = [
          // Planner Creator Content
          { id: "ai-planner-desc", contentType: "product_description", sellerType: "planner_creator", title: "Daily Reset ADHD Planner", content: "Transform overwhelming days into focused productivity with this ADHD-friendly planner designed by neurodivergent creators for real-world challenges.", metadata: {}, tier: "free", createdAt: /* @__PURE__ */ new Date() },
          { id: "ai-planner-hashtags", contentType: "hashtags", sellerType: "planner_creator", title: "Planner Hashtags", content: "#digitalplanner #adhdplanner #productivity #plannerlife #focusplanner #planneraddict #digitalorganization #mindfulplanning", metadata: {}, tier: "free", createdAt: /* @__PURE__ */ new Date() },
          // Journal Seller Content  
          { id: "ai-journal-caption", contentType: "social_captions", sellerType: "journal_seller", title: "Self-Love Journey", content: "If your inner critic is louder than your inner cheerleader, this 30-day self-love journal will help you rewrite that story. Give yourself permission to grow. \u{1F495}", metadata: {}, tier: "free", createdAt: /* @__PURE__ */ new Date() },
          { id: "ai-journal-email", contentType: "email_templates", sellerType: "journal_seller", title: "Launch Email", content: "Subject: Your journey to self-love starts today \u2728\n\nHey beautiful soul,\n\nI'm so excited to share something I've poured my heart into...\n\n[Continue with launch sequence]", metadata: {}, tier: "pro", createdAt: /* @__PURE__ */ new Date() },
          // Course Creator Content
          { id: "ai-course-pricing", contentType: "pricing_suggestions", sellerType: "course_creator", title: "Course Pricing Strategy", content: "Based on your niche and course length:\n\u2022 Mini Course (2-3 hours): $47-97\n\u2022 Full Course (8-12 hours): $197-497\n\u2022 Masterclass (20+ hours): $497-997", metadata: {}, tier: "pro", createdAt: /* @__PURE__ */ new Date() },
          // Artist (Stickers) Content
          { id: "ai-sticker-title", contentType: "product_title", sellerType: "artist_stickers", title: "Wellness Sticker Collection", content: "Mindful Moments: Hand-Drawn Wellness Sticker Pack for Digital & Print Planners", metadata: {}, tier: "free", createdAt: /* @__PURE__ */ new Date() },
          // eBook Seller Content
          { id: "ai-ebook-description", contentType: "product_description", sellerType: "ebook_seller", title: "Complete Guide Description", content: "This comprehensive guide takes you from beginner to expert with step-by-step tutorials, real-world examples, and actionable templates you can implement immediately.", metadata: {}, tier: "free", createdAt: /* @__PURE__ */ new Date() },
          // Kids Content Creator Content
          { id: "ai-kids-hashtags", contentType: "hashtags", sellerType: "kids_content_creator", title: "Kids Content Hashtags", content: "#printablesforkids #homeschool #kidsactivities #coloringpages #learningthroughplay #parentresources #preschoolprintables #educationalfun", metadata: {}, tier: "free", createdAt: /* @__PURE__ */ new Date() }
        ];
        content.forEach((item) => {
          this.aiContent.set(item.id, item);
        });
      }
      initializeStorefrontTemplates() {
        const templates = [
          {
            id: "store-simple-sales",
            name: "Simple Sales Page",
            type: "simple_sales",
            preview: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&w=300",
            features: ["one_time", "paypal", "stripe"],
            tier: "free",
            data: {
              layout: "single_column",
              sections: ["hero", "features", "testimonials", "pricing", "cta"],
              customizable: ["colors", "fonts", "images", "copy"]
            },
            createdAt: /* @__PURE__ */ new Date()
          },
          {
            id: "store-bundle-sales",
            name: "Bundle Sales Page",
            type: "bundle_sales",
            preview: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&w=300",
            features: ["bundle_pricing", "upsells", "cart_abandonment"],
            tier: "pro",
            data: {
              layout: "multi_column",
              sections: ["hero", "bundle_breakdown", "savings_calculator", "testimonials", "faq", "cta"],
              customizable: ["colors", "fonts", "images", "copy", "bundle_options"]
            },
            createdAt: /* @__PURE__ */ new Date()
          },
          {
            id: "store-freebie-funnel",
            name: "Freebie Funnel Page",
            type: "freebie_funnel",
            preview: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&w=300",
            features: ["email_capture", "auto_delivery", "upsell_sequence"],
            tier: "free",
            data: {
              layout: "opt_in_focused",
              sections: ["hero", "value_proposition", "opt_in_form", "social_proof"],
              customizable: ["colors", "fonts", "images", "copy", "form_fields"]
            },
            createdAt: /* @__PURE__ */ new Date()
          }
        ];
        templates.forEach((template) => {
          this.storefrontTemplates.set(template.id, template);
        });
      }
      initializeWorkflows() {
        const workflows2 = [
          {
            id: "workflow-quick-launch",
            name: "Quick Launch Path",
            type: "quick_launch",
            description: "Get your first digital product from idea to sale in under 2 hours",
            estimatedTime: 120,
            difficulty: "beginner",
            tier: "free",
            steps: [
              { step: 1, title: "Choose Your Template", description: "Pick a template that matches your seller type", estimatedTime: 5 },
              { step: 2, title: "Customize Content", description: "Add your branding and content using our AI tools", estimatedTime: 30 },
              { step: 3, title: "Set Your Price", description: "Use AI-powered pricing suggestions", estimatedTime: 5 },
              { step: 4, title: "Create Storefront", description: "Generate your sales page automatically", estimatedTime: 15 },
              { step: 5, title: "Publish & Share", description: "Go live and start selling", estimatedTime: 5 }
            ],
            createdAt: /* @__PURE__ */ new Date()
          },
          {
            id: "workflow-7-day-launch",
            name: "7-Day Launch Plan",
            type: "7_day_launch",
            description: "Comprehensive 7-day plan with daily actions and coaching",
            estimatedTime: 60,
            difficulty: "intermediate",
            tier: "pro",
            steps: [
              { step: 1, title: "Day 1: Market Research", description: "Identify your target audience and competitors", estimatedTime: 60 },
              { step: 2, title: "Day 2: Content Creation", description: "Create your core product content", estimatedTime: 90 },
              { step: 3, title: "Day 3: Design & Branding", description: "Perfect your visual identity", estimatedTime: 75 },
              { step: 4, title: "Day 4: Sales Page Creation", description: "Build compelling sales copy", estimatedTime: 60 },
              { step: 5, title: "Day 5: Marketing Materials", description: "Create social media and email content", estimatedTime: 45 },
              { step: 6, title: "Day 6: Testing & Optimization", description: "Test all systems and optimize", estimatedTime: 30 },
              { step: 7, title: "Day 7: Launch Day", description: "Go live and celebrate!", estimatedTime: 30 }
            ],
            createdAt: /* @__PURE__ */ new Date()
          },
          {
            id: "workflow-brain-dump",
            name: "Digital Product Brain Dump",
            type: "brain_dump",
            description: "Mind-mapping system to generate unlimited product ideas",
            estimatedTime: 45,
            difficulty: "beginner",
            tier: "free",
            steps: [
              { step: 1, title: "Skills Inventory", description: "List all your skills and knowledge", estimatedTime: 10 },
              { step: 2, title: "Problem Identification", description: "What problems can you solve?", estimatedTime: 15 },
              { step: 3, title: "Product Brainstorm", description: "Turn problems into product ideas", estimatedTime: 15 },
              { step: 4, title: "Validation Check", description: "Quick market validation for top ideas", estimatedTime: 5 }
            ],
            createdAt: /* @__PURE__ */ new Date()
          },
          {
            id: "workflow-monetization-tracker",
            name: "Monetization Tracker",
            type: "monetization_tracker",
            description: "Visual dashboard to track all your income streams and products",
            estimatedTime: 30,
            difficulty: "beginner",
            tier: "free",
            steps: [
              { step: 1, title: "Income Stream Setup", description: "Configure your revenue sources", estimatedTime: 10 },
              { step: 2, title: "Goal Setting", description: "Set monthly and yearly targets", estimatedTime: 10 },
              { step: 3, title: "Progress Tracking", description: "Daily revenue and milestone tracking", estimatedTime: 5 },
              { step: 4, title: "Optimization Review", description: "Weekly analysis and improvements", estimatedTime: 15 }
            ],
            createdAt: /* @__PURE__ */ new Date()
          }
        ];
        workflows2.forEach((workflow) => {
          this.workflows.set(workflow.id, workflow);
        });
      }
      initializeDemoUser() {
        const demoUser = {
          id: "demo-user",
          email: "demo@creatorcore.com",
          name: "Demo Creator",
          sellerType: "journal_seller",
          subscriptionTier: "free",
          subscriptionStatus: "active",
          exportsThisMonth: 0,
          lastExportReset: /* @__PURE__ */ new Date(),
          onboardingCompleted: true,
          defaultBrandKitId: null,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        this.users.set(demoUser.id, demoUser);
        const demoBrandKit = {
          id: "demo-brand-kit",
          userId: "demo-user",
          name: "My Brand Kit",
          colorPalette: ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e"],
          fonts: ["Inter", "Poppins", "Playfair Display"],
          logos: [],
          designElements: ["sticker-heart", "icon-wellness"],
          isDefault: true,
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        this.brandKits.set(demoBrandKit.id, demoBrandKit);
      }
      // Projects methods
      async getProject(id) {
        return this.projects.get(id);
      }
      async getProjects() {
        return Array.from(this.projects.values());
      }
      async createProject(insertProject) {
        const id = randomUUID();
        const now = /* @__PURE__ */ new Date();
        const project = {
          ...insertProject,
          id,
          templateId: insertProject.templateId || null,
          storefront: insertProject.storefront || null,
          published: insertProject.published || false,
          createdAt: now,
          updatedAt: now
        };
        this.projects.set(id, project);
        return project;
      }
      async updateProject(id, updateData) {
        const existing = this.projects.get(id);
        if (!existing) return void 0;
        const updated = {
          ...existing,
          ...updateData,
          updatedAt: /* @__PURE__ */ new Date()
        };
        this.projects.set(id, updated);
        return updated;
      }
      async deleteProject(id) {
        return this.projects.delete(id);
      }
      // Assets methods
      async getAsset(id) {
        return this.assets.get(id);
      }
      async getAssetsByProject(projectId) {
        return Array.from(this.assets.values()).filter((asset) => asset.projectId === projectId);
      }
      async createAsset(insertAsset) {
        const id = randomUUID();
        const asset = {
          ...insertAsset,
          id,
          userId: insertAsset.userId || null,
          projectId: insertAsset.projectId || null,
          metadata: insertAsset.metadata || {},
          isPublic: insertAsset.isPublic || false,
          createdAt: /* @__PURE__ */ new Date()
        };
        this.assets.set(id, asset);
        return asset;
      }
      async deleteAsset(id) {
        return this.assets.delete(id);
      }
      async getProjectsByUser(userId) {
        return Array.from(this.projects.values());
      }
      async getAssetsByUser(userId) {
        return Array.from(this.assets.values()).filter((asset) => asset.userId === userId);
      }
      // Product Templates methods
      async getProductTemplate(id) {
        return this.productTemplates.get(id);
      }
      async getProductTemplates(sellerType, tier) {
        let templates = Array.from(this.productTemplates.values());
        if (sellerType) {
          templates = templates.filter((template) => template.sellerType === sellerType);
        }
        if (tier) {
          templates = templates.filter((template) => {
            if (tier === "free") return template.tier === "free";
            if (tier === "pro") return template.tier === "free" || template.tier === "pro";
            if (tier === "agency") return true;
            return false;
          });
        }
        return templates;
      }
      async createProductTemplate(insertTemplate) {
        const id = randomUUID();
        const template = {
          ...insertTemplate,
          id,
          mockupImages: insertTemplate.mockupImages || null,
          suggestedPrice: insertTemplate.suggestedPrice || null,
          tags: insertTemplate.tags || null,
          tier: insertTemplate.tier || "free",
          createdAt: /* @__PURE__ */ new Date()
        };
        this.productTemplates.set(id, template);
        return template;
      }
      // Design Elements methods
      async getDesignElement(id) {
        return this.designElements.get(id);
      }
      async getDesignElements(category, tier) {
        let elements = Array.from(this.designElements.values());
        if (category) {
          elements = elements.filter((element) => element.category === category);
        }
        if (tier) {
          elements = elements.filter((element) => {
            if (tier === "free") return element.tier === "free";
            if (tier === "pro") return element.tier === "free" || element.tier === "pro";
            if (tier === "agency") return true;
            return false;
          });
        }
        return elements;
      }
      async createDesignElement(insertElement) {
        const id = randomUUID();
        const element = {
          ...insertElement,
          id,
          subCategory: insertElement.subCategory || null,
          metadata: insertElement.metadata || {},
          tags: insertElement.tags || null,
          tier: insertElement.tier || "free",
          createdAt: /* @__PURE__ */ new Date()
        };
        this.designElements.set(id, element);
        return element;
      }
      // AI Content methods
      async getAiContent(sellerType, contentType) {
        let content = Array.from(this.aiContent.values()).filter((item) => item.sellerType === sellerType);
        if (contentType) {
          content = content.filter((item) => item.contentType === contentType);
        }
        return content;
      }
      async createAiContent(insertContent) {
        const id = randomUUID();
        const content = {
          ...insertContent,
          id,
          metadata: insertContent.metadata || {},
          tier: insertContent.tier || "free",
          createdAt: /* @__PURE__ */ new Date()
        };
        this.aiContent.set(id, content);
        return content;
      }
      // Storefront Templates methods
      async getStorefrontTemplates(tier) {
        let templates = Array.from(this.storefrontTemplates.values());
        if (tier) {
          templates = templates.filter((template) => {
            if (tier === "free") return template.tier === "free";
            if (tier === "pro") return template.tier === "free" || template.tier === "pro";
            if (tier === "agency") return true;
            return false;
          });
        }
        return templates;
      }
      async createStorefrontTemplate(insertTemplate) {
        const id = randomUUID();
        const template = {
          ...insertTemplate,
          id,
          features: insertTemplate.features || null,
          tier: insertTemplate.tier || "free",
          createdAt: /* @__PURE__ */ new Date()
        };
        this.storefrontTemplates.set(id, template);
        return template;
      }
      // Workflows methods
      async getWorkflows(tier) {
        let workflows2 = Array.from(this.workflows.values());
        if (tier) {
          workflows2 = workflows2.filter((workflow) => {
            if (tier === "free") return workflow.tier === "free";
            if (tier === "pro") return workflow.tier === "free" || workflow.tier === "pro";
            if (tier === "agency") return true;
            return false;
          });
        }
        return workflows2;
      }
      async createWorkflow(insertWorkflow) {
        const id = randomUUID();
        const workflow = {
          ...insertWorkflow,
          id,
          estimatedTime: insertWorkflow.estimatedTime || null,
          tier: insertWorkflow.tier || "free",
          createdAt: /* @__PURE__ */ new Date()
        };
        this.workflows.set(id, workflow);
        return workflow;
      }
      // User Progress methods
      async getUserProgress(userId) {
        return Array.from(this.userProgress.values()).filter((progress) => progress.userId === userId);
      }
      async createUserProgress(insertProgress) {
        const id = randomUUID();
        const now = /* @__PURE__ */ new Date();
        const progress = {
          ...insertProgress,
          id,
          workflowId: insertProgress.workflowId || null,
          projectId: insertProgress.projectId || null,
          currentStep: insertProgress.currentStep || 0,
          completedSteps: insertProgress.completedSteps || null,
          status: insertProgress.status || "in_progress",
          createdAt: now,
          updatedAt: now
        };
        this.userProgress.set(id, progress);
        return progress;
      }
      async updateUserProgress(id, updateData) {
        const existing = this.userProgress.get(id);
        if (!existing) return void 0;
        const updated = {
          ...existing,
          ...updateData,
          updatedAt: /* @__PURE__ */ new Date()
        };
        this.userProgress.set(id, updated);
        return updated;
      }
      // Brand Kits methods
      async getBrandKits(userId) {
        return Array.from(this.brandKits.values()).filter((kit) => kit.userId === userId);
      }
      async createBrandKit(insertBrandKit) {
        const id = randomUUID();
        const now = /* @__PURE__ */ new Date();
        const brandKit = {
          ...insertBrandKit,
          id,
          colorPalette: insertBrandKit.colorPalette || null,
          fonts: insertBrandKit.fonts || null,
          logos: insertBrandKit.logos || null,
          designElements: insertBrandKit.designElements || null,
          isDefault: insertBrandKit.isDefault || false,
          createdAt: now,
          updatedAt: now
        };
        this.brandKits.set(id, brandKit);
        return brandKit;
      }
      async updateBrandKit(id, updateData) {
        const existing = this.brandKits.get(id);
        if (!existing) return void 0;
        const updated = {
          ...existing,
          ...updateData,
          updatedAt: /* @__PURE__ */ new Date()
        };
        this.brandKits.set(id, updated);
        return updated;
      }
      // User methods
      async getUser(id) {
        return this.users.get(id);
      }
      async getUserByEmail(email) {
        return Array.from(this.users.values()).find((user) => user.email === email);
      }
      async createUser(insertUser) {
        const id = randomUUID();
        const now = /* @__PURE__ */ new Date();
        const user = {
          name: insertUser.name,
          email: insertUser.email,
          id,
          sellerType: insertUser.sellerType || null,
          subscriptionTier: insertUser.subscriptionTier || "free",
          subscriptionStatus: insertUser.subscriptionStatus || "active",
          exportsThisMonth: insertUser.exportsThisMonth || 0,
          lastExportReset: insertUser.lastExportReset || now,
          onboardingCompleted: insertUser.onboardingCompleted || false,
          defaultBrandKitId: insertUser.defaultBrandKitId || null,
          createdAt: now,
          updatedAt: now
        };
        this.users.set(id, user);
        return user;
      }
      async updateUser(id, updateData) {
        const existing = this.users.get(id);
        if (!existing) return void 0;
        const updated = {
          ...existing,
          ...updateData,
          updatedAt: /* @__PURE__ */ new Date()
        };
        this.users.set(id, updated);
        return updated;
      }
      // User Session methods
      async getUserSession(sessionToken) {
        return this.userSessions.get(sessionToken);
      }
      async createUserSession(insertSession) {
        const id = randomUUID();
        const session = {
          ...insertSession,
          id,
          createdAt: /* @__PURE__ */ new Date()
        };
        this.userSessions.set(insertSession.sessionToken, session);
        return session;
      }
      async deleteUserSession(sessionToken) {
        return this.userSessions.delete(sessionToken);
      }
      // Subscription management methods
      async canUserExport(userId) {
        const user = await this.getUser(userId);
        if (!user) return false;
        const limits = SUBSCRIPTION_LIMITS[user.subscriptionTier];
        const now = /* @__PURE__ */ new Date();
        const lastReset = new Date(user.lastExportReset);
        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
          await this.resetMonthlyExports(userId);
          return true;
        }
        if (limits.exportsPerMonth === -1) return true;
        return user.exportsThisMonth < limits.exportsPerMonth;
      }
      async incrementUserExports(userId) {
        const user = await this.getUser(userId);
        if (!user) return;
        await this.updateUser(userId, {
          exportsThisMonth: user.exportsThisMonth + 1
        });
      }
      async resetMonthlyExports(userId) {
        await this.updateUser(userId, {
          exportsThisMonth: 0,
          lastExportReset: /* @__PURE__ */ new Date()
        });
      }
    };
    storage = new MemStorage();
  }
});

// server/populate-comprehensive.ts
var populate_comprehensive_exports = {};
__export(populate_comprehensive_exports, {
  populateAllSections: () => populateAllSections
});
async function populateAllSections() {
  console.log("Populating every section with comprehensive pre-originated content...");
  const comprehensiveTemplates = [
    // Planner Creator - Multiple subcategories
    {
      name: "Ultimate Business Planner 2024",
      description: "Complete business planning system with goal tracking, revenue planning, and team management tools for entrepreneurs and small business owners.",
      sellerType: "planner_creator",
      subCategory: "Business Planners",
      tier: "agency",
      suggestedPrice: 59.99,
      tags: ["Business", "Planning", "Goals", "Revenue", "Team Management"],
      preview: "/previews/business-planner.jpg",
      data: {
        pages: 285,
        format: "PDF + Excel + Notion",
        printable: true,
        features: ["90-day goals", "Revenue tracker", "Team workflows", "KPI dashboard", "Strategic planning"]
      }
    },
    {
      name: "Teacher's Lesson Planner Pro",
      description: "Comprehensive teaching planner with lesson plans, student tracking, grade management, and parent communication templates.",
      sellerType: "planner_creator",
      subCategory: "Academic",
      tier: "pro",
      suggestedPrice: 34.99,
      tags: ["Teaching", "Education", "Lesson Plans", "Student Tracking", "Academic"],
      preview: "/previews/teacher-planner.jpg",
      data: {
        pages: 195,
        format: "PDF + Digital",
        features: ["Weekly lesson plans", "Student profiles", "Grade tracker", "Communication templates", "Curriculum mapping"]
      }
    },
    {
      name: "Wedding Planning Bundle",
      description: "Complete wedding planning kit with timeline, budget tracker, vendor management, and guest coordination tools.",
      sellerType: "planner_creator",
      subCategory: "Event Planning",
      tier: "pro",
      suggestedPrice: 44.99,
      tags: ["Wedding", "Event Planning", "Budget", "Timeline", "Vendor Management"],
      preview: "/previews/wedding-planner.jpg",
      data: {
        pages: 220,
        format: "PDF + Google Sheets",
        features: ["12-month timeline", "Budget calculator", "Vendor contacts", "Guest management", "Day-of coordinator"]
      }
    },
    // Journal Seller - Multiple types
    {
      name: "Pregnancy & Baby Journal",
      description: "Beautiful pregnancy journey journal with weekly tracking, ultrasound pages, memory keeping, and baby's first year milestones.",
      sellerType: "journal_seller",
      subCategory: "Life Events",
      tier: "pro",
      suggestedPrice: 38.99,
      tags: ["Pregnancy", "Baby", "Memories", "Milestones", "Family"],
      preview: "/previews/pregnancy-journal.jpg",
      data: {
        pages: 160,
        duration: "40 weeks + 1 year",
        format: "PDF + Digital",
        features: ["Weekly tracking", "Ultrasound pages", "Memory keeping", "Milestone tracking", "Photo spaces"]
      }
    },
    {
      name: "Travel Adventure Journal",
      description: "Wanderlust journal for documenting travel experiences with itinerary planning, memory pages, and reflection prompts.",
      sellerType: "journal_seller",
      subCategory: "Travel",
      tier: "free",
      suggestedPrice: 22.99,
      tags: ["Travel", "Adventure", "Memories", "Planning", "Wanderlust"],
      preview: "/previews/travel-journal.jpg",
      data: {
        pages: 120,
        format: "PDF + Printable",
        features: ["Trip planning", "Daily logs", "Photo spaces", "Map pages", "Reflection prompts"]
      }
    },
    {
      name: "Gratitude & Mindfulness Daily",
      description: "365-day gratitude and mindfulness practice journal with daily prompts, meditation guides, and progress tracking.",
      sellerType: "journal_seller",
      subCategory: "Mindfulness",
      tier: "pro",
      suggestedPrice: 32.99,
      tags: ["Gratitude", "Mindfulness", "Daily Practice", "Mental Health", "Wellbeing"],
      preview: "/previews/gratitude-journal.jpg",
      data: {
        pages: 380,
        duration: "365 days",
        format: "PDF + Audio meditations",
        features: ["Daily prompts", "Meditation guides", "Progress tracking", "Weekly reflections", "Milestone celebrations"]
      }
    },
    // Course Creator - Multiple formats
    {
      name: "Masterclass Presentation Kit",
      description: "Professional presentation templates, slide designs, and workshop materials for creating high-impact masterclasses and workshops.",
      sellerType: "course_creator",
      subCategory: "Presentations",
      tier: "agency",
      suggestedPrice: 79.99,
      tags: ["Masterclass", "Presentations", "Workshop", "Professional", "Teaching"],
      preview: "/previews/masterclass-kit.jpg",
      data: {
        slides: 150,
        templates: 25,
        format: "PowerPoint + Keynote + Canva",
        features: ["Slide templates", "Workshop outlines", "Handout templates", "Marketing materials", "Follow-up sequences"]
      }
    },
    {
      name: "Online Course Accelerator",
      description: "Complete course creation system with module templates, student worksheets, quiz templates, and marketing materials.",
      sellerType: "course_creator",
      subCategory: "Course Creation",
      tier: "agency",
      suggestedPrice: 129.99,
      tags: ["Course Creation", "Online Learning", "Templates", "Marketing", "Student Success"],
      preview: "/previews/course-accelerator.jpg",
      data: {
        modules: 12,
        worksheets: 35,
        quizzes: 15,
        format: "PDF + Video Scripts + Canva",
        features: ["Module templates", "Student worksheets", "Quiz templates", "Marketing kit", "Launch plan"]
      }
    },
    // Artist Stickers - Multiple themes
    {
      name: "Seasonal Sticker Mega Pack",
      description: "200+ seasonal digital stickers covering all holidays and seasons with winter, spring, summer, and fall themes.",
      sellerType: "artist_stickers",
      subCategory: "Seasonal",
      tier: "pro",
      suggestedPrice: 24.99,
      tags: ["Seasonal", "Holidays", "Digital Stickers", "Planner", "Decorative"],
      preview: "/previews/seasonal-stickers.jpg",
      data: {
        stickers: 200,
        seasons: 4,
        holidays: 12,
        format: "PNG + SVG + PDF",
        features: ["All seasons", "Major holidays", "Weather elements", "Nature themes", "Celebration graphics"]
      }
    },
    {
      name: "Kawaii Animal Friends",
      description: "Adorable kawaii-style animal stickers perfect for planners, journals, and digital decoration with 100+ cute designs.",
      sellerType: "artist_stickers",
      subCategory: "Kawaii",
      tier: "free",
      suggestedPrice: 14.99,
      tags: ["Kawaii", "Animals", "Cute", "Digital Art", "Planner Stickers"],
      preview: "/previews/kawaii-animals.jpg",
      data: {
        stickers: 100,
        animals: 25,
        expressions: 8,
        format: "PNG + SVG",
        features: ["Kawaii style", "Multiple expressions", "Various poses", "High resolution", "Commercial use"]
      }
    },
    {
      name: "Fitness & Wellness Icons",
      description: "Motivational fitness and wellness stickers with workout icons, healthy habits, and progress tracking elements.",
      sellerType: "artist_stickers",
      subCategory: "Fitness",
      tier: "pro",
      suggestedPrice: 18.99,
      tags: ["Fitness", "Wellness", "Health", "Workout", "Motivation"],
      preview: "/previews/fitness-stickers.jpg",
      data: {
        stickers: 85,
        categories: 8,
        workouts: 15,
        format: "PNG + SVG + PDF",
        features: ["Workout icons", "Progress trackers", "Motivational quotes", "Habit trackers", "Achievement badges"]
      }
    },
    // eBook Seller - Multiple niches
    {
      name: "Recipe eBook Template Collection",
      description: "Professional recipe book templates with ingredient lists, instructions, nutritional info, and beautiful food photography layouts.",
      sellerType: "ebook_seller",
      subCategory: "Recipe Books",
      tier: "pro",
      suggestedPrice: 39.99,
      tags: ["Recipes", "Cookbook", "Food", "Templates", "Photography"],
      preview: "/previews/recipe-ebook.jpg",
      data: {
        templates: 15,
        layouts: 45,
        pages: 180,
        format: "InDesign + PDF + Canva",
        features: ["Recipe layouts", "Ingredient lists", "Photo placeholders", "Nutritional info", "Index templates"]
      }
    },
    {
      name: "Self-Help eBook Starter Kit",
      description: "Complete template suite for self-help and personal development eBooks with chapter layouts, exercise pages, and worksheets.",
      sellerType: "ebook_seller",
      subCategory: "Self-Help",
      tier: "agency",
      suggestedPrice: 67.99,
      tags: ["Self-Help", "Personal Development", "Templates", "Worksheets", "Growth"],
      preview: "/previews/selfhelp-ebook.jpg",
      data: {
        chapters: 20,
        worksheets: 25,
        exercises: 40,
        format: "InDesign + Word + PDF",
        features: ["Chapter templates", "Exercise pages", "Worksheet layouts", "Progress trackers", "Action plans"]
      }
    },
    // Kids Content - Multiple ages and types
    {
      name: "Alphabet Adventure Activity Pack",
      description: "Complete alphabet learning pack with coloring pages, tracing worksheets, and fun activities for preschoolers aged 3-5.",
      sellerType: "kids_content",
      subCategory: "Learning Activities",
      tier: "free",
      suggestedPrice: 12.99,
      tags: ["Alphabet", "Preschool", "Learning", "Activities", "Ages 3-5"],
      preview: "/previews/alphabet-pack.jpg",
      data: {
        pages: 78,
        activities: 26,
        ageRange: "3-5 years",
        format: "PDF + Printable",
        features: ["Letter tracing", "Coloring pages", "Matching games", "Sound activities", "Progress tracking"]
      }
    },
    {
      name: "Math Fun Workbook Series",
      description: "Engaging math workbook for elementary students with colorful illustrations, practice problems, and achievement stickers.",
      sellerType: "kids_content",
      subCategory: "Math Workbooks",
      tier: "pro",
      suggestedPrice: 19.99,
      tags: ["Math", "Elementary", "Workbook", "Practice", "Ages 6-10"],
      preview: "/previews/math-workbook.jpg",
      data: {
        levels: 4,
        problems: 200,
        ageRange: "6-10 years",
        format: "PDF + Answer Key",
        features: ["Grade-level practice", "Visual examples", "Progress tracking", "Achievement stickers", "Parent guide"]
      }
    },
    {
      name: "Mindfulness for Kids Bundle",
      description: "Gentle mindfulness activities and emotional regulation tools designed specifically for children ages 5-12.",
      sellerType: "kids_content",
      subCategory: "Mindfulness",
      tier: "pro",
      suggestedPrice: 26.99,
      tags: ["Mindfulness", "Emotional Regulation", "Kids", "Wellbeing", "Ages 5-12"],
      preview: "/previews/kids-mindfulness.jpg",
      data: {
        activities: 45,
        exercises: 20,
        ageRange: "5-12 years",
        format: "PDF + Audio guides",
        features: ["Breathing exercises", "Emotion cards", "Calming activities", "Parent guide", "Progress chart"]
      }
    }
  ];
  const comprehensiveDesignElements = [
    {
      name: "Professional Business Icons",
      type: "icon",
      category: "business",
      url: "/design-elements/business-icons.svg",
      tier: "pro",
      tags: ["business", "professional", "icons", "corporate"],
      metadata: {
        count: 120,
        formats: ["SVG", "PNG", "PDF"],
        styles: ["Outline", "Filled", "Duotone"],
        categories: ["Finance", "Marketing", "Team", "Strategy", "Analytics"]
      }
    },
    {
      name: "Hand-drawn Botanical Elements",
      type: "illustration",
      category: "nature",
      url: "/design-elements/botanical.svg",
      tier: "free",
      tags: ["botanical", "nature", "hand-drawn", "organic"],
      metadata: {
        count: 85,
        formats: ["PNG", "SVG"],
        styles: ["Watercolor", "Line Art", "Filled"],
        elements: ["Leaves", "Flowers", "Branches", "Wreaths", "Borders"]
      }
    },
    {
      name: "Modern Geometric Shapes",
      type: "shape",
      category: "geometric",
      url: "/design-elements/geometric.svg",
      tier: "pro",
      tags: ["geometric", "modern", "abstract", "contemporary"],
      metadata: {
        count: 95,
        formats: ["SVG", "PNG", "AI"],
        styles: ["Minimal", "Bold", "Gradient", "Outline"],
        shapes: ["Circles", "Triangles", "Polygons", "Abstract", "Patterns"]
      }
    },
    {
      name: "Watercolor Textures & Brushes",
      type: "texture",
      category: "artistic",
      url: "/design-elements/watercolor.png",
      tier: "agency",
      tags: ["watercolor", "textures", "artistic", "backgrounds"],
      metadata: {
        count: 60,
        formats: ["PNG", "PSD", "TIFF"],
        types: ["Backgrounds", "Splashes", "Gradients", "Overlays"],
        colors: 24
      }
    },
    {
      name: "Typography Quote Frames",
      type: "frame",
      category: "typography",
      url: "/design-elements/quote-frames.svg",
      tier: "pro",
      tags: ["typography", "quotes", "frames", "inspiration"],
      metadata: {
        count: 40,
        formats: ["SVG", "PNG", "PDF"],
        styles: ["Modern", "Classic", "Handwritten", "Bold"],
        sizes: ["Square", "Rectangle", "Circle", "Custom"]
      }
    }
  ];
  const comprehensiveAiContent = [
    {
      sellerType: "all",
      contentType: "product_description",
      title: "Compelling Product Descriptions",
      content: "Transform your digital products with AI-generated descriptions that convert browsers into buyers. Get persuasive, SEO-optimized copy tailored to your target audience.",
      tier: "free",
      metadata: {
        templates: 25,
        tones: ["Professional", "Casual", "Inspiring", "Educational", "Playful"],
        lengths: ["Short", "Medium", "Long", "Email", "Social"],
        tags: ["copywriting", "sales", "marketing", "conversion"]
      }
    },
    {
      sellerType: "all",
      contentType: "social_captions",
      title: "Viral Social Media Captions",
      content: "Generate engaging captions for Instagram, Facebook, Pinterest, and TikTok that boost engagement and drive traffic to your digital products.",
      tier: "pro",
      metadata: {
        platforms: ["Instagram", "Facebook", "Pinterest", "TikTok", "Twitter"],
        styles: ["Story-driven", "Educational", "Behind-the-scenes", "Promotional", "User-generated"],
        hashtags: "Auto-generated relevant hashtags included",
        tags: ["social media", "engagement", "viral", "captions"]
      }
    },
    {
      sellerType: "all",
      contentType: "email_sequences",
      title: "High-Converting Email Sequences",
      content: "Complete email marketing sequences for product launches, nurture campaigns, and customer onboarding that build relationships and drive sales.",
      tier: "agency",
      metadata: {
        sequences: ["Welcome", "Launch", "Nurture", "Upsell", "Re-engagement"],
        emails: "5-10 emails per sequence",
        personalization: "Dynamic content based on customer data",
        tags: ["email marketing", "sequences", "conversion", "automation"]
      }
    },
    {
      sellerType: "course_creator",
      contentType: "course_outlines",
      title: "Comprehensive Course Outlines",
      content: "Detailed course structures with learning objectives, module breakdowns, and engaging lesson plans tailored to your expertise and audience.",
      tier: "pro",
      metadata: {
        formats: ["Mini-course", "Full course", "Masterclass", "Workshop"],
        modules: "3-12 modules per course",
        activities: "Interactive exercises and assessments included",
        tags: ["course creation", "education", "curriculum", "learning"]
      }
    },
    {
      sellerType: "all",
      contentType: "blog_content",
      title: "SEO-Optimized Blog Content",
      content: "Professional blog posts and articles that establish authority, improve SEO rankings, and drive organic traffic to your digital products.",
      tier: "pro",
      metadata: {
        wordCounts: ["500-800", "1000-1500", "2000-3000"],
        formats: ["How-to", "List", "Case study", "Opinion", "Tutorial"],
        seoOptimized: "Keyword research and optimization included",
        tags: ["content marketing", "SEO", "blogging", "authority"]
      }
    }
  ];
  for (const template of comprehensiveTemplates) {
    await storage.createProductTemplate(template);
  }
  for (const element of comprehensiveDesignElements) {
    await storage.createDesignElement(element);
  }
  for (const content of comprehensiveAiContent) {
    await storage.createAiContent(content);
  }
  console.log(`\u2705 Populated comprehensive content: ${comprehensiveTemplates.length} templates, ${comprehensiveDesignElements.length} design elements, ${comprehensiveAiContent.length} AI content pieces`);
  return {
    templates: comprehensiveTemplates.length,
    designElements: comprehensiveDesignElements.length,
    aiContent: comprehensiveAiContent.length
  };
}
var init_populate_comprehensive = __esm({
  "server/populate-comprehensive.ts"() {
    "use strict";
    init_storage();
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
init_storage();
init_schema();
import { createServer } from "http";
import multer2 from "multer";
import { z } from "zod";
import path2 from "path";
import fs2 from "fs";
import PDFDocument from "pdfkit";

// server/cloud-storage.ts
import { Storage } from "@google-cloud/storage";
import multer from "multer";
import fs from "fs";
import path from "path";
var storage2 = null;
var bucket = null;
try {
  if (process.env.GOOGLE_CLOUD_PROJECT_ID) {
    storage2 = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE
    });
    const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || "creatorflow-assets";
    bucket = storage2.bucket(bucketName);
  }
} catch (error) {
  console.log("Google Cloud Storage not configured, using local storage");
}
var multerStorage = multer.memoryStorage();
var upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 50 * 1024 * 1024
    // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ].includes(file.mimetype);
    if (allowedTypes) {
      cb(null, true);
    } else {
      cb(new Error("File type not supported"), false);
    }
  }
});
var uploadToCloudStorage = async (file, folder = "uploads") => {
  if (bucket && storage2) {
    const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || "creatorflow-assets";
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      },
      public: true
    });
    return new Promise((resolve, reject) => {
      stream.on("error", reject);
      stream.on("finish", () => {
        fileUpload.makePublic().then(() => {
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
          resolve(publicUrl);
        }).catch(reject);
      });
      stream.end(file.buffer);
    });
  } else {
    const uploadDir = path.join(process.cwd(), "uploads", folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);
    return `/uploads/${folder}/${fileName}`;
  }
};
var listCloudFiles = async (folder = "uploads") => {
  if (bucket) {
    const [files] = await bucket.getFiles({
      prefix: folder
    });
    const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || "creatorflow-assets";
    return files.map((file) => ({
      name: file.name,
      size: file.metadata.size,
      contentType: file.metadata.contentType,
      timeCreated: file.metadata.timeCreated,
      publicUrl: `https://storage.googleapis.com/${bucketName}/${file.name}`
    }));
  } else {
    const uploadDir = path.join(process.cwd(), "uploads", folder);
    if (!fs.existsSync(uploadDir)) {
      return [];
    }
    const files = fs.readdirSync(uploadDir);
    return files.map((file) => {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        contentType: "application/octet-stream",
        timeCreated: stats.birthtime,
        publicUrl: `/uploads/${folder}/${file}`
      };
    });
  }
};
var uploadMiddleware = upload.array("files", 5);
var handleFileUpload = async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }
    const uploadPromises = req.files.map(
      (file) => uploadToCloudStorage(file, "user-uploads")
    );
    const uploadedUrls = await Promise.all(uploadPromises);
    const uploadedFiles = req.files.map((file, index) => ({
      originalName: file.originalname,
      size: file.size,
      type: file.mimetype,
      url: uploadedUrls[index]
    }));
    res.json({
      success: true,
      files: uploadedFiles
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Upload failed",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var connectGoogleDrive = async (req, res) => {
  res.json({
    success: true,
    message: "Google Drive integration requires OAuth setup",
    authUrl: "https://accounts.google.com/oauth/authorize?..."
    // OAuth URL would go here
  });
};
var deployProject = async (projectData) => {
  try {
    const projectFolder = `projects/${projectData.id}`;
    const htmlContent = generateProjectHTML(projectData);
    const cssContent = generateProjectCSS(projectData);
    if (bucket) {
      const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || "creatorflow-assets";
      const htmlFile = bucket.file(`${projectFolder}/index.html`);
      const cssFile = bucket.file(`${projectFolder}/styles.css`);
      await Promise.all([
        htmlFile.save(htmlContent, {
          metadata: { contentType: "text/html" },
          public: true
        }),
        cssFile.save(cssContent, {
          metadata: { contentType: "text/css" },
          public: true
        })
      ]);
      await Promise.all([
        htmlFile.makePublic(),
        cssFile.makePublic()
      ]);
      return `https://storage.googleapis.com/${bucketName}/${projectFolder}/index.html`;
    } else {
      const deployDir = path.join(process.cwd(), "deployed", projectFolder);
      if (!fs.existsSync(deployDir)) {
        fs.mkdirSync(deployDir, { recursive: true });
      }
      fs.writeFileSync(path.join(deployDir, "index.html"), htmlContent);
      fs.writeFileSync(path.join(deployDir, "styles.css"), cssContent);
      return `/deployed/${projectFolder}/index.html`;
    }
  } catch (error) {
    console.error("Deployment error:", error);
    throw new Error("Failed to deploy project");
  }
};
var generateProjectHTML = (projectData) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectData.name}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="project-container">
        <h1>${projectData.name}</h1>
        ${projectData.elements?.map((element) => {
    if (element.type === "text") {
      return `<div class="text-element" style="
              position: absolute;
              left: ${element.x}px;
              top: ${element.y}px;
              font-size: ${element.fontSize || 16}px;
              color: ${element.color || "#000"};
              font-family: ${element.fontFamily || "Inter, sans-serif"};
            ">${element.content}</div>`;
    }
    if (element.type === "shape") {
      return `<div class="shape-element" style="
              position: absolute;
              left: ${element.x}px;
              top: ${element.y}px;
              width: ${element.width || 100}px;
              height: ${element.height || 100}px;
              background-color: ${element.backgroundColor || "#8753f0"};
              border-radius: ${element.shapeType === "circle" ? "50%" : "0"};
            "></div>`;
    }
    return "";
  }).join("") || ""}
    </div>
</body>
</html>`;
};
var generateProjectCSS = (projectData) => {
  return `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.project-container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    padding: 20px;
}

.text-element {
    white-space: pre-wrap;
    word-break: break-word;
}

.shape-element {
    transition: all 0.3s ease;
}

.shape-element:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
}

@media (max-width: 768px) {
    .project-container {
        padding: 10px;
    }
    
    .text-element {
        font-size: 14px !important;
    }
    
    .shape-element {
        transform: scale(0.8);
    }
}`;
};

// server/routes.ts
var upload2 = multer2({
  dest: "uploads/",
  limits: {
    fileSize: 50 * 1024 * 1024
    // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|mp3|mp4|wav|txt|docx/;
    const extname = allowedTypes.test(path2.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  }
});
async function registerRoutes(app2) {
  app2.use("/uploads", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    next();
  }, (req, res, next) => {
    const filePath = path2.join(process.cwd(), "uploads", req.path);
    if (fs2.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });
  app2.get("/api/product-templates", async (req, res) => {
    try {
      const { sellerType, tier } = req.query;
      const templates = await storage.getProductTemplates(
        sellerType,
        tier
      );
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product templates" });
    }
  });
  app2.get("/api/product-templates/:id", async (req, res) => {
    try {
      const template = await storage.getProductTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Product template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product template" });
    }
  });
  app2.post("/api/product-templates", async (req, res) => {
    try {
      const validatedData = insertProductTemplateSchema.parse(req.body);
      const template = await storage.createProductTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product template" });
    }
  });
  app2.get("/api/design-elements", async (req, res) => {
    try {
      const { category, tier } = req.query;
      const elements = await storage.getDesignElements(
        category,
        tier
      );
      res.json(elements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch design elements" });
    }
  });
  app2.get("/api/design-elements/:id", async (req, res) => {
    try {
      const element = await storage.getDesignElement(req.params.id);
      if (!element) {
        return res.status(404).json({ message: "Design element not found" });
      }
      res.json(element);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch design element" });
    }
  });
  app2.post("/api/design-elements", async (req, res) => {
    try {
      const validatedData = insertDesignElementSchema.parse(req.body);
      const element = await storage.createDesignElement(validatedData);
      res.status(201).json(element);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid element data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create design element" });
    }
  });
  app2.get("/api/ai-content/:sellerType", async (req, res) => {
    try {
      const { sellerType } = req.params;
      const { contentType } = req.query;
      const content = await storage.getAiContent(
        sellerType,
        contentType
      );
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI content" });
    }
  });
  app2.post("/api/ai-content", async (req, res) => {
    try {
      const validatedData = insertAiContentSchema.parse(req.body);
      const content = await storage.createAiContent(validatedData);
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create AI content" });
    }
  });
  app2.get("/api/storefront-templates", async (req, res) => {
    try {
      const { tier } = req.query;
      const templates = await storage.getStorefrontTemplates(tier);
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch storefront templates" });
    }
  });
  app2.post("/api/storefront-templates", async (req, res) => {
    try {
      const validatedData = insertStorefrontTemplateSchema.parse(req.body);
      const template = await storage.createStorefrontTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create storefront template" });
    }
  });
  app2.get("/api/workflows", async (req, res) => {
    try {
      const { tier } = req.query;
      const workflows2 = await storage.getWorkflows(tier);
      res.json(workflows2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workflows" });
    }
  });
  app2.post("/api/workflows", async (req, res) => {
    try {
      const validatedData = insertWorkflowSchema.parse(req.body);
      const workflow = await storage.createWorkflow(validatedData);
      res.status(201).json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workflow data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create workflow" });
    }
  });
  app2.get("/api/user-progress/:userId", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });
  app2.post("/api/user-progress", async (req, res) => {
    try {
      const validatedData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createUserProgress(validatedData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user progress" });
    }
  });
  app2.patch("/api/user-progress/:id", async (req, res) => {
    try {
      const validatedData = insertUserProgressSchema.partial().parse(req.body);
      const progress = await storage.updateUserProgress(req.params.id, validatedData);
      if (!progress) {
        return res.status(404).json({ message: "User progress not found" });
      }
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user progress" });
    }
  });
  app2.get("/api/brand-kits/:userId", async (req, res) => {
    try {
      const brandKits2 = await storage.getBrandKits(req.params.userId);
      res.json(brandKits2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brand kits" });
    }
  });
  app2.post("/api/brand-kits", async (req, res) => {
    try {
      const validatedData = insertBrandKitSchema.parse(req.body);
      const brandKit = await storage.createBrandKit(validatedData);
      res.status(201).json(brandKit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid brand kit data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create brand kit" });
    }
  });
  app2.patch("/api/brand-kits/:id", async (req, res) => {
    try {
      const validatedData = insertBrandKitSchema.partial().parse(req.body);
      const brandKit = await storage.updateBrandKit(req.params.id, validatedData);
      if (!brandKit) {
        return res.status(404).json({ message: "Brand kit not found" });
      }
      res.json(brandKit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid brand kit data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update brand kit" });
    }
  });
  app2.get("/api/projects", async (req, res) => {
    try {
      const { userId } = req.query;
      const projects2 = userId ? await storage.getProjectsByUser(userId) : await storage.getProjects();
      res.json(projects2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  app2.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });
  app2.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });
  app2.put("/api/projects/:id", async (req, res) => {
    try {
      const updateData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, updateData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });
  app2.delete("/api/projects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });
  app2.get("/api/projects/:projectId/assets", async (req, res) => {
    try {
      const assets2 = await storage.getAssetsByProject(req.params.projectId);
      res.json(assets2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assets" });
    }
  });
  app2.post("/api/projects/:projectId/assets", upload2.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const fileType = req.file.mimetype.startsWith("image/") ? "image" : req.file.mimetype.startsWith("audio/") ? "audio" : req.file.mimetype.startsWith("video/") ? "video" : "text";
      const assetData = {
        projectId: req.params.projectId,
        name: req.file.originalname,
        type: fileType,
        url: `/uploads/${req.file.filename}`,
        metadata: {
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      };
      const asset = await storage.createAsset(assetData);
      res.status(201).json(asset);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload asset" });
    }
  });
  app2.delete("/api/assets/:id", async (req, res) => {
    try {
      const asset = await storage.getAsset(req.params.id);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      const filePath = path2.join(process.cwd(), "uploads", path2.basename(asset.url));
      if (fs2.existsSync(filePath)) {
        fs2.unlinkSync(filePath);
      }
      const deleted = await storage.deleteAsset(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete asset" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/users/by-email/:email", async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.patch("/api/users/:id", async (req, res) => {
    try {
      const validatedData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, validatedData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  app2.get("/api/sessions/:token", async (req, res) => {
    try {
      const session = await storage.getUserSession(req.params.token);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });
  app2.post("/api/sessions", async (req, res) => {
    try {
      const validatedData = insertUserSessionSchema.parse(req.body);
      const session = await storage.createUserSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create session" });
    }
  });
  app2.delete("/api/sessions/:token", async (req, res) => {
    try {
      const deleted = await storage.deleteUserSession(req.params.token);
      if (!deleted) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete session" });
    }
  });
  app2.get("/api/users/:userId/can-export", async (req, res) => {
    try {
      const canExport = await storage.canUserExport(req.params.userId);
      res.json({ canExport });
    } catch (error) {
      res.status(500).json({ message: "Failed to check export eligibility" });
    }
  });
  app2.post("/api/users/:userId/increment-exports", async (req, res) => {
    try {
      await storage.incrementUserExports(req.params.userId);
      res.status(200).json({ message: "Export count incremented" });
    } catch (error) {
      res.status(500).json({ message: "Failed to increment exports" });
    }
  });
  app2.post("/api/users/:userId/reset-exports", async (req, res) => {
    try {
      await storage.resetMonthlyExports(req.params.userId);
      res.status(200).json({ message: "Monthly exports reset" });
    } catch (error) {
      res.status(500).json({ message: "Failed to reset exports" });
    }
  });
  app2.post("/api/projects/:id/export", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      const { format = "pdf", quality = "high" } = req.body;
      if (format === "pdf") {
        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${project.name}.pdf"`);
        doc.pipe(res);
        doc.fontSize(20).text(project.name, 100, 100);
        if (project.data && typeof project.data === "object" && "pages" in project.data) {
          const pages = project.data.pages;
          pages.forEach((page, pageIndex) => {
            if (pageIndex > 0) doc.addPage();
            if (page.elements) {
              page.elements.forEach((element) => {
                if (element.type === "text") {
                  doc.fontSize(element.style?.fontSize || 12).text(element.content || "", element.position?.x || 100, element.position?.y || 200);
                }
              });
            }
          });
        }
        doc.end();
      } else {
        res.status(400).json({ message: "Unsupported export format" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to export project" });
    }
  });
  app2.post("/api/upload/cloud", uploadMiddleware, handleFileUpload);
  app2.get("/api/cloud/files", async (req, res) => {
    try {
      const folder = req.query.folder || "uploads";
      const files = await listCloudFiles(folder);
      res.json({ files });
    } catch (error) {
      res.status(500).json({ error: "Failed to list files" });
    }
  });
  app2.post("/api/cloud/connect/google-drive", connectGoogleDrive);
  app2.post("/api/projects/:id/deploy", async (req, res) => {
    try {
      const projectId = req.params.id;
      console.log("Deploying project:", projectId);
      const projects2 = await storage.getProjects();
      const project = projects2.find((p) => p.id === projectId);
      if (!project) {
        console.log("Available projects:", projects2.map((p) => p.id));
        return res.status(404).json({ error: "Project not found" });
      }
      console.log("Found project:", project.name);
      const deployUrl = await deployProject(project);
      res.json({ success: true, deployUrl });
    } catch (error) {
      console.error("Deploy error:", error);
      res.status(500).json({ error: "Deployment failed" });
    }
  });
  app2.use("/deployed", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    next();
  }, (req, res, next) => {
    const filePath = path2.join(process.cwd(), "deployed", req.path);
    if (fs2.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs3 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path3.resolve(import.meta.dirname, "client", "src"),
      "@shared": path3.resolve(import.meta.dirname, "shared"),
      "@assets": path3.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path3.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path3.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs3.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/seed-data.ts
init_storage();

// server/populate-content.ts
init_storage();
async function populateCreatorContent() {
  console.log("Adding realistic creator activity and content...");
  const creatorProjects = [
    {
      name: "2024 Budget Planner Bundle",
      userId: "user-1",
      templateId: "template-1",
      data: {
        title: "2024 Budget Planner Bundle",
        description: "Complete financial planning system with monthly budgets, expense trackers, and savings goals",
        status: "published",
        sales: 342,
        revenue: 8549.8,
        rating: 4.9,
        reviews: 156,
        categories: ["Finance", "Planning", "Budget"],
        downloadCount: 487,
        lastUpdated: "2024-07-20"
      },
      status: "published",
      createdAt: /* @__PURE__ */ new Date("2024-01-15"),
      updatedAt: /* @__PURE__ */ new Date("2024-07-20")
    },
    {
      name: "Self-Care Sunday Journal",
      userId: "user-2",
      templateId: "template-2",
      data: {
        title: "Self-Care Sunday Journal",
        description: "Weekly self-care practices and reflection prompts for busy professionals",
        status: "published",
        sales: 278,
        revenue: 6950.5,
        rating: 4.8,
        reviews: 127,
        categories: ["Self-Care", "Wellness", "Journal"],
        downloadCount: 356,
        lastUpdated: "2024-06-15"
      },
      status: "published",
      createdAt: /* @__PURE__ */ new Date("2024-02-01"),
      updatedAt: /* @__PURE__ */ new Date("2024-06-15")
    },
    {
      name: "Productivity Power Stickers",
      userId: "user-3",
      templateId: "template-3",
      data: {
        title: "Productivity Power Stickers",
        description: "Motivational digital stickers for planners and journals",
        status: "published",
        sales: 523,
        revenue: 6799.9,
        rating: 4.7,
        reviews: 234,
        categories: ["Stickers", "Productivity", "Digital Art"],
        downloadCount: 678,
        lastUpdated: "2024-05-10"
      },
      status: "published",
      createdAt: /* @__PURE__ */ new Date("2024-03-01"),
      updatedAt: /* @__PURE__ */ new Date("2024-05-10")
    },
    {
      name: "Course Creator Launch Kit",
      userId: "user-4",
      templateId: "template-4",
      data: {
        title: "Course Creator Launch Kit",
        description: "Everything needed to launch your first online course",
        status: "published",
        sales: 89,
        revenue: 7121,
        rating: 4.9,
        reviews: 67,
        categories: ["Course Creation", "Business", "Templates"],
        downloadCount: 142,
        lastUpdated: "2024-04-20"
      },
      status: "published",
      createdAt: /* @__PURE__ */ new Date("2024-01-20"),
      updatedAt: /* @__PURE__ */ new Date("2024-04-20")
    },
    {
      name: "Mindful Parenting Journal",
      userId: "user-5",
      templateId: "template-5",
      data: {
        title: "Mindful Parenting Journal",
        description: "Daily reflection prompts for conscious parenting",
        status: "draft",
        completionPercent: 92,
        targetLaunch: "2024-08-15",
        categories: ["Parenting", "Mindfulness", "Journal"]
      },
      status: "draft",
      createdAt: /* @__PURE__ */ new Date("2024-06-01"),
      updatedAt: /* @__PURE__ */ new Date("2024-07-25")
    }
  ];
  const progressData = [
    {
      userId: "user-1",
      workflowId: "workflow-quick-launch",
      currentStep: 8,
      totalSteps: 8,
      completedAt: /* @__PURE__ */ new Date("2024-01-15"),
      data: { projectName: "2024 Budget Planner Bundle", totalTime: 95 }
    },
    {
      userId: "user-2",
      workflowId: "workflow-7-day-launch",
      currentStep: 7,
      totalSteps: 7,
      completedAt: /* @__PURE__ */ new Date("2024-02-01"),
      data: { projectName: "Self-Care Sunday Journal", totalTime: 420 }
    },
    {
      userId: "user-3",
      workflowId: "workflow-brain-dump",
      currentStep: 4,
      totalSteps: 4,
      completedAt: /* @__PURE__ */ new Date("2024-03-01"),
      data: { ideasGenerated: 23, selectedIdeas: 3 }
    },
    {
      userId: "user-4",
      workflowId: "workflow-monetization-tracker",
      currentStep: 4,
      totalSteps: 4,
      completedAt: /* @__PURE__ */ new Date("2024-01-20"),
      data: { monthlyGoal: 5e3, currentRevenue: 7121 }
    }
  ];
  for (const project of creatorProjects) {
    await storage.createProject(project);
  }
  for (const progress of progressData) {
    await storage.createUserProgress(progress);
  }
  console.log(`\u2705 Added ${creatorProjects.length} creator projects and ${progressData.length} workflow completions`);
}

// server/seed-data.ts
async function seedDatabase() {
  console.log("Seeding CreatorCore with comprehensive pre-originated content...");
  const sampleUsers = [
    {
      name: "Sarah Johnson",
      email: "sarah@creativeplanner.com",
      sellerType: "planner_creator",
      subscriptionTier: "pro",
      onboardingCompleted: true
    },
    {
      name: "Mike Chen",
      email: "mike@coursehub.edu",
      sellerType: "course_creator",
      subscriptionTier: "agency",
      onboardingCompleted: true
    },
    {
      name: "Emma Davis",
      email: "emma@mindfuljournals.co",
      sellerType: "journal_seller",
      subscriptionTier: "pro",
      onboardingCompleted: true
    },
    {
      name: "Alex Rivera",
      email: "alex@stickerart.studio",
      sellerType: "artist_stickers",
      subscriptionTier: "pro",
      onboardingCompleted: true
    },
    {
      name: "Jordan Taylor",
      email: "jordan@ebookempire.com",
      sellerType: "ebook_seller",
      subscriptionTier: "agency",
      onboardingCompleted: true
    },
    {
      name: "Riley Morgan",
      email: "riley@kidscreative.fun",
      sellerType: "kids_content",
      subscriptionTier: "pro",
      onboardingCompleted: true
    }
  ];
  for (const user of sampleUsers) {
    await storage.createUser(user);
  }
  const plannerTemplates = [
    {
      name: "ADHD Daily Focus Planner",
      description: "A comprehensive daily planner designed specifically for ADHD minds with time-blocking, priority matrices, and dopamine tracking. Includes 180+ pages of structured layouts.",
      sellerType: "planner_creator",
      subCategory: "Daily Planners",
      tier: "free",
      suggestedPrice: 24.99,
      tags: ["ADHD", "Focus", "Daily Planning", "Productivity", "Mental Health"],
      preview: "/previews/adhd-planner.jpg",
      data: {
        pages: 185,
        format: "PDF + PNG",
        printable: true,
        hyperlinks: true,
        features: ["Daily pages", "Weekly overview", "Monthly goals", "Habit tracker", "Priority matrix", "Time blocking"]
      }
    },
    {
      name: "Entrepreneur's Success Tracker",
      description: "Goal-setting and habit-tracking planner for ambitious entrepreneurs with revenue tracking, networking logs, and monthly reviews. Perfect for solopreneurs and small business owners.",
      sellerType: "planner_creator",
      subCategory: "Goal Setting",
      tier: "pro",
      suggestedPrice: 39.99,
      tags: ["Business", "Goals", "Habits", "Success", "Entrepreneur"],
      preview: "/previews/entrepreneur-tracker.jpg",
      data: {
        pages: 220,
        format: "PDF + Excel",
        printable: true,
        features: ["Revenue tracking", "Goal breakdown", "Network mapping", "Monthly reviews", "KPI dashboard", "Action plans"]
      }
    },
    {
      name: "Student Academic Organizer",
      description: "Complete academic planner with assignment trackers, study schedules, grade monitoring, and exam prep guides. Designed for high school and college students.",
      sellerType: "planner_creator",
      subCategory: "Academic",
      tier: "free",
      suggestedPrice: 19.99,
      tags: ["Student", "Academic", "Study", "Organization", "School"],
      preview: "/previews/student-organizer.jpg",
      data: {
        pages: 150,
        format: "PDF",
        printable: true,
        features: ["Assignment tracker", "Study schedule", "Grade tracker", "Exam prep", "Note templates", "Project planner"]
      }
    },
    {
      name: "Wellness & Self-Care Planner",
      description: "Holistic wellness planner focusing on mental health, physical wellness, and self-care routines. Includes mood tracking, gratitude pages, and wellness challenges.",
      sellerType: "planner_creator",
      subCategory: "Wellness",
      tier: "pro",
      suggestedPrice: 29.99,
      tags: ["Wellness", "Self-Care", "Mental Health", "Habits", "Mindfulness"],
      preview: "/previews/wellness-planner.jpg",
      data: {
        pages: 160,
        format: "PDF + PNG",
        printable: true,
        features: ["Mood tracker", "Gratitude journal", "Wellness challenges", "Self-care checklists", "Reflection prompts"]
      }
    },
    {
      name: "Budget Boss Financial Planner",
      description: "Comprehensive financial planning system with budget trackers, debt payoff plans, savings goals, and investment tracking. Perfect for personal finance management.",
      sellerType: "planner_creator",
      subCategory: "Finance",
      tier: "pro",
      suggestedPrice: 34.99,
      tags: ["Finance", "Budget", "Money", "Savings", "Investment"],
      preview: "/previews/budget-planner.jpg",
      data: {
        pages: 195,
        format: "PDF + Excel",
        printable: true,
        features: ["Monthly budgets", "Debt tracker", "Savings goals", "Investment log", "Expense categories", "Financial goals"]
      }
    }
  ];
  const journalTemplates = [
    {
      name: "Self-Love Journey Journal",
      description: "90-day guided journal with daily affirmations, gratitude practices, and self-compassion exercises for building authentic self-love. Includes weekly check-ins and progress tracking.",
      sellerType: "journal_seller",
      subCategory: "Self-Care",
      tier: "free",
      suggestedPrice: 27.99,
      tags: ["Self-Love", "Mindfulness", "Gratitude", "Personal Growth", "Mental Health"],
      preview: "/previews/self-love-journal.jpg",
      data: {
        pages: 95,
        duration: "90 days",
        format: "PDF + Digital",
        features: ["Daily affirmations", "Gratitude practice", "Self-compassion exercises", "Weekly reflections", "Progress tracking"]
      }
    },
    {
      name: "Anxiety Relief Workbook",
      description: "Therapeutic journal combining CBT techniques, mindfulness practices, and anxiety tracking tools for mental wellness. Created by licensed therapists.",
      sellerType: "journal_seller",
      subCategory: "Mental Health",
      tier: "pro",
      suggestedPrice: 34.99,
      tags: ["Anxiety", "Mental Health", "CBT", "Mindfulness", "Therapy"],
      preview: "/previews/anxiety-workbook.jpg",
      data: {
        pages: 120,
        format: "PDF + Interactive",
        features: ["CBT worksheets", "Anxiety tracking", "Mindfulness exercises", "Coping strategies", "Progress monitoring"]
      }
    },
    {
      name: "Manifestation & Goal Journal",
      description: "Powerful manifestation journal with visualization exercises, goal setting frameworks, and abundance mindset practices. Transform your dreams into reality.",
      sellerType: "journal_seller",
      subCategory: "Personal Growth",
      tier: "pro",
      suggestedPrice: 31.99,
      tags: ["Manifestation", "Goals", "Visualization", "Abundance", "Success"],
      preview: "/previews/manifestation-journal.jpg",
      data: {
        pages: 110,
        format: "PDF + Audio guides",
        features: ["Visualization exercises", "Goal frameworks", "Abundance practices", "Moon phases tracker", "Success tracking"]
      }
    },
    {
      name: "Grief & Healing Journal",
      description: "Compassionate journal for processing grief and loss with guided prompts, memory pages, and healing exercises. Designed with grief counselors.",
      sellerType: "journal_seller",
      subCategory: "Mental Health",
      tier: "pro",
      suggestedPrice: 29.99,
      tags: ["Grief", "Healing", "Loss", "Mental Health", "Recovery"],
      preview: "/previews/grief-journal.jpg",
      data: {
        pages: 85,
        format: "PDF + Digital",
        features: ["Guided prompts", "Memory pages", "Healing exercises", "Emotion tracking", "Support resources"]
      }
    }
  ];
  const courseTemplates = [
    {
      name: "Professional Slide Deck Mastery",
      description: "Complete slide deck template collection for course creators with 50+ professionally designed layouts and presentation guides.",
      sellerType: "course_creator",
      subCategory: "Presentation Templates",
      tier: "pro",
      suggestedPrice: 49.99,
      tags: ["Presentations", "Teaching", "Course Creation", "Design", "Professional"]
    },
    {
      name: "Online Course Launch Kit",
      description: "Everything needed to launch an online course: sales pages, email sequences, student workbooks, and marketing materials.",
      sellerType: "course_creator",
      subCategory: "Course Materials",
      tier: "agency",
      suggestedPrice: 89.99,
      tags: ["Course Launch", "Marketing", "Sales", "Education", "Online Business"]
    }
  ];
  const stickerTemplates = [
    {
      name: "Wellness & Self-Care Sticker Pack",
      description: "50 hand-drawn digital stickers featuring motivational quotes, wellness icons, and self-care reminders for planners and journals.",
      sellerType: "artist_stickers",
      subCategory: "Digital Stickers",
      tier: "free",
      suggestedPrice: 12.99,
      tags: ["Stickers", "Wellness", "Self-Care", "Digital Art", "Planner Accessories"]
    },
    {
      name: "Productivity Power-Up Collection",
      description: "Vibrant sticker collection with productivity themes, goal celebrations, and motivational graphics for digital and print use.",
      sellerType: "artist_stickers",
      subCategory: "Digital Stickers",
      tier: "pro",
      suggestedPrice: 16.99,
      tags: ["Productivity", "Goals", "Motivation", "Digital Art", "Stickers"]
    }
  ];
  const ebookTemplates = [
    {
      name: "Professional eBook Template Suite",
      description: "15 stunning eBook layouts with table of contents, chapter dividers, and professional typography for non-fiction authors.",
      sellerType: "ebook_seller",
      subCategory: "eBook Templates",
      tier: "pro",
      suggestedPrice: 29.99,
      tags: ["eBook", "Publishing", "Templates", "Non-Fiction", "Professional"]
    }
  ];
  const kidsTemplates = [
    {
      name: "Educational Activity Coloring Book",
      description: "30-page coloring book teaching letters, numbers, and shapes with engaging characters and educational content for ages 3-7.",
      sellerType: "kids_content",
      subCategory: "Coloring Books",
      tier: "free",
      suggestedPrice: 8.99,
      tags: ["Kids", "Education", "Coloring", "Learning", "Ages 3-7"]
    }
  ];
  const allTemplates = [
    ...plannerTemplates,
    ...journalTemplates,
    ...courseTemplates,
    ...stickerTemplates,
    ...ebookTemplates,
    ...kidsTemplates
  ];
  for (const template of allTemplates) {
    await storage.createProductTemplate(template);
  }
  const designElements2 = [
    {
      name: "Minimalist Icon Set",
      category: "icons",
      tier: "free",
      url: "/assets/icons/minimalist-set.svg",
      type: "svg",
      tags: ["icons", "minimalist", "ui", "interface"]
    },
    {
      name: "Watercolor Brush Collection",
      category: "brushes",
      tier: "pro",
      url: "/assets/brushes/watercolor.zip",
      type: "zip",
      tags: ["brushes", "watercolor", "artistic", "texture"]
    },
    {
      name: "Motivational Quote Stickers",
      category: "stickers",
      tier: "free",
      url: "/assets/stickers/motivational.svg",
      type: "svg",
      tags: ["stickers", "quotes", "motivation", "text"]
    },
    {
      name: "Progress Tracking Widgets",
      category: "widgets",
      tier: "pro",
      url: "/assets/widgets/progress.svg",
      type: "svg",
      tags: ["widgets", "progress", "tracking", "interactive"]
    },
    {
      name: "Magazine Layout Grids",
      category: "layouts",
      tier: "agency",
      url: "/assets/layouts/magazine.zip",
      type: "zip",
      tags: ["layouts", "magazine", "grid", "editorial"]
    }
  ];
  for (const element of designElements2) {
    await storage.createDesignElement(element);
  }
  const aiContent2 = [
    {
      sellerType: "planner_creator",
      contentType: "product_description",
      title: "ADHD Planner Description",
      content: "Transform your daily chaos into focused productivity with this ADHD-friendly planner. Featuring time-blocking templates, dopamine tracking, and gentle accountability systems designed by neurodivergent creators for neurodivergent minds."
    },
    {
      sellerType: "planner_creator",
      contentType: "social_caption",
      title: "Instagram Caption - Daily Planner",
      content: "\u2728 Finally, a planner that gets your ADHD brain! No more overwhelming pages or impossible daily goals. Just real, sustainable planning that actually works. Who's ready to turn their beautiful chaos into focused action? \u{1F9E0}\u{1F4AA} #ADHDPlanner #ProductivityTips #NeurodivergentLife"
    },
    {
      sellerType: "journal_seller",
      contentType: "email_template",
      title: "Self-Love Journal Launch Email",
      content: "Subject: Your 90-day self-love transformation starts now \u2728\n\nHey beautiful soul,\n\nRemember that inner critic that tells you you're not enough? It's time to replace that voice with one of compassion and love.\n\nYour Self-Love Journey Journal is more than pages \u2013 it's your daily companion for building unshakeable self-worth.\n\nReady to fall in love with yourself? Let's begin."
    },
    {
      sellerType: "course_creator",
      contentType: "pricing_strategy",
      title: "Course Template Pricing Guide",
      content: "Price Range: $47-89 | Sweet Spot: $67\n\nPosition as 'Done-for-You Course Creation System' - emphasize time savings (20+ hours of design work). Bundle with bonus email templates for higher conversion. Launch at $47 early bird, increase to $67 after 100 sales."
    },
    {
      sellerType: "artist_stickers",
      contentType: "hashtag_sets",
      title: "Wellness Sticker Hashtags",
      content: "#wellnessstickers #selfcarestickers #digitalstickers #plannerstickers #journalstickers #wellnessplanner #selfcareart #mindfulnessart #digitalwellness #plannercommunity #stickeraddict #wellnessjourney #selfcaretools #plannergirl #digitalart"
    }
  ];
  for (const content of aiContent2) {
    await storage.createAiContent(content);
  }
  const storefrontTemplates2 = [
    {
      name: "Wellness Brand Storefront",
      type: "wellness",
      preview: "/templates/wellness-storefront.jpg",
      data: {
        colorScheme: "sage-pink",
        layout: "centered",
        features: ["product-grid", "testimonials", "about-section"]
      },
      tier: "free"
    },
    {
      name: "Professional Course Hub",
      type: "professional",
      preview: "/templates/course-hub.jpg",
      data: {
        colorScheme: "navy-gold",
        layout: "sidebar",
        features: ["course-catalog", "instructor-bio", "student-portal", "reviews"]
      },
      tier: "pro"
    },
    {
      name: "Creative Portfolio Shop",
      type: "creative",
      preview: "/templates/creative-portfolio.jpg",
      data: {
        colorScheme: "rainbow-dark",
        layout: "masonry",
        features: ["portfolio-gallery", "custom-orders", "art-process", "client-testimonials"]
      },
      tier: "agency"
    }
  ];
  for (const template of storefrontTemplates2) {
    await storage.createStorefrontTemplate(template);
  }
  const workflows2 = [
    {
      name: "Quick Launch Path",
      description: "Get your first digital product to market in under 2 hours with this step-by-step roadmap",
      estimatedTime: 120,
      difficulty: "beginner",
      tier: "free",
      steps: [
        { title: "Choose Your Product Type", description: "Select from planner, journal, or course template", estimatedMinutes: 5 },
        { title: "Pick a Winning Template", description: "Browse seller-specific templates and choose your favorite", estimatedMinutes: 10 },
        { title: "Customize with AI Content", description: "Let AI generate your product description and marketing copy", estimatedMinutes: 15 },
        { title: "Add Your Brand Colors", description: "Apply your brand kit or choose from our professional palettes", estimatedMinutes: 10 },
        { title: "Create Your Sales Page", description: "Use our storefront templates to build your product page", estimatedMinutes: 20 },
        { title: "Set Your Price", description: "Use AI pricing suggestions based on your niche and competition", estimatedMinutes: 5 },
        { title: "Export & Upload", description: "Generate your final files and upload to your preferred platform", estimatedMinutes: 15 },
        { title: "Launch & Celebrate", description: "Share your new product and start making sales!", estimatedMinutes: 5 }
      ]
    },
    {
      name: "7-Day Launch Plan",
      description: "Comprehensive weekly strategy for market research, product creation, and successful launch",
      estimatedTime: 10080,
      difficulty: "intermediate",
      tier: "pro",
      steps: [
        { title: "Day 1: Market Research", description: "Analyze competitors and validate your product idea", estimatedMinutes: 120 },
        { title: "Day 2: Content Planning", description: "Outline your product structure and content strategy", estimatedMinutes: 90 },
        { title: "Day 3: Design & Creation", description: "Build your product using templates and custom content", estimatedMinutes: 180 },
        { title: "Day 4: Brand Development", description: "Create consistent branding and visual identity", estimatedMinutes: 120 },
        { title: "Day 5: Sales Page Creation", description: "Build compelling sales page with testimonials and benefits", estimatedMinutes: 150 },
        { title: "Day 6: Marketing Setup", description: "Prepare social media content and email sequences", estimatedMinutes: 120 },
        { title: "Day 7: Launch Day", description: "Execute your launch plan and monitor initial sales", estimatedMinutes: 240 }
      ]
    },
    {
      name: "Digital Product Brain Dump",
      description: "Systematic approach to generate unlimited product ideas from your expertise",
      estimatedTime: 60,
      difficulty: "beginner",
      tier: "free",
      steps: [
        { title: "Skills Inventory", description: "List all your skills, experiences, and knowledge areas", estimatedMinutes: 15 },
        { title: "Problem Identification", description: "Identify problems you've solved in your life or work", estimatedMinutes: 15 },
        { title: "Format Brainstorming", description: "Match problems to digital product formats (planner, course, etc.)", estimatedMinutes: 15 },
        { title: "Audience Mapping", description: "Define who would buy each potential product", estimatedMinutes: 10 },
        { title: "Priority Ranking", description: "Score ideas based on demand, competition, and your passion", estimatedMinutes: 5 }
      ]
    },
    {
      name: "Monetization Tracker",
      description: "Visual dashboard system for tracking income streams and growth metrics",
      estimatedTime: 30,
      difficulty: "beginner",
      tier: "free",
      steps: [
        { title: "Income Stream Setup", description: "Define all your current and planned revenue sources", estimatedMinutes: 10 },
        { title: "Goal Setting", description: "Set monthly and yearly financial targets", estimatedMinutes: 5 },
        { title: "Tracking Dashboard", description: "Set up your personalized income tracking system", estimatedMinutes: 10 },
        { title: "Progress Review", description: "Schedule weekly check-ins and monthly deep dives", estimatedMinutes: 5 }
      ]
    }
  ];
  for (const workflow of workflows2) {
    await storage.createWorkflow(workflow);
  }
  const brandKits2 = [
    {
      userId: "user-1",
      name: "Wellness & Mindfulness Brand",
      colorPalette: ["#8B9A8B", "#F4E4C1", "#E07A7A"],
      fonts: ["Inter", "Playfair Display"],
      logos: ["/brand-kits/wellness-logo.svg"]
    },
    {
      userId: "user-2",
      name: "Professional Educator Brand",
      colorPalette: ["#2C3E50", "#3498DB", "#F39C12"],
      fonts: ["Source Sans Pro", "Merriweather"],
      logos: ["/brand-kits/educator-logo.svg"]
    }
  ];
  for (const brandKit of brandKits2) {
    await storage.createBrandKit(brandKit);
  }
  await populateCreatorContent();
  const { populateAllSections: populateAllSections2 } = await Promise.resolve().then(() => (init_populate_comprehensive(), populate_comprehensive_exports));
  const additionalContent = await populateAllSections2();
  console.log("\u2705 CreatorCore populated with comprehensive pre-originated content!");
  console.log(`\u{1F4CA} Platform ready with: ${allTemplates.length + additionalContent.templates} product templates, ${designElements2.length + additionalContent.designElements} design elements, ${aiContent2.length + additionalContent.aiContent} AI content pieces, ${storefrontTemplates2.length} storefront templates, ${workflows2.length} workflows, ${brandKits2.length} brand kits, ${sampleUsers.length} creator profiles`);
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    version: process.env.npm_package_version || "1.0.0"
  });
});
app.get("/ready", (req, res) => {
  res.status(200).json({
    status: "ready",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
(async () => {
  const server = await registerRoutes(app);
  try {
    await seedDatabase();
  } catch (error) {
    console.error("Database seeding failed:", error);
  }
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "80", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
