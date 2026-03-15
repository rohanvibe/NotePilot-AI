import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

export default withSerwist({
  reactStrictMode: true,
  serverExternalPackages: ["pdf-parse", "mammoth"],
  // Optimize for modern browsers
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
});
