import React from "react";
import { Container, Row, Col } from "reactstrap";

const limeGradient = "linear-gradient(90deg, #b3d334 0%, #7ea100 100%)"; // Use SCSS variable values
const teal = "#14444d"; // Use SCSS variable value
const limeLeft = "#b3d334"; // Use SCSS variable value
const limeRight = "#7ea100"; // Use SCSS variable value

const features = [
  {
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
        <defs>
          <linearGradient
            id="lime-gradient"
            x1="0"
            y1="0"
            x2="48"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={limeLeft} />
            <stop offset="1" stopColor={limeRight} />
          </linearGradient>
        </defs>
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke={teal}
          strokeWidth="2"
          fill={limeGradient}
        />
        <path
          d="M24 14l3.09 6.26L34 21.27l-5 4.87L30.18 34 24 29.77 17.82 34 19 26.14l-5-4.87 6.91-1.01L24 14z"
          stroke={teal}
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    ),
    title: ["Wholesale", "price"],
    desc: "Buy at lowest wholesale rates on 4,000+ products. Earn maximum profit.",
  },
  {
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
        <defs>
          <linearGradient
            id="lime-gradient"
            x1="0"
            y1="0"
            x2="48"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={limeLeft} />
            <stop offset="1" stopColor={limeRight} />
          </linearGradient>
        </defs>
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke={teal}
          strokeWidth="2"
          fill={limeGradient}
        />
        <text
          x="24"
          y="32"
          textAnchor="middle"
          fontSize="20"
          fill={teal}
          fontWeight="bold"
        >
          1
        </text>
        <path
          d="M24 10c-7.732 0-14 6.268-14 14 0 7.732 6.268 14 14 14s14-6.268 14-14c0-7.732-6.268-14-14-14z"
          stroke={teal}
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    ),
    title: ["Guaranteed", "quality"],
    desc: "Sit back and relax, Saddar will deliver your goods anytime, anywhere.",
  },
  {
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
        <defs>
          <linearGradient
            id="lime-gradient"
            x1="0"
            y1="0"
            x2="48"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={limeLeft} />
            <stop offset="1" stopColor={limeRight} />
          </linearGradient>
        </defs>
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke={teal}
          strokeWidth="2"
          fill={limeGradient}
        />
        <path
          d="M16 24l6 6 10-10"
          stroke={teal}
          strokeWidth="2.5"
          fill="none"
        />
      </svg>
    ),
    title: ["Store", "delivery"],
    desc: "Get original products direct from official suppliers. 100% guaranteed.",
  },
  {
    icon: (
      <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
        <defs>
          <linearGradient
            id="lime-gradient"
            x1="0"
            y1="0"
            x2="48"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={limeLeft} />
            <stop offset="1" stopColor={limeRight} />
          </linearGradient>
        </defs>
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke={teal}
          strokeWidth="2"
          fill={limeGradient}
        />
        <path d="M32 20l-8 8-4-4" stroke={teal} strokeWidth="2.5" fill="none" />
        <path d="M24 32v-8" stroke={teal} strokeWidth="2" fill="none" />
      </svg>
    ),
    title: ["Easy", "returns"],
    desc: "Not satisfied with the product? Return it with our simple and hassle-free return process",
  },
];

const FeatureInfoBlock = () => (
  <div
    style={{
      position: "relative",
      zIndex: 10,
      marginTop: "-90px",
      marginBottom: "40px",
    }}
  >
    <Container>
      <Row
        style={{
          background: "#fff",
          borderRadius: "24px",
          boxShadow:
            "0 8px 32px rgba(179, 211, 52, 0.15), 0 1.5px 8px rgba(20, 68, 77, 0.08)",
          padding: "32px 0",
          display: "flex",
          alignItems: "stretch",
        }}
        className="justify-content-center"
      >
        {features.map((f, i) => (
          <Col
            key={i}
            md={3}
            sm={6}
            xs={12}
            className="d-flex flex-column align-items-center text-center mb-4 mb-md-0"
            style={{ minWidth: 220 }}
          >
            <div style={{ marginBottom: 16 }}>{f.icon}</div>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 20,
                  marginBottom: 8,
                }}
              >
                <span style={{ color: limeLeft }}>{f.title[0]} </span>
                <span style={{ color: teal }}>{f.title[1]}</span>
              </div>
              <div style={{ color: "#222", fontSize: 16, lineHeight: 1.5 }}>
                {f.desc}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  </div>
);

export default FeatureInfoBlock;
