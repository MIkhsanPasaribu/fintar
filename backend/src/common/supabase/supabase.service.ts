import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;
  private isAvailable = false;

  constructor(private configService: ConfigService) {
    this.initializeSupabase();
  }

  private initializeSupabase() {
    try {
      const supabaseUrl = this.configService.get<string>("SUPABASE_URL");
      const supabaseKey = this.configService.get<string>("SUPABASE_ANON_KEY");

      if (!supabaseUrl || !supabaseKey) {
        this.logger.warn(
          "⚠️ Supabase credentials not configured, service disabled"
        );
        return;
      }

      this.supabase = createClient(supabaseUrl, supabaseKey);
      this.isAvailable = true;
      this.logger.log("✅ Supabase client initialized");
    } catch (error) {
      this.logger.error("❌ Failed to initialize Supabase client:", error);
    }
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  isSupabaseAvailable(): boolean {
    return this.isAvailable;
  }

  // Helper method for database operations
  from(table: string) {
    if (!this.isAvailable) {
      throw new Error("Supabase is not available");
    }
    return this.supabase.from(table);
  }

  // Auth operations
  async signIn(email: string, password: string) {
    if (!this.isAvailable) {
      throw new Error("Supabase is not available");
    }

    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(`Sign in attempt ${attempt} for email: ${email}`);

        const { data, error } = await this.supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(`Authentication failed: ${error.message}`);
        }

        this.logger.log(`Sign in successful for email: ${email}`);
        return { data, error: null };
      } catch (error) {
        this.logger.error(`Sign in attempt ${attempt} failed:`, error);

        if (attempt === maxRetries) {
          this.logger.error(
            `All ${maxRetries} sign in attempts failed for: ${email}`
          );
          throw error;
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  async signUp(email: string, password: string, metadata?: any) {
    if (!this.isAvailable) {
      throw new Error("Supabase is not available");
    }

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    return { data, error };
  }

  async signOut() {
    if (!this.isAvailable) {
      throw new Error("Supabase is not available");
    }

    const { error } = await this.supabase.auth.signOut();
    return { error };
  }
}
