import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { privacy } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Shepley Spring collects, uses and protects personal information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function Page() {
  return (
    <LegalPage
      path="/privacy-policy"
      title="Privacy policy"
      intro="We are committed to safeguarding the privacy of our customers and website visitors. This policy explains what we collect, why, and the rights you have."
      sections={privacy}
    />
  );
}
