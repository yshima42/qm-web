export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      achievement_records: {
        Row: {
          achieved_at: string | null;
          achievement_key: string;
          id: string;
          user_id: string;
        };
        Insert: {
          achieved_at?: string | null;
          achievement_key: string;
          id?: string;
          user_id: string;
        };
        Update: {
          achieved_at?: string | null;
          achievement_key?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "achievement_records_achievement_key_fkey";
            columns: ["achievement_key"];
            isOneToOne: false;
            referencedRelation: "achievements";
            referencedColumns: ["key"];
          },
          {
            foreignKeyName: "achievement_records_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      achievements: {
        Row: {
          created_at: string | null;
          key: string;
        };
        Insert: {
          created_at?: string | null;
          key: string;
        };
        Update: {
          created_at?: string | null;
          key?: string;
        };
        Relationships: [];
      };
      article_comment_likes: {
        Row: {
          comment_id: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          comment_id: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          comment_id?: string;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "article_comment_likes_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "article_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "article_comment_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      article_comments: {
        Row: {
          article_id: string;
          content: string;
          created_at: string;
          id: string;
          parent_comment_id: string | null;
          user_id: string;
        };
        Insert: {
          article_id: string;
          content: string;
          created_at?: string;
          id?: string;
          parent_comment_id?: string | null;
          user_id: string;
        };
        Update: {
          article_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          parent_comment_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "article_comments_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "article_comments_parent_comment_id_fkey";
            columns: ["parent_comment_id"];
            isOneToOne: false;
            referencedRelation: "article_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "article_comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      article_likes: {
        Row: {
          article_id: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          article_id: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          article_id?: string;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "article_likes_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "article_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      articles: {
        Row: {
          content: string;
          created_at: string;
          custom_habit_name: string | null;
          habit_category_id: string | null;
          id: string;
          is_published: boolean;
          published_at: string | null;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          custom_habit_name?: string | null;
          habit_category_id?: string | null;
          id?: string;
          is_published?: boolean;
          published_at?: string | null;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          custom_habit_name?: string | null;
          habit_category_id?: string | null;
          id?: string;
          is_published?: boolean;
          published_at?: string | null;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "articles_habit_category_id_fkey";
            columns: ["habit_category_id"];
            isOneToOne: false;
            referencedRelation: "habit_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "articles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      blocked_users: {
        Row: {
          blocked_id: string;
          blocker_id: string;
          created_at: string;
        };
        Insert: {
          blocked_id: string;
          blocker_id: string;
          created_at?: string;
        };
        Update: {
          blocked_id?: string;
          blocker_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blocked_users_blocked_id_fkey";
            columns: ["blocked_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blocked_users_blocker_id_fkey";
            columns: ["blocker_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      breathings: {
        Row: {
          created_at: string | null;
          duration_seconds: number;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          duration_seconds: number;
          id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          duration_seconds?: number;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "breathings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      challenge_record_images: {
        Row: {
          challenge_record_id: string | null;
          created_at: string | null;
          id: string;
          image_url: string;
        };
        Insert: {
          challenge_record_id?: string | null;
          created_at?: string | null;
          id?: string;
          image_url: string;
        };
        Update: {
          challenge_record_id?: string | null;
          created_at?: string | null;
          id?: string;
          image_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "challenge_record_images_challenge_record_id_fkey";
            columns: ["challenge_record_id"];
            isOneToOne: false;
            referencedRelation: "challenge_records";
            referencedColumns: ["id"];
          },
        ];
      };
      challenge_records: {
        Row: {
          challenge_key: string;
          completed_at: string | null;
          id: string;
          is_failed: boolean | null;
          started_at: string | null;
          user_id: string;
        };
        Insert: {
          challenge_key: string;
          completed_at?: string | null;
          id?: string;
          is_failed?: boolean | null;
          started_at?: string | null;
          user_id: string;
        };
        Update: {
          challenge_key?: string;
          completed_at?: string | null;
          id?: string;
          is_failed?: boolean | null;
          started_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "challenge_records_challenge_key_fkey";
            columns: ["challenge_key"];
            isOneToOne: false;
            referencedRelation: "challenges";
            referencedColumns: ["key"];
          },
          {
            foreignKeyName: "challenge_records_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      challenges: {
        Row: {
          created_at: string | null;
          key: string;
        };
        Insert: {
          created_at?: string | null;
          key: string;
        };
        Update: {
          created_at?: string | null;
          key?: string;
        };
        Relationships: [];
      };
      comment_likes: {
        Row: {
          comment_id: string;
          created_at: string;
          user_id: string;
        };
        Insert: {
          comment_id: string;
          created_at?: string;
          user_id: string;
        };
        Update: {
          comment_id?: string;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      comments: {
        Row: {
          content: string | null;
          created_at: string;
          id: string;
          parent_comment_id: string | null;
          story_id: string;
          user_id: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          id?: string;
          parent_comment_id?: string | null;
          story_id: string;
          user_id: string;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          id?: string;
          parent_comment_id?: string | null;
          story_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_parent_comment_id_fkey";
            columns: ["parent_comment_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      daily_active_users: {
        Row: {
          active_date: string;
          created_at: string;
          id: string;
          user_id: string | null;
        };
        Insert: {
          active_date: string;
          created_at?: string;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          active_date?: string;
          created_at?: string;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "daily_active_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      dp_excluded_stories: {
        Row: {
          created_at: string | null;
          id: string;
          reason: string | null;
          story_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          reason?: string | null;
          story_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          reason?: string | null;
          story_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_story";
            columns: ["story_id"];
            isOneToOne: true;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      dp_quotes: {
        Row: {
          created_at: string;
          display_date: string;
          id: string;
          quote_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_date: string;
          id?: string;
          quote_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_date?: string;
          id?: string;
          quote_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dp_quotes_quote_id_fkey";
            columns: ["quote_id"];
            isOneToOne: false;
            referencedRelation: "quotes";
            referencedColumns: ["id"];
          },
        ];
      };
      dp_qw_session_sequences: {
        Row: {
          id: string;
          sequence_order: number;
          session_id: string;
        };
        Insert: {
          id?: string;
          sequence_order: number;
          session_id: string;
        };
        Update: {
          id?: string;
          sequence_order?: number;
          session_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dp_qw_session_sequences_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "qw_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      dp_stories: {
        Row: {
          created_at: string | null;
          id: string;
          story_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          story_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          story_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_story";
            columns: ["story_id"];
            isOneToOne: true;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      dp_stories_candidates: {
        Row: {
          created_at: string | null;
          id: string;
          story_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          story_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          story_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_story";
            columns: ["story_id"];
            isOneToOne: true;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      dp_tasks: {
        Row: {
          task_type: string;
        };
        Insert: {
          task_type: string;
        };
        Update: {
          task_type?: string;
        };
        Relationships: [];
      };
      dp_user_completed_dates: {
        Row: {
          completion_date: string;
          created_at: string | null;
          id: string;
          user_id: string | null;
        };
        Insert: {
          completion_date: string;
          created_at?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          completion_date?: string;
          created_at?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "dp_user_completed_dates_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      dp_user_qw_progresses: {
        Row: {
          created_at: string | null;
          id: string;
          last_completed_session_sequence_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          last_completed_session_sequence_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          last_completed_session_sequence_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dp_user_qw_progresses_last_completed_session_sequence_id_fkey";
            columns: ["last_completed_session_sequence_id"];
            isOneToOne: false;
            referencedRelation: "dp_qw_session_sequences";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dp_user_qw_progresses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      dp_user_read_stories: {
        Row: {
          date: string;
          dp_story_id: string;
          id: string;
          read_at: string | null;
          user_id: string;
        };
        Insert: {
          date: string;
          dp_story_id: string;
          id?: string;
          read_at?: string | null;
          user_id: string;
        };
        Update: {
          date?: string;
          dp_story_id?: string;
          id?: string;
          read_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_dp_story";
            columns: ["dp_story_id"];
            isOneToOne: false;
            referencedRelation: "dp_stories";
            referencedColumns: ["story_id"];
          },
          {
            foreignKeyName: "fk_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      dp_user_tasks: {
        Row: {
          created_at: string | null;
          date: string;
          id: string;
          task_type: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          id?: string;
          task_type?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          id?: string;
          task_type?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "dp_user_tasks_task_type_fkey";
            columns: ["task_type"];
            isOneToOne: false;
            referencedRelation: "dp_tasks";
            referencedColumns: ["task_type"];
          },
          {
            foreignKeyName: "dp_user_tasks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      followers: {
        Row: {
          created_at: string;
          followed_id: string;
          follower_id: string;
        };
        Insert: {
          created_at?: string;
          followed_id: string;
          follower_id: string;
        };
        Update: {
          created_at?: string;
          followed_id?: string;
          follower_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "followers_followed_id_fkey";
            columns: ["followed_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "followers_follower_id_fkey";
            columns: ["follower_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      habit_baselines: {
        Row: {
          created_at: string;
          duration_months: number;
          frequency_per_week: number;
          habit_id: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          duration_months: number;
          frequency_per_week: number;
          habit_id: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          duration_months?: number;
          frequency_per_week?: number;
          habit_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "habit_baselines_habit_id_fkey";
            columns: ["habit_id"];
            isOneToOne: true;
            referencedRelation: "habits";
            referencedColumns: ["id"];
          },
        ];
      };
      habit_categories: {
        Row: {
          created_at: string;
          habit_category_name: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          habit_category_name: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          habit_category_name?: string;
          id?: string;
        };
        Relationships: [];
      };
      habits: {
        Row: {
          created_at: string;
          custom_habit_name: string | null;
          display_order: number | null;
          habit_category_id: string;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          custom_habit_name?: string | null;
          display_order?: number | null;
          habit_category_id: string;
          id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          custom_habit_name?: string | null;
          display_order?: number | null;
          habit_category_id?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "habits_habit_category_id_fkey";
            columns: ["habit_category_id"];
            isOneToOne: false;
            referencedRelation: "habit_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "habits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      likes: {
        Row: {
          created_at: string;
          story_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          story_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          story_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "likes_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "likes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      meditations: {
        Row: {
          created_at: string | null;
          duration_seconds: number;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          duration_seconds: number;
          id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          duration_seconds?: number;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meditations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      meeting_attendance_logs: {
        Row: {
          id: string;
          joined_at: string | null;
          meeting_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          joined_at?: string | null;
          meeting_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          joined_at?: string | null;
          meeting_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meeting_attendance_logs_meeting_id_fkey";
            columns: ["meeting_id"];
            isOneToOne: false;
            referencedRelation: "meetings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meeting_attendance_logs_meeting_id_fkey";
            columns: ["meeting_id"];
            isOneToOne: false;
            referencedRelation: "meetings_active";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meeting_attendance_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      meeting_hosts: {
        Row: {
          created_at: string;
          host_user_id: string;
          id: string;
          meeting_id: string;
        };
        Insert: {
          created_at?: string;
          host_user_id: string;
          id?: string;
          meeting_id: string;
        };
        Update: {
          created_at?: string;
          host_user_id?: string;
          id?: string;
          meeting_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meeting_hosts_host_user_id_fkey";
            columns: ["host_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meeting_hosts_meeting_id_fkey";
            columns: ["meeting_id"];
            isOneToOne: false;
            referencedRelation: "meetings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meeting_hosts_meeting_id_fkey";
            columns: ["meeting_id"];
            isOneToOne: false;
            referencedRelation: "meetings_active";
            referencedColumns: ["id"];
          },
        ];
      };
      meeting_kicked_users: {
        Row: {
          created_at: string;
          id: string;
          kicked_by: string;
          meeting_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          kicked_by: string;
          meeting_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          kicked_by?: string;
          meeting_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meeting_kicked_users_kicked_by_fkey";
            columns: ["kicked_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meeting_kicked_users_meeting_id_fkey";
            columns: ["meeting_id"];
            isOneToOne: false;
            referencedRelation: "meetings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meeting_kicked_users_meeting_id_fkey";
            columns: ["meeting_id"];
            isOneToOne: false;
            referencedRelation: "meetings_active";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meeting_kicked_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      meeting_participants: {
        Row: {
          id: string;
          joined_at: string | null;
          meeting_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          joined_at?: string | null;
          meeting_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          joined_at?: string | null;
          meeting_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meeting_participants_meeting_id_fkey";
            columns: ["meeting_id"];
            isOneToOne: false;
            referencedRelation: "meetings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meeting_participants_meeting_id_fkey";
            columns: ["meeting_id"];
            isOneToOne: false;
            referencedRelation: "meetings_active";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meeting_participants_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      meetings: {
        Row: {
          cancel_reason: string | null;
          created_at: string;
          created_by: string;
          deleted_at: string | null;
          description: string;
          end_at: string;
          format: string;
          id: string;
          is_cancelled: boolean;
          max_participants: number;
          start_at: string;
          title: string;
        };
        Insert: {
          cancel_reason?: string | null;
          created_at?: string;
          created_by: string;
          deleted_at?: string | null;
          description: string;
          end_at: string;
          format?: string;
          id?: string;
          is_cancelled?: boolean;
          max_participants: number;
          start_at: string;
          title: string;
        };
        Update: {
          cancel_reason?: string | null;
          created_at?: string;
          created_by?: string;
          deleted_at?: string | null;
          description?: string;
          end_at?: string;
          format?: string;
          id?: string;
          is_cancelled?: boolean;
          max_participants?: number;
          start_at?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meetings_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notification_categories: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          article_comment_id: string | null;
          article_id: string | null;
          comment_id: string | null;
          content: string | null;
          created_at: string;
          id: string;
          is_read: boolean;
          notification_category_id: string;
          story_id: string | null;
          target_user_id: string;
          trigger_user_id: string | null;
        };
        Insert: {
          article_comment_id?: string | null;
          article_id?: string | null;
          comment_id?: string | null;
          content?: string | null;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          notification_category_id: string;
          story_id?: string | null;
          target_user_id: string;
          trigger_user_id?: string | null;
        };
        Update: {
          article_comment_id?: string | null;
          article_id?: string | null;
          comment_id?: string | null;
          content?: string | null;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          notification_category_id?: string;
          story_id?: string | null;
          target_user_id?: string;
          trigger_user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_article_comment_id_fkey";
            columns: ["article_comment_id"];
            isOneToOne: false;
            referencedRelation: "article_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_notification_category_id_fkey";
            columns: ["notification_category_id"];
            isOneToOne: false;
            referencedRelation: "notification_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_target_user_id_fkey";
            columns: ["target_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notifications_trigger_user_id_fkey";
            columns: ["trigger_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string;
          id: string;
          last_login: string | null;
          user_name: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name: string;
          id: string;
          last_login?: string | null;
          user_name: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string;
          id?: string;
          last_login?: string | null;
          user_name?: string;
        };
        Relationships: [];
      };
      quotes: {
        Row: {
          author: string | null;
          background_image_url: string | null;
          created_at: string;
          id: string;
          language: string;
          quote_text: string;
          source: string | null;
          updated_at: string;
        };
        Insert: {
          author?: string | null;
          background_image_url?: string | null;
          created_at?: string;
          id?: string;
          language: string;
          quote_text: string;
          source?: string | null;
          updated_at?: string;
        };
        Update: {
          author?: string | null;
          background_image_url?: string | null;
          created_at?: string;
          id?: string;
          language?: string;
          quote_text?: string;
          source?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      quotes_user_favorite: {
        Row: {
          created_at: string;
          id: string;
          quote_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          quote_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          quote_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quotes_user_favorite_quote_id_fkey";
            columns: ["quote_id"];
            isOneToOne: false;
            referencedRelation: "quotes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quotes_user_favorite_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      qw_chapters: {
        Row: {
          key: string;
        };
        Insert: {
          key: string;
        };
        Update: {
          key?: string;
        };
        Relationships: [];
      };
      qw_emotions: {
        Row: {
          emotion_type: string;
        };
        Insert: {
          emotion_type: string;
        };
        Update: {
          emotion_type?: string;
        };
        Relationships: [];
      };
      qw_exercises: {
        Row: {
          id: string;
          key: string;
          qw_session_id: string;
          sort_order: number;
          type: Database["public"]["Enums"]["qw_exercise_type"];
        };
        Insert: {
          id?: string;
          key: string;
          qw_session_id: string;
          sort_order: number;
          type: Database["public"]["Enums"]["qw_exercise_type"];
        };
        Update: {
          id?: string;
          key?: string;
          qw_session_id?: string;
          sort_order?: number;
          type?: Database["public"]["Enums"]["qw_exercise_type"];
        };
        Relationships: [
          {
            foreignKeyName: "qw_exercises_qw_session_id_fkey";
            columns: ["qw_session_id"];
            isOneToOne: false;
            referencedRelation: "qw_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      qw_modules: {
        Row: {
          image_url: string | null;
          key: string;
          qw_chapter_key: string;
          sort_order: number;
        };
        Insert: {
          image_url?: string | null;
          key: string;
          qw_chapter_key: string;
          sort_order: number;
        };
        Update: {
          image_url?: string | null;
          key?: string;
          qw_chapter_key?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "qw_modules_qw_chapter_key_fkey";
            columns: ["qw_chapter_key"];
            isOneToOne: false;
            referencedRelation: "qw_chapters";
            referencedColumns: ["key"];
          },
        ];
      };
      qw_sessions: {
        Row: {
          estimated_duration: number | null;
          id: string;
          image_url: string | null;
          key: string;
          qw_module_key: string;
          sort_order: number;
        };
        Insert: {
          estimated_duration?: number | null;
          id?: string;
          image_url?: string | null;
          key: string;
          qw_module_key: string;
          sort_order: number;
        };
        Update: {
          estimated_duration?: number | null;
          id?: string;
          image_url?: string | null;
          key?: string;
          qw_module_key?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "qw_sessions_qw_module_key_fkey";
            columns: ["qw_module_key"];
            isOneToOne: false;
            referencedRelation: "qw_modules";
            referencedColumns: ["key"];
          },
        ];
      };
      qw_user_emotion_exercise_inputs: {
        Row: {
          emotion_type: string;
          emotion_value: number;
          id: string;
          qw_user_emotion_exercise_id: string;
        };
        Insert: {
          emotion_type: string;
          emotion_value: number;
          id?: string;
          qw_user_emotion_exercise_id: string;
        };
        Update: {
          emotion_type?: string;
          emotion_value?: number;
          id?: string;
          qw_user_emotion_exercise_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "qw_user_emotion_exercise_input_qw_user_emotion_exercise_id_fkey";
            columns: ["qw_user_emotion_exercise_id"];
            isOneToOne: false;
            referencedRelation: "qw_user_emotion_exercises";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "qw_user_emotion_exercise_inputs_emotion_type_fkey";
            columns: ["emotion_type"];
            isOneToOne: false;
            referencedRelation: "qw_emotions";
            referencedColumns: ["emotion_type"];
          },
        ];
      };
      qw_user_emotion_exercises: {
        Row: {
          created_at: string | null;
          id: string;
          qw_exercise_id: string;
          qw_user_sessions_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          qw_exercise_id: string;
          qw_user_sessions_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          qw_exercise_id?: string;
          qw_user_sessions_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "qw_user_emotion_exercises_qw_exercise_id_fkey";
            columns: ["qw_exercise_id"];
            isOneToOne: false;
            referencedRelation: "qw_exercises";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "qw_user_emotion_exercises_qw_user_sessions_id_fkey";
            columns: ["qw_user_sessions_id"];
            isOneToOne: false;
            referencedRelation: "qw_user_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      qw_user_sessions: {
        Row: {
          created_at: string | null;
          id: string;
          qw_session_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          qw_session_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          qw_session_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "qw_user_sessions_qw_session_id_fkey";
            columns: ["qw_session_id"];
            isOneToOne: false;
            referencedRelation: "qw_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "qw_user_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      qw_user_write_exercises: {
        Row: {
          created_at: string | null;
          id: string;
          input_text: string;
          qw_exercise_id: string;
          qw_user_sessions_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          input_text: string;
          qw_exercise_id: string;
          qw_user_sessions_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          input_text?: string;
          qw_exercise_id?: string;
          qw_user_sessions_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "qw_user_write_exercises_qw_exercise_id_fkey";
            columns: ["qw_exercise_id"];
            isOneToOne: false;
            referencedRelation: "qw_exercises";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "qw_user_write_exercises_qw_user_sessions_id_fkey";
            columns: ["qw_user_sessions_id"];
            isOneToOne: false;
            referencedRelation: "qw_user_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      reasons: {
        Row: {
          content: string;
          created_at: string;
          habit_id: string;
          id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          habit_id: string;
          id?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          habit_id?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reasons_habit_id_fkey";
            columns: ["habit_id"];
            isOneToOne: false;
            referencedRelation: "habits";
            referencedColumns: ["id"];
          },
        ];
      };
      reports: {
        Row: {
          article_comment_id: string | null;
          article_id: string | null;
          comment_id: string | null;
          created_at: string;
          id: string;
          profile_id: string | null;
          report_reason: string | null;
          reporter_id: string;
          story_id: string | null;
        };
        Insert: {
          article_comment_id?: string | null;
          article_id?: string | null;
          comment_id?: string | null;
          created_at?: string;
          id?: string;
          profile_id?: string | null;
          report_reason?: string | null;
          reporter_id: string;
          story_id?: string | null;
        };
        Update: {
          article_comment_id?: string | null;
          article_id?: string | null;
          comment_id?: string | null;
          created_at?: string;
          id?: string;
          profile_id?: string | null;
          report_reason?: string | null;
          reporter_id?: string;
          story_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_article";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_article_comment";
            columns: ["article_comment_id"];
            isOneToOne: false;
            referencedRelation: "article_comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_reporter_id_fkey";
            columns: ["reporter_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
        ];
      };
      sp_emotions: {
        Row: {
          emotion_type: string;
        };
        Insert: {
          emotion_type: string;
        };
        Update: {
          emotion_type?: string;
        };
        Relationships: [];
      };
      sp_exercises: {
        Row: {
          key: string;
          sort_order: number;
          sp_session_key: string;
          type: Database["public"]["Enums"]["sp_exercise_type"];
        };
        Insert: {
          key: string;
          sort_order: number;
          sp_session_key: string;
          type: Database["public"]["Enums"]["sp_exercise_type"];
        };
        Update: {
          key?: string;
          sort_order?: number;
          sp_session_key?: string;
          type?: Database["public"]["Enums"]["sp_exercise_type"];
        };
        Relationships: [
          {
            foreignKeyName: "sp_exercises_sp_session_key_fkey";
            columns: ["sp_session_key"];
            isOneToOne: false;
            referencedRelation: "sp_sessions";
            referencedColumns: ["key"];
          },
        ];
      };
      sp_sessions: {
        Row: {
          estimated_duration: number | null;
          image_url: string | null;
          key: string;
        };
        Insert: {
          estimated_duration?: number | null;
          image_url?: string | null;
          key: string;
        };
        Update: {
          estimated_duration?: number | null;
          image_url?: string | null;
          key?: string;
        };
        Relationships: [];
      };
      sp_user_emotion_exercise_inputs: {
        Row: {
          emotion_type: string;
          emotion_value: number;
          id: string;
          sp_user_emotion_exercise_id: string;
        };
        Insert: {
          emotion_type: string;
          emotion_value: number;
          id?: string;
          sp_user_emotion_exercise_id: string;
        };
        Update: {
          emotion_type?: string;
          emotion_value?: number;
          id?: string;
          sp_user_emotion_exercise_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sp_user_emotion_exercise_input_sp_user_emotion_exercise_id_fkey";
            columns: ["sp_user_emotion_exercise_id"];
            isOneToOne: false;
            referencedRelation: "sp_user_emotion_exercises";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sp_user_emotion_exercise_inputs_emotion_type_fkey";
            columns: ["emotion_type"];
            isOneToOne: false;
            referencedRelation: "sp_emotions";
            referencedColumns: ["emotion_type"];
          },
        ];
      };
      sp_user_emotion_exercises: {
        Row: {
          created_at: string | null;
          id: string;
          sp_exercise_key: string;
          sp_user_sessions_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          sp_exercise_key: string;
          sp_user_sessions_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          sp_exercise_key?: string;
          sp_user_sessions_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sp_user_emotion_exercises_sp_exercise_key_fkey";
            columns: ["sp_exercise_key"];
            isOneToOne: false;
            referencedRelation: "sp_exercises";
            referencedColumns: ["key"];
          },
          {
            foreignKeyName: "sp_user_emotion_exercises_sp_user_sessions_id_fkey";
            columns: ["sp_user_sessions_id"];
            isOneToOne: false;
            referencedRelation: "sp_user_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      sp_user_sessions: {
        Row: {
          created_at: string | null;
          id: string;
          sp_session_key: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          sp_session_key: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          sp_session_key?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sp_user_sessions_sp_session_key_fkey";
            columns: ["sp_session_key"];
            isOneToOne: false;
            referencedRelation: "sp_sessions";
            referencedColumns: ["key"];
          },
          {
            foreignKeyName: "sp_user_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      sp_user_write_exercises: {
        Row: {
          created_at: string | null;
          id: string;
          input_text: string;
          sp_exercise_key: string;
          sp_user_sessions_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          input_text: string;
          sp_exercise_key: string;
          sp_user_sessions_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          input_text?: string;
          sp_exercise_key?: string;
          sp_user_sessions_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sp_user_write_exercises_sp_exercise_key_fkey";
            columns: ["sp_exercise_key"];
            isOneToOne: false;
            referencedRelation: "sp_exercises";
            referencedColumns: ["key"];
          },
          {
            foreignKeyName: "sp_user_write_exercises_sp_user_sessions_id_fkey";
            columns: ["sp_user_sessions_id"];
            isOneToOne: false;
            referencedRelation: "sp_user_sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      stories: {
        Row: {
          article_id: string | null;
          challenge_record_id: string | null;
          comment_setting: string;
          content: string;
          created_at: string;
          custom_habit_name: string | null;
          habit_category_id: string;
          id: string;
          is_reason: boolean;
          qw_user_session_id: string | null;
          sp_user_session_id: string | null;
          story_topic_id: string | null;
          trial_elapsed_days: number;
          trial_started_at: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          article_id?: string | null;
          challenge_record_id?: string | null;
          comment_setting?: string;
          content: string;
          created_at?: string;
          custom_habit_name?: string | null;
          habit_category_id: string;
          id?: string;
          is_reason?: boolean;
          qw_user_session_id?: string | null;
          sp_user_session_id?: string | null;
          story_topic_id?: string | null;
          trial_elapsed_days?: number;
          trial_started_at: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          article_id?: string | null;
          challenge_record_id?: string | null;
          comment_setting?: string;
          content?: string;
          created_at?: string;
          custom_habit_name?: string | null;
          habit_category_id?: string;
          id?: string;
          is_reason?: boolean;
          qw_user_session_id?: string | null;
          sp_user_session_id?: string | null;
          story_topic_id?: string | null;
          trial_elapsed_days?: number;
          trial_started_at?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "stories_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stories_challenge_record_id_fkey";
            columns: ["challenge_record_id"];
            isOneToOne: false;
            referencedRelation: "challenge_records";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stories_habit_category_id_fkey";
            columns: ["habit_category_id"];
            isOneToOne: false;
            referencedRelation: "habit_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stories_qw_user_sessions_id_fkey";
            columns: ["qw_user_session_id"];
            isOneToOne: false;
            referencedRelation: "qw_user_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stories_sp_user_session_id_fkey";
            columns: ["sp_user_session_id"];
            isOneToOne: false;
            referencedRelation: "sp_user_sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stories_story_topic_id_fkey";
            columns: ["story_topic_id"];
            isOneToOne: false;
            referencedRelation: "story_topics";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "stories_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      story_tags: {
        Row: {
          created_at: string;
          story_id: string;
          tag_id: string;
        };
        Insert: {
          created_at?: string;
          story_id: string;
          tag_id: string;
        };
        Update: {
          created_at?: string;
          story_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "story_tags_story_id_fkey";
            columns: ["story_id"];
            isOneToOne: false;
            referencedRelation: "stories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "story_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      story_topics: {
        Row: {
          actual_ended_at: string | null;
          actual_started_at: string | null;
          content: string;
          created_at: string;
          id: string;
          key: string;
          planned_ended_at: string;
          planned_started_at: string;
          title: string;
        };
        Insert: {
          actual_ended_at?: string | null;
          actual_started_at?: string | null;
          content: string;
          created_at?: string;
          id?: string;
          key: string;
          planned_ended_at: string;
          planned_started_at: string;
          title?: string;
        };
        Update: {
          actual_ended_at?: string | null;
          actual_started_at?: string | null;
          content?: string;
          created_at?: string;
          id?: string;
          key?: string;
          planned_ended_at?: string;
          planned_started_at?: string;
          title?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          app_user_id: string | null;
          currency: string | null;
          environment: string | null;
          event_type: string | null;
          expiration_at: string | null;
          id: string;
          original_transaction_id: string | null;
          period_type: string | null;
          price: number | null;
          product_id: string | null;
          purchased_at: string | null;
          store: string | null;
          transaction_id: string | null;
        };
        Insert: {
          app_user_id?: string | null;
          currency?: string | null;
          environment?: string | null;
          event_type?: string | null;
          expiration_at?: string | null;
          id?: string;
          original_transaction_id?: string | null;
          period_type?: string | null;
          price?: number | null;
          product_id?: string | null;
          purchased_at?: string | null;
          store?: string | null;
          transaction_id?: string | null;
        };
        Update: {
          app_user_id?: string | null;
          currency?: string | null;
          environment?: string | null;
          event_type?: string | null;
          expiration_at?: string | null;
          id?: string;
          original_transaction_id?: string | null;
          period_type?: string | null;
          price?: number | null;
          product_id?: string | null;
          purchased_at?: string | null;
          store?: string | null;
          transaction_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_app_user_id_fkey";
            columns: ["app_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      suspended_users: {
        Row: {
          created_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "suspended_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      trials: {
        Row: {
          created_at: string;
          ended_at: string | null;
          habit_id: string;
          id: string;
          started_at: string;
        };
        Insert: {
          created_at?: string;
          ended_at?: string | null;
          habit_id: string;
          id?: string;
          started_at?: string;
        };
        Update: {
          created_at?: string;
          ended_at?: string | null;
          habit_id?: string;
          id?: string;
          started_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trials_habit_id_fkey";
            columns: ["habit_id"];
            isOneToOne: false;
            referencedRelation: "habits";
            referencedColumns: ["id"];
          },
        ];
      };
      user_fcm_tokens: {
        Row: {
          created_at: string | null;
          id: string;
          token: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          token: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          token?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_fcm_tokens_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      meetings_active: {
        Row: {
          cancel_reason: string | null;
          created_at: string | null;
          created_by: string | null;
          deleted_at: string | null;
          description: string | null;
          end_at: string | null;
          format: string | null;
          id: string | null;
          is_cancelled: boolean | null;
          max_participants: number | null;
          start_at: string | null;
          title: string | null;
        };
        Insert: {
          cancel_reason?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          end_at?: string | null;
          format?: string | null;
          id?: string | null;
          is_cancelled?: boolean | null;
          max_participants?: number | null;
          start_at?: string | null;
          title?: string | null;
        };
        Update: {
          cancel_reason?: string | null;
          created_at?: string | null;
          created_by?: string | null;
          deleted_at?: string | null;
          description?: string | null;
          end_at?: string | null;
          format?: string | null;
          id?: string | null;
          is_cancelled?: boolean | null;
          max_participants?: number | null;
          start_at?: string | null;
          title?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "meetings_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      achv_calculate_current_streak: {
        Args: {
          p_user_id: string;
        };
        Returns: number;
      };
      achv_calculate_max_streak: {
        Args: {
          p_user_id: string;
        };
        Returns: number;
      };
      achv_get_breathing_days_count: {
        Args: {
          p_user_id: string;
          p_timezone?: string;
          p_base_hour?: number;
          p_base_minute?: number;
        };
        Returns: number;
      };
      achv_get_comment_days_count: {
        Args: {
          p_user_id: string;
          p_timezone?: string;
          p_base_hour?: number;
          p_base_minute?: number;
        };
        Returns: number;
      };
      achv_get_login_streak_days_count: {
        Args: {
          p_user_id: string;
        };
        Returns: number;
      };
      achv_get_meditation_days_count: {
        Args: {
          p_user_id: string;
          p_timezone?: string;
          p_base_hour?: number;
          p_base_minute?: number;
        };
        Returns: number;
      };
      achv_get_meeting_count: {
        Args: {
          p_user_id: string;
        };
        Returns: number;
      };
      achv_get_post_days_count: {
        Args: {
          p_user_id: string;
          p_timezone?: string;
          p_base_hour?: number;
          p_base_minute?: number;
          p_since_date?: string;
        };
        Returns: number;
      };
      article_get_comment_liked_users: {
        Args: {
          comment_id: string;
          current_user_id: string;
        };
        Returns: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string;
          id: string;
          last_login: string | null;
          user_name: string;
        }[];
      };
      article_get_comment_tile_data: {
        Args: {
          p_article_id: string;
          p_current_user_id: string;
        };
        Returns: Database["public"]["CompositeTypes"]["article_comment_tile_data"][];
      };
      article_get_liked_users: {
        Args: {
          article_id: string;
          current_user_id: string;
        };
        Returns: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string;
          id: string;
          last_login: string | null;
          user_name: string;
        }[];
      };
      article_get_published_tile_data: {
        Args: {
          article_ids: string[];
          current_user_id: string;
        };
        Returns: Database["public"]["CompositeTypes"]["article_tile_data"][];
      };
      article_get_single_tile_data: {
        Args: {
          article_id: string;
          current_user_id: string;
        };
        Returns: Database["public"]["CompositeTypes"]["article_tile_data"];
      };
      article_get_unblocked_comment_count: {
        Args: {
          article_id: string;
          current_user_id: string;
        };
        Returns: number;
      };
      article_get_unblocked_like_count: {
        Args: {
          article_id: string;
          current_user_id: string;
        };
        Returns: number;
      };
      calculate_reference_date: {
        Args: {
          p_user_timezone: string;
          p_reference_time: string;
          p_current_timestamp?: string;
        };
        Returns: string;
      };
      challenge_get_latest_challenges: {
        Args: {
          p_user_id: string;
          p_challenge_keys?: string[];
        };
        Returns: {
          challenge_key: string;
          completed_at: string | null;
          id: string;
          is_failed: boolean | null;
          started_at: string | null;
          user_id: string;
        }[];
      };
      check_all_stories_are_reasons: {
        Args: {
          p_user_id: string;
        };
        Returns: boolean;
      };
      create_notification: {
        Args: {
          p_target_user_id: string;
          p_category_id: string;
          p_trigger_user_id: string;
          p_story_id?: string;
          p_comment_id?: string;
          p_article_id?: string;
          p_article_comment_id?: string;
        };
        Returns: undefined;
      };
      delete_empty_sp_user_sessions:
        | {
            Args: Record<PropertyKey, never>;
            Returns: undefined;
          }
        | {
            Args: {
              target_user_id: string;
            };
            Returns: undefined;
          };
      delete_user: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      dp_complete_story_task: {
        Args: {
          p_user_id: string;
          p_date: string;
          p_dp_story_id: string;
        };
        Returns: undefined;
      };
      dp_get_latest_challenge_completions: {
        Args: {
          p_user_id: string;
          p_challenge_keys?: string[];
        };
        Returns: {
          challenge_key: string;
          completed_at: string;
        }[];
      };
      dp_get_latest_sp_session_completions: {
        Args: {
          p_user_id: string;
          p_session_keys?: string[];
        };
        Returns: {
          session_key: string;
          completed_at: string;
        }[];
      };
      dp_get_latest_topic_completions: {
        Args: {
          p_user_id: string;
          p_topic_keys?: string[];
        };
        Returns: {
          topic_key: string;
          completed_at: string;
        }[];
      };
      dp_get_next_qw_session_sequence_id: {
        Args: {
          p_current_session_sequence_id: string;
        };
        Returns: string;
      };
      dp_get_story_for_user: {
        Args: {
          p_user_id: string;
          p_user_timezone: string;
          p_reference_time?: string;
          p_current_timestamp?: string;
        };
        Returns: string;
      };
      dp_get_user_qw_session_sequence: {
        Args: {
          p_user_id: string;
          p_user_timezone: string;
          p_reference_time?: string;
          p_current_timestamp?: string;
        };
        Returns: {
          id: string;
          sequence_order: number;
          session_id: string;
        };
      };
      dp_insert_story_candidates: {
        Args: {
          p_count_per_habit: number;
          p_habit_name?: string;
          p_excluded_user_ids?: string[];
        };
        Returns: {
          habit_category_name: string;
          period: string;
          inserted_count: number;
        }[];
      };
      dp_process_story_candidates: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      dp_update_qw_progress_and_tasks: {
        Args: {
          p_user_id: string;
          p_last_completed_session_sequence_id: string;
          p_user_timezone: string;
          p_reference_time?: string;
          p_current_timestamp?: string;
        };
        Returns: undefined;
      };
      get_comment_counts_by_story_ids: {
        Args: {
          p_story_ids: string[];
          p_user_id: string;
        };
        Returns: {
          story_id: string;
          comment_count: number;
        }[];
      };
      get_comment_liked_users: {
        Args: {
          p_comment_id: string;
          p_user_id: string;
        };
        Returns: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string;
          id: string;
          last_login: string | null;
          user_name: string;
        }[];
      };
      get_commented_stories: {
        Args: {
          commenter_id: string;
          user_id: string;
          from_pos: number;
          to_pos: number;
          before_timestamp: string;
        };
        Returns: {
          article_id: string | null;
          challenge_record_id: string | null;
          comment_setting: string;
          content: string;
          created_at: string;
          custom_habit_name: string | null;
          habit_category_id: string;
          id: string;
          is_reason: boolean;
          qw_user_session_id: string | null;
          sp_user_session_id: string | null;
          story_topic_id: string | null;
          trial_elapsed_days: number;
          trial_started_at: string;
          updated_at: string | null;
          user_id: string;
        }[];
      };
      get_comments_by_story: {
        Args: {
          p_story_id: string;
          p_user_id: string;
        };
        Returns: {
          content: string | null;
          created_at: string;
          id: string;
          parent_comment_id: string | null;
          story_id: string;
          user_id: string;
        }[];
      };
      get_current_story_topic: {
        Args: Record<PropertyKey, never>;
        Returns: {
          actual_ended_at: string | null;
          actual_started_at: string | null;
          content: string;
          created_at: string;
          id: string;
          key: string;
          planned_ended_at: string;
          planned_started_at: string;
          title: string;
        }[];
      };
      get_current_time: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_followed_user_stories_excluding_blocked: {
        Args: {
          input_user_id: string;
          from_pos: number;
          to_pos: number;
          before_timestamp: string;
        };
        Returns: {
          article_id: string | null;
          challenge_record_id: string | null;
          comment_setting: string;
          content: string;
          created_at: string;
          custom_habit_name: string | null;
          habit_category_id: string;
          id: string;
          is_reason: boolean;
          qw_user_session_id: string | null;
          sp_user_session_id: string | null;
          story_topic_id: string | null;
          trial_elapsed_days: number;
          trial_started_at: string;
          updated_at: string | null;
          user_id: string;
        }[];
      };
      get_has_liked_by_comment_ids: {
        Args: {
          p_comment_ids: string[];
          p_user_id: string;
        };
        Returns: {
          comment_id: string;
          has_liked: boolean;
        }[];
      };
      get_has_liked_by_story_ids: {
        Args: {
          p_story_ids: string[];
          p_user_id: string;
        };
        Returns: {
          story_id: string;
          has_liked: boolean;
        }[];
      };
      get_latest_story_owners_by_category: {
        Args: {
          input_habit_category_name?: string;
        };
        Returns: {
          avatar_url: string;
          trial_elapsed_days: number;
          created_at: string;
        }[];
      };
      get_like_counts_by_comment_ids: {
        Args: {
          p_comment_ids: string[];
          p_user_id: string;
        };
        Returns: {
          comment_id: string;
          like_count: number;
        }[];
      };
      get_like_counts_by_story_ids: {
        Args: {
          p_story_ids: string[];
          p_user_id: string;
        };
        Returns: {
          story_id: string;
          like_count: number;
        }[];
      };
      get_liked_users: {
        Args: {
          p_story_id: string;
          p_user_id: string;
        };
        Returns: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string;
          id: string;
          last_login: string | null;
          user_name: string;
        }[];
      };
      get_meeting_remaining_seconds: {
        Args: {
          meeting_id: string;
        };
        Returns: number;
      };
      get_next_story_topic: {
        Args: Record<PropertyKey, never>;
        Returns: {
          actual_ended_at: string | null;
          actual_started_at: string | null;
          content: string;
          created_at: string;
          id: string;
          key: string;
          planned_ended_at: string;
          planned_started_at: string;
          title: string;
        }[];
      };
      get_profiles_by_search: {
        Args: {
          p_search_text: string;
          p_user_id: string;
        };
        Returns: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string;
          id: string;
          last_login: string | null;
          user_name: string;
        }[];
      };
      get_ranged_published_article_ids: {
        Args: {
          current_user_id: string;
          from_pos: number;
          to_pos: number;
          before_timestamp?: string;
        };
        Returns: {
          id: string;
        }[];
      };
      get_ranged_stories_by_habit_and_milestone: {
        Args: {
          input_habit_category_name: string;
          milestone_from: number;
          milestone_to: number;
          from_pos: number;
          to_pos: number;
          before_timestamp: string;
        };
        Returns: {
          article_id: string | null;
          challenge_record_id: string | null;
          comment_setting: string;
          content: string;
          created_at: string;
          custom_habit_name: string | null;
          habit_category_id: string;
          id: string;
          is_reason: boolean;
          qw_user_session_id: string | null;
          sp_user_session_id: string | null;
          story_topic_id: string | null;
          trial_elapsed_days: number;
          trial_started_at: string;
          updated_at: string | null;
          user_id: string;
        }[];
      };
      get_ranged_stories_by_habit_including_official: {
        Args: {
          input_habit_category_name: string;
          from_pos: number;
          to_pos: number;
          before_timestamp: string;
        };
        Returns: {
          article_id: string | null;
          challenge_record_id: string | null;
          comment_setting: string;
          content: string;
          created_at: string;
          custom_habit_name: string | null;
          habit_category_id: string;
          id: string;
          is_reason: boolean;
          qw_user_session_id: string | null;
          sp_user_session_id: string | null;
          story_topic_id: string | null;
          trial_elapsed_days: number;
          trial_started_at: string;
          updated_at: string | null;
          user_id: string;
        }[];
      };
      get_reason_stories_by_habit: {
        Args: {
          p_habit_category_name: string;
          p_user_id: string;
          p_from_pos: number;
          p_to_pos: number;
          p_before_timestamp: string;
        };
        Returns: {
          article_id: string | null;
          challenge_record_id: string | null;
          comment_setting: string;
          content: string;
          created_at: string;
          custom_habit_name: string | null;
          habit_category_id: string;
          id: string;
          is_reason: boolean;
          qw_user_session_id: string | null;
          sp_user_session_id: string | null;
          story_topic_id: string | null;
          trial_elapsed_days: number;
          trial_started_at: string;
          updated_at: string | null;
          user_id: string;
        }[];
      };
      get_record_counts: {
        Args: Record<PropertyKey, never>;
        Returns: {
          reports_count: number;
          profiles_count: number;
          stories_count: number;
          followers_count: number;
          likes_count: number;
          comment_likes_count: number;
          comments_count: number;
          habit_categories_count: number;
          habits_count: number;
          trials_count: number;
          blocked_users_count: number;
          notification_categories_count: number;
          notifications_count: number;
        }[];
      };
      get_record_counts_created_today: {
        Args: Record<PropertyKey, never>;
        Returns: {
          reports_count: number;
          profiles_count: number;
          stories_count: number;
          followers_count: number;
          likes_count: number;
          comment_likes_count: number;
          comments_count: number;
          habit_categories_count: number;
          habits_count: number;
          trials_count: number;
          blocked_users_count: number;
          notification_categories_count: number;
          notifications_count: number;
        }[];
      };
      get_record_counts_exclude_users: {
        Args: {
          excluded_users: string[];
        };
        Returns: {
          reports_count: number;
          profiles_count: number;
          stories_count: number;
          followers_count: number;
          likes_count: number;
          comment_likes_count: number;
          comments_count: number;
          habit_categories_count: number;
          habits_count: number;
          trials_count: number;
          blocked_users_count: number;
          notification_categories_count: number;
          notifications_count: number;
        }[];
      };
      get_stories_by_habit_and_tag: {
        Args: {
          p_habit_category_name: string;
          p_tag_name: string;
          p_user_id: string;
          p_from_pos: number;
          p_to_pos: number;
          p_before_timestamp: string;
        };
        Returns: {
          article_id: string | null;
          challenge_record_id: string | null;
          comment_setting: string;
          content: string;
          created_at: string;
          custom_habit_name: string | null;
          habit_category_id: string;
          id: string;
          is_reason: boolean;
          qw_user_session_id: string | null;
          sp_user_session_id: string | null;
          story_topic_id: string | null;
          trial_elapsed_days: number;
          trial_started_at: string;
          updated_at: string | null;
          user_id: string;
        }[];
      };
      get_stories_by_search: {
        Args: {
          search_text: string;
          user_id: string;
          from_pos: number;
          to_pos: number;
          before_timestamp: string;
        };
        Returns: {
          article_id: string | null;
          challenge_record_id: string | null;
          comment_setting: string;
          content: string;
          created_at: string;
          custom_habit_name: string | null;
          habit_category_id: string;
          id: string;
          is_reason: boolean;
          qw_user_session_id: string | null;
          sp_user_session_id: string | null;
          story_topic_id: string | null;
          trial_elapsed_days: number;
          trial_started_at: string;
          updated_at: string | null;
          user_id: string;
        }[];
      };
      get_stories_by_topic: {
        Args: {
          topic_id: string;
          user_id: string;
          from_pos: number;
          to_pos: number;
          before_timestamp: string;
        };
        Returns: {
          article_id: string | null;
          challenge_record_id: string | null;
          comment_setting: string;
          content: string;
          created_at: string;
          custom_habit_name: string | null;
          habit_category_id: string;
          id: string;
          is_reason: boolean;
          qw_user_session_id: string | null;
          sp_user_session_id: string | null;
          story_topic_id: string | null;
          trial_elapsed_days: number;
          trial_started_at: string;
          updated_at: string | null;
          user_id: string;
        }[];
      };
      get_story_topics_started_up_to_now: {
        Args: Record<PropertyKey, never>;
        Returns: {
          actual_ended_at: string | null;
          actual_started_at: string | null;
          content: string;
          created_at: string;
          id: string;
          key: string;
          planned_ended_at: string;
          planned_started_at: string;
          title: string;
        }[];
      };
      habit_create_transaction: {
        Args: {
          p_user_id: string;
          p_habit_category_name: string;
          p_custom_habit_name?: string;
          p_reason?: string;
          p_started_at?: string;
          p_duration_months?: number;
          p_frequency_per_week?: number;
        };
        Returns: {
          created_at: string;
          custom_habit_name: string | null;
          display_order: number | null;
          habit_category_id: string;
          id: string;
          user_id: string;
        };
      };
      habit_create_with_trial: {
        Args: {
          p_user_id: string;
          p_habit_category_name: string;
          p_custom_habit_name?: string;
          p_reason?: string;
          p_started_at?: string;
        };
        Returns: undefined;
      };
      habit_restart_trial: {
        Args: {
          p_habit_id: string;
          p_trial_id: string;
        };
        Returns: undefined;
      };
      handle_delete_user_created_objects: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      insert_daily_active_users: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      is_blocked: {
        Args: {
          p_blocker_id: string;
          p_blocked_id: string;
        };
        Returns: boolean;
      };
      is_meeting_open: {
        Args: {
          meeting_id: string;
        };
        Returns: boolean;
      };
      qw_get_user_session_history_excluding_read_only: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          created_at: string | null;
          id: string;
          qw_session_id: string;
          user_id: string;
        }[];
      };
      qw_is_all_sessions_available: {
        Args: {
          p_user_id: string;
        };
        Returns: boolean;
      };
      select_empty_sp_user_sessions: {
        Args: {
          target_user_id: string;
        };
        Returns: {
          id: string;
          user_id: string;
          sp_session_key: string;
          created_at: string;
        }[];
      };
      select_filled_sp_user_sessions: {
        Args: {
          target_user_id: string;
        };
        Returns: {
          id: string;
          user_id: string;
          sp_session_key: string;
          created_at: string;
        }[];
      };
      set_next_daily_quote: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      sp_create_qw_sample_data: {
        Args: {
          p_user_id: string;
        };
        Returns: undefined;
      };
      sp_get_user_session_history_excluding_read_only: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          created_at: string | null;
          id: string;
          sp_session_key: string;
          user_id: string;
        }[];
      };
      sp_migrate_qw_to_sp_data: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      update_habits_order: {
        Args: {
          p_orders: Database["public"]["CompositeTypes"]["habit_order_update"][];
        };
        Returns: undefined;
      };
      update_topic_dates: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      qw_exercise_type: "read" | "write" | "emotion";
      sp_exercise_type: "read" | "write" | "emotion";
    };
    CompositeTypes: {
      article_comment_tile_data: {
        comment_json: Json | null;
        author_json: Json | null;
        parent_comment_json: Json | null;
        parent_comment_author_json: Json | null;
        like_count: number | null;
        is_liked_by_user: boolean | null;
      };
      article_tile_data: {
        article_json: Json | null;
        like_count: number | null;
        comment_count: number | null;
        is_liked_by_user: boolean | null;
        habit_category_name: string | null;
        author_json: Json | null;
      };
      habit_order_update: {
        habit_id: string | null;
        new_order: number | null;
      };
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
