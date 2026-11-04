import type { Metadata } from "next";
import { getContent } from "@/lib/get-content";
import type { ServiceKey } from "@/lib/services";
import { ServiceDetail } from "./service-pages";

/*
 * Each service has its own static route folder (no URL params), so every page
 * is fully prerendered and navigations to it are instant.
 */
export function serviceRoute(key: ServiceKey) {
  async function generateMetadata(): Promise<Metadata> {
    const service = (await getContent()).services[key];
    return { title: service.seoTitle, description: service.seoDescription };
  }

  async function Page() {
    const content = await getContent();
    return <ServiceDetail content={content} serviceKey={key} />;
  }

  return { generateMetadata, Page };
}
