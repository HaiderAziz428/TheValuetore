import React from "react";
import { Row, Col } from "reactstrap";

import s from "./Instagram.module.scss";

const InstagramWidget = () => (
  <section style={{ marginTop: 80, marginBottom: 80 }}>
    <h3 className={"text-center fw-bold mb-4"}>Follow us on Instagram</h3>
    <Row className={"no-gutters"}>
      <Col md={2} sm={4} xs={6}>
        <img src={"/images/e-commerce/home/insta1.jpg"} className={"w-100"} />
      </Col>
      <Col md={2} sm={4} xs={6}>
        <img src={"/images/e-commerce/home/insta2.jpg"} className={"w-100"} />
      </Col>
      <Col md={2} sm={4} xs={6}>
        <img src={"/images/e-commerce/home/insta3.jpg"} className={"w-100"} />
      </Col>
      <Col md={2} sm={4} xs={6}>
        <img src={"/images/e-commerce/home/insta4.jpg"} className={"w-100"} />
      </Col>
      <Col md={2} sm={4} xs={6}>
        <img src={"/images/e-commerce/home/insta5.jpg"} className={"w-100"} />
      </Col>
      <Col md={2} sm={4} xs={6}>
        <img src={"/images/e-commerce/home/insta6.jpg"} className={"w-100"} />
      </Col>
    </Row>
  </section>
);

export default InstagramWidget;
