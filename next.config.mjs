/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  basePath: isProd ? "/E-learning" : "",
  assetPrefix: isProd ? "/E-learning/" : "",

  images: {
    unoptimized: true,
    domains: [
      "xxonkdbeoydoxftexluw.supabase.co",
      "lh3.googleusercontent.com",
    ],
  },
};

export default nextConfig;
