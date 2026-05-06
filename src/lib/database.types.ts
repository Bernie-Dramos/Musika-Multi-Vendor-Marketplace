export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      forum_comments: {
        Row: {
          author_id: string;
          content: string;
          created_at: string;
          id: string;
          is_answer: boolean;
          post_id: string;
          updated_at: string;
          upvotes: number;
        };
        Insert: {
          author_id: string;
          content: string;
          created_at?: string;
          id?: string;
          is_answer?: boolean;
          post_id: string;
          updated_at?: string;
          upvotes?: number;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          is_answer?: boolean;
          post_id?: string;
          updated_at?: string;
          upvotes?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'forum_comments_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'forum_comments_post_id_fkey';
            columns: ['post_id'];
            isOneToOne: false;
            referencedRelation: 'forum_posts';
            referencedColumns: ['id'];
          },
        ];
      };
      forum_posts: {
        Row: {
          author_id: string;
          category: Database['public']['Enums']['forum_category'];
          content: string;
          created_at: string;
          id: string;
          is_answered: boolean;
          is_trending: boolean;
          replies_count: number;
          saved_count: number;
          slug: string;
          tags: string[];
          title: string;
          updated_at: string;
          upvotes: number;
          views: number;
        };
        Insert: {
          author_id: string;
          category?: Database['public']['Enums']['forum_category'];
          content: string;
          created_at?: string;
          id?: string;
          is_answered?: boolean;
          is_trending?: boolean;
          replies_count?: number;
          saved_count?: number;
          slug: string;
          tags?: string[];
          title: string;
          updated_at?: string;
          upvotes?: number;
          views?: number;
        };
        Update: {
          author_id?: string;
          category?: Database['public']['Enums']['forum_category'];
          content?: string;
          created_at?: string;
          id?: string;
          is_answered?: boolean;
          is_trending?: boolean;
          replies_count?: number;
          saved_count?: number;
          slug?: string;
          tags?: string[];
          title?: string;
          updated_at?: string;
          upvotes?: number;
          views?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'forum_posts_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          country: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          marketing_consent: boolean;
          role: Database['public']['Enums']['user_role'];
          university: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          country?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          marketing_consent?: boolean;
          role?: Database['public']['Enums']['user_role'];
          university?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          country?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          marketing_consent?: boolean;
          role?: Database['public']['Enums']['user_role'];
          university?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      resources: {
        Row: {
          address: string | null;
          category: Database['public']['Enums']['resource_category'];
          city: string | null;
          country: string;
          created_at: string;
          created_by: string | null;
          description: string;
          email: string | null;
          id: number;
          is_free: boolean;
          is_verified: boolean;
          phone: string | null;
          slug: string;
          title: string;
          updated_at: string;
          url: string | null;
        };
        Insert: {
          address?: string | null;
          category: Database['public']['Enums']['resource_category'];
          city?: string | null;
          country: string;
          created_at?: string;
          created_by?: string | null;
          description: string;
          email?: string | null;
          id?: number;
          is_free?: boolean;
          is_verified?: boolean;
          phone?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
          url?: string | null;
        };
        Update: {
          address?: string | null;
          category?: Database['public']['Enums']['resource_category'];
          city?: string | null;
          country?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          email?: string | null;
          id?: number;
          is_free?: boolean;
          is_verified?: boolean;
          phone?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'resources_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      saved_resources: {
        Row: {
          created_at: string;
          id: string;
          resource_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          resource_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          resource_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'saved_resources_resource_id_fkey';
            columns: ['resource_id'];
            isOneToOne: false;
            referencedRelation: 'resources';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'saved_resources_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      support_messages: {
        Row: {
          attachment_urls: string[];
          author_id: string | null;
          author_role: Database['public']['Enums']['support_message_author_role'];
          created_at: string;
          id: string;
          message: string;
          ticket_id: string;
        };
        Insert: {
          attachment_urls?: string[];
          author_id?: string | null;
          author_role: Database['public']['Enums']['support_message_author_role'];
          created_at?: string;
          id?: string;
          message: string;
          ticket_id: string;
        };
        Update: {
          attachment_urls?: string[];
          author_id?: string | null;
          author_role?: Database['public']['Enums']['support_message_author_role'];
          created_at?: string;
          id?: string;
          message?: string;
          ticket_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'support_messages_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'support_messages_ticket_id_fkey';
            columns: ['ticket_id'];
            isOneToOne: false;
            referencedRelation: 'support_tickets';
            referencedColumns: ['id'];
          },
        ];
      };
      support_tickets: {
        Row: {
          category: string;
          created_at: string;
          description: string;
          id: string;
          priority: Database['public']['Enums']['support_ticket_priority'];
          resolved_at: string | null;
          status: Database['public']['Enums']['support_ticket_status'];
          subject: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          description: string;
          id?: string;
          priority?: Database['public']['Enums']['support_ticket_priority'];
          resolved_at?: string | null;
          status?: Database['public']['Enums']['support_ticket_status'];
          subject: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string;
          id?: string;
          priority?: Database['public']['Enums']['support_ticket_priority'];
          resolved_at?: string | null;
          status?: Database['public']['Enums']['support_ticket_status'];
          subject?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'support_tickets_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      vendor_conversations: {
        Row: {
          created_at: string;
          id: string;
          last_message_at: string | null;
          last_message_preview: string | null;
          last_message_sender_id: string | null;
          student_id: string;
          student_unread_count: number;
          updated_at: string;
          vendor_id: string;
          vendor_unread_count: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          last_message_at?: string | null;
          last_message_preview?: string | null;
          last_message_sender_id?: string | null;
          student_id: string;
          student_unread_count?: number;
          updated_at?: string;
          vendor_id: string;
          vendor_unread_count?: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          last_message_at?: string | null;
          last_message_preview?: string | null;
          last_message_sender_id?: string | null;
          student_id?: string;
          student_unread_count?: number;
          updated_at?: string;
          vendor_id?: string;
          vendor_unread_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'vendor_conversations_last_message_sender_id_fkey';
            columns: ['last_message_sender_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'vendor_conversations_student_id_fkey';
            columns: ['student_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'vendor_conversations_vendor_id_fkey';
            columns: ['vendor_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      vendor_messages: {
        Row: {
          conversation_id: string;
          created_at: string;
          id: string;
          message: string;
          read_at: string | null;
          sender_id: string;
          sender_role: Database['public']['Enums']['user_role'];
        };
        Insert: {
          conversation_id: string;
          created_at?: string;
          id?: string;
          message: string;
          read_at?: string | null;
          sender_id: string;
          sender_role: Database['public']['Enums']['user_role'];
        };
        Update: {
          conversation_id?: string;
          created_at?: string;
          id?: string;
          message?: string;
          read_at?: string | null;
          sender_id?: string;
          sender_role?: Database['public']['Enums']['user_role'];
        };
        Relationships: [
          {
            foreignKeyName: 'vendor_messages_conversation_id_fkey';
            columns: ['conversation_id'];
            isOneToOne: false;
            referencedRelation: 'vendor_conversations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'vendor_messages_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      vendor_applications: {
        Row: {
          bank_account_holder: string | null;
          bank_account_number_encrypted: string | null;
          bank_name: string | null;
          business_description: string;
          business_name: string;
          business_registration: string | null;
          business_type: Database['public']['Enums']['vendor_business_type'];
          category: string;
          created_at: string;
          id: string;
          owner_email: string;
          owner_name: string;
          owner_phone: string;
          payment_method: Database['public']['Enums']['payment_method'];
          review_notes: string | null;
          reviewed_at: string | null;
          status: Database['public']['Enums']['vendor_application_status'];
          submitted_at: string | null;
          tax_id: string | null;
          updated_at: string;
          vendor_id: string;
        };
        Insert: {
          bank_account_holder?: string | null;
          bank_account_number_encrypted?: string | null;
          bank_name?: string | null;
          business_description: string;
          business_name: string;
          business_registration?: string | null;
          business_type?: Database['public']['Enums']['vendor_business_type'];
          category: string;
          created_at?: string;
          id?: string;
          owner_email: string;
          owner_name: string;
          owner_phone: string;
          payment_method?: Database['public']['Enums']['payment_method'];
          review_notes?: string | null;
          reviewed_at?: string | null;
          status?: Database['public']['Enums']['vendor_application_status'];
          submitted_at?: string | null;
          tax_id?: string | null;
          updated_at?: string;
          vendor_id: string;
        };
        Update: {
          bank_account_holder?: string | null;
          bank_account_number_encrypted?: string | null;
          bank_name?: string | null;
          business_description?: string;
          business_name?: string;
          business_registration?: string | null;
          business_type?: Database['public']['Enums']['vendor_business_type'];
          category?: string;
          created_at?: string;
          id?: string;
          owner_email?: string;
          owner_name?: string;
          owner_phone?: string;
          payment_method?: Database['public']['Enums']['payment_method'];
          review_notes?: string | null;
          reviewed_at?: string | null;
          status?: Database['public']['Enums']['vendor_application_status'];
          submitted_at?: string | null;
          tax_id?: string | null;
          updated_at?: string;
          vendor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'vendor_applications_vendor_id_fkey';
            columns: ['vendor_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      forum_category: 'housing' | 'academics' | 'legal' | 'events' | 'general';
      payment_method: 'bank_transfer' | 'stripe' | 'paypal';
      resource_category: 'visa' | 'legal' | 'housing' | 'transport' | 'healthcare' | 'discounts' | 'emergency';
      support_message_author_role: 'customer' | 'support';
      support_ticket_priority: 'low' | 'medium' | 'high' | 'urgent';
      support_ticket_status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
      user_role: 'student' | 'vendor' | 'admin';
      vendor_application_status: 'draft' | 'submitted' | 'review' | 'approved' | 'rejected' | 'revision_required';
      vendor_business_type: 'individual' | 'business' | 'non_profit';
    };
    CompositeTypes: Record<string, never>;
  };
};

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type VendorApplicationRow = Database['public']['Tables']['vendor_applications']['Row'];
export type ResourceRow = Database['public']['Tables']['resources']['Row'];
export type ForumPostRow = Database['public']['Tables']['forum_posts']['Row'];
export type ForumCommentRow = Database['public']['Tables']['forum_comments']['Row'];
export type SupportTicketRow = Database['public']['Tables']['support_tickets']['Row'];
export type SupportMessageRow = Database['public']['Tables']['support_messages']['Row'];
export type SavedResourceRow = Database['public']['Tables']['saved_resources']['Row'];
export type VendorConversationRow = Database['public']['Tables']['vendor_conversations']['Row'];
export type VendorMessageRow = Database['public']['Tables']['vendor_messages']['Row'];
