const baseURLApi =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://your-railway-backend-url.railway.app/api";

export default {
  baseURLApi,
  remote: "https://flatlogic-ecommerce-backend.herokuapp.com/api/:41521",
  isBackend: process.env.REACT_APP_BACKEND,
  // Add timeout configuration
  timeout: 10000, // 10 seconds timeout
  // Add retry configuration
  retryAttempts: 3,
  retryDelay: 1000,
  app: {
    colors: {
      dark: "#002B49",
      light: "#FFFFFF",
      sea: "#004472",
      sky: "#E9EBEF",
      wave: "#D1E7F6",
      rain: "#CCDDE9",
      middle: "#D7DFE6",
      black: "#13191D",
      salat: "#21AE8C",
    },
  },
};
