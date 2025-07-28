import Link from "next/link";
import { ThemeSwitcher } from "../theme-switcher";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 py-10 text-xs text-muted-foreground">
      <div className="max-w-6xl mx-auto w-full px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>
          © {new Date().getFullYear()} TreatSplit — Built with Supabase & Next.js
        </p>
        <ThemeSwitcher />
        <p>
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            rel="noreferrer"
            className="font-medium hover:underline"
          >
            Supabase
          </a>{" "}
          • <Link href="https://nextjs.org" className="hover:underline">Next.js</Link>
        </p>
      </div>
    </footer>
  );
}
