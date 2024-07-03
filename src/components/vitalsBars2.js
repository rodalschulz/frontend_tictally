import React from "react";

const VitalsBars2 = ({ periodTimes }) => {
  const totalPxHeight = 200;

  const sleep = periodTimes.CORE?.SLEEP || 0;
  const sleepBottom = Math.floor((2800 / 5000) * totalPxHeight);
  const sleepTop = Math.floor((3780 / 5000) * totalPxHeight);
  const sleepLvl =
    Math.floor((sleep / 5000) * totalPxHeight) < 5
      ? 0
      : Math.floor((sleep / 5000) * totalPxHeight);

  const productivityMax = 5000;
  const productivityBtm = 2400;
  const productivitySum =
    (periodTimes.WORK?.TOTAL || 0) +
    (periodTimes.LEARN?.TOTAL || 0) +
    (periodTimes.BUILD?.TOTAL || 0);
  const productivity = 4000; //Math.min(productivitySum, productivityMax);
  const productivityBtmPx = Math.floor(
    (productivityBtm / productivityMax) * totalPxHeight
  );
  const productivityPx =
    Math.floor((productivity / productivityMax) * totalPxHeight) < 5
      ? 0
      : Math.floor((productivity / productivityMax) * totalPxHeight);
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
  const fitnessPx =
    Math.floor((fitness / fitnessMax) * totalPxHeight) < 5
      ? 0
      : Math.floor((fitness / fitnessMax) * totalPxHeight);
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
  const socialSum =
    (periodTimes.GENERAL?.SOCIAL || 0) +
    (periodTimes.RECOVERY?.SOCIAL || 0) +
    (periodTimes.GENERAL?.SOCIALIZE || 0) +
    (periodTimes.RECOVERY?.SOCIALIZE || 0);
  const social = Math.min(socialSum, socialMax);
  const socialBtmPx = Math.floor((socialBtm / socialMax) * totalPxHeight);
  const socialPx =
    Math.floor((social / socialMax) * totalPxHeight) < 5
      ? 0
      : Math.floor((social / socialMax) * totalPxHeight);
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
    <section className="bg-custom-grey w-full px-8 h-[270px] rounded-lg flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="font-bold text-white">SL</div>
        <div className="relative bg-gray-200 w-[16px] h-[200px] rounded-md flex items-end border-[2px] border-white">
          <div
            className="bg-blue-500 w-[16px] rounded-md"
            style={{ height: `${sleepLvl}px` }}
          ></div>
          <div
            className="bg-black w-[20px] h-[2px] rounded-lg absolute left-[-2px]"
            style={{ bottom: `${sleepBottom}px`, zIndex: 10 }}
          ></div>
          <div
            className="bg-black w-[20px] h-[2px] rounded-lg absolute left-[-2px]"
            style={{ bottom: `${sleepTop}px`, zIndex: 10 }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col items-center ml-6">
        <div className="font-bold text-white">PR</div>
        <div className="relative bg-gray-200 w-[16px] h-[200px] rounded-md flex items-end border-[2px] border-white">
          <div
            className="bg-blue-500 w-[16px] rounded-md"
            style={{
              height: `${productivityPx}px`,
              backgroundColor: `rgb(${productivityRed}, ${productivityGreen}, ${productivityBlue})`,
            }}
          ></div>
          <div
            className="bg-black w-[20px] h-[2px] rounded-lg absolute left-[-2px]"
            style={{ bottom: `${productivityBtmPx}px`, zIndex: 10 }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col items-center ml-6">
        <div className="font-bold text-white">FI</div>
        <div className="relative bg-gray-200 w-[16px] h-[200px] rounded-md flex items-end border-[2px] border-white">
          <div
            className="bg-blue-500 w-[16px] rounded-md"
            style={{
              height: `${fitnessPx}px`,
              backgroundColor: `rgb(${fitnessRed}, ${fitnessGreen}, ${fitnessBlue})`,
            }}
          ></div>
          <div
            className="bg-black w-[20px] h-[2px] rounded-lg absolute left-[-2px]"
            style={{ bottom: `${fitnessBtmPx}px`, zIndex: 10 }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col items-center ml-6">
        <div className="font-bold text-white">SO</div>
        <div className="relative bg-gray-200 w-[16px] h-[200px] rounded-md flex items-end border-[2px] border-white">
          <div
            className="bg-blue-500 w-[16px] rounded-md"
            style={{
              height: `${socialPx}px`,
              backgroundColor: `rgb(${socialRed}, ${socialGreen}, ${socialBlue})`,
            }}
          ></div>
          <div
            className="bg-black w-[20px] h-[2px] rounded-lg absolute left-[-2px]"
            style={{ bottom: `${socialBtmPx}px`, zIndex: 10 }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default VitalsBars2;
