import { useState, useEffect } from "react";

export default function LimitedTimeOffer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 7,
    minutes: 16,
    seconds: 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        seconds--;

        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }

        if (minutes < 0) {
          minutes = 59;
          hours--;
        }

        if (hours < 0) {
          hours = 23;
          days--;
        }

        // When days and hours both reach 0, reset to 7 hours
        if (days <= 0 && hours < 0) {
          days = 0;
          hours = 7;
          minutes = 16;
          seconds = 20;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => {
    return num.toString().padStart(2, "0");
  };

  return (
    <>
      {/* Bootstrap CSS - Add this to your HTML head if not already included */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div
        className="container-fluid py-3"
        style={{ backgroundColor: "#fff2f2" }}
      >
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="text-center">
              {/* Limited Time Offer Header */}
              <h6
                className="text-danger fw-bold mb-3"
                style={{ fontSize: "14px", letterSpacing: "1px" }}
              >
                LIMITED TIME OFFER
              </h6>

              {/* Countdown Timer */}
              <div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
                {/* Days */}
                <div className="text-center">
                  <div
                    className="bg-white border rounded d-flex align-items-center justify-content-center fw-bold text-danger"
                    style={{
                      width: "50px",
                      height: "50px",
                      fontSize: "20px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {formatNumber(timeLeft.days)}
                  </div>
                  <small
                    className="text-muted mt-1 d-block"
                    style={{ fontSize: "11px", fontWeight: "500" }}
                  >
                    days
                  </small>
                </div>

                {/* Hours */}
                <div className="text-center">
                  <div
                    className="bg-white border rounded d-flex align-items-center justify-content-center fw-bold text-danger"
                    style={{
                      width: "50px",
                      height: "50px",
                      fontSize: "20px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {formatNumber(timeLeft.hours)}
                  </div>
                  <small
                    className="text-muted mt-1 d-block"
                    style={{ fontSize: "11px", fontWeight: "500" }}
                  >
                    hours
                  </small>
                </div>

                {/* Minutes */}
                <div className="text-center">
                  <div
                    className="bg-white border rounded d-flex align-items-center justify-content-center fw-bold text-danger"
                    style={{
                      width: "50px",
                      height: "50px",
                      fontSize: "20px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {formatNumber(timeLeft.minutes)}
                  </div>
                  <small
                    className="text-muted mt-1 d-block"
                    style={{ fontSize: "11px", fontWeight: "500" }}
                  >
                    minutes
                  </small>
                </div>

                {/* Seconds */}
                <div className="text-center">
                  <div
                    className="bg-white border rounded d-flex align-items-center justify-content-center fw-bold text-danger"
                    style={{
                      width: "50px",
                      height: "50px",
                      fontSize: "20px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {formatNumber(timeLeft.seconds)}
                  </div>
                  <small
                    className="text-muted mt-1 d-block"
                    style={{ fontSize: "11px", fontWeight: "500" }}
                  >
                    seconds
                  </small>
                </div>
              </div>

              {/* Price Revert Message */}
              <p className="text-muted mt-3 mb-0" style={{ fontSize: "12px" }}>
                The price of this item will revert back to{" "}
                <span className="text-danger fw-bold">Original price</span> at
                the end of this countdown.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
