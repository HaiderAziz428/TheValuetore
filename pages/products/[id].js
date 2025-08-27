import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import LimitedTimeOffer from "components/e-commerce/LimitedTimeOffer/LimitedTimeOffer";
import ImagesFormItem from "components/admin/FormItems/items/ImagesFormItem";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import s from "./Product.module.scss";

import InfoBlock from "components/e-commerce/InfoBlock";
import InstagramWidget from "components/e-commerce/Instagram";
import axios from "axios";
import actions from "redux/actions/products/productsFormActions";
import Head from "next/head";

import productsListActions from "redux/actions/products/productsListActions";
import ReactImageMagnify from "react-image-magnify";
import { AlertTriangle, Eye, ShoppingCart, Truck } from "lucide-react";

import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import Image from "next/image";

const Star = ({ selected = false, onClick = (f) => f }) => (
  <div
    className={selected ? `${s.star} ${s.selected}` : `${s.star} `}
    onClick={onClick}
    style={{
      width: 24,
      height: 24,
      display: "inline-block",
      marginRight: 4,
      cursor: onClick !== null ? "pointer" : "default",
    }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill={selected ? "rgb(179, 211, 52)" : "#e4e5e9"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        stroke="rgb(179, 211, 52)"
        strokeWidth="1"
        fill={selected ? "rgb(179, 211, 52)" : "#e4e5e9"}
      />
    </svg>
  </div>
);

const Id = ({ product: serverSideProduct, currentProductId }) => {
  const [width, setWidth] = React.useState(1440);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [product, setProduct] = React.useState(serverSideProduct);
  const [quantity, setQuantity] = React.useState(1);
  const [fetching, setFetching] = React.useState(true);
  const [reviews, setReviews] = React.useState([]);
  const [showReviewModal, setShowReviewModal] = React.useState(false);
  const [reviewImages, setReviewImages] = React.useState([]);
  const [reviewText, setReviewText] = React.useState("");
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewName, setReviewName] = React.useState("");
  // Helper function for small random variation
  function getRandomWithVariation(base, variation) {
    const change = Math.floor(Math.random() * (variation * 2 + 1)) - variation;
    return Math.max(0, base + change); // Ensure it doesn't go negative
  }

  const [randomReviewsCount] = React.useState(() =>
    getRandomWithVariation(35, 2)
  ); // base 35 ±4
  const [watchingCount] = React.useState(() => getRandomWithVariation(35, 2)); // base 65 ±2
  const [inCartCount] = React.useState(() => getRandomWithVariation(20, 2)); // base 60 ±2
  const [leftInStock] = React.useState(() => getRandomWithVariation(5, 1)); // base 5 ±1

  const deliveryStart = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const deliveryEnd = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000);

  const [sortBy, setSortBy] = React.useState("recent");
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;

  // Load reviews from backend (Supabase via Next API)
  React.useEffect(() => {
    const loadReviews = async () => {
      if (!id) return;
      try {
        const r = await fetch(
          `/api/reviews?product_id=${encodeURIComponent(id)}`
        );
        if (!r.ok) throw new Error(`Failed to load reviews: ${r.status}`);
        const res = await r.json();
        const rows = res?.rows || [];
        const mapped = rows.map((r) => ({
          id: r.id,
          reviewer: r.reviewer_name || "Anonymous",
          comment: r.comment,
          rating: r.rating,
          images: Array.isArray(r.images) ? r.images : [],
          date: r.created_at
            ? new Date(r.created_at).toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })
            : "",
        }));
        setReviews(mapped);
      } catch (e) {
        console.error("Failed to load reviews", e);
      }
    };
    loadReviews();
  }, [id]);

  // Gallery state: main media index and type
  const allMedia = [...(product.image || []), ...(product.video || [])];
  const [mainMediaIdx, setMainMediaIdx] = React.useState(0);

  React.useEffect(() => {
    typeof window !== "undefined" &&
      window.addEventListener("resize", () => {
        setWidth(window.innerWidth);
      });
    typeof window !== "undefined" &&
      window.setTimeout(() => {
        setFetching(false);
      }, 1000);
  }, []);

  React.useEffect(() => {
    // Prefill reviewer name from logged in user if available
    const name = (currentUser && (currentUser.name || currentUser.email)) || "";
    setReviewName(name);
  }, [currentUser]);

  const addToCart = () => {
    dispatch(actions.doFind(id));
    if (currentUser) {
      axios.post(`/orders/`, {
        data: {
          amount: quantity,
          order_date: new Date(),
          product: id,
          status: "in cart",
          user: currentUser.id,
        },
      });
      return;
    }
    const localProducts =
      (typeof window !== "undefined" &&
        JSON.parse(localStorage.getItem("products"))) ||
      [];
    localProducts.push({
      amount: quantity,
      order_date: new Date(),
      product: id,
      status: "in cart",
    });
    typeof window !== "undefined" &&
      localStorage.setItem("products", JSON.stringify(localProducts));
    dispatch(productsListActions.doAdd(localProducts));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (reviewImages.length + files.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    // Read files as data URLs for persistence after refresh
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({ file, preview: reader.result, dataUrl: reader.result });
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((newImages) => {
      setReviewImages((prev) => [...prev, ...newImages]);
    });
  };

  const removeImage = (index) => {
    const newImages = reviewImages.filter((_, i) => i !== index);
    setReviewImages(newImages);
  };

  const submitReview = async () => {
    if (!reviewText.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        product_id: id,
        rating: reviewRating,
        comment: reviewText,
        reviewer_name:
          reviewName?.trim() ||
          currentUser?.email ||
          currentUser?.name ||
          "Anonymous",
        images: reviewImages
          .map((img) => img.dataUrl || img.preview)
          .slice(0, 3),
      };

      const r = await fetch(`/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(`Failed to submit review: ${r.status}`);
      const res = await r.json();
      const saved = res?.row || payload;

      const newReview = {
        id: saved.id || Date.now(),
        reviewer: saved.reviewer_name || "Anonymous",
        comment: saved.comment,
        rating: saved.rating,
        images: Array.isArray(saved.images) ? saved.images : [],
        date: saved.created_at
          ? new Date(saved.created_at).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })
          : new Date().toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            }),
      };

      setReviews([newReview, ...reviews]);
      setShowReviewModal(false);
      setReviewText("");
      setReviewImages([]);
      setReviewRating(5);
      toast.success("Review submitted successfully!");
    } catch (e) {
      console.error("Failed to submit review", e);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(2)
      : "0.00";

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const sortedReviews = React.useMemo(() => {
    const copy = [...reviews];
    if (sortBy === "highest") return copy.sort((a, b) => b.rating - a.rating);
    if (sortBy === "lowest") return copy.sort((a, b) => a.rating - b.rating);
    // recent (no created_at client side date for local ones) – keep insertion order
    return copy;
  }, [reviews, sortBy]);

  return (
    <>
      <Head>
        <title>{product.title}</title>
      </Head>
      <ToastContainer />
      <Container>
        <Col xs={12} lg={allMedia.length > 1 ? 7 : 6} className={"d-flex"}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              position: "relative", // <-- Add this!
            }}
          >
            {product.discount > 0 && (
              <div
                className="absolute"
                style={{
                  top: 10,
                  left: 10,
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  fontWeight: "bold",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  backgroundColor: "rgb(179, 211, 52)",
                  color: "rgb(20, 68, 77)",
                  width: "70px",
                  height: "70px",
                  fontSize: "18px",
                  border: "3px solid rgb(20, 68, 77)",
                  position: "absolute",
                }}
              >
                Sale!
              </div>
            )}
          </div>
        </Col>
        {fetching ? (
          <div
            style={{ height: 480 }}
            className={"d-flex justify-content-center align-items-center"}
          >
            <img src="/images/e-commerce/preloader.gif" alt={"fetching"} />
          </div>
        ) : (
          <Row className={"mb-5"} style={{ marginTop: 32 }}>
            <Col xs={12} lg={allMedia.length > 1 ? 7 : 6} className={"d-flex"}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {/* Main display: image or video */}
                {allMedia[mainMediaIdx] && allMedia[mainMediaIdx].publicUrl ? (
                  allMedia[mainMediaIdx].name &&
                  allMedia[mainMediaIdx].name.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      width="100%"
                      height="auto"
                      controls
                      style={{
                        maxWidth: 400,
                        borderRadius: 8,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        marginBottom: 16,
                      }}
                      src={allMedia[mainMediaIdx].publicUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <ReactImageMagnify
                      {...{
                        smallImage: {
                          alt: product.title,
                          isFluidWidth: true,
                          src: allMedia[mainMediaIdx].publicUrl,
                        },
                        largeImage: {
                          src: allMedia[mainMediaIdx].publicUrl,
                          width: 1200,
                          height: 1200,
                        },
                      }}
                      className={allMedia.length && "mr-3"}
                      enlargedImagePosition={"over"}
                    />
                  )
                ) : null}
                {/* Thumbnails */}
                {allMedia.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 16,
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {allMedia.map((media, idx) => (
                      <div
                        key={media.id || idx}
                        style={{
                          border:
                            idx === mainMediaIdx
                              ? "2px solid #007bff"
                              : "2px solid transparent",
                          borderRadius: 4,
                          cursor: "pointer",
                          padding: 2,
                          background: "#fff",
                        }}
                        onClick={() => setMainMediaIdx(idx)}
                      >
                        {media.name &&
                        media.name.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video
                            width={60}
                            height={40}
                            style={{ objectFit: "cover", borderRadius: 2 }}
                            src={media.publicUrl}
                          />
                        ) : (
                          <Image
                            src={media.publicUrl}
                            alt={product.title}
                            width={60}
                            height={40}
                            className={"product-thumbnail"}
                            placeholder="blur"
                            blurDataURL="/images/e-commerce/404/1.png"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {product.image.length > 1 ? (
                <div
                  className={`d-flex flex-column h-100 justify-content-between ${s.dMdNone}`}
                  style={{ width: 160 }}
                >
                  {product.image.slice(1).map((img, index) => (
                    <Image
                      key={index}
                      src={`${img.publicUrl}?t=${Date.now()}`}
                      width={160}
                      height={120}
                      alt={`Product view ${index + 2}`}
                      placeholder="blur"
                      blurDataURL="/images/e-commerce/404/1.png"
                    />
                  ))}
                </div>
              ) : null}
            </Col>
            <Col
              xs={12}
              lg={product.image.length > 1 ? 5 : 6}
              className={"d-flex flex-column justify-content-between"}
            >
              <div
                className={"d-flex flex-column justify-content-between mb-2"}
                style={{ height: 250 }}
              >
                <h6 className={`text-muted ${s.detailCategory}`}>
                  {product.categories[0].title[0].toUpperCase() +
                    product.categories[0].title.slice(1)}
                </h6>
                <h4 className={"fw-bold"}>{product.title}</h4>
                <div className={"d-flex align-items-center "}>
                  {[1, 2, 3, 4, 5].map((n, i) => (
                    <Star
                      key={i}
                      selected={i < product.rating}
                      onClick={null}
                    />
                  ))}
                  <p className={"text-primary ml-3 mb-0"}>
                    {`${randomReviewsCount} reviews`}
                  </p>
                </div>
                <h6 className={"text-muted mt-3"}>Free Delivery Above 699</h6>
                <h6 className={"text-muted "}>
                  All Over Pakistan Within 3-5 Working Days
                </h6>
                <h6 className={"text-muted mb-3"}>
                  First open your parcel then pay
                </h6>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                  پہلے اپنا پارسل کھولیں پھر ادائیگی کریں
                </p>

                <div className={"d-flex mt-2"}>
                  <div
                    className={
                      "d-flex flex-column mr-5 justify-content-between"
                    }
                  >
                    <h6 className={"fw-bold text-muted text-uppercase"}>
                      Quantity
                    </h6>
                    <div className={"d-flex align-items-center"}>
                      <Button
                        className={`bg-transparent border-0 p-1 fw-bold mr-3 ${s.quantityBtn}`}
                        style={{
                          backgroundColor: "#e4e5e9",
                          color: "#000",
                        }}
                        onClick={() => {
                          if (quantity === 1) return;
                          setQuantity((prevState) => prevState - 1);
                          setProduct((prevState) => ({
                            ...prevState,
                            price:
                              Number(prevState.price) -
                              Number(serverSideProduct.price),
                          }));
                        }}
                      >
                        -
                      </Button>
                      <p className={"fw-bold mb-0"}>{quantity}</p>
                      <Button
                        className={`bg-transparent border-0 p-1 fw-bold ml-3 ${s.quantityBtn}`}
                        style={{
                          backgroundColor: "#e4e5e9",
                          color: "#000",
                        }}
                        onClick={() => {
                          if (quantity < 1) return;
                          setQuantity((prevState) => prevState + 1);
                          setProduct((prevState) => ({
                            ...prevState,
                            price:
                              Number(prevState.price) +
                              Number(serverSideProduct.price),
                          }));
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="d-flex flex-column justify-content-between">
                    <h6 className="fw-bold text-muted text-uppercase">Price</h6>

                    {product.discount && product.discount > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Price section */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              color: "#888",
                              textDecoration: "line-through",
                              fontSize: "1rem",
                            }}
                          >
                            Rs {product.price} PKR
                          </span>
                          <span
                            style={{
                              color: "#b3d334",
                              fontWeight: 900,
                              fontSize: "1.5rem",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Rs {product.price - product.discount} PKR
                          </span>
                        </div>

                        {/* Discount percentage */}
                        <div
                          style={{
                            backgroundColor: "rgb(179, 211, 52)",
                            color: "#fff",
                            fontWeight: "bold",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.9rem",
                          }}
                        >
                          -
                          {Math.round((product.discount / product.price) * 100)}
                          %
                        </div>
                      </div>
                    ) : (
                      <h6 className="fw-bold">Rs {product.price} PKR</h6>
                    )}
                  </div>
                </div>
              </div>
              <div className={`mt-5 ${s.ctaButtons}`}>
                <Button
                  onClick={() => {
                    toast.info("products successfully added to your cart");
                    addToCart();
                  }}
                  className={`${s.addToCart} text-uppercase`}
                >
                  Add to Cart
                </Button>

                <a
                  href={`https://wa.me/923356630319?text=${encodeURIComponent(
                    `Hi! I would like to place an order for the following item:

• ${product.title} - Quantity: ${quantity} - Price: Rs ${
                      product.price - product.discount
                    } PKR each

Total: Rs ${(product.price - product.discount) * quantity} PKR

Please let me know about delivery options and payment methods. Thank you!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={"d-inline-block"}
                >
                  <Button
                    className={`${s.whatsapp} ${s.buynow} text-uppercase`}
                  >
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <svg
                        className="logo-svg"
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        fill="#fff"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.451 3.488" />
                      </svg>
                    </span>
                    Buy now via Whatsapp
                  </Button>
                </a>
              </div>
              <h6 className={"text-muted mt-4"}>
                <span className="fw-bold">900+ bought </span>
                in past month
              </h6>
              <h6
                className={"fw-bold mb-1 "}
                style={{ color: "rgb(179, 211, 52)" }}
              >
                Limited time deal
              </h6>
              <LimitedTimeOffer />
              <h4 className="fw-bold my-4">Description</h4>
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6",
                  fontSize: "1.1rem",
                  fontFamily:
                    "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {product.description}
              </div>
            </Col>
          </Row>
        )}
        <hr />

        <div className="mb-4">
          <div className="card p-3 shadow-sm rounded-xl">
            {/* Top stats */}
            <div className="d-flex flex-wrap gap-2 mb-3">
              {/* Watching */}
              <div className="d-inline-flex align-items-center px-3 py-1 rounded-pill bg-light">
                <Eye size={16} className="text-primary" />
                <div className="ms-2">
                  <span className="fw-bold text-primary">{watchingCount}</span>
                  <span className="ms-1 text-muted">watching</span>
                </div>
              </div>

              {/* In Cart */}
              <div
                className="d-inline-flex align-items-center px-3 py-1 rounded-pill"
                style={{ background: "#f0fdf4" }}
              >
                <ShoppingCart size={16} className="text-success" />
                <div className="ms-2">
                  <span className="fw-bold text-success">{inCartCount}</span>
                  <span className="ms-1 text-muted">in cart</span>
                </div>
              </div>
            </div>

            {/* Delivery dates */}
            <div className="mb-3 text-muted small">
              Products will be delivered between{" "}
              <strong>
                {deliveryStart.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </strong>{" "}
              and{" "}
              <strong>
                {deliveryEnd.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </strong>
              .
            </div>

            {/* Stock info */}
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="fw-bold text-danger me-2 mr-2">
                  {leftInStock}
                </div>
                <div className="text-uppercase small text-muted">
                  Left in Stock
                </div>
              </div>
              <div
                className="border rounded bg-light overflow-hidden"
                style={{ width: 140 }}
              >
                <div
                  style={{
                    height: 10,
                    width: `${Math.min((leftInStock / 10) * 100, 100)}%`,
                    background:
                      leftInStock <= 3
                        ? "#ef4444"
                        : leftInStock <= 10
                        ? "#f97316"
                        : "#10b981",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>

            {/* Low Stock Warning */}
            {leftInStock <= 10 && (
              <div className="mt-2 text-danger small d-flex align-items-center gap-1">
                <AlertTriangle size={14} className="text-danger" />
                Low stock - order soon!
              </div>
            )}
          </div>
        </div>
        <hr />

        {/* Reviews Section */}
        <Row className={"mt-5 mb-5"}>
          <Col xs={12}>
            <h3 className="text-center mb-4 fw-bold">Customer Reviews</h3>
            <Row className="align-items-center mb-4">
              <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
                <div
                  className="d-flex align-items-center justify-content-center justify-content-md-start"
                  style={{ gap: 8 }}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      selected={s <= Math.round(parseFloat(averageRating))}
                    />
                  ))}
                  <span className="fw-bold" style={{ marginLeft: 8 }}>
                    {averageRating} out of 5
                  </span>
                </div>
                <div className="text-muted">
                  Based on {reviews.length} review
                  {reviews.length === 1 ? "" : "s"}
                </div>
              </Col>
              <Col md={5} className="mb-3 mb-md-0">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star];
                  const percent = reviews.length
                    ? Math.round((count / reviews.length) * 100)
                    : 0;
                  return (
                    <div
                      key={star}
                      className="d-flex align-items-center mb-1"
                      style={{ gap: 8 }}
                    >
                      <span style={{ width: 60 }}>{star} star</span>
                      <div
                        style={{
                          flex: 1,
                          height: 8,
                          background: "#eee",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${percent}%`,
                            height: "100%",
                            background: "#8B4513",
                          }}
                        />
                      </div>
                      <span style={{ width: 20, textAlign: "right" }}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </Col>
              <Col md={3} className="text-center text-md-end">
                <Button
                  style={{
                    backgroundColor: "#8B4513",
                    borderColor: "#8B4513",
                    color: "white",
                  }}
                  onClick={() => setShowReviewModal(true)}
                >
                  Write a review
                </Button>
              </Col>
            </Row>

            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="text-muted">Most Recent</div>
              <div>
                <select
                  className="form-select"
                  style={{ width: 180 }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Sort by</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </div>

            {sortedReviews.length > 0 && (
              <div>
                {sortedReviews.map((review, index) => (
                  <div
                    key={review.id || index}
                    className="border-bottom pb-4 mb-4"
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center">
                        <div
                          className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <span className="text-white">
                            {review.reviewer?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div
                            className="d-flex align-items-center"
                            style={{ gap: 2 }}
                          >
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                selected={star <= review.rating}
                              />
                            ))}
                          </div>
                          <div className="fw-bold" style={{ marginTop: 6 }}>
                            {review.reviewer || "Anonymous"}
                          </div>
                        </div>
                      </div>
                      <span className="text-muted">{review.date}</span>
                    </div>
                    {/* First line bold as pseudo-title */}
                    {review.comment && (
                      <div style={{ marginBottom: 6 }} className="fw-bold">
                        {String(review.comment).split("\n")[0].slice(0, 80)}
                      </div>
                    )}
                    <p className="mb-3" style={{ whiteSpace: "pre-wrap" }}>
                      {review.comment}
                    </p>
                    {Array.isArray(review.images) &&
                      review.images.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {review.images.map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={image}
                              alt={`Review image ${imgIndex + 1}`}
                              style={{
                                width: 120,
                                height: 120,
                                objectFit: "cover",
                                borderRadius: 6,
                              }}
                            />
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}

            {sortedReviews.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">
                  No reviews yet. Be the first to write a review!
                </p>
              </div>
            )}
          </Col>
        </Row>
        {/* Review Modal */}
        <Modal
          isOpen={showReviewModal}
          toggle={() => setShowReviewModal(false)}
          size="lg"
        >
          <ModalHeader toggle={() => setShowReviewModal(false)}>
            Write a Review
          </ModalHeader>
          <ModalBody>
            <div className="mb-3">
              <label className="form-label fw-bold">Rating</label>
              <div className="d-flex align-items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    selected={star <= reviewRating}
                    onClick={() => setReviewRating(star)}
                  />
                ))}
                <span className="ms-2">{reviewRating} stars</span>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Review</label>
              <Input
                type="textarea"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell others about your experience"
                rows={4}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Your name</label>
              <Input
                type="text"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Enter your name (optional)"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Images (Max 3)</label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={reviewImages.length >= 3}
              />
              {reviewImages.length > 0 && (
                <div className="d-flex gap-2 mt-2">
                  {reviewImages.map((image, index) => (
                    <div key={index} className="position-relative">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute"
                        style={{ top: "-5px", right: "-5px" }}
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setShowReviewModal(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={submitReview}>
              Submit Review
            </Button>
          </ModalFooter>
        </Modal>
        <hr />
      </Container>
      <InfoBlock />
      <InstagramWidget />
    </>
  );
};

export async function getServerSideProps(context) {
  const res = await axios.get(`/products/${context.query.id}`);
  const product = res.data;

  return {
    props: { product, currentProductId: context.query.id }, // will be passed to the page component as props
  };
}

export default Id;
