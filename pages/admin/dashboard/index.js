import React from "react";
import { connect } from "react-redux";
import { Row, Col, Progress } from "reactstrap";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { chartData, splineArea } from "./chartsMock";
import SimpleLine from "./widget";
import Head from "next/head";
import HomePageWidget from "../widgets/HomePageWidget";

import s from "./Dashboard.module.scss";

class Index extends React.Component {
  state = {
    graph: null,
    checkedArr: [false, false, false],
    pie: {
      options: {
        chart: {
          type: "donut",
        },
        colors: ["#745FF9", "#E74A4B", "#FF943B"],
        labels: ["On progress", "Canceled", "Booked"],
        stroke: {
          show: false,
          width: 0,
        },
        plotOptions: {
          pie: {
            donut: {
              size: "45%",
            },
          },
        },
        dataLabels: {
          dropShadow: {
            enabled: false,
          },
        },
        legend: {
          show: false,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    },
  };

  componentDidMount() {
    typeof window !== "undefined" &&
      window.addEventListener("resize", this.forceUpdate);
  }

  forceUpdate = () => {
    return this.setState({});
  };

  checkTable = (id) => {
    let arr = [];
    if (id === 0) {
      const val = !this.state.checkedArr[0];
      for (let i = 0; i < this.state.checkedArr.length; i += 1) {
        arr[i] = val;
      }
    } else {
      arr = this.state.checkedArr;
      arr[id] = !arr[id];
    }
    if (arr[0]) {
      let count = 1;
      for (let i = 1; i < arr.length; i += 1) {
        if (arr[i]) {
          count += 1;
        }
      }
      if (count !== arr.length) {
        arr[0] = !arr[0];
      }
    }
    this.setState({
      checkedArr: arr,
    });
  };

  render() {
    return (
      <>
        <Head>
          <title>Ecommerce dashboard</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />

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
        <div className={s.root}>
          <h1 className="page-title">
            Welcome,{" "}
            {this.props.currentUser
              ? this.props.currentUser.firstName || "User"
              : "User"}
            ! <br />
            <small>
              <small>
                Your role is{" "}
                {this.props.currentUser && this.props.currentUser.role}
              </small>
            </small>
          </h1>
        </div>
      </>
    );
  }
}

function mapStateToProps(store) {
  return {
    currentUser: store.auth.currentUser,
    loadingInit: store.auth.loadingInit,
  };
}

export async function getServerSideProps(context) {
  // const res = await axios.get("/products");
  // const products = res.data.rows;

  return {
    props: {}, // will be passed to the page component as props
  };
}

export default connect(mapStateToProps)(withRouter(Index));
