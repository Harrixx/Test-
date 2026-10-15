import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { cookies } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Cookies policy",
  description: "How the Shepley Spring website uses cookies, and how to control them.",
  alternates: { canonical: "/cookies-policy" },
};

export default function Page() {
  return (
    <LegalPage
      path="/cookies-policy"
      title="Cookies policy"
      intro="Like most websites, we sometimes place small data files called cookies on your device. Here is what they do and how you can control them."
      sections={cookies}
    />
  );
}
