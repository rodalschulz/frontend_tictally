import React from "react";
import "../styles/vitalsBars.css";

const VitalsBars = ({ periodTimes }) => {
  const ranges = {
    SLEEP: { min: 2940, max: 4000 },
    FITNESS: { min: 200, max: 600 },
    PRODUCTIVITY: { min: 2400, max: 5400 },
    SOCIAL: { min: 360, max: 2000 },
  };

  const calculateHeight = (value, min, max) => {
    const totalHeight = 200;
    const topLimit = max;
    const highestPoint = topLimit * 1.5;
    const barHeight = (value / highestPoint) * totalHeight;
    return barHeight;
  };

  const determineColor = (value, min, max) => {
    const range = max - min;
    const idealRange = range * 0.2;
    const lowerLimit = min - idealRange;
    const upperLimit = max + idealRange;

    if (value >= min && value <= max) {
      return "green";
    } else if (value < lowerLimit || value > upperLimit) {
      return "red";
    } else {
      const percentage =
        value < min ? (min - value) / range : (value - max) / range;
      const redValue = Math.round(255 * percentage);
      return `rgb(${255 - redValue}, 100, 100)`;
    }
  };

  return (
    <div className="vitals-bars-container bg-white items-center rounded-lg px-4">
      <div className="vitals-bar">
        <div className="vitals-title">SL</div>
        <div className="vitals-bar-graph">
          <div
            className="bar"
            style={{
              height: `${calculateHeight(
                periodTimes.CORE?.SLEEP || 0,
                ranges.SLEEP.min,
                ranges.SLEEP.max
              )}px`,
              backgroundColor: determineColor(
                periodTimes.CORE?.SLEEP || 0,
                ranges.SLEEP.min,
                ranges.SLEEP.max
              ),
            }}
          ></div>
        </div>
      </div>

      <div className="vitals-bar">
        <div className="vitals-title">FI</div>
        <div className="vitals-bar-graph">
          <div
            className="bar"
            style={{
              height: `${calculateHeight(
                periodTimes.CORE?.FITNESS || 0,
                ranges.FITNESS.min,
                ranges.FITNESS.max
              )}px`,
              backgroundColor: determineColor(
                periodTimes.CORE?.FITNESS || 0,
                ranges.FITNESS.min,
                ranges.FITNESS.max
              ),
            }}
          ></div>
        </div>
      </div>

      <div className="vitals-bar">
        <div className="vitals-title">PR</div>
        <div className="vitals-bar-graph">
          <div
            className="bar"
            style={{
              height: `${calculateHeight(
                periodTimes.WORK?.TOTAL ||
                  0 + periodTimes.LEARN?.TOTAL ||
                  0 + periodTimes.BUILD?.TOTAL ||
                  0,
                ranges.PRODUCTIVITY.min,
                ranges.PRODUCTIVITY.max
              )}px`,
              backgroundColor: determineColor(
                periodTimes.WORK?.TOTAL ||
                  0 + periodTimes.LEARN?.TOTAL ||
                  0 + periodTimes.BUILD?.TOTAL ||
                  0,
                ranges.PRODUCTIVITY.min,
                ranges.PRODUCTIVITY.max
              ),
            }}
          ></div>
        </div>
      </div>

      <div className="vitals-bar">
        <div className="vitals-title">SO</div>
        <div className="vitals-bar-graph">
          <div
            className="bar"
            style={{
              height: `${calculateHeight(
                (periodTimes.RECOVERY?.SOCIALIZE || 0) +
                  (periodTimes.GENERAL?.SOCIAL || 0) +
                  (periodTimes.RECOVERY?.SOCIAL || 0) +
                  (periodTimes.GENERAL?.SOCIALIZE || 0),
                ranges.SOCIAL.min,
                ranges.SOCIAL.max
              )}px`,
              backgroundColor: determineColor(
                (periodTimes.RECOVERY?.SOCIALIZE || 0) +
                  (periodTimes.GENERAL?.SOCIAL || 0) +
                  (periodTimes.RECOVERY?.SOCIAL || 0) +
                  (periodTimes.GENERAL?.SOCIALIZE || 0),
                ranges.SOCIAL.min,
                ranges.SOCIAL.max
              ),
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default VitalsBars;
