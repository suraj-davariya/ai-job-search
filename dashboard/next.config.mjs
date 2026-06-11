/** @type {import('next').NextConfig} */
const nextConfig = {
  // No remote images, no Google Fonts network fetch — fully local (REQ-5008 / NFR-0017).
  images: { remotePatterns: [] },
  // Disable Next telemetry-style analytics by convention; no external calls.
  poweredByHeader: false,
};
export default nextConfig;
