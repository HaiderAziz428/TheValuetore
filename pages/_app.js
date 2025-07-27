import React from "react";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import axios from "axios";
import createRootReducer from "redux/reducers";
import config from "constants/config";
import { doInit } from "redux/actions/auth";
import Header from "components/e-commerce/Header";
import Sidebar from "components/e-commerce/Sidebar";
import Footer from "components/e-commerce/Footer";
import AdminLayout from "components/admin/Layout";
import "styles/theme.scss";
import { useRouter } from "next/router";
import { Container } from "reactstrap";
import BreadcrumbHistory from "components/admin/BreadcrumbHistory";

// Configure axios with performance optimizations
axios.defaults.baseURL = config.baseURLApi;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.timeout = 10000; // 10 second timeout
axios.defaults.headers.common["Accept-Encoding"] = "gzip, deflate, br";

// Add request interceptor for caching
axios.interceptors.request.use((config) => {
  // Add cache headers for GET requests
  if (config.method === "get") {
    config.headers["Cache-Control"] = "public, max-age=300";
  }
  return config;
});

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const token = typeof window !== "undefined" && localStorage.getItem("token");

if (token) {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
}

export const store = createStore(
  createRootReducer,
  compose(applyMiddleware(ReduxThunk))
);

// Initialize store only on client side
if (typeof window !== "undefined") {
  store.dispatch(doInit());
}

function MyApp({ Component, pageProps, sidebarStatic }) {
  const router = useRouter();

  React.useEffect(() => {
    document.querySelector("body").scrollTo(0, 0);
  });

  // Preload critical resources
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Preload critical CSS and JS
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "style";
      link.href = "/styles/theme.scss";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <Provider store={store}>
      {router.pathname.includes("admin") ? (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      ) : router.pathname.includes("login") ||
        router.pathname.includes("register") ? (
        <Component {...pageProps} />
      ) : router.pathname.includes("search") ? (
        <>
          <Header />
          <Component {...pageProps} />
        </>
      ) : (
        <>
          <Sidebar />
          <Header />
          {router.pathname === "/" ? null : (
            <>
              <Container>
                <BreadcrumbHistory url={router.pathname} />
              </Container>
            </>
          )}
          <Component {...pageProps} />
          <Footer />
        </>
      )}
    </Provider>
  );
}

export default MyApp;
