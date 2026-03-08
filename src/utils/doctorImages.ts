/**
 * Maps doctor slugs to their resolved image URLs using featuredDoctors imports.
 * This ensures Vite-resolved asset URLs are used in the profile pages.
 */
import { featuredDoctors } from "@/data/featuredDoctors";

const slugToImage: Record<string, string> = {};
featuredDoctors.forEach((d) => {
  slugToImage[d.slug] = d.image;
});

export function getDoctorImage(slug: string): string | null {
  return slugToImage[slug] || null;
}
