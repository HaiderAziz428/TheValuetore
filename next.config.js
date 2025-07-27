const withImages = require("next-images");
const withNextCircularDeps = require("next-circular-dependency");

module.exports = withImages({
  // Enable compression
  compress: true,

  // Enable image optimization
  images: {
    domains: [
      "your-railway-domain.railway.app",
      "your-supabase-domain.supabase.co",
      "ecommerce-backend-dgnm.onrender.com",
      "flatlogic-ecommerce-backend.herokuapp.com",
    ],
    formats: ["image/webp", "image/avif"],
  },

  // Add caching headers
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, stale-while-revalidate=600",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    };

    // Fix for Node.js modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Add trailing slash for better compatibility
  trailingSlash: false,

  // Disable serverless functions for better performance
  target: "serverless",

  // Add environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
});
