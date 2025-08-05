import React from "react";
import { Container, Row, Col, Table, Button } from "reactstrap";
import Link from "next/link";
import s from "./Cart.module.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import Head from "next/head";
import { toast, ToastContainer } from "react-toastify";

const Index = () => {
  const currentUser = useSelector((store) => store.auth.currentUser);
  const [products, setProducts] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState(0);

  React.useEffect(() => {
    if (currentUser) {
      axios.get(`/orders?user=${currentUser.id}&status=in+cart`).then((res) => {
        res.data.rows.map((item, index) => {
          axios.get(`/products/${item.product.id}`).then((res) => {
            const data = res.data;
            data.amount = item.amount;
            setProducts((prevState) => [...prevState, data]);
            setTotalPrice(0);
          });
        });
        return;
      });
    }
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("products") &&
      !currentUser
    ) {
      JSON.parse(localStorage.getItem("products")).map((item, index) => {
        if (item.product) {
          axios.get(`/products/${item.product}`).then((res) => {
            const data = res.data;
            if (data && typeof data === "object") {
              data.amount = item.amount;
              setProducts((prevState) => [...prevState, data]);
            }
            setTotalPrice(0);
          });
        } else {
          axios.get(`/products/${item.id}`).then((res) => {
            const data = res.data;
            if (data && typeof data === "object") {
              data.amount = item.amount;
              setProducts((prevState) => [...prevState, data]);
            }
            setTotalPrice(0);
          });
        }
      });
    }
  }, []);

  React.useEffect(() => {
    let total = 0;
    products.map((item) => {
      total += item.amount * item.price;
    });
    setTotalPrice((prevState) => total);
  }, [products]);

  const reduceQuantity = (index) => {
    if (currentUser) {
      const product = products[index];
      if (product.amount > 1) product.amount -= 1;
      setProducts((prevState) => {
        prevState[index] = product;
        return prevState;
      });
      axios
        .put(`/orders/${currentUser.id}`, {
          data: {
            product: product.id,
            amount: product.amount,
            status: "in cart",
            user: currentUser.id,
          },
          id: currentUser.id,
        })
        .then((res) => {
          console.log(1);
        });
    } else if (typeof window !== "undefined") {
      const product = products[index];
      if (product.amount > 1) product.amount -= 1;
      setProducts((prevState) => {
        prevState[index] = product;
        return prevState;
      });
      localStorage.setItem("products", JSON.stringify(products));
      setProducts(JSON.parse(localStorage.getItem("products")));
    }
  };

  const increaseQuantity = (index) => {
    if (currentUser) {
      const product = products[index];
      product.amount += 1;
      setProducts((prevState) => {
        prevState[index] = product;
        return prevState;
      });
      axios
        .put(`/orders/${currentUser.id}`, {
          data: {
            product: product.id,
            amount: product.amount,
            status: "in cart",
            user: currentUser.id,
          },
          id: currentUser.id,
        })
        .then((res) => {
          console.log(1);
        });
    } else if (typeof window !== "undefined") {
      const product = products[index];
      product.amount += 1;
      setProducts((prevState) => {
        prevState[index] = product;
        return prevState;
      });
      localStorage.setItem("products", JSON.stringify(products));
      setProducts(JSON.parse(localStorage.getItem("products")));
    }
  };

  const removeFromProducts = (id) => {
    if (currentUser) {
      axios.put(`/users/${currentUser.id}`, {
        id: currentUser.id,
        data: {
          ...currentUser,
          wishlist: [],
        },
      });
    } else if (typeof window !== "undefined") {
      let count = 0;
      // localStorage.removeItem("products")
      // const products = JSON.parse(localStorage.getItem("products"));
      // setProducts(products)
      const newProducts = products.filter((item) => {
        if (item.id === id) {
          if (count >= 1) return true;
          count += 1;
          return false;
        }
        return true;
      });
      localStorage.setItem("products", JSON.stringify(newProducts));
      setProducts(newProducts);
    }
  };

  return (
    <Container>
      <Head>
        <title>Cart</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <meta
          name="description"
          content="Beautifully designed web application template built with React and Bootstrap to create modern apps and speed up development"
        />
        <meta name="keywords" content="flatlogic, react templates" />
        <meta name="author" content="Flatlogic LLC." />
        <meta charSet="utf-8" />

        <meta
          property="og:title"
          content="Flatlogic - React, Vue, Angular and Bootstrap Templates and Admin Dashboard Themes"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://flatlogic-ecommerce.herokuapp.com/"
        />
        <meta
          property="og:image"
          content="https://flatlogic-ecommerce-backend.herokuapp.com/images/blogs/content_image_six.jpg"
        />
        <meta
          property="og:description"
          content="Beautifully designed web application template built with React and Bootstrap to create modern apps and speed up development"
        />
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="fb:app_id" content="712557339116053" />

        <meta property="og:site_name" content="Flatlogic" />
        <meta name="twitter:site" content="@flatlogic" />
      </Head>
      <Row className={"mb-5"} style={{ marginTop: 32 }}>
        <ToastContainer />
        <Col xs={12} lg={8}>
          <h2 className={"fw-bold mt-4 mb-5"}>Shopping Cart</h2>
          <Table borderless>
            <thead>
              <tr style={{ borderBottom: "1px solid #D9D9D9" }}>
                <th className={"bg-transparent text-dark px-0"}>Product</th>
                <th className={"bg-transparent text-dark px-0"}>Quantity</th>
                <th className={"bg-transparent text-dark px-0"}>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <h5 className={"fw-bold mt-3"}>No items</h5>
              ) : (
                <>
                  {products.map((item, index) => (
                    <tr className={"mt-2"}>
                      <td className={"px-0 pt-4"}>
                        <div className={"d-flex align-items-center"}>
                          <img
                            src={item.image[0].publicUrl}
                            width={100}
                            className={"mr-4"}
                          />
                          <div>
                            <h6 className={"text-muted"}>
                              {item.categories[0].title[0].toUpperCase() +
                                item.categories[0].title.slice(1)}
                            </h6>
                            <h5 className={"fw-bold"}>{item.title}</h5>
                          </div>
                        </div>
                      </td>
                      <td className={"px-0 pt-4"}>
                        <div className={"d-flex align-items-center"}>
                          <Button
                            className={`${s.quantityBtn} bg-transparent border-0 p-1 fw-bold mr-3`}
                            onClick={() => reduceQuantity(index)}
                          >
                            -
                          </Button>
                          <p className={"fw-bold mb-0"}>{item.amount}</p>
                          <Button
                            className={`${s.quantityBtn} bg-transparent border-0 p-1 fw-bold ml-3`}
                            onClick={() => increaseQuantity(index)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td className={"px-0 pt-4"}>
                        {item.discount && item.discount > 0 ? (
                          <div>
                            <span
                              style={{
                                color: "#888",
                                textDecoration: "line-through",
                                marginRight: 8,
                              }}
                            >
                              Rs {item.price} PKR
                            </span>
                            <span style={{ color: "#b3d334", fontWeight: 700 }}>
                              Rs {item.price - item.discount} PKR
                            </span>
                          </div>
                        ) : (
                          <h6 className={"fw-bold mb-0"}>
                            Rs {item.price} PKR
                          </h6>
                        )}
                      </td>
                      <td className={"px-0 pt-4"}>
                        <Button
                          className={"bg-transparent border-0 p-0"}
                          onClick={() => {
                            removeFromProducts(item.id);
                            toast.info("product successfully removed");
                          }}
                        >
                          <img
                            src="/images/e-commerce/close.svg"
                            alt={"close"}
                          />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </Table>
        </Col>
        <Col xs={12} lg={4}>
          <section className={s.cartTotal}>
            <h2 className={"fw-bold mb-5"}>Cart Total</h2>
            <div className={"d-flex"}>
              <h6 className={"fw-bold mr-5 mb-0"}>Subtotal:</h6>
              <h6 className={"fw-bold mb-0"}>Rs {totalPrice} PKR</h6>
            </div>
            <hr className={"my-4"} />
            <div className={"d-flex"}>
              <h6 className={"fw-bold mr-5 mb-0"}>Shipping:</h6>
              <div>
                <h6 className={"fw-bold mb-3"}>Free Shipping</h6>
                <p className={"mb-0"}>
                  Shipping options will be updated during checkout.
                </p>
              </div>
            </div>
            <hr className={"my-4"} />
            <div className={"d-flex"}>
              <h5 className={"fw-bold"} style={{ marginRight: 63 }}>
                Total:
              </h5>
              <h5 className={"fw-bold"}>Rs {totalPrice} PKR</h5>
            </div>
            <a
              href={`https://wa.me/923356630319?text=${encodeURIComponent(
                products.length > 0
                  ? `Hi! I would like to place an order for the following items:

${products
  .map(
    (p) =>
      `• ${p.title} - Quantity: ${p.amount} - Price: Rs ${p.price} PKR each`
  )
  .join("\n")}

Total: Rs ${totalPrice} PKR

Please let me know about delivery options and payment methods. Thank you!`
                  : "Hi! I would like to inquire about your products and place an order. Please let me know about your available items and delivery options. Thank you!"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "100%",
                display: "block",
                textDecoration: "none",
                marginTop: 24,
              }}
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
                Check out via Whatsapp
              </Button>
            </a>
          </section>
        </Col>
      </Row>
    </Container>
  );
};

export async function getServerSideProps(context) {
  // const res = await axios.get("/products");
  // const products = res.data.rows;

  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Index;
