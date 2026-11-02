import type { Metadata } from "next";
import { getContent } from "@/lib/get-content";
import LandingPage from "./landing-page";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent();
  return { title: seo.title, description: seo.description };
}

export default async function Home() {
  const content = await getContent();
  return <LandingPage content={content} />;
}
