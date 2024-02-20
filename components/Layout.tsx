import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export default function Layout({ children }: { children: React.ReactNode }) {
  const canInitSupabaseClient = () => {
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <span>
            <a href={defaultUrl}>supasplit</a>
          </span>
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="w-[90vw] md:max-w-[70vw] lg:max-w-[50vw]">{children}</main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          © 2024 Developed by{" "}
          <a href="https://github.com/diniftryn" target="_blank" className="font-bold hover:underline" rel="noreferrer">
            DF
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
}
