const withImages = require("next-images");
const withNextCircularDeps = require("next-circular-dependency");

module.exports = withImages({
  // Enable compression
  compress: true,

  // Webpack optimizations - minimal for compatibility
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

    return config;
  },
});
