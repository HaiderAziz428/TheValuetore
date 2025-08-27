import { useState, useEffect } from "react";

export default function FlashSaleCountdown() {
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
          hours = 7;
          minutes = 0;
          seconds = 0;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => {
    return num.toString().padStart(2, "0").split("");
  };

  return (
    <div
      className="text-center"
      style={{ backgroundColor: "rgb(252, 231, 219)", padding: "2rem" }}
    >
      <h1 className="display-4 fw-bold mb-4" style={{ color: "#ff4500" }}>
        Flash Sale!
      </h1>
      <div className="d-flex justify-content-center align-items-center gap-2">
        {/* Days */}
        <div className="text-center">
          <div className="d-flex gap-1">
            {formatNumber(timeLeft.days).map((digit, index) => (
              <div
                key={`day-${index}`}
                className="d-flex align-items-center justify-content-center rounded"
                style={{
                  width: "3rem",
                  height: "3.5rem",
                  backgroundColor: "rgba(255, 69, 0, 0.1)",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#ff4500",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {digit}
              </div>
            ))}
          </div>
          <div
            className="mt-2 small text-uppercase"
            style={{ color: "#ff4500" }}
          >
            Days
          </div>
        </div>

        <div className="h3 mb-0 mx-1" style={{ color: "#ff4500" }}>
          :
        </div>

        {/* Hours */}
        <div className="text-center">
          <div className="d-flex gap-1">
            {formatNumber(timeLeft.hours).map((digit, index) => (
              <div
                key={`hour-${index}`}
                className="d-flex align-items-center justify-content-center rounded"
                style={{
                  width: "3rem",
                  height: "3.5rem",
                  backgroundColor: "rgba(255, 69, 0, 0.1)",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#ff4500",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {digit}
              </div>
            ))}
          </div>
          <div
            className="mt-2 small text-uppercase"
            style={{ color: "#ff4500" }}
          >
            Hours
          </div>
        </div>

        <div className="h3 mb-0 mx-1" style={{ color: "#ff4500" }}>
          :
        </div>

        {/* Minutes */}
        <div className="text-center">
          <div className="d-flex gap-1">
            {formatNumber(timeLeft.minutes).map((digit, index) => (
              <div
                key={`minute-${index}`}
                className="d-flex align-items-center justify-content-center rounded"
                style={{
                  width: "3rem",
                  height: "3.5rem",
                  backgroundColor: "rgba(255, 69, 0, 0.1)",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#ff4500",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {digit}
              </div>
            ))}
          </div>
          <div
            className="mt-2 small text-uppercase"
            style={{ color: "#ff4500" }}
          >
            Minutes
          </div>
        </div>

        <div className="h3 mb-0 mx-1" style={{ color: "#ff4500" }}>
          :
        </div>

        {/* Seconds */}
        <div className="text-center">
          <div className="d-flex gap-1">
            {formatNumber(timeLeft.seconds).map((digit, index) => (
              <div
                key={`second-${index}`}
                className="d-flex align-items-center justify-content-center rounded"
                style={{
                  width: "3rem",
                  height: "3.5rem",
                  backgroundColor: "rgba(255, 69, 0, 0.1)",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#ff4500",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {digit}
              </div>
            ))}
          </div>
          <div
            className="mt-2 small text-uppercase"
            style={{ color: "#ff4500" }}
          >
            Seconds
          </div>
        </div>
      </div>
    </div>
  );
}
