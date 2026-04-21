export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PostFormat = "reel" | "image" | "carousel" | "story";
export type PostStatus =
  | "draft"
  | "needs_asset"
  | "approved"
  | "scheduled"
  | "publishing"
  | "published"
  | "failed";
export type AssetType = "image" | "video";
export type AdminRole = "owner" | "admin" | "editor" | "viewer";

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          user_id: string | null;
          email: string;
          role: AdminRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          email: string;
          role?: AdminRole;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
        Relationships: [];
      };
      assets: {
        Row: {
          id: string;
          filename: string;
          type: AssetType;
          storage_url: string;
          public_url: string;
          aspect_ratio: string | null;
          duration_sec: number | null;
          width: number | null;
          height: number | null;
          file_size_bytes: number | null;
          alt_text: string | null;
          checksum: string | null;
          usage_rights_confirmed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          filename: string;
          type: AssetType;
          storage_url: string;
          public_url: string;
          aspect_ratio?: string | null;
          duration_sec?: number | null;
          width?: number | null;
          height?: number | null;
          file_size_bytes?: number | null;
          alt_text?: string | null;
          checksum?: string | null;
          usage_rights_confirmed?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assets"]["Insert"]>;
        Relationships: [];
      };
      content_templates: {
        Row: {
          id: string;
          service: string;
          pillar: string;
          hook: string;
          caption_template: string;
          cta: string | null;
          hashtags: string[];
        };
        Insert: {
          id?: string;
          service: string;
          pillar: string;
          hook: string;
          caption_template: string;
          cta?: string | null;
          hashtags?: string[];
        };
        Update: Partial<Database["public"]["Tables"]["content_templates"]["Insert"]>;
        Relationships: [];
      };
      metrics: {
        Row: {
          id: string;
          post_id: string;
          collected_at: string;
          reach: number | null;
          impressions: number | null;
          views: number | null;
          likes: number | null;
          comments: number | null;
          saves: number | null;
          shares: number | null;
          profile_visits: number | null;
          website_taps: number | null;
        };
        Insert: {
          id?: string;
          post_id: string;
          collected_at?: string;
          reach?: number | null;
          impressions?: number | null;
          views?: number | null;
          likes?: number | null;
          comments?: number | null;
          saves?: number | null;
          shares?: number | null;
          profile_visits?: number | null;
          website_taps?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["metrics"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "metrics_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          platform: string;
          format: PostFormat;
          pillar: string | null;
          status: PostStatus;
          caption: string | null;
          hashtags: string[];
          cta: string | null;
          scheduled_at: string | null;
          timezone: string;
          asset_ids: string[];
          meta_container_id: string | null;
          meta_media_id: string | null;
          permalink: string | null;
          error: string | null;
          owner_approved: boolean;
          price_verified: boolean;
          requires_price_verification: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          platform?: string;
          format: PostFormat;
          pillar?: string | null;
          status?: PostStatus;
          caption?: string | null;
          hashtags?: string[];
          cta?: string | null;
          scheduled_at?: string | null;
          timezone?: string;
          asset_ids?: string[];
          meta_container_id?: string | null;
          meta_media_id?: string | null;
          permalink?: string | null;
          error?: string | null;
          owner_approved?: boolean;
          price_verified?: boolean;
          requires_price_verification?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type AssetRow = Database["public"]["Tables"]["assets"]["Row"];
export type AssetInsert = Database["public"]["Tables"]["assets"]["Insert"];
export type AdminUserInsert = Database["public"]["Tables"]["admin_users"]["Insert"];
export type AdminUserRow = Database["public"]["Tables"]["admin_users"]["Row"];
export type ContentTemplateInsert =
  Database["public"]["Tables"]["content_templates"]["Insert"];
export type ContentTemplateRow =
  Database["public"]["Tables"]["content_templates"]["Row"];
export type MetricInsert = Database["public"]["Tables"]["metrics"]["Insert"];
export type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
export type PostRow = Database["public"]["Tables"]["posts"]["Row"];
