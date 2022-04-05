import Head from "next/head";
import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import DataGraph from "../../components/tutorials/2d-curve/data-graph";
import TfHistory from "../../components/tutorials/2d-curve/tf-history";

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export type CarType = {
  Name: string;
  Miles_per_Gallon?: number;
  Cylinders?: number;
  Displacement?: number;
  Horsepower?: number;
  Weight_in_lbs?: number;
  Acceleration?: number;
  Year?: string;
  Origin?: string;
};

const dataUrl = "https://storage.googleapis.com/tfjs-tutorials/carsData.json";

const TwoDCurvePage = () => {
  const [data, setData] = useState<Array<CarType>>();

  const getData = async () => {
    await fetch(dataUrl)
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          setData(res);
        }
      });
  };

  useEffect(() => {
    getData();
    console.log("Hello TensorFlow");
  }, []);

  return (
    <>
      <Head>
        <title>2D 데이터로 예측하기(튜토리얼)</title>
      </Head>
      <h1>#1. 데이터 확인</h1>
      <div
        style={{
          width: "90vw",
          height: "fit-content",
          margin: "0 auto",
          background: "#ddd",
        }}
      >
        <DataGraph data={data} />
      </div>
      <h1>#2. tensorflow용 데이터로 가공</h1>
      <div
        style={{
          width: "90vw",
          height: "fit-content",
          margin: "0 auto",
          background: "#ddd",
        }}
      >
        <TfHistory data={data} />
      </div>
    </>
  );
};

export default TwoDCurvePage;
