import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient | null = null;
  private isAvailable = false;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Use SUPABASE_URL instead of DATABASE_URL for Supabase client
    const supabaseUrl = this.configService.get<string>("SUPABASE_URL");
    const supabaseKey = this.configService.get<string>("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      this.isAvailable = false;
      this.logger.warn(
        "Supabase integration is disabled: Missing credentials. " +
          "Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables to enable Supabase features."
      );
      return;
    }

    try {
      this.logger.log("Initializing Supabase client...");
      this.supabase = createClient(supabaseUrl, supabaseKey);
      this.isAvailable = true;
      this.logger.log("Supabase client initialized successfully");
    } catch (error) {
      this.isAvailable = false;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Failed to initialize Supabase client: ${errorMessage}`
      );
    }
  }

  getClient(): SupabaseClient {
    if (!this.isAvailable || !this.supabase) {
      throw new Error(
        "Supabase client is not available. Check if credentials are properly configured."
      );
    }
    return this.supabase;
  }

  isSupabaseAvailable(): boolean {
    return this.isAvailable;
  }

  // Auth methods
  async signUp(email: string, password: string) {
    if (!this.isSupabaseAvailable()) {
      throw new Error("Supabase authentication is not available");
    }
    return await this.supabase.auth.signUp({
      email,
      password,
    });
  }

  async signIn(email: string, password: string) {
    if (!this.isSupabaseAvailable()) {
      throw new Error("Supabase authentication is not available");
    }
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signOut() {
    if (!this.isSupabaseAvailable()) {
      throw new Error("Supabase authentication is not available");
    }
    return await this.supabase.auth.signOut();
  }

  async getUser(accessToken: string) {
    if (!this.isSupabaseAvailable()) {
      throw new Error("Supabase authentication is not available");
    }
    return await this.supabase.auth.getUser(accessToken);
  }

  // Database methods
  from(table: string) {
    return this.supabase.from(table);
  }

  // Storage methods
  async uploadFile(bucket: string, path: string, file: File) {
    return await this.supabase.storage.from(bucket).upload(path, file);
  }

  async downloadFile(bucket: string, path: string) {
    return await this.supabase.storage.from(bucket).download(path);
  }

  async deleteFile(bucket: string, path: string) {
    return await this.supabase.storage.from(bucket).remove([path]);
  }

  // Real-time subscriptions
  async subscribe(table: string, callback: (payload: any) => void) {
    return this.supabase
      .channel("custom-all-channel")
      .on("postgres_changes", { event: "*", schema: "public", table }, callback)
      .subscribe();
  }
}
