import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { modernSlavery } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Modern slavery and human trafficking statement",
  description: "Shepley Spring Ltd's statement under section 54 of the Modern Slavery Act 2015.",
  alternates: { canonical: "/modern-slavery-statement" },
};

export default function Page() {
  return (
    <LegalPage
      path="/modern-slavery-statement"
      title="Modern slavery and human trafficking statement"
      intro="Shepley Spring Ltd takes a zero-tolerance approach to modern slavery, in our own business and throughout our supply chains."
      sections={modernSlavery}
    />
  );
}
