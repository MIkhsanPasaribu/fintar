import { Injectable, OnModuleInit } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const supabaseUrl = this.configService.get<string>("SUPABASE_URL");
    const supabaseKey = this.configService.get<string>("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase URL and Anon Key must be provided");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Auth methods
  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({
      email,
      password,
    });
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getUser(accessToken: string) {
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
