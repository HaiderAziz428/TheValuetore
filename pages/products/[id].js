import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Toast,
  ToastBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import { Formik } from "formik";
import IniValues from "components/admin/FormItems/iniValues";
import PreparedValues from "components/admin/FormItems/preparedValues";
import FormValidations from "components/admin/FormItems/formValidations";
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
import feedbackActions from "redux/actions/feedback/feedbackListActions";
import feedbackActionsForm from "redux/actions/feedback/feedbackFormActions";
import productsListActions from "redux/actions/products/productsListActions";
import ReactImageMagnify from "react-image-magnify";
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
    className={selected ? `${s.star} ${s.selected}` : `${s.star}`}
    onClick={onClick}
  ></div>
);

const products = [
  {
    id: 0,
    img: "/images/e-commerce/home/product1.png",
  },
  {
    id: 1,
    img: "/images/e-commerce/home/product2.png",
  },
  {
    id: 2,
    img: "/images/e-commerce/home/product3.png",
  },
  {
    id: 3,
    img: "/images/e-commerce/home/product4.png",
  },
  {
    id: 7,
    img: "/images/e-commerce/home/product1.png",
  },
  {
    id: 4,
    img: "/images/e-commerce/home/product2.png",
  },
  {
    id: 5,
    img: "/images/e-commerce/home/product3.png",
  },
  {
    id: 6,
    img: "/images/e-commerce/home/product4.png",
  },
];

const Id = ({ product: serverSideProduct, currentProductId }) => {
  const [width, setWidth] = React.useState(1440);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [product, setProduct] = React.useState(serverSideProduct);
  const [quantity, setQuantity] = React.useState(1);
  const [fetching, setFetching] = React.useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;

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

  return (
    <>
      <Head>
        <title>{product.title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <meta
          name="description"
          content={`${
            product.meta_description ||
            "Beautifully designed web application template built with React and Bootstrap to create modern apps and speed up development"
          }`}
        />
        <meta
          name="keywords"
          content={`${product.keywords || "flatlogic, react templates"}`}
        />
        <meta
          name="author"
          content={`${product.meta_author || "Flatlogic LLC."}`}
        />
        <meta charSet="utf-8" />

        <meta
          property="og:title"
          content={`${
            product.meta_og_title ||
            "Flatlogic - React, Vue, Angular and Bootstrap Templates and Admin Dashboard Themes"
          }`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${
            product.meta_og_url || "https://flatlogic-ecommerce.herokuapp.com/"
          }`}
        />
        <meta
          property="og:image"
          content={`${
            product.meta_og_image ||
            "https://flatlogic-ecommerce-backend.herokuapp.com/images/blogs/content_image_six.jpg"
          }`}
        />
        <meta
          property="og:description"
          content={`${
            product.meta_description ||
            "Beautifully designed web application template built with React and Bootstrap to create modern apps and speed up development"
          }`}
        />
        <meta name="twitter:card" content="summary_large_image" />

        <meta
          property="fb:app_id"
          content={`${product.meta_fb_id || "712557339116053"}`}
        />

        <meta
          property="og:site_name"
          content={`${product.meta_og_sitename || "Flatlogic"}`}
        />
        <meta
          name="twitter:site"
          content={`${product.post_twitter || "@flatlogic"}`}
        />
      </Head>
      <ToastContainer />
      <Container>
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
                            blurDataURL="/public/images/e-commerce/404/1.png"
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
                      blurDataURL="/public/images/e-commerce/404/1.png"
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
                className={"d-flex flex-column justify-content-between"}
                style={{ height: 320 }}
              >
                <h6 className={`text-muted ${s.detailCategory}`}>
                  {product.categories[0].title[0].toUpperCase() +
                    product.categories[0].title.slice(1)}
                </h6>
                <h4 className={"fw-bold"}>{product.title}</h4>
                <div className={"d-flex align-items-center"}>
                  {[1, 2, 3, 4, 5].map((n, i) => (
                    <Star
                      key={i}
                      selected={i < product.rating}
                      onClick={null}
                    />
                  ))}
                  <p className={"text-primary ml-3 mb-0"}>
                    {/* {feedbackList.length} reviews */}0 reviews
                  </p>
                </div>
                <p>{product.description}</p>
                <div className={"d-flex"}>
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
                  <div className={"d-flex flex-column justify-content-between"}>
                    <h6 className={"fw-bold text-muted text-uppercase"}>
                      Price
                    </h6>
                    <h6 className={"fw-bold"}>{product.price}$</h6>
                  </div>
                </div>
              </div>
              <div className={`${s.buttonsWrapper} d-flex`}>
                <Button
                  outline
                  color={"primary"}
                  className={"flex-fill mr-4 text-uppercase fw-bold"}
                  style={{ width: "50%" }}
                  onClick={() => {
                    toast.info("products successfully added to your cart");
                    addToCart();
                  }}
                >
                  Add to Cart
                </Button>
                <a
                  href={`https://wa.me/923356630319?text=${encodeURIComponent(
                    `Hi! I would like to place an order for the following item:

• ${product.title} - Quantity: ${quantity} - Price: $${product.price} each

Total: $${product.price * quantity}

Please let me know about delivery options and payment methods. Thank you!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={"d-inline-block flex-fill"}
                  style={{ width: "50%" }}
                >
                  <Button
                    style={{
                      width: "100%",
                      backgroundColor: "#25D366",
                      borderColor: "#25D366",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                    className={"text-uppercase fw-bold"}
                  >
                    {/* WhatsApp logo SVG as provided */}
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
            </Col>
          </Row>
        )}
        <hr />
        <Row className={"mt-5 mb-5"}>
          {/* Remove all feedback-related state, handlers, and the Formik feedback form/modal from this file. */}
          {/* Remove feedbackList, starsSelected, firstname, lastname, review, setOpen, isOpen, addFeedback, iniValues, formValidations, handleSubmit, and any feedbackActions/feedbackActionsForm usage. */}
          {/* Remove the feedback modal and the 'Leave Feedback' button and reviews section from the render output. */}
        </Row>
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
