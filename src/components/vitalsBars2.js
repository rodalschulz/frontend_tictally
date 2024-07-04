import React, { useEffect, useState } from "react";
import { GiBrain, GiNightSleep } from "react-icons/gi";
import { IoFitness } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";

const VitalsBars2 = ({ periodTimes }) => {
  const [vhInPixels, setVhInPixels] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight / 100;
      setVhInPixels(vh);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPxHeight = Math.floor(vhInPixels * 17);

  const sleepMax = 5000;
  const sleepBtm = 2800;
  const sleepTp = 3780;
  const sleep =
    (periodTimes.CORE?.SLEEP || 0) > sleepMax
      ? sleepMax
      : periodTimes.CORE?.SLEEP || 0;
  const sleepBtmPx = Math.floor((sleepBtm / sleepMax) * totalPxHeight);
  const sleepTpPx = Math.floor((sleepTp / sleepMax) * totalPxHeight);
  const sleepPx = Math.floor((sleep / sleepMax) * totalPxHeight);
  const sleepBorder =
    sleep / sleepMax < 0.01 ? "border-red-700" : "border-white";
  const sleepRed = sleep < sleepBtm ? 210 : sleep > sleepTp ? 210 : 0;
  const sleepGreen =
    sleep < sleepBtm
      ? (sleep / sleepBtm) * 150
      : sleep > sleepTp
      ? 150 - ((sleep - sleepTp) / (sleepMax - sleepTp)) * 150
      : 200;
  const sleepBlue =
    sleep < sleepBtm
      ? (sleep / sleepBtm) * 150
      : sleep > sleepTp
      ? 150 - ((sleep - sleepTp) / (sleepMax - sleepTp)) * 150
      : 200;

  const productivityMax = 5000;
  const productivityBtm = 2400;
  const productivitySum =
    (periodTimes.WORK?.TOTAL || 0) +
    (periodTimes.LEARN?.TOTAL || 0) +
    (periodTimes.BUILD?.TOTAL || 0);
  const productivity = Math.min(productivitySum, productivityMax);
  const productivityBtmPx = Math.floor(
    (productivityBtm / productivityMax) * totalPxHeight
  );
  const productivityPx = Math.floor(
    (productivity / productivityMax) * totalPxHeight
  );
  const productivityBorder =
    productivity / productivityMax < 0.01 ? "border-red-700" : "border-white";
  const productivityRed = productivity < productivityBtm ? 210 : 0;
  const productivityGreen =
    productivity < productivityBtm
      ? (productivity / productivityBtm) * 150
      : Math.floor(
          130 +
            ((productivity / productivityMax -
              productivityBtm / productivityMax) /
              (1 - productivityBtm / productivityMax)) *
              125
        );
  const productivityBlue =
    productivity < productivityBtm
      ? (productivity / productivityBtm) * 150
      : Math.floor(
          130 +
            ((productivity / productivityMax -
              productivityBtm / productivityMax) /
              (1 - productivityBtm / productivityMax)) *
              125
        );

  const fitnessMax = 1000;
  const fitnessBtm = 240;
  const fitness =
    (periodTimes.CORE?.FITNESS || 0) > fitnessMax
      ? fitnessMax
      : periodTimes.CORE?.FITNESS || 0;
  const fitnessBtmPx = Math.floor((fitnessBtm / fitnessMax) * totalPxHeight);
  const fitnessPx = Math.floor((fitness / fitnessMax) * totalPxHeight);
  const fitnessBorder =
    fitness / fitnessMax < 0.01 ? "border-red-700" : "border-white";
  const fitnessRed = fitness < fitnessBtm ? 210 : 0;
  const fitnessGreen =
    fitness < fitnessBtm
      ? (fitness / fitnessBtm) * 150
      : Math.floor(
          130 +
            ((fitness / fitnessMax - fitnessBtm / fitnessMax) /
              (1 - fitnessBtm / fitnessMax)) *
              125
        );
  const fitnessBlue =
    fitness < fitnessBtm
      ? (fitness / fitnessBtm) * 150
      : Math.floor(
          130 +
            ((fitness / fitnessMax - fitnessBtm / fitnessMax) /
              (1 - fitnessBtm / fitnessMax)) *
              125
        );

  const socialMax = 2000;
  const socialBtm = 420;
  const socialSum = // Maybe here I should add other categories and also track for "MINGLE"
    (periodTimes.GENERAL?.SOCIAL || 0) +
    (periodTimes.RECOVERY?.SOCIAL || 0) +
    (periodTimes.GENERAL?.SOCIALIZE || 0) +
    (periodTimes.RECOVERY?.SOCIALIZE || 0);
  const social = Math.min(socialSum, socialMax);
  const socialBtmPx = Math.floor((socialBtm / socialMax) * totalPxHeight);
  const socialPx = Math.floor((social / socialMax) * totalPxHeight);
  const socialBorder =
    social / socialMax < 0.01 ? "border-red-700" : "border-white";
  const socialRed = social < socialBtm ? 210 : 0;
  const socialGreen =
    social < socialBtm
      ? (social / socialBtm) * 150
      : Math.floor(
          130 +
            ((social / socialMax - socialBtm / socialMax) /
              (1 - socialBtm / socialMax)) *
              125
        );
  const socialBlue =
    social < socialBtm
      ? (social / socialBtm) * 150
      : Math.floor(
          130 +
            ((social / socialMax - socialBtm / socialMax) /
              (1 - socialBtm / socialMax)) *
              125
        );

  return (
    <section className="bg-custom-vitals py-8 px-8 rounded-lg flex items-center justify-center shadow-lg w-full h-full">
      <div className="flex flex-col items-center">
        <div className="font-bold text-white mb-2 text-4xl">
          <GiNightSleep />
        </div>
        <div
          className={`relative bg-gray-200 w-[16px] rounded-md flex items-end border-[2px] ${sleepBorder}`}
          style={{
            height: `${totalPxHeight}px`,
          }}
        >
          <div
            className="w-[16px] rounded-sm"
            style={{
              height: `${sleepPx}px`,
              backgroundColor: `rgb(${sleepRed}, ${sleepGreen}, ${sleepBlue})`,
            }}
          ></div>
          <div
            className="bg-gray-600 w-[16px] h-[2px] rounded-lg absolute left-[-2px]"
            style={{ bottom: `${sleepBtmPx}px`, zIndex: 10 }}
          ></div>
          <div
            className="bg-gray-600 w-[16px] h-[2px] rounded-lg absolute left-[-2px]"
            style={{ bottom: `${sleepTpPx}px`, zIndex: 10 }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col items-center ml-10">
        <div className="font-bold text-white mb-2 text-4xl">
          <GiBrain />
        </div>
        <div
          className={`relative bg-gray-200 w-[16px] rounded-md flex items-end border-[2px] ${productivityBorder}`}
          style={{
            height: `${totalPxHeight}px`,
          }}
        >
          <div
            className="w-[16px] rounded-sm"
            style={{
              height: `${productivityPx}px`,
              backgroundColor: `rgb(${productivityRed}, ${productivityGreen}, ${productivityBlue})`,
            }}
          ></div>
          <div
            className="bg-gray-600 w-[16px] h-[2px] rounded-lg absolute left-[-2px]"
            style={{ bottom: `${productivityBtmPx}px`, zIndex: 10 }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col items-center ml-10">
        <div className="font-bold text-white mb-2 text-4xl">
          <IoFitness />
        </div>
        <div
          className={`relative bg-gray-200 w-[16px] rounded-md flex items-end border-[2px] ${fitnessBorder}
          }`}
          style={{
            height: `${totalPxHeight}px`,
          }}
        >
          <div
            className="w-[16px] rounded-sm"
            style={{
              height: `${fitnessPx}px`,
              backgroundColor: `rgb(${fitnessRed}, ${fitnessGreen}, ${fitnessBlue})`,
            }}
          ></div>
          <div
            className="bg-gray-600 w-[16px] h-[2px] rounded-lg absolute left-[-2px]"
            style={{ bottom: `${fitnessBtmPx}px`, zIndex: 10 }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col items-center ml-10">
        <div className="font-bold text-white mb-2 text-4xl">
          <FaPeopleGroup />
        </div>
        <div
          className={`relative bg-gray-200 w-[16px] rounded-md flex items-end border-[2px] ${socialBorder}`}
          style={{
            height: `${totalPxHeight}px`,
          }}
        >
          <div
            className="w-[16px] rounded-sm"
            style={{
              height: `${socialPx}px`,
              backgroundColor: `rgb(${socialRed}, ${socialGreen}, ${socialBlue})`,
            }}
          ></div>
          <div
            className="bg-gray-600 w-[16px] h-[2px] rounded-lg absolute left-[-2px]"
            style={{ bottom: `${socialBtmPx}px`, zIndex: 10 }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default VitalsBars2;
