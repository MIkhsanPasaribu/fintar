import { Injectable, Logger } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>("SUPABASE_URL");
    const supabaseKey = this.configService.get<string>("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn(
        "Supabase configuration is missing - service will be disabled"
      );
      // Don't throw error, just log warning and continue
      return;
    }

    try {
      this.supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: false,
        },
        global: {
          fetch: (url, options) => {
            const timeoutSignal = AbortSignal.timeout(10000); // Reduced to 10 seconds
            return fetch(url, {
              ...options,
              signal: timeoutSignal,
            });
          },
        },
      });
      this.logger.log("Supabase client initialized successfully");
    } catch (error) {
      this.logger.error("Failed to initialize Supabase client:", error);
      // Don't throw error, just log and continue without Supabase
    }
  }

  async signIn(email: string, password: string, retries = 3) {
    if (!this.supabase) {
      throw new Error("Supabase client is not initialized");
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.logger.log(`Sign in attempt ${attempt} for email: ${email}`);

        const { data, error } = await this.supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          this.logger.error(`Supabase auth error: ${error.message}`);

          // Handle specific auth errors that shouldn't be retried
          if (
            error.message.includes("Invalid login credentials") ||
            error.message.includes("Invalid API key") ||
            error.message.includes("Email not confirmed")
          ) {
            throw new Error(`Authentication failed: ${error.message}`);
          }

          throw new Error(`Authentication failed: ${error.message}`);
        }

        this.logger.log(`Sign in successful for email: ${email}`);
        return data;
      } catch (error) {
        this.logger.error(`Sign in attempt ${attempt} failed:`, error);

        const errorMessage =
          error instanceof Error ? error.message : String(error);

        // Don't retry for these specific errors
        if (
          errorMessage.includes("Invalid login credentials") ||
          errorMessage.includes("Invalid API key") ||
          errorMessage.includes("Email not confirmed")
        ) {
          throw error;
        }

        if (attempt === retries) {
          if (
            errorMessage.includes("UND_ERR_CONNECT_TIMEOUT") ||
            errorMessage.includes("fetch failed") ||
            errorMessage.includes("timeout")
          ) {
            throw new Error(
              "Supabase connection timeout. Please try again later."
            );
          }
          throw new Error(
            `Authentication service unavailable after ${retries} attempts`
          );
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  async signUp(email: string, password: string, retries = 3) {
    if (!this.supabase) {
      throw new Error("Supabase client is not initialized");
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.logger.log(`Sign up attempt ${attempt} for email: ${email}`);

        const { data, error } = await this.supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          this.logger.error(`Supabase signup error: ${error.message}`);

          // Handle specific signup errors that shouldn't be retried
          if (
            error.message.includes("User already registered") ||
            error.message.includes("Invalid API key") ||
            error.message.includes("Invalid email") ||
            error.message.includes("Password should be")
          ) {
            throw new Error(`Registration failed: ${error.message}`);
          }

          throw new Error(`Registration failed: ${error.message}`);
        }

        this.logger.log(`Sign up successful for email: ${email}`);
        return data;
      } catch (error) {
        this.logger.error(`Sign up attempt ${attempt} failed:`, error);

        const errorMessage =
          error instanceof Error ? error.message : String(error);

        // Don't retry for these specific errors
        if (
          errorMessage.includes("User already registered") ||
          errorMessage.includes("Invalid API key") ||
          errorMessage.includes("Invalid email") ||
          errorMessage.includes("Password should be")
        ) {
          throw error;
        }

        if (attempt === retries) {
          if (
            errorMessage.includes("UND_ERR_CONNECT_TIMEOUT") ||
            errorMessage.includes("fetch failed") ||
            errorMessage.includes("timeout")
          ) {
            throw new Error(
              "Supabase connection timeout. Please try again later."
            );
          }
          throw new Error(
            `Registration service unavailable after ${retries} attempts`
          );
        }

        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  async healthCheck(): Promise<boolean> {
    if (!this.supabase) {
      return false;
    }

    try {
      // Simple health check by attempting to get session
      const { data } = await this.supabase.auth.getSession();
      return true;
    } catch (error) {
      this.logger.error("Supabase health check failed:", error);
      return false;
    }
  }

  async signOut() {
    if (!this.supabase) {
      throw new Error("Supabase client is not initialized");
    }

    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        this.logger.error(`Supabase sign out error: ${error.message}`);
        throw new Error(`Sign out failed: ${error.message}`);
      }
      this.logger.log("User signed out successfully");
    } catch (error) {
      this.logger.error("Sign out failed:", error);
      throw error;
    }
  }

  // Database operations methods
  isSupabaseAvailable(): boolean {
    try {
      const supabaseUrl = this.configService.get<string>("SUPABASE_URL");
      const supabaseKey = this.configService.get<string>("SUPABASE_ANON_KEY");
      return !!(supabaseUrl && supabaseKey && this.supabase);
    } catch (error) {
      this.logger.error("Supabase availability check failed:", error);
      return false;
    }
  }

  from(table: string) {
    if (!this.supabase) {
      throw new Error("Supabase client is not initialized");
    }
    return this.supabase.from(table);
  }

  // Additional utility methods for database operations
  async testConnection(): Promise<boolean> {
    if (!this.supabase) {
      return false;
    }

    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("count", { count: "exact", head: true });

      return !error;
    } catch (error) {
      this.logger.error("Supabase connection test failed:", error);
      return false;
    }
  }
}
