import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import BackButton from "./BackButton";

const defaultUrl = process.env.VERCEL_URL ? "https://supasplit.vercel.app/" : "http://localhost:3000";

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
    <div className="flex-1 w-full flex flex-col gap-5 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <a href={defaultUrl} className="flex items-center gap-x-2">
            <Image src="/favicon-3.png" height={45} width={45} alt="supasplit" />
            <span className="hidden md:block">supasplit</span>
          </a>

          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="w-[90vw] md:max-w-[70vw] lg:max-w-[50vw]">
          <BackButton />
          {children}
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          © 2024 Developed by{" "}
          <a href="https://github.com/diniftryn" target="_blank" className="hover:underline" rel="noreferrer">
            DF
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
}
