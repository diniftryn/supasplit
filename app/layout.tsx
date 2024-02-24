import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Layout from "@/components/Layout";

const defaultUrl = process.env.VERCEL_URL ? `http://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "supasplit",
  description: "web app to split shared expenses"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <Layout>{children}</Layout>
        </main>
      </body>
    </html>
  );
}
