import React from "react";
import s from "./Footer.module.scss";
import { Container, Row, Col, Input, Button } from "reactstrap";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className={s.footer}>
      <Container>
        <>
          <hr className={s.footer__hr} />
          <Row className={"my-5 justify-content-between"}>
            <Col
              xl={5}
              md={3}
              className={"d-flex flex-column justify-content-between"}
            >
              <div>
                <img
                  alt="img"
                  src="/images/e-commerce/header/logo.png"
                  className={"mb-4"}
                  style={{ height: "70px" }}
                />
                <p className={"text-white fw-thin mb-0"}>
                  Lorem Ipsum has been the industry's standard dummy text ever
                  since the 1500s,
                </p>
              </div>
              <div className={s.socialLinks}>
                <Link href="https://flatlogic.com/">
                  <a
                    className={s.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/images/e-commerce/google.svg" alt="Google" />
                  </a>
                </Link>
                <Link href="https://twitter.com/flatlogic">
                  <a
                    className={s.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/images/e-commerce/twitter.svg" alt="Twitter" />
                  </a>
                </Link>
                <Link href="https://www.linkedin.com/company/flatlogic/">
                  <a
                    className={s.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/images/e-commerce/linkedin.svg" alt="Linkedin" />
                  </a>
                </Link>
                <Link href="https://www.facebook.com/flatlogic/">
                  <a
                    className={s.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/images/e-commerce/facebook.svg" alt="Facebook" />
                  </a>
                </Link>
              </div>
            </Col>
            <Col md={9} xl={7} sm={12}>
              <Row className={s.linksRow}>
                <Col md={4} sm={6} xs={12}>
                  <h5
                    className={
                      "text-white fw-bold text-uppercase text-nowrap mb-4"
                    }
                  >
                    customer service
                  </h5>
                  <Link href="/contact">
                    <h6 className={`mb-3 ${s.navigationLink}`}>
                      Help & Contact Us
                    </h6>
                  </Link>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
        <hr className={`${s.footer__hr} mb-0`} />
        <Row style={{ padding: "30px 0" }}>
          <Col sm={12}>
            <p className={"text-muted mb-0"}>
              © 2020-{new Date().getFullYear()} powered by{" "}
              <Link href="https://flatlogic.com">
                <span className={s.navigationLink}>The Value Store</span>
              </Link>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
