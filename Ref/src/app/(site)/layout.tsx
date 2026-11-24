import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LanguageProvider } from "@/lib/i18n/provider";
import { StickyReserve } from "@/components/sticky-reserve";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <StickyReserve />
    </LanguageProvider>
  );
}
