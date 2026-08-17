import { loadPublishedContent } from "./load-published-content";
import { buildSiteFrame, isEmptyManagedPage } from "./site-content";

export function getSiteFrame() {
  return buildSiteFrame(loadPublishedContent());
}

export function getManagedPage<Key extends "home" | "about" | "services" | "testimonials" | "contact">(key: Key) {
  const content = loadPublishedContent();
  if (!content || isEmptyManagedPage(content.pages[key])) return null;
  return content.pages[key];
}
