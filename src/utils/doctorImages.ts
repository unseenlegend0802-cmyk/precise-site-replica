// Central map of doctor image imports for Vite compatibility
const images = import.meta.glob('/src/assets/doctors/*.png', { eager: true, import: 'default' }) as Record<string, string>;

/**
 * Resolves a doctor image_url path (e.g. "/src/assets/doctors/saiteja.png")
 * to a Vite-compatible URL that works in production builds.
 */
export function resolveDoctorImage(imageUrl: string | null): string | null {
  if (!imageUrl) return null;
  // If it's already an absolute URL, return as-is
  if (imageUrl.startsWith('http')) return imageUrl;
  // Try to resolve from the glob map
  return images[imageUrl] ?? null;
}
