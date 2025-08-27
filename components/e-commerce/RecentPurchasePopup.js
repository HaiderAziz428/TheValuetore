import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const locations = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Multan",
  "Faisalabad",
  "Peshawar",
  "Quetta",
  "Abbottabad",
  "Jehlam",
];

function getRandomTimeAgo() {
  const mins = Math.floor(Math.random() * 59) + 1;
  return `${mins} minutes ago`;
}

function getRandomLocation() {
  return locations[Math.floor(Math.random() * locations.length)];
}

export default function RecentPurchasePopup() {
  const [show, setShow] = useState(false);
  const [product, setProduct] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [products, setProducts] = useState([]);
  const [timeAgo, setTimeAgo] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products");
        const allProducts = response.data.rows || [];
        const availableProducts = allProducts.filter(
          (p) => p && p.status === "in stock" && p.image && p.image.length > 0
        );
        setProducts(availableProducts);
      } catch (error) {
        console.log("Failed to fetch products for popup:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!products || products.length === 0) return;

    let timeout;

    const loopPopup = () => {
      const randomProduct =
        products[Math.floor(Math.random() * products.length)];
      setProduct(randomProduct);

      // ✅ Generate new time and location each time popup shows
      setTimeAgo(getRandomTimeAgo());
      setLocation(getRandomLocation());

      setFadeOut(false);
      setShow(true);

      // Show for 4 seconds, then fade out for 1s
      timeout = setTimeout(() => {
        setFadeOut(true);

        // Wait for fade-out animation before hiding completely
        timeout = setTimeout(() => {
          setShow(false);
          timeout = setTimeout(loopPopup, 40000); // Gap before showing next popup
        }, 1000); // fade-out duration
      }, 8000);
    };

    // ✅ First popup after 10 seconds
    timeout = setTimeout(loopPopup, 10000);

    return () => clearTimeout(timeout);
  }, [products]);

  if (!show || !product) return null;

  const handleClick = () => {
    router.push(`/products/${product.id}`);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setFadeOut(true);
    setTimeout(() => setShow(false), 1000);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: 32,
        left: 32,
        zIndex: 9999,
        background: "#fff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        minWidth: 320,
        maxWidth: 400,
        padding: 16,
        animation: `${fadeOut ? "fadeOut" : "fadeIn"} 1.5s ease`,
        cursor: "pointer",
        border: "1px solid #eee",
      }}
    >
      <img
        src={product.image?.[0]?.publicUrl || "/images/e-commerce/404/1.png"}
        alt={product.title}
        style={{
          width: 64,
          height: 64,
          objectFit: "cover",
          borderRadius: 6,
          marginRight: 16,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "1rem", color: "#888" }}>
          Someone recently bought <b>{product.title}</b>
        </div>
        <div style={{ fontSize: "0.95rem", color: "#aaa", marginTop: 4 }}>
          {timeAgo}, from {location}
        </div>
        {product.discount && product.discount > 0 && (
          <div style={{ fontSize: "0.9rem", color: "#28a745", marginTop: 4 }}>
            Save Rs {product.discount}
          </div>
        )}
      </div>
      <button
        onClick={handleClose}
        style={{
          background: "#222",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 28,
          height: 28,
          marginLeft: 12,
          cursor: "pointer",
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Close"
      >
        ×
      </button>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0);}
          to { opacity: 0; transform: translateY(30px);}
        }
      `}</style>
    </div>
  );
}
