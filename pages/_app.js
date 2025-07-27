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

// Configure axios with timeout and retry logic
axios.defaults.baseURL = config.baseURLApi;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.timeout = config.timeout;

// Add request interceptor for retry logic
axios.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues
    if (config.method === "get") {
      config.params = { ...config.params, _t: Date.now() };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for retry logic
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { config } = error;

    if (!config || !config.retry) {
      config.retry = 0;
    }

    if (config.retry >= config.retryAttempts || config.retry >= 3) {
      return Promise.reject(error);
    }

    config.retry += 1;

    // Wait before retrying
    await new Promise((resolve) =>
      setTimeout(resolve, config.retryDelay || 1000)
    );

    return axios(config);
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

store.dispatch(doInit());

function MyApp({ Component, pageProps, sidebarStatic }) {
  const router = useRouter();
  React.useEffect(() => {
    document.querySelector("body").scrollTo(0, 0);
  });
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
