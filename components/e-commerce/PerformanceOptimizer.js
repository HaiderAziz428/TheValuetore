import React from "react";

class PerformanceOptimizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      isLoaded: false,
    };
    this.observer = null;
    this.ref = React.createRef();
  }

  componentDidMount() {
    // Set up intersection observer for lazy loading
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.setState({ isVisible: true });
            this.observer.unobserve(entry.target);
          }
        },
        {
          rootMargin: "50px 0px",
          threshold: 0.1,
        }
      );

      if (this.ref.current) {
        this.observer.observe(this.ref.current);
      }
    } else {
      // Fallback for older browsers
      this.setState({ isVisible: true });
    }

    // Preload critical resources
    this.preloadResources();
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  preloadResources() {
    // Preload critical images
    const criticalImages = [
      "/images/e-commerce/header/logo.svg",
      "/images/e-commerce/home/hero-bg.jpg",
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload critical fonts
    const fonts = [
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    ];

    fonts.forEach((href) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "style";
      link.href = href;
      document.head.appendChild(link);
    });
  }

  render() {
    const { children, placeholder, threshold = 0.1 } = this.props;
    const { isVisible, isLoaded } = this.state;

    if (!isVisible) {
      return (
        <div ref={this.ref} style={{ minHeight: "200px" }}>
          {placeholder || <div className="loading-placeholder">Loading...</div>}
        </div>
      );
    }

    return (
      <div ref={this.ref}>
        {React.cloneElement(children, {
          onLoad: () => this.setState({ isLoaded: true }),
          ...this.props,
        })}
      </div>
    );
  }
}

// HOC for lazy loading components
export const withLazyLoading = (WrappedComponent, options = {}) => {
  return class LazyLoadedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        Component: null,
        isLoading: true,
      };
    }

    componentDidMount() {
      // Simulate lazy loading with a small delay
      setTimeout(() => {
        this.setState({
          Component: WrappedComponent,
          isLoading: false,
        });
      }, options.delay || 100);
    }

    render() {
      const { Component, isLoading } = this.state;

      if (isLoading) {
        return options.loadingComponent || <div>Loading...</div>;
      }

      return Component ? <Component {...this.props} /> : null;
    }
  };
};

// Hook for performance monitoring
export const usePerformanceMonitor = () => {
  React.useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window) {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "navigation") {
            console.log(
              "Page Load Time:",
              entry.loadEventEnd - entry.loadEventStart
            );
          }
          if (entry.entryType === "largest-contentful-paint") {
            console.log("LCP:", entry.startTime);
          }
        }
      });

      observer.observe({
        entryTypes: ["navigation", "largest-contentful-paint"],
      });

      return () => observer.disconnect();
    }
  }, []);
};

// Utility for image optimization
export const optimizeImage = (src, options = {}) => {
  const { width = 800, quality = 80, format = "webp" } = options;

  // If using a CDN like Cloudinary or similar
  if (src.includes("cloudinary.com") || src.includes("res.cloudinary.com")) {
    return src.replace(
      "/upload/",
      `/upload/w_${width},q_${quality},f_${format}/`
    );
  }

  // For local images, return as is
  return src;
};

// Utility for preloading data
export const preloadData = async (url, options = {}) => {
  const { cacheKey, ttl = 5 * 60 * 1000 } = options;

  if (cacheKey) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        return data;
      }
    }
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (cacheKey) {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    }

    return data;
  } catch (error) {
    console.error("Preload error:", error);
    return null;
  }
};

export default PerformanceOptimizer;
