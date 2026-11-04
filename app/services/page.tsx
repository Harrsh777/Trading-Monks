import type { Metadata } from "next";
import { getContent } from "@/lib/get-content";
import { ServicesHub } from "./service-pages";

export async function generateMetadata(): Promise<Metadata> {
  const { services } = await getContent();
  return { title: services.hub.seoTitle, description: services.hub.seoDescription };
}

export default async function ServicesPage() {
  const content = await getContent();
  return <ServicesHub content={content} />;
}
