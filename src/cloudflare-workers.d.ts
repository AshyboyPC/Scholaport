declare module "cloudflare:workers" {
  export const env: Cloudflare.Env;
}

declare namespace Cloudflare {
  interface Env {
    EMAIL?: {
      send(message: {
        to: string;
        from: string | { email: string; name?: string };
        replyTo?: string | { email: string; name?: string };
        subject: string;
        html: string;
        text: string;
      }): Promise<{ messageId: string }>;
    };
    WAITLIST_EMAIL_FROM?: string;
    WAITLIST_EMAIL_REPLY_TO?: string;
  }
}
